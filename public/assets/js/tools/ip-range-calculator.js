import { calculateIpRange } from '../lib/range.js';
import { formatNumber } from '../lib/format.js';
import { wireCopyButton } from '../copy.js';

const form = document.getElementById('tool-form');
const errorBox = document.getElementById('form-error');
const resultsCard = document.getElementById('results-card');
const liveStatus = document.getElementById('live-status');
let lastResult = null;

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  resultsCard.classList.remove('is-visible');
  liveStatus.textContent = msg;
}
function clearError() { errorBox.style.display = 'none'; }

function render(r) {
  document.getElementById('res-first').textContent = r.startIp;
  document.getElementById('res-last').textContent = r.endIp;
  document.getElementById('res-total').textContent = formatNumber(r.totalAddresses);

  document.getElementById('range-truncated-note').style.display = r.truncated ? 'block' : 'none';

  const tbody = document.querySelector('#range-table tbody');
  tbody.innerHTML = r.cidrBlocks
    .map((b) => `<tr><td class="mono">${b.notation}</td><td>${formatNumber(b.size)}</td></tr>`)
    .join('');

  resultsCard.classList.add('is-visible');
  liveStatus.textContent = 'Results updated.';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();
  const start = document.getElementById('start-ip').value.trim();
  const end = document.getElementById('end-ip').value.trim();
  try {
    const result = calculateIpRange(start, end);
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
  const r = lastResult;
  return [
    `First IP: ${r.startIp}`,
    `Last IP: ${r.endIp}`,
    `Total Addresses: ${r.totalAddresses}`,
    'CIDR Blocks:',
    ...r.cidrBlocks.map((b) => `  ${b.notation} (${b.size} addresses)`),
  ].join('\n');
});
