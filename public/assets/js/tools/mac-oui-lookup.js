import { normalizeMac, lookupOui, isUnicastLocallyAdministered } from '../lib/mac.js';
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();
  const input = document.getElementById('mac-input').value.trim();
  const normalized = normalizeMac(input);

  if (!normalized) {
    showError('Invalid MAC address. Expected 12 hex digits, e.g. 00:11:22:33:44:55.');
    lastResult = null;
    return;
  }

  const vendor = lookupOui(normalized.oui);
  const flags = isUnicastLocallyAdministered(normalized.bare);
  const typeLabel = `${flags.multicast ? 'Multicast' : 'Unicast'}, ${flags.locallyAdministered ? 'Locally Administered' : 'Universally Administered (burned-in)'}`;

  lastResult = { ...normalized, vendor, typeLabel };

  document.getElementById('res-colon').textContent = normalized.colon;
  document.getElementById('res-hyphen').textContent = normalized.hyphen;
  document.getElementById('res-cisco').textContent = normalized.cisco;
  document.getElementById('res-oui').textContent = normalized.oui;
  document.getElementById('res-vendor').textContent = vendor || 'Manufacturer not found.';
  document.getElementById('res-type').textContent = typeLabel;

  const note = document.getElementById('mac-note');
  if (!vendor) {
    note.textContent = 'This OUI is not in our local reference database. We do not guess manufacturers — this simply means the vendor is unknown to this tool.';
    note.style.display = 'block';
  } else {
    note.style.display = 'none';
  }

  resultsCard.classList.add('is-visible');
  liveStatus.textContent = 'Results updated.';
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
    `Colon format: ${r.colon}`, `Hyphen format: ${r.hyphen}`, `Cisco format: ${r.cisco}`,
    `OUI: ${r.oui}`, `Manufacturer: ${r.vendor || 'Manufacturer not found.'}`, `Address Type: ${r.typeLabel}`,
  ].join('\n');
});
