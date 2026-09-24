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

function render(data) {
  const table = document.getElementById('dns-table');
  const empty = document.getElementById('dns-empty');
  if (!data.hasRecords) {
    empty.textContent = data.message || `No records found.`;
    empty.style.display = 'block';
    table.style.display = 'none';
  } else {
    empty.style.display = 'none';
    table.style.display = '';
    document.querySelector('#dns-table tbody').innerHTML = data.records.map((r) =>
      `<tr><td>${r.name}</td><td>${r.type}</td><td>${r.ttl}</td><td class="mono">${escapeHtml(r.value)}</td></tr>`
    ).join('');
  }
  resultsCard.classList.add('is-visible');
  liveStatus.textContent = 'Results updated.';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  const domain = document.getElementById('dns-domain').value.trim();
  const type = document.getElementById('dns-type').value;

  if (!domain) {
    showError('Please enter a domain name.');
    return;
  }

  setLoading(true);
  try {
    const resp = await fetch(`/api/dns-lookup?domain=${encodeURIComponent(domain)}&type=${type}`);
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      showError(data.error || 'Unable to retrieve DNS information right now. Please try again.');
      lastResult = null;
      return;
    }
    lastResult = data;
    render(data);
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
  if (!lastResult.hasRecords) return `${lastResult.domain} — ${lastResult.message}`;
  return [`${lastResult.domain} — ${lastResult.queryType} records:`, ...lastResult.records.map((r) => `  ${r.name} ${r.ttl} ${r.type} ${r.value}`)].join('\n');
});
