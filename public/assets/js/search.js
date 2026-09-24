(function () {
  function initSearch(inputId, cardSelector, redirectOnEnter) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const cards = Array.from(document.querySelectorAll(cardSelector));

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let visibleCount = 0;
      cards.forEach((card) => {
        const haystack = (card.dataset.search || card.textContent).toLowerCase();
        const match = q === '' || haystack.includes(q);
        card.hidden = !match;
        if (match) visibleCount++;
      });
      document.querySelectorAll('.tool-category').forEach((section) => {
        const anyVisible = Array.from(section.querySelectorAll(cardSelector)).some((c) => !c.hidden);
        section.hidden = !anyVisible;
      });
      const empty = document.getElementById('search-empty-state');
      if (empty) empty.hidden = visibleCount !== 0;
    });

    if (redirectOnEnter) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.location.href = '/tools/?q=' + encodeURIComponent(input.value.trim());
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSearch('home-search', '.tool-card', true);
    initSearch('tools-search', '.tool-card', false);

    // If arriving from the homepage search with ?q=, pre-fill and filter.
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const toolsSearch = document.getElementById('tools-search');
    if (q && toolsSearch) {
      toolsSearch.value = q;
      toolsSearch.dispatchEvent(new Event('input'));
    }
  });
})();
