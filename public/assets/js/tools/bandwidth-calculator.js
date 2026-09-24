import { calculateTransferTime, calculateRequiredBandwidth, formatDuration } from '../lib/bandwidth.js';
import { formatNumber } from '../lib/format.js';
import { wireCopyButton } from '../copy.js';

const form = document.getElementById('tool-form');
const errorBox = document.getElementById('form-error');
const resultsCard = document.getElementById('results-card');
const liveStatus = document.getElementById('live-status');
const modeSelect = document.getElementById('bw-mode');
const rateFields = document.getElementById('bw-rate-fields');
const timeField = document.getElementById('bw-time-field');
let lastResult = null;

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  resultsCard.classList.remove('is-visible');
  liveStatus.textContent = msg;
}
function clearError() { errorBox.style.display = 'none'; }

function syncModeFields() {
  const mode = modeSelect.value;
  rateFields.style.display = mode === 'time' ? '' : 'none';
  timeField.style.display = mode === 'bandwidth' ? '' : 'none';
  document.getElementById('bw-rate').required = mode === 'time';
  document.getElementById('bw-time').required = mode === 'bandwidth';
}
modeSelect.addEventListener('change', syncModeFields);
syncModeFields();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();
  const mode = modeSelect.value;
  const size = Number(document.getElementById('bw-size').value);
  const sizeUnit = document.getElementById('bw-size-unit').value;

  try {
    if (mode === 'time') {
      const rate = Number(document.getElementById('bw-rate').value);
      const rateUnit = document.getElementById('bw-rate-unit').value;
      const result = calculateTransferTime(size, sizeUnit, rate, rateUnit);
      lastResult = { mode, result };

      document.getElementById('bw-results-time').style.display = '';
      document.getElementById('bw-results-bandwidth').style.display = 'none';
      document.getElementById('res-time').textContent = formatDuration(result.seconds);
      document.getElementById('res-bits').textContent = formatNumber(Math.round(result.bits));
      document.getElementById('res-bytes').textContent = formatNumber(Math.round(result.bytes));
    } else {
      const seconds = Number(document.getElementById('bw-time').value);
      const result = calculateRequiredBandwidth(size, sizeUnit, seconds);
      lastResult = { mode, result };

      document.getElementById('bw-results-time').style.display = 'none';
      document.getElementById('bw-results-bandwidth').style.display = '';
      document.getElementById('res-mbps').textContent = result.mbps.toFixed(2);
      document.getElementById('res-kbps').textContent = result.kbps.toFixed(2);
      document.getElementById('res-gbps').textContent = result.gbps.toFixed(4);
    }
    resultsCard.classList.add('is-visible');
    liveStatus.textContent = 'Results updated.';
  } catch (err) {
    lastResult = null;
    showError(err.message);
  }
});

form.addEventListener('reset', () => {
  clearError();
  resultsCard.classList.remove('is-visible');
  lastResult = null;
  syncModeFields();
});

wireCopyButton(document.getElementById('copy-btn'), () => {
  if (!lastResult) return null;
  if (lastResult.mode === 'time') {
    const r = lastResult.result;
    return `Transfer Time: ${formatDuration(r.seconds)}\nBits Transferred: ${Math.round(r.bits)}\nBytes Transferred: ${Math.round(r.bytes)}`;
  }
  const r = lastResult.result;
  return `Required Bandwidth: ${r.mbps.toFixed(2)} Mbps (${r.kbps.toFixed(2)} Kbps / ${r.gbps.toFixed(4)} Gbps)`;
});
