import { calculateVLSM } from '../lib/vlsm.js';
import { formatNumber } from '../lib/format.js';
import { wireCopyButton } from '../copy.js';

const form = document.getElementById('tool-form');
const errorBox = document.getElementById('form-error');
const resultsCard = document.getElementById('results-card');
const liveStatus = document.getElementById('live-status');
let lastResult = null;

function parseRequirements(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error('Enter at least one subnet requirement.');
  return lines.map((line) => {
    const parts = line.split(',');
    if (parts.length < 2) throw new Error(`Invalid line: "${line}". Use the format "name, host count".`);
    const name = parts[0].trim();
    const hosts = Number(parts[1].trim());
    if (!name) throw new Error(`Missing a name for line: "${line}"`);
    if (!Number.isFinite(hosts) || hosts <= 0) throw new Error(`Invalid host count in line: "${line}"`);
    return { name, hosts };
  });
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  resultsCard.classList.remove('is-visible');
  liveStatus.textContent = msg;
}
function clearError() { errorBox.style.display = 'none'; }

function render(result) {
  const tbody = document.querySelector('#vlsm-table tbody');
  tbody.innerHTML = result.allocations.map((a) => `
    <tr>
      <td>${a.name}</td>
      <td>${formatNumber(a.requiredHosts)}</td>
      <td>${formatNumber(a.allocatedHosts)}</td>
      <td>/${a.cidr}</td>
      <td class="mono">${a.subnetMask}</td>
      <td class="mono">${a.network}</td>
      <td class="mono">${a.firstHost}</td>
      <td class="mono">${a.lastHost}</td>
      <td class="mono">${a.broadcast}</td>
    </tr>`).join('');
  document.getElementById('vlsm-remaining').textContent =
    `Base network: ${result.baseNetwork} — ${formatNumber(result.remainingAddresses)} addresses remaining unallocated.`;
  resultsCard.classList.add('is-visible');
  liveStatus.textContent = 'Results updated.';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();
  const base = document.getElementById('base-network').value.trim();
  const reqText = document.getElementById('requirements').value;
  try {
    const requirements = parseRequirements(reqText);
    const result = calculateVLSM(base, requirements);
    if (!result.success) {
      showError(result.error);
      lastResult = null;
      return;
    }
    lastResult = result;
    render(result);
  } catch (err) {
    lastResult = null;
    showError(err.message);
  }
});

form.addEventListener('reset', () => {
  clearError();
  resultsCard.classList.remove('is-visible');
  lastResult = null;
});

wireCopyButton(document.getElementById('copy-btn'), () => {
  if (!lastResult) return null;
  const lines = [`Base Network: ${lastResult.baseNetwork}`, ''];
  lastResult.allocations.forEach((a) => {
    lines.push(
      `${a.name}: /${a.cidr} (${a.subnetMask}) — Network ${a.network}, Hosts ${a.firstHost}-${a.lastHost}, Broadcast ${a.broadcast}, Allocated ${a.allocatedHosts} (required ${a.requiredHosts})`
    );
  });
  lines.push('', `Remaining addresses: ${lastResult.remainingAddresses}`);
  return lines.join('\n');
});
