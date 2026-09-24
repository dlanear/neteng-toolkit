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
  submitBtn.textContent = isLoading ? 'Checking…' : 'Calculate';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  const domain = document.getElementById('ssl-domain').value.trim();
  if (!domain) { showError('Please enter a domain name.'); return; }

  setLoading(true);
  try {
    const resp = await fetch(`/api/ssl-check?domain=${encodeURIComponent(domain)}`);
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      showError(data.error || 'Unable to check this domain right now.');
      lastResult = null;
      return;
    }
    lastResult = data;
    document.getElementById('res-reachable').textContent = data.httpsReachable ? 'Yes' : 'No';
    document.getElementById('res-status').textContent = data.statusCode ?? '—';
    document.getElementById('res-time').textContent = data.responseTimeMs ? `${data.responseTimeMs} ms` : '—';
    document.getElementById('ssl-limitation').textContent = data.limitation || data.message || '';
    resultsCard.classList.add('is-visible');
    liveStatus.textContent = 'Results updated.';
  } catch (err) {
    lastResult = null;
    showError('Unable to check this domain right now. Please try again.');
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
  return `Domain: ${d.domain}\nHTTPS Reachable: ${d.httpsReachable ? 'Yes' : 'No'}\n${d.limitation || d.message || ''}`;
});
