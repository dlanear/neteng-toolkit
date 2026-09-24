import { calculateSubnetFromInput } from '../lib/subnet.js';
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

function clearError() {
  errorBox.style.display = 'none';
}

function render(r) {
  document.getElementById('res-ip').textContent = r.ip;
  document.getElementById('res-cidr').textContent = `/${r.cidr}`;
  document.getElementById('res-mask').textContent = r.subnetMask;
  document.getElementById('res-network').textContent = r.networkAddress;
  document.getElementById('res-broadcast').textContent = r.broadcastAddress;
  document.getElementById('res-first').textContent = r.firstUsable;
  document.getElementById('res-last').textContent = r.lastUsable;
  document.getElementById('res-total').textContent = formatNumber(r.totalAddresses);
  document.getElementById('res-usable').textContent = formatNumber(r.usableAddresses);
  document.getElementById('res-class').textContent = r.addressClass;
  document.getElementById('res-wildcard').textContent = r.wildcardMask;
  document.getElementById('bin-ip').textContent = r.binary.ip;
  document.getElementById('bin-mask').textContent = r.binary.mask;
  document.getElementById('bin-network').textContent = r.binary.network;
  document.getElementById('bin-broadcast').textContent = r.binary.broadcast;

  const noteBox = document.getElementById('special-note');
  if (r.note) {
    noteBox.textContent = r.note;
    noteBox.style.display = 'block';
  } else {
    noteBox.style.display = 'none';
  }

  resultsCard.classList.add('is-visible');
  liveStatus.textContent = 'Results updated.';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();
  const ipInput = document.getElementById('ip-input').value.trim();
  const maskInput = document.getElementById('mask-input').value.trim();
  try {
    const result = calculateSubnetFromInput(ipInput, maskInput || undefined);
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
    `IP Address: ${r.ip}`,
    `CIDR: /${r.cidr}`,
    `Subnet Mask: ${r.subnetMask}`,
    `Network Address: ${r.networkAddress}`,
    `Broadcast Address: ${r.broadcastAddress}`,
    `First Usable: ${r.firstUsable}`,
    `Last Usable: ${r.lastUsable}`,
    `Total Addresses: ${r.totalAddresses}`,
    `Usable Addresses: ${r.usableAddresses}`,
    `Address Class: ${r.addressClass}`,
    `Wildcard Mask: ${r.wildcardMask}`,
  ].join('\n');
});
