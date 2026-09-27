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
document.querySelectorAll('.book-visuals').forEach(section => {
  const select = section.querySelector('[data-person-select]');
  const nodes = [...section.querySelectorAll('[data-person]')];
  const rows = [...section.querySelectorAll('[data-related]')];
  const choose = key => {
    select.value = key;
    nodes.forEach(node => node.setAttribute('aria-pressed', String(Boolean(key) && node.dataset.person === key)));
    rows.forEach(row => {
      const related = Boolean(key) && row.dataset.related.split(' ').includes(key);
      row.classList.toggle('is-related', related);
      row.classList.toggle('is-muted', Boolean(key) && !related);
    });
    section.querySelectorAll('[data-person-description]').forEach(p => { p.hidden = p.dataset.personDescription !== key; });
    const events = section.querySelectorAll('.time-event.is-related').length;
    const relations = section.querySelectorAll('.relation-pair.is-related').length;
    section.querySelector('[data-visual-count]').textContent = key
      ? `${select.selectedOptions[0].textContent}：${events} 个事件，${relations} 组联系。其余内容仍可浏览。`
      : '点击人名，可同时高亮相关事件和关系。';
    section.querySelectorAll('.visual-scroll').forEach(list => {
      const first = list.querySelector('.is-related');
      list.scrollTop = first ? list.scrollTop + first.getBoundingClientRect().top - list.getBoundingClientRect().top - 4 : 0;
    });
  };
  nodes.forEach(node => node.addEventListener('click', () => choose(node.dataset.person)));
  select.addEventListener('change', () => choose(select.value));
  section.querySelector('[data-person-reset]').addEventListener('click', () => choose(''));
});

// The original edition cover opens inside the current page.
const coverDialog = document.querySelector('[data-cover-dialog]');
const coverOpener = document.querySelector('[data-cover-open]');
if (coverDialog && coverOpener) {
  coverOpener.addEventListener('click', () => coverDialog.showModal());
  document.querySelector('[data-cover-close]').addEventListener('click', () => coverDialog.close());
  coverDialog.addEventListener('click', event => { if (event.target === coverDialog) coverDialog.close(); });
  coverDialog.addEventListener('close', () => coverOpener.focus());
}
