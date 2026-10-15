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
