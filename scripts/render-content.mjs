export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const projectTitleMarkup=(id,title)=>id==='mongene'?'<span>モンジェネ</span><small class="project-title-sub">学習塾向けの問題生成</small>':id==='research'?'<span class="research-title"><span class="title-chunk">組織コミュニケーションの</span><span class="title-chunk">生成モデル</span></span>':escape(title);
const projectTypes={mongene:'DEVELOPMENT',research:'RESEARCH',festival:'DEVELOPMENT / TEAM',sporty:'DEVELOPMENT'};
export function repositoriesMarkup(project,assetBase='assets/') {
  const brandIcon=name=>`<svg class="contact-icon" aria-hidden="true"><use href="${assetBase}contact-icons.svg#${name}"/></svg>`;
  const urls=(project.bullets.find(text=>text.startsWith('GitHub'))||'').match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+/g)||[];
  return urls.map(url=>{
    const label=project.id==='mongene'?'GitHub（ETSUZAN2025）':project.id==='festival'?({'group-manager-2':'GM2','SeeFT':'SeeFT','NUTMEG-Seeds':'Seeds'}[url.split('/').pop()]||'GitHub'):'GitHub';
    return `<a href="${escape(url)}" target="_blank" rel="noreferrer">${brandIcon('github')}${label} <span aria-hidden="true">↗</span></a>`;
  }).join('')+(project.externalLinks||[]).map(link=>`<a href="${escape(link.url)}" target="_blank" rel="noreferrer">${escape(link.label)} <span aria-hidden="true">↗</span></a>`).join('');
}
function fill(source,id,content) {
  const pattern=new RegExp(String.raw`(<(div|p)\b[^>]*\bid="${id}"[^>]*>)(\s*)(</\2>)`);
  if(!pattern.test(source))throw Error('Missing static content slot: '+id);
  return source.replace(pattern,(_,open,tag,space,close)=>open+content+close);
}
export function renderHome(source,data) {
  const art = id => ({
    mongene:`<div class="project-ui-shot"><img src="assets/mongene-engine-problem-ui.jpg" alt="図つきの問題を表示するモンジェネの出題画面" loading="lazy"></div><span class="art-caption">モンジェネの出題画面</span>`,
    research:`<div class="project-ui-shot"><img src="assets/research-latent.png" alt="学習済みモデルの潜在空間。組織の型を色で示す研究図" loading="lazy"></div><span class="art-caption">学習済みモデルの潜在空間</span>`,
    festival:`<div class="project-ui-shot"><img src="assets/gm-current-ui.jpg" alt="GM2の申請状況とお知らせ" loading="lazy"></div><span class="art-caption">GM2の申請状況とお知らせ</span>`,
    etsuzan:`<div class="flow-art"><span>文章とプログラム</span><span class="flow-arrow" aria-hidden="true">↓</span><strong>LLM</strong><span class="flow-arrow" aria-hidden="true">↓</span><span>計算と作図</span><strong>PROGRAM</strong></div><span class="art-caption">問題生成の役割分担 / 概念図</span>`,
    sporty:`<div class="project-ui-shot"><img src="assets/sporty-comparison-ui.jpg" alt="sportyの並列動画比較画面" loading="lazy"></div><span class="art-caption">2つの動画を並列比較</span>`
  })[id];
  const projects=data.projects.map((project,index)=>{
    const visual=art(project.id);
    const facts=project.bullets.filter(line=>!line.startsWith('技術：')&&!line.startsWith('GitHub')).map(line=>`<li>${escape(line)}</li>`).join('');
    let paragraphs=project.summaryParagraphs||project.summary.split(/\n\s*\n/);
    if(project.id==='sporty'&&paragraphs.length===1)paragraphs=paragraphs[0].split(/(?<=できます。)/);
    const summary=paragraphs.filter(Boolean).map(text=>`<p>${escape(text).replace(/\n/g,'<br>')}</p>`).join('');
    const technology=project.technology.split('。').filter(Boolean).map((text,i)=>`<span class="${i?'tech-history':'tech-line'}">${escape(text)}</span>`).join('');
    return `<article class="project project-${project.id} ${visual?'has-art':''}">
      ${visual?`<a href="projects/${project.id}/" class="project-art" data-project="${project.id}" aria-label="${escape(project.title)}の詳細を見る">${visual}</a>`:''}
      <div class="project-content"><div class="project-topline"><span class="project-number">${String(index+1).padStart(2,'0')}</span><span>${projectTypes[project.id]}</span><span>${escape(project.year)}</span></div>
      <h3><a href="projects/${project.id}/" data-project="${project.id}">${projectTitleMarkup(project.id,project.title)}</a></h3><div class="project-summary">${summary}</div>${facts?`<ul class="project-facts">${facts}</ul>`:''}<div class="project-bottom"><div class="project-technologies">${technology}</div><div class="project-links"><a href="projects/${project.id}/" class="project-more" data-project="${project.id}">詳しく見る <span aria-hidden="true">↗</span></a>${repositoriesMarkup(project)}</div></div></div></article>`;
  }).join('');

  const slots={
    'hero-intro':escape(data.intro).replace(/(修士2年[。．])\s*/,'$1<br>').replace(/(研究しながら、)\s*/,'$1<br>'),
    'about-copy':data.about.map(text=>`<p>${escape(text)}</p>`).join(''),
    'project-grid':projects,
    'full-experience':data.timeline.map(([date,content])=>`<div class="timeline-row"><time>${escape(date)}</time><p>${escape(content)}</p></div>`).join(''),
    'articles':data.articles.map(article=>`<a class="article-link" href="${escape(article.url)}" target="_blank" rel="noreferrer"><time>${escape(article.date)}</time><span>${escape(article.title)}</span><span class="article-arrow" aria-hidden="true">↗</span></a>`).join(''),
    'talks':data.talks.map(talk=>`<p class="talk-item">${escape(talk)}</p>`).join(''),
    'awards':data.awards.map(award=>`<p>${escape(award)}</p>`).join('')
  };
  for(const [id,content] of Object.entries(slots))source=fill(source,id,content);
  return source.replace(/(<p class="writing-intro">)[^]*?(<\/p>)/,(_,open,close)=>open+escape(data.writingIntro)+close);
}
export function renderProject(source,project) {
  const detail=project.detail.replaceAll('__ASSETS__','../../assets/').replace(/<(\/?)h3>/g,'<$1h2>');
  const links=repositoriesMarkup(project,'../../assets/');
  return source.replace('<article id="project-page-body" class="project-page-body"></article>',()=>`<article id="project-page-body" class="project-page-body">${detail}${links?`<div class="project-repositories">${links}</div>`:''}</article>`)
    .replace('<h1 id="project-page-title">'+escape(project.detailTitle)+'</h1>',()=>'<h1 id="project-page-title">'+projectTitleMarkup(project.id,project.detailTitle)+'</h1>');
}
