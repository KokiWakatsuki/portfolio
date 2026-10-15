(() => {
  'use strict';
  const chart=document.querySelector('#activity-chart');
  if(!chart) return;
  const detail=document.querySelector('#activity-detail');
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const categories=['学校','開発','教える','運営','研究'];
  const dateParts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());
  const part=name=>Number(dateParts.find(p=>p.type===name).value);
  const current=part('year')+(part('month')-1+(part('day')-1)/31)/12;
  const start=2018;
  const percent=value=>100*(value-start)/(current-start);
  const month=(value,end=false)=>{const [year,m]=value.split('.').map(Number);return year+((m||1)-1+(end?1:0))/12;};
  const events=window.PORTFOLIO_CONTENT.activities.map((event,id)=>{
    const [from,to]=event.period.split(/[–−—]/);
    const point=event.kind==='時点';
    return {...event,id,from:month(from),to:point?month(from):to?month(to,true):current,point};
  });
  const years=Array.from({length:Math.floor(current)-start+1},(_,i)=>start+i);
  const grid=years.map(year=>`<i style="left:${percent(year)}%"></i>`).join('');
  chart.innerHTML=`<div class="activity-axis"><span></span><div>${years.map(year=>`<time style="left:${percent(year)}%">${year}</time>`).join('')}<span class="activity-now" style="left:100%">現在</span></div></div>`+categories.map((category,index)=>{
    const entries=events.filter(event=>event.category===category).sort((a,b)=>a.from-b.from||b.to-a.to);
    const rows=[];
    const buttons=entries.map(event=>{
      // Stack overlapping activities within the same category; keep five category bands.
      const occupiedTo=event.point?event.from+.12:event.to;
      let row=rows.findIndex(end=>end<=event.from);
      if(row===-1) row=rows.length;
      rows[row]=occupiedTo;
      const tooltip=`${event.category} ${event.period} ${event.content}`;
      return `<button type="button" class="activity-event ${event.point?'is-point':''}" data-activity="${event.id}" aria-label="${escape(tooltip)}" aria-pressed="false" style="left:${percent(event.from)}%;width:${event.point?'24px':Math.max(.25,percent(event.to)-percent(event.from))+'%'};top:${14+row*34}px"><span>${event.point?'':escape(event.content)}</span></button>`;
    }).join('');
    return `<div class="activity-lane" data-category="${index}"><span class="activity-label">${category}</span><div class="activity-track" style="height:${Math.max(1,rows.length)*34+26}px">${grid}${buttons}</div></div>`;
  }).join('');
  let pinned=null;
  function show(id) {
    const event=events[id];
    detail.innerHTML=`<span class="activity-detail-meta">${escape(event.category)} <time>${escape(event.period)}</time></span><p>${escape(event.content)}</p>`;
    detail.classList.add('is-active');
    chart.querySelectorAll('[data-activity]').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.activity)===Number(id)));
  }
  function clear() {
    if(pinned!==null) {show(pinned);return;}
    detail.classList.remove('is-active');
    chart.querySelectorAll('[data-activity]').forEach(button=>button.classList.remove('is-active'));
  }
  chart.querySelectorAll('[data-activity]').forEach(button=>{
    const id=Number(button.dataset.activity);
    button.addEventListener('pointerenter',()=>show(id));
    button.addEventListener('pointerleave',clear);
    button.addEventListener('focus',()=>show(id));
    button.addEventListener('blur',clear);
    button.addEventListener('click',()=>{
      pinned=pinned===id?null:id;
      chart.querySelectorAll('[data-activity]').forEach(other=>other.setAttribute('aria-pressed',String(Number(other.dataset.activity)===pinned)));
      if(pinned===null) clear();else show(id);
    });
    button.addEventListener('keydown',event=>{
      if(event.key==='Escape') {pinned=null;chart.querySelectorAll('[data-activity]').forEach(other=>other.setAttribute('aria-pressed','false'));clear();}
    });
  });
})();
