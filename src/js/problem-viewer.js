(() => {
  const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const assets=()=>document.body.dataset.assetBase||'assets/';
  const difficulties=['','基礎','標準','応用','発展'];
  window.engineViewerMarkup=()=>`<section id="engine-examples" class="engine-viewer" aria-label="エンジンで生成した問題"><h3>エンジンで生成した問題</h3><div class="engine-controls"><label>分野<select data-engine-topic aria-label="分野"><option value="all">すべての出題例</option>${[...new Set(window.ENGINE_EXAMPLES.map(p=>p.topic))].map(topic=>`<option>${escape(topic)}</option>`).join('')}</select></label><button type="button" data-engine-next>別の問題を見る ↻</button></div><div data-engine-problem aria-live="polite"></div></section>`;
  window.initializeEngineViewers=container=>{
    container.querySelectorAll('.engine-viewer').forEach(viewer=>{
      if(viewer.dataset.ready)return;
      viewer.dataset.ready='true';
      const select=viewer.querySelector('[data-engine-topic]');let index=0;
      function render(){
        const choices=select.value==='all'?window.ENGINE_EXAMPLES:window.ENGINE_EXAMPLES.filter(p=>p.topic===select.value);const item=choices[index%choices.length];
        viewer.querySelector('[data-engine-problem]').innerHTML=`<div class="engine-meta"><span>${escape(item.title)}</span><span>${difficulties[item.level]} · ${index%choices.length+1} / ${choices.length}</span></div><p class="engine-statement">${escape(item.statement)}</p>${item.diagram?`<img class="engine-diagram" src="${assets()+item.diagram}" alt="${escape(item.title)}の問題の図">`:''}${item.questions.filter(q=>q.prompt).map(q=>`<p>${escape(q.label)} ${escape(q.prompt)}</p>`).join('')}<details class="engine-answer"><summary>解答と解説を見る</summary>${item.questions.map(q=>`<strong>${escape(q.label)} ${escape(q.answer)}</strong><p>${escape(q.explanation)}</p>${q.diagram?`<img class="engine-diagram" src="${assets()+q.diagram}" alt="${escape(item.title)}の模範解答の図">`:''}`).join('')}</details>`;
        window.improveTextWrap(viewer);
      }
      select.addEventListener('change',()=>{index=0;render();});
      viewer.querySelector('[data-engine-next]').addEventListener('click',()=>{index++;render();});render();
    });
  };
})();
