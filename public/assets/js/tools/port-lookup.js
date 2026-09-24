import { findByPort, findByService } from '../lib/ports-data.js';
import { wireCopyButton } from '../copy.js';

const form = document.getElementById('tool-form');
const errorBox = document.getElementById('form-error');
const resultsCard = document.getElementById('results-card');
const liveStatus = document.getElementById('live-status');
let lastResults = [];

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
  const query = document.getElementById('port-query').value.trim();
  if (!query) { showError('Please enter a port number or service name.'); return; }

  const results = /^\d+$/.test(query) ? findByPort(query) : findByService(query);
  lastResults = results;

  const table = document.getElementById('port-table');
  const empty = document.getElementById('port-empty');
  if (results.length === 0) {
    empty.style.display = 'block';
    table.style.display = 'none';
  } else {
    empty.style.display = 'none';
    table.style.display = '';
    document.querySelector('#port-table tbody').innerHTML = results.map((r) =>
      `<tr><td>${r.port}</td><td>${r.protocol}</td><td>${r.service}</td><td>${r.description}</td></tr>`
    ).join('');
  }
  resultsCard.classList.add('is-visible');
  liveStatus.textContent = 'Results updated.';
});

form.addEventListener('reset', () => {
  clearError();
  resultsCard.classList.remove('is-visible');
  lastResults = [];
});

wireCopyButton(document.getElementById('copy-btn'), () => {
  if (!lastResults.length) return null;
  return lastResults.map((r) => `${r.port}/${r.protocol} — ${r.service}: ${r.description}`).join('\n');
});
