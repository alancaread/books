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

(() => {
 const deck=document.querySelector('#deck');
 if(!deck)return;
 const slides=[...deck.querySelectorAll('.slide')], controls=document.querySelector('.deck-controls');
 const prev=document.querySelector('#prev'),next=document.querySelector('#next'),progress=document.querySelector('#progress');
 let current=0,start=null;
 function show(n,update=true){
  current=Math.max(0,Math.min(slides.length-1,n));
  slides.forEach((s,i)=>s.hidden=i!==current);
  prev.disabled=current===0;next.disabled=current===slides.length-1;
  progress.textContent=`${current+1} / ${slides.length}`;
  if(update)history.replaceState(null,'',`#slide-${current+1}`);
 }
 function fromHash(){const m=location.hash.match(/^#slide-(\d+)$/);show(m?Number(m[1])-1:0,false);}
 controls.hidden=false;fromHash();window.addEventListener('hashchange',fromHash);
 prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
 document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}
  if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}
  if(e.key==='Home'&&deck.contains(e.target)){e.preventDefault();show(0);}
  if(e.key==='End'&&deck.contains(e.target)){e.preventDefault();show(slides.length-1);}
 });
 deck.addEventListener('touchstart',e=>{if(e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
 deck.addEventListener('touchend',e=>{
  if(!start||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)show(current+(dx<0?1:-1));
 },{passive:true});
 deck.addEventListener('touchcancel',()=>start=null,{passive:true});
})();

(() => {const redirect=()=>{const id=decodeURIComponent(location.hash.slice(1));const node=document.getElementById(id);if(node?.dataset.redirect)location.replace(node.dataset.redirect);};redirect();addEventListener('hashchange',redirect);})();
document.querySelectorAll('audio').forEach(audio=>audio.addEventListener('play',()=>document.querySelectorAll('audio').forEach(other=>{if(other!==audio)other.pause();})));
