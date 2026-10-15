(() => {
  'use strict';
  let serial=0;
  const instances=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const allowed=()=>!reduced.matches&&!document.body.classList.contains('motion-off')&&!document.hidden;
  const pairs=[];for(let i=0;i<7;i++)for(let j=i+1;j<7;j++)pairs.push([i,j]);
  const hub=[[300,165],...Array.from({length:6},(_,i)=>[300+145*Math.cos(i*Math.PI/3-Math.PI/2),165+118*Math.sin(i*Math.PI/3-Math.PI/2)])];
  const shapes={
    flat:{label:'フラット型',points:Array.from({length:7},(_,i)=>[300+152*Math.cos(i*2*Math.PI/7-Math.PI/2),165+118*Math.sin(i*2*Math.PI/7-Math.PI/2)]),edge:(i,j)=>j-i===1||(i===0&&j===6)},
    hierarchy:{label:'階層型',points:[[300,45],[190,150],[410,150],[125,265],[245,265],[355,265],[475,265]],edge:(i,j)=>j===i*2+1||j===i*2+2},
    cluster:{label:'クラスター型',points:[[175,85],[110,195],[245,200],[400,75],[485,125],[465,245],[365,230]],edge:(i,j)=>(i<3&&j<3)||(i>=3&&j>=3)||(i===0&&j===3)}
  };
  window.researchConceptMarkup=()=>{
    const id=`research-progress-${++serial}`;
    return `<figure id="research-concept" class="research-concept" data-research-concept><div class="concept-heading"><div><span class="eyebrow">RESEARCH CONCEPT</span><h3>研究で目指していること</h3></div><span class="concept-members">メンバーは同じ7人</span></div><div class="concept-targets" role="group" aria-label="目標の組織の形">${Object.entries(shapes).map(([key,shape])=>`<button type="button" data-shape="${key}" aria-pressed="${key==='flat'}">${shape.label}</button>`).join('')}</div><svg viewBox="0 0 600 330" role="img" aria-label="同じ7人のつながり方が、ハブ型から目標の形へ変わる概念図"><g class="concept-edges">${pairs.map(()=>'<line/>').join('')}</g><g class="concept-nodes">${hub.map((_,i)=>`<g><circle r="19"/><text text-anchor="middle" dy=".35em">${i+1}</text><text class="concept-leader-label" text-anchor="middle" y="-29">リーダー</text></g>`).join('')}</g></svg><div class="concept-controls"><button type="button" class="concept-play" aria-label="組織の変化を一時停止">一時停止</button><label class="presence-live" for="${id}">組織の変化の段階</label><input id="${id}" type="range" min="0" max="100" value="0"><span class="concept-stage" aria-live="off">ハブ型 → フラット型</span></div><figcaption>メンバーを固定し、つながり方を変える操作のイメージです。学習済みモデルの出力は下の図で紹介しています。</figcaption></figure>`;
  };
  window.initializeResearchConcepts=container=>{
    for(const instance of instances)if(!instance.root.isConnected){instance.dispose();instances.delete(instance);}
    container.querySelectorAll('[data-research-concept]').forEach(root=>{
      if(root.dataset.ready)return;root.dataset.ready='true';
      let target='flat',progress=0,direction=1,playing=true,visible=false,frame=0,last=0;
      const lines=[...root.querySelectorAll('line')],nodes=[...root.querySelectorAll('.concept-nodes>g')];
      const slider=root.querySelector('input'),play=root.querySelector('.concept-play'),stage=root.querySelector('.concept-stage');
      const paint=()=>{
        const t=progress*progress*(3-2*progress),shape=shapes[target];
        const points=hub.map((p,i)=>p.map((v,k)=>v+(shape.points[i][k]-v)*t));
        pairs.forEach(([i,j],index)=>{const line=lines[index];line.setAttribute('x1',points[i][0]);line.setAttribute('y1',points[i][1]);line.setAttribute('x2',points[j][0]);line.setAttribute('y2',points[j][1]);line.style.opacity=((i===0?1:0)*(1-t)+(shape.edge(i,j)?1:0)*t).toFixed(3);line.classList.toggle('concept-bridge',target==='cluster'&&i===0&&j===3);});
        nodes.forEach((node,i)=>{node.setAttribute('transform',`translate(${points[i][0]} ${points[i][1]})`);node.classList.toggle('is-cluster-leader',target==='cluster'&&progress>.6&&(i===0||i===3));});
        slider.value=Math.round(progress*100);slider.setAttribute('aria-valuetext',`${Math.round(progress*100)}%、ハブ型から${shape.label}へ`);
        stage.textContent=`ハブ型 → ${shape.label}`;
      };
      const pause=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
      const updateButton=()=>{const active=playing&&allowed();play.textContent=active?'一時停止':'再生';play.setAttribute('aria-label',active?'組織の変化を一時停止':'組織の変化を再生');play.disabled=!allowed();};
      const tick=now=>{frame=0;if(!root.isConnected||!visible||!allowed()||!playing){last=0;return;}if(last){progress+=Math.min(now-last,80)/6500*direction;if(progress>=1){progress=1;direction=-1;}if(progress<=0){progress=0;direction=1;}}last=now;paint();frame=requestAnimationFrame(tick);};
      const resume=()=>{pause();updateButton();if(visible&&playing&&allowed())frame=requestAnimationFrame(tick);};
      root.querySelectorAll('[data-shape]').forEach(button=>button.addEventListener('click',()=>{target=button.dataset.shape;progress=0;direction=1;root.querySelectorAll('[data-shape]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));paint();resume();}));
      slider.addEventListener('input',()=>{playing=false;progress=Number(slider.value)/100;pause();paint();updateButton();});
      play.addEventListener('click',()=>{playing=!playing;resume();});
      const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:.05});observer.observe(root);
      instances.add({root,resume,dispose(){pause();observer.disconnect();}});paint();updateButton();
    });
  };
  const resumeAll=()=>instances.forEach(instance=>instance.resume());
  window.addEventListener('motionchange',resumeAll);document.addEventListener('visibilitychange',resumeAll);reduced.addEventListener('change',resumeAll);
})();
