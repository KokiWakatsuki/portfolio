(() => {
  'use strict';
  const data = window.PORTFOLIO_CONTENT;
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function restoreAnchor(){
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
    const target=id&&document.getElementById(id);
    if(target)requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant',block:'start'}));
  }
  document.body.dataset.design='studio';
  const projectTypes = {mongene:'DEVELOPMENT',research:'RESEARCH',festival:'DEVELOPMENT / TEAM',etsuzan:'DEVELOPMENT',sporty:'DEVELOPMENT'};
  const brandIcon=name=>`<svg class="contact-icon" aria-hidden="true"><use href="${document.body.dataset.assetBase||'assets/'}contact-icons.svg#${name}"/></svg>`;
  const updated=document.querySelector('#last-updated');
  if(updated){updated.dateTime=data.lastUpdated;updated.textContent=`Last updated ${data.lastUpdated.replaceAll('-','.')}`;}
  function repositoriesMarkup(project){
    const line=project.bullets.find(text=>text.startsWith('GitHub'))||'';
    const urls=line.match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+/g)||[];
    return urls.map(url=>{
      const label=project.id==='mongene'?'GitHub（ETSUZAN2025）':project.id==='festival'?({'group-manager-2':'GM2','SeeFT':'SeeFT','NUTMEG-Seeds':'Seeds'}[url.split('/').pop()]||'GitHub'):'GitHub';
      return `<a href="${escape(url)}" target="_blank" rel="noreferrer">${brandIcon('github')}${label} <span aria-hidden="true">↗</span></a>`;
    }).join('')+(project.externalLinks||[]).map(link=>`<a href="${escape(link.url)}" target="_blank" rel="noreferrer">${escape(link.label)} <span aria-hidden="true">↗</span></a>`).join('');
  }

  if(document.body.dataset.projectDetail) {
    const project=data.projects.find(p=>p.id===document.body.dataset.projectDetail);
    if(project) {
      $('#project-page-body').innerHTML=projectDetailMarkup(project).replace(/<(\/?)h3>/g,'<$1h2>');
      $('#project-page-title').innerHTML=window.projectTitleMarkup(project.id,project.detailTitle||project.title);
      window.initializeProjectGalleries($('#project-page-body'));
      window.initializeEngineViewers($('#project-page-body'));
      window.initializeResearchConcepts?.($('#project-page-body'));
      window.improveTextWrap($('#project-page-body'));
      restoreAnchor();
    }
    return;
  }
  // Keep the two activities on separate lines; each still wraps naturally on small screens.
  $('#hero-intro').innerHTML = escape(data.intro)
    .replace(/(修士2年[。．])\s*/,'$1<br>')
    .replace(/(研究しながら、)\s*/,'$1<br>');
  $('#about-copy').innerHTML = data.about.map(text=>`<p>${escape(text)}</p>`).join('');
  $('.writing-intro').textContent=data.writingIntro || '';
  const art = id => ({
    mongene:`<div class="project-ui-shot"><img src="assets/mongene-engine-problem-ui.jpg" alt="図つきの問題を表示するモンジェネの出題画面" loading="lazy"></div><span class="art-caption">モンジェネの出題画面</span>`,
    research:`<div class="project-ui-shot"><img src="assets/research-latent.png" alt="学習済みモデルの潜在空間。組織の型を色で示す研究図" loading="lazy"></div><span class="art-caption">学習済みモデルの潜在空間</span>`,
    festival:`<div class="project-ui-shot"><img src="assets/gm-current-ui.jpg" alt="GM2の申請状況とお知らせ" loading="lazy"></div><span class="art-caption">GM2の申請状況とお知らせ</span>`,
    etsuzan:`<div class="flow-art"><span>文章とプログラム</span><span class="flow-arrow" aria-hidden="true">↓</span><strong>LLM</strong><span class="flow-arrow" aria-hidden="true">↓</span><span>計算と作図</span><strong>PROGRAM</strong></div><span class="art-caption">問題生成の役割分担 / 概念図</span>`,
    sporty:`<div class="project-ui-shot"><img src="assets/sporty-comparison-ui.jpg" alt="sportyの並列動画比較画面" loading="lazy"></div><span class="art-caption">2つの動画を並列比較</span>`
  })[id];
  $('#project-grid').innerHTML=data.projects.map((project,index)=>{
    const visual=art(project.id);
    const facts=project.bullets.filter(line=>!line.startsWith('技術：')&&!line.startsWith('GitHub')).map(line=>`<li>${escape(line)}</li>`).join('');
    let paragraphs=project.summaryParagraphs||project.summary.split(/\n\s*\n/);
    if(project.id==='sporty'&&paragraphs.length===1)paragraphs=paragraphs[0].split(/(?<=できます。)/);
    const summary=paragraphs.filter(Boolean).map(text=>`<p>${escape(text).replace(/\n/g,'<br>')}</p>`).join('');
    const technology=project.technology.split('。').filter(Boolean).map((text,i)=>`<span class="${i?'tech-history':'tech-line'}">${escape(text)}</span>`).join('');
    return `<article class="project project-${project.id} ${visual?'has-art':''}">
      ${visual?`<a href="projects/${project.id}/" class="project-art" data-project="${project.id}" aria-label="${escape(project.title)}の詳細を見る">${visual}</a>`:''}
      <div class="project-content"><div class="project-topline"><span class="project-number">${String(index+1).padStart(2,'0')}</span><span>${projectTypes[project.id]}</span><span>${escape(project.year)}</span></div>
      <h3><a href="projects/${project.id}/" data-project="${project.id}">${window.projectTitleMarkup(project.id,project.title)}</a></h3><div class="project-summary">${summary}</div>${facts?`<ul class="project-facts">${facts}</ul>`:''}<div class="project-bottom"><div class="project-technologies">${technology}</div><div class="project-links"><a href="projects/${project.id}/" class="project-more" data-project="${project.id}">詳しく見る <span aria-hidden="true">↗</span></a>${repositoriesMarkup(project)}</div></div></div></article>`;
  }).join('');
  const timelineRow=([date,content])=>`<div class="timeline-row"><time>${escape(date)}</time><p>${escape(content)}</p></div>`;
  $('#full-experience').innerHTML=data.timeline.map(timelineRow).join('');
  $('#articles').innerHTML=data.articles.map(article=>`<a class="article-link" href="${escape(article.url)}" target="_blank" rel="noreferrer"><time>${escape(article.date)}</time><span>${escape(article.title)}</span><span class="article-arrow" aria-hidden="true">↗</span></a>`).join('');
  $('#talks').innerHTML=data.talks.map(talk=>`<p class="talk-item">${escape(talk)}</p>`).join('');
  $('#awards').innerHTML=data.awards.map(award=>`<p>${escape(award)}</p>`).join('');

  const dialog=$('#detail-dialog');
  function showDetail(title,html,kicker='PROJECT NOTES') {
    const project=data.projects.find(item=>item.title===title);
    $('#dialog-title').innerHTML=project?window.projectTitleMarkup(project.id,project.detailTitle||title):escape(title);
    $('#dialog-body').innerHTML=html;
    $('#dialog-kicker').textContent=kicker;
    dialog.dataset.projectId=project?.id||'';
    dialog.showModal();
    dialog.querySelector('.dialog-scroll').scrollTop=0;
    window.initializeProjectGalleries(dialog);
    window.initializeEngineViewers(dialog);
    window.initializeResearchConcepts?.(dialog);
    window.improveTextWrap(dialog);
    window.dispatchEvent(new CustomEvent('projectview',{detail:{id:project?.id||''}}));
  }
  function projectCapture(id) { return window.projectGalleryMarkup(id); }
  function projectDetailMarkup(project) {
    const diagram=project.id==='mongene'?window.decisionMarkup():'';
    const heading='<h3>設計図から問題を組み立てる方式にした理由</h3>';
    const detail=(diagram?project.detail.replace(heading,heading+diagram):project.detail).replaceAll('__ASSETS__',document.body.dataset.assetBase||'assets/');
    const repositories=repositoriesMarkup(project);
    return (project.id==='research'?window.researchConceptMarkup():'')+projectCapture(project.id)+(project.id==='mongene'?window.engineViewerMarkup():'')+detail+(repositories?`<div class="project-repositories">${repositories}</div>`:'');
  }
  window.openPortfolioProject=id=>{
    const project=data.projects.find(project=>project.id===id);
    if(!project)return;
    showDetail(project.title,`<p class="project-page-link"><a href="projects/${project.id}/">このプロジェクトのページを開く ↗</a></p>`+projectDetailMarkup(project),`${projectTypes[project.id]} / ${project.year}`);
  };
  document.querySelectorAll('[data-project]').forEach(link=>link.addEventListener('click',event=>{
    if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.openPortfolioProject(link.dataset.project);
  }));
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog) return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) dialog.close();
  });
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-visible'));
  new MutationObserver(()=>document.body.classList.toggle('dialog-visible',dialog.open)).observe(dialog,{attributes:true,attributeFilter:['open']});

  window.improveTextWrap(document.querySelector('main'));
  restoreAnchor();
  if(location.hash.startsWith('#project-')) {const project=data.projects.find(project=>`#project-${project.id}`===location.hash);if(project) showDetail(project.title,`<p class="project-page-link"><a href="projects/${project.id}/">このプロジェクトのページを開く ↗</a></p>`+projectDetailMarkup(project));}
})();
