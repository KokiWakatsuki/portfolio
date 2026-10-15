(() => {
  'use strict';
  const button=document.querySelector('#motion-toggle');
  const progress=document.querySelector('.reading-progress');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let preference=null;
  try{preference=sessionStorage.getItem('portfolio-motion');}catch{}
  let enabled=!reduced.matches&&preference!=='off';
  const animations=new Set();
  const ease='cubic-bezier(.22,.8,.22,1)';
  function animate(element,frames,options={}) {
    if(!enabled || reduced.matches || !element?.animate) return;
    const animation=element.animate(frames,{duration:260,easing:ease,...options});
    animations.add(animation);
    animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
    return animation;
  }
  window.portfolioAnimate=animate;
  function applyMotion() {
    document.body.classList.toggle('motion-on',enabled);
    document.body.classList.toggle('motion-off',!enabled);
    document.documentElement.style.scrollBehavior=enabled?'smooth':'auto';
    if(button){button.disabled=reduced.matches;button.innerHTML=`<span>動き</span><span class="motion-value">${enabled?'ON':'OFF'}</span>`;button.setAttribute('aria-label',reduced.matches?'端末の設定に合わせて動きを減らしています':enabled?'動きを止める':'動きを再生');button.setAttribute('aria-pressed',String(!enabled));}
    if(!enabled) animations.forEach(a=>a.cancel());
    window.dispatchEvent(new CustomEvent('motionchange',{detail:{enabled}}));
  }
  button?.addEventListener('click',()=>{enabled=!enabled;preference=enabled?'on':'off';try{sessionStorage.setItem('portfolio-motion',preference);}catch{}applyMotion();});
  reduced.addEventListener('change',()=>{enabled=!reduced.matches&&preference!=='off';applyMotion();});
  function update() {
    document.documentElement.style.setProperty('--preview-offset','24px');
    const length=document.documentElement.scrollHeight-innerHeight;
    if(progress)progress.style.transform=`scaleX(${length>0?scrollY/length:0})`;
  }
  let pending=false;
  window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>{update();pending=false;});}},{passive:true});
  window.addEventListener('resize',update);
  applyMotion();update();
  // Only illustrations settle into place. All names and prose remain visible from the first frame.
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    animate(entry.target,[{transform:'translateY(12px)'},{transform:'translateY(0)'}],{duration:550});
    observer.unobserve(entry.target);
  }),{threshold:.18});
  document.querySelectorAll('.project-art').forEach(element=>observer.observe(element));
  const dialog=document.querySelector('#detail-dialog');
  if(dialog)new MutationObserver(()=>{if(dialog.open)animate(dialog,[{transform:'translateY(10px) scale(.985)',opacity:.85},{transform:'translateY(0) scale(1)',opacity:1}]);}).observe(dialog,{attributes:true,attributeFilter:['open']});
  const guide=document.querySelector('#dog-guide');
  if(guide)new MutationObserver(()=>{if(!guide.hidden)animate(guide,[{transform:'translateY(-5px) scale(.98)'},{transform:'translateY(0) scale(1)'}]);}).observe(guide,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('click',event=>{
    const switchButton=event.target.closest('[data-ui-view],[data-engine-next],[data-engine-topic]');
    if(switchButton){const container=switchButton.closest('[data-ui-gallery],.engine-viewer');const artwork=container.querySelector('img,[data-engine-problem]');animate(artwork,[{transform:'translateY(6px)'},{transform:'translateY(0)'}],{duration:240});}
  });
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
  document.querySelectorAll('.project-art').forEach(art=>{
    art.addEventListener('pointermove',event=>{
      if(!enabled||reduced.matches||!finePointer.matches)return;
      const box=art.getBoundingClientRect();
      art.style.setProperty('--art-x',`${(event.clientX-box.left)/box.width*2-1}deg`);
      art.style.setProperty('--art-y',`${-((event.clientY-box.top)/box.height*2-1)}deg`);
    });
    art.addEventListener('pointerleave',()=>{art.style.setProperty('--art-x','0deg');art.style.setProperty('--art-y','0deg');});
  });
})();
