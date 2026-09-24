import { ipToBinaryOctets, binaryToIp, isValidBinaryIp } from '../lib/binary.js';
import { isValidIPv4 } from '../lib/ipv4.js';
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
  const mode = document.getElementById('bin-mode').value;
  const input = document.getElementById('bin-input').value.trim();

  try {
    let ip, octetsBinary;
    if (mode === 'to-binary') {
      if (!isValidIPv4(input)) throw new Error('Please enter a valid IPv4 address.');
      ip = input;
      octetsBinary = ipToBinaryOctets(ip);
    } else {
      if (!isValidBinaryIp(input)) {
        throw new Error('Invalid binary IPv4 address. Expected four 8-bit groups, e.g. 11000000.10101000.00000001.00001010');
      }
      ip = binaryToIp(input);
      octetsBinary = ipToBinaryOctets(ip);
    }

    lastResult = { ip, binary: octetsBinary.join('.'), decimalOctets: ip.split('.') , binaryOctets: octetsBinary };

    document.getElementById('res-ip').textContent = ip;
    document.getElementById('res-binary').textContent = octetsBinary.join('.');
    document.getElementById('octet-body').innerHTML = ip.split('.').map((dec, i) =>
      `<tr><td>Octet ${i + 1}</td><td>${dec}</td><td class="mono">${octetsBinary[i]}</td></tr>`
    ).join('');

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
});

wireCopyButton(document.getElementById('copy-btn'), () => {
  if (!lastResult) return null;
  return `IPv4: ${lastResult.ip}\nBinary: ${lastResult.binary}`;
});
