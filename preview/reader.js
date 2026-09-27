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
