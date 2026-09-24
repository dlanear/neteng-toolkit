export function formatNumber(n) {
  if (typeof n !== 'number' || !isFinite(n)) return String(n);
  return n.toLocaleString('en-US');
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
