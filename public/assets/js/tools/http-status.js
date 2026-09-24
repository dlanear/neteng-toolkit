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
  const url = document.getElementById('status-url').value.trim();
  if (!url) { showError('Please enter a URL.'); return; }

  setLoading(true);
  try {
    const resp = await fetch(`/api/http-status?url=${encodeURIComponent(url)}`);
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      showError(data.error || 'Unable to reach that URL. It may be offline or blocking automated requests.');
      lastResult = null;
      return;
    }
    lastResult = data;
    document.getElementById('res-code').textContent = data.statusCode;
    document.getElementById('res-message').textContent = data.statusMessage;
    document.getElementById('res-time').textContent = `${data.responseTimeMs} ms`;
    document.getElementById('res-final').textContent = data.finalUrl;
    document.querySelector('#redirect-table tbody').innerHTML = data.redirectChain.map((hop, i) =>
      `<tr><td>${i + 1}</td><td class="mono">${hop.url}</td><td>${hop.status}</td></tr>`
    ).join('');
    resultsCard.classList.add('is-visible');
    liveStatus.textContent = 'Results updated.';
  } catch (err) {
    lastResult = null;
    showError('Unable to reach that URL. It may be offline or blocking automated requests.');
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
  return `${d.requestedUrl}\nStatus: ${d.statusCode} ${d.statusMessage}\nResponse Time: ${d.responseTimeMs} ms\nFinal URL: ${d.finalUrl}\nRedirects: ${d.redirectCount}`;
});
