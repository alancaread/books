(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  toggle.setAttribute('aria-pressed', String(isDark()));
  toggle.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    toggle.setAttribute('aria-pressed', String(isDark()));
  });
  const article = document.querySelector('#article');
  const progress = document.querySelector('#reading-progress');
  if (article && progress) {
    const update = () => {
      const rect = article.getBoundingClientRect();
      const range = Math.max(1, rect.height - innerHeight);
      const value = Math.max(0, Math.min(100, Math.round(-rect.top / range * 100)));
      progress.value = value;
      progress.textContent = `${value}%`;
    };
    addEventListener('scroll', update, {passive: true});
    addEventListener('resize', update);
    update();
  }
})();
document.querySelectorAll('.podcast').forEach(section => {
  const audio = section.querySelector('audio');
  section.querySelectorAll('[data-seek]').forEach(button => button.addEventListener('click', () => {
    const seek = () => { audio.currentTime = Number(button.dataset.seek); };
    if (audio.readyState >= 1) seek();
    else { audio.addEventListener('loadedmetadata', seek, {once:true}); audio.load(); }
  }));
  const search = section.querySelector('[data-transcript-search]');
  const rows = [...section.querySelectorAll('[data-transcript]')];
  const filter = () => {
    const term = search.value.trim().toLocaleLowerCase();
    rows.forEach(row => { row.hidden = !row.textContent.toLocaleLowerCase().includes(term); });
    section.querySelector('[data-search-count]').textContent = `${rows.filter(row => !row.hidden).length} 段匹配`;
  };
  search.addEventListener('input', filter); filter();
});
