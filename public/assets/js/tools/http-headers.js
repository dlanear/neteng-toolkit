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
  const url = document.getElementById('headers-url').value.trim();
  if (!url) { showError('Please enter a URL.'); return; }

  setLoading(true);
  try {
    const resp = await fetch(`/api/http-headers?url=${encodeURIComponent(url)}`);
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      showError(data.error || 'Unable to reach that URL to retrieve headers.');
      lastResult = null;
      return;
    }
    lastResult = data;

    document.querySelector('#highlighted-table tbody').innerHTML = data.highlighted.length
      ? data.highlighted.map((h) => `<tr><td class="mono">${h.name}</td><td class="mono">${h.value}</td></tr>`).join('')
      : '<tr><td colspan="2">None of the highlighted headers were present.</td></tr>';

    document.querySelector('#all-headers-table tbody').innerHTML = Object.entries(data.headers)
      .map(([k, v]) => `<tr><td class="mono">${k}</td><td class="mono">${v}</td></tr>`).join('');

    const missingBox = document.getElementById('missing-security');
    if (data.missingSecurityHeaders.length) {
      missingBox.textContent = `Missing common security headers: ${data.missingSecurityHeaders.join(', ')}`;
      missingBox.style.display = 'block';
    } else {
      missingBox.style.display = 'none';
    }

    resultsCard.classList.add('is-visible');
    liveStatus.textContent = 'Results updated.';
  } catch (err) {
    lastResult = null;
    showError('Unable to reach that URL to retrieve headers.');
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
  return [`URL: ${lastResult.finalUrl}`, '', ...Object.entries(lastResult.headers).map(([k, v]) => `${k}: ${v}`)].join('\n');
});
