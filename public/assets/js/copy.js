export function wireCopyButton(button, getText) {
  if (!button) return;
  button.addEventListener('click', async () => {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Fallback for browsers without Clipboard API permission.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) { /* ignore */ }
      document.body.removeChild(ta);
    }
    button.dataset.copied = 'true';
    button.setAttribute('aria-live', 'polite');
    const original = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.dataset.copied = 'false';
      button.textContent = original;
    }, 1600);
  });
}
