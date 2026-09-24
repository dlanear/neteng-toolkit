import { wireCopyButton } from '../copy.js';

const form = document.getElementById('tool-form');
const errorBox = document.getElementById('form-error');
const resultsCard = document.getElementById('results-card');
const liveStatus = document.getElementById('live-status');
const submitBtn = form.querySelector('button[type="submit"]');
let lastResult = null;

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  resultsCard.classList.remove('is-visible');
  liveStatus.textContent = msg;
}
function clearError() { errorBox.style.display = 'none'; }
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? 'Testing…' : 'Calculate';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  const target = document.getElementById('ping-target').value.trim();
  if (!target) { showError('Please enter a hostname or URL.'); return; }

  setLoading(true);
  try {
    const resp = await fetch(`/api/ping?target=${encodeURIComponent(target)}`);
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      showError(data.error || 'Unable to reach that target. Please try again.');
      lastResult = null;
      return;
    }
    lastResult = data;
    document.getElementById('res-min').textContent = `${data.minMs} ms`;
    document.getElementById('res-avg').textContent = `${data.avgMs} ms`;
    document.getElementById('res-max').textContent = `${data.maxMs} ms`;
    document.getElementById('res-loss').textContent = `${data.packetLossPercent}%`;
    document.getElementById('ping-note').textContent = data.note;
    resultsCard.classList.add('is-visible');
    liveStatus.textContent = 'Results updated.';
  } catch (err) {
    lastResult = null;
    showError('Unable to reach that target. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
});

form.addEventListener('reset', () => {
  clearError();
  resultsCard.classList.remove('is-visible');
  lastResult = null;
});

wireCopyButton(document.getElementById('copy-btn'), () => {
  if (!lastResult) return null;
  const d = lastResult;
  return `${d.testType} — ${d.target}\nMin: ${d.minMs} ms | Avg: ${d.avgMs} ms | Max: ${d.maxMs} ms | Packet Loss: ${d.packetLossPercent}%`;
});
