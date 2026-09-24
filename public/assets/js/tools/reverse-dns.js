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
  submitBtn.textContent = isLoading ? 'Looking up…' : 'Calculate';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  const ip = document.getElementById('rdns-ip').value.trim();
  if (!ip) { showError('Please enter an IP address.'); return; }

  setLoading(true);
  try {
    const resp = await fetch(`/api/reverse-dns?ip=${encodeURIComponent(ip)}`);
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      showError(data.error || 'Unable to retrieve DNS information right now. Please try again.');
      lastResult = null;
      return;
    }
    lastResult = data;
    document.getElementById('res-ip').textContent = data.ip;
    document.getElementById('res-hostname').textContent = data.hostname || data.message || 'No PTR record found.';
    resultsCard.classList.add('is-visible');
    liveStatus.textContent = 'Results updated.';
  } catch (err) {
    lastResult = null;
    showError('Unable to retrieve DNS information right now. Please check your connection and try again.');
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
  return `IP: ${lastResult.ip}\nHostname: ${lastResult.hostname || 'No PTR record found.'}`;
});
