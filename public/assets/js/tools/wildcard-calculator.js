import { maskToWildcard, wildcardToMask, isValidSubnetMask } from '../lib/wildcard.js';
import { isValidIPv4 } from '../lib/ipv4.js';
import { maskToCidr } from '../lib/ipv4.js';
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
  const input = document.getElementById('wc-input').value.trim();
  const direction = document.getElementById('wc-direction').value;

  if (!isValidIPv4(input)) {
    showError('Please enter a valid dotted-decimal mask (e.g. 255.255.255.0).');
    return;
  }

  try {
    let output, resolvedDirection;
    if (direction === 'mask-to-wildcard') {
      if (!isValidSubnetMask(input)) throw new Error('That is not a valid contiguous subnet mask.');
      output = maskToWildcard(input);
      resolvedDirection = 'mask-to-wildcard';
    } else if (direction === 'wildcard-to-mask') {
      output = wildcardToMask(input);
      resolvedDirection = 'wildcard-to-mask';
    } else {
      // auto-detect: if it's a valid contiguous subnet mask, treat as mask -> wildcard.
      if (isValidSubnetMask(input)) {
        output = maskToWildcard(input);
        resolvedDirection = 'mask-to-wildcard';
      } else {
        output = wildcardToMask(input);
        resolvedDirection = 'wildcard-to-mask';
      }
    }

    const maskValue = resolvedDirection === 'mask-to-wildcard' ? input : output;
    const cidr = maskToCidr(maskValue);

    lastResult = { input, output, cidr };
    document.getElementById('res-input').textContent = input;
    document.getElementById('res-output').textContent = output;
    document.getElementById('res-cidr').textContent = cidr !== null ? `/${cidr}` : 'N/A';
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
  return `Input: ${lastResult.input}\nResult: ${lastResult.output}\nEquivalent CIDR: /${lastResult.cidr}`;
});
