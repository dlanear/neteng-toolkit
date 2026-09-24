import { calculateSubnetFromInput } from '../lib/subnet.js';
import { buildCidrTable } from '../lib/cidr-table.js';
import { formatNumber } from '../lib/format.js';
import { wireCopyButton } from '../copy.js';

const form = document.getElementById('tool-form');
const errorBox = document.getElementById('form-error');
const resultsCard = document.getElementById('results-card');
const liveStatus = document.getElementById('live-status');
let lastResult = null;

function populateCidrTable() {
  const tbody = document.querySelector('#cidr-table tbody');
  tbody.innerHTML = buildCidrTable()
    .map((row) => `<tr><td>${row.cidr}</td><td class="mono">${row.mask}</td><td>${formatNumber(row.totalAddresses)}</td><td>${formatNumber(row.usableHosts)}</td></tr>`)
    .join('');
}
populateCidrTable();

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  resultsCard.classList.remove('is-visible');
  liveStatus.textContent = msg;
}
function clearError() { errorBox.style.display = 'none'; }

function render(r) {
  document.getElementById('res-ip').textContent = r.ip;
  document.getElementById('res-prefix').textContent = `/${r.cidr}`;
  document.getElementById('res-mask').textContent = r.subnetMask;
  document.getElementById('res-network').textContent = r.networkAddress;
  document.getElementById('res-broadcast').textContent = r.broadcastAddress;
  document.getElementById('res-first').textContent = r.firstUsable;
  document.getElementById('res-last').textContent = r.lastUsable;
  document.getElementById('res-total').textContent = formatNumber(r.totalAddresses);
  document.getElementById('res-usable').textContent = formatNumber(r.usableAddresses);
  document.getElementById('res-wildcard').textContent = r.wildcardMask;
  document.getElementById('bin-out').textContent = r.binary.ip;
  resultsCard.classList.add('is-visible');
  liveStatus.textContent = 'Results updated.';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();
  const input = document.getElementById('cidr-input').value.trim();
  try {
    const result = calculateSubnetFromInput(input);
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
    `IP: ${r.ip}`, `Prefix: /${r.cidr}`, `Subnet Mask: ${r.subnetMask}`,
    `Network: ${r.networkAddress}`, `Broadcast: ${r.broadcastAddress}`,
    `First Address: ${r.firstUsable}`, `Last Address: ${r.lastUsable}`,
    `Total Addresses: ${r.totalAddresses}`, `Usable Hosts: ${r.usableAddresses}`,
    `Wildcard Mask: ${r.wildcardMask}`,
  ].join('\n');
});
