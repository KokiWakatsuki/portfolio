(() => {
  const toggle=document.querySelector('.dog-guide-toggle');const guide=document.querySelector('#dog-guide');
  if(!toggle||!guide)return;
  function set(open){guide.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'犬のアイコンからサイト案内を閉じる':'犬のアイコンからサイト案内を開く');}
  toggle.addEventListener('click',()=>set(guide.hidden));
  guide.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>set(false)));
  document.addEventListener('pointerdown',event=>{if(!guide.contains(event.target)&&!toggle.contains(event.target))set(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!guide.hidden){set(false);toggle.focus();}});
})();
