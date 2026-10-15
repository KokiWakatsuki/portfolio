(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mouse=matchMedia('(hover:hover) and (pointer:fine)');
  const on=()=>document.body.classList.contains('motion-on')&&!reduced.matches;
  const ball=document.createElement('div');ball.className='pointer-ball';ball.hidden=true;ball.setAttribute('aria-hidden','true');
  ball.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M5 5Q16 12 19 19M5 19Q8 11 19 5"/></svg>';
  const follower=document.createElement('div');follower.className='pointer-dog';follower.hidden=true;follower.setAttribute('aria-hidden','true');follower.innerHTML=window.companionDogSvg;
  document.body.append(ball,follower);
  const live=document.createElement('p');live.className='presence-live';live.setAttribute('aria-live','polite');document.body.append(live);
  const wiggle=new window.BallWiggle(),mood=new window.CompanionMood();
  let point={x:innerWidth*.6,y:innerHeight*.6},activityPoint={...point},position={...point},velocity={x:0,y:0};
  let chasing=false,keyboard=false,pressed=null,lastFrame=0,frame=0,timer=0,facing=1,returning=null,summonAfter=0,dogScale=1;
  const dialog=document.querySelector('#detail-dialog');
  const pickHanger=window.DogArt.createPicker(window.DogArt.pageBreed.id);
  const followerBreed=window.DogArt.pageBreed;
  let hanger,backHanger,followerPose='stand',followerState='';
  if(dialog){
    backHanger=document.createElement('div');backHanger.className='modal-hanger modal-hanger-back';backHanger.setAttribute('aria-hidden','true');
    hanger=document.createElement('div');hanger.className='modal-hanger modal-hanger-front';hanger.setAttribute('aria-hidden','true');
    dialog.append(backHanger,hanger);
  }
  function dressHanger(){const breed=pickHanger();backHanger.innerHTML=window.DogArt.hanging(breed,'back');hanger.innerHTML=window.DogArt.hanging(breed,'front');window.DogArt.anchorJoints(hanger);}
  function putBall(){ball.style.transform=`translate(${point.x}px,${point.y}px)`;}
  function cursor(show){const visible=show&&(chasing||returning)&&!dialog?.open;ball.hidden=!visible;document.body.classList.toggle('has-ball-cursor',visible&&!keyboard);if(visible)putBall();}
  function pauseLoop(){cancelAnimationFrame(frame);clearTimeout(timer);frame=0;timer=0;}
  function ensureLoop(){if(chasing&&!frame&&!timer&&!document.hidden&&!dialog?.open&&on())frame=requestAnimationFrame(tick);}
  function movement(now){
    if(!chasing||returning)return;
    mood.movement(now);clearTimeout(timer);timer=0;ensureLoop();
  }
  function stop(){
    pauseLoop();chasing=false;returning=null;follower.hidden=true;follower.style.transform='';follower.classList.remove('is-running');follower.dataset.state='';followerState='';document.body.classList.remove('dog-outside');wiggle.reset();velocity={x:0,y:0};mood.reset();live.textContent='';
    summonAfter=performance.now()+1000;cursor(false);delete follower.dataset.returnStage;window.dispatchEvent(new Event('doghome'));
  }
  function start(){
    if(!on()||dialog?.open||chasing)return;
    window.dispatchEvent(new Event('dogdeparture'));
    followerPose='';followerState='';mood.reset();
    setFollowerState('run');
    const playground=document.querySelector('.dog-arena svg');
    const box=document.querySelector('.dog-play .dog-painted')?.getBoundingClientRect();
    const visible=box&&box.top>=0&&box.bottom<innerHeight;
    position={x:visible?box.left+box.width*.5:innerWidth-90,y:visible?box.top+box.height*.5:innerHeight-75};
    velocity={x:0,y:0};activityPoint={...point};chasing=true;cursor(true);follower.hidden=false;window.DogArt.anchorJoints(follower);document.body.classList.add('dog-outside');lastFrame=performance.now();
    const ownSvg=follower.querySelector('svg');
    dogScale=playground?playground.getBoundingClientRect().width/playground.viewBox.baseVal.width/(follower.offsetWidth/ownSvg.viewBox.baseVal.width):1;
    facing=-1;ownSvg.style.transform='scaleX(-1)';
    follower.style.transform=`translate(0px,0px) scale(${dogScale})`;
    if(visible){const own=follower.querySelector('.dog-painted').getBoundingClientRect();position={x:box.left+box.width/2-own.left-own.width/2,y:box.top+box.height/2-own.top-own.height/2};}
    follower.style.transform=`translate(${position.x}px,${position.y}px) scale(${dogScale})`;
    live.textContent='犬がボールを追いかけています。Escapeで終了できます。';ensureLoop();
    // A shake can begin without a click. Give the page keyboard focus for Escape.
    if(!document.activeElement?.closest('input,textarea,select,[contenteditable="true"]')){
      document.body.tabIndex=-1;window.focus();document.body.focus({preventScroll:true});
    }
  }
  function tick(now){
    frame=0;if(!chasing||!on())return;
    if(document.hidden||dialog?.open)return;
    if(returning){returnTick(now);return;}
    const dt=Math.min(.032,(now-lastFrame)/1000);lastFrame=now;
    if(mood.holdsPosition(now))velocity={x:0,y:0};
    else{
      if(Math.abs(point.x-position.x)>50)facing=point.x>position.x?-1:1;
      const target={x:Math.max(48,Math.min(innerWidth-48,point.x+(facing===1?29:-29))),y:Math.max(48,Math.min(innerHeight-48,point.y+44))};
      velocity.x+=(26*(target.x-position.x)-11*velocity.x)*dt;
      velocity.y+=(26*(target.y-position.y)-11*velocity.y)*dt;
      const speed=Math.hypot(velocity.x,velocity.y);if(speed>460){velocity.x*=460/speed;velocity.y*=460/speed;}
      position.x+=velocity.x*dt;position.y+=velocity.y*dt;
    }
    const speed=Math.hypot(velocity.x,velocity.y),running=speed>35;
    const state=mood.tick(now,running);setFollowerState(state);
    const hop=state==='run'?Math.abs(Math.sin(now/110))*1.5:0;
    follower.style.transform=`translate(${position.x}px,${position.y-hop}px) scale(${dogScale})`;
    follower.querySelector('svg').style.transform=`scaleX(${facing})`;
    if(speed>2)ensureLoop();
    else{
      // CSS handles breathing and wagging. Resting dogs do not need 60fps JS.
      const delay=state==='deep-sleep'?1000:state==='sleep'?250:state==='wake'?50:120;
      timer=setTimeout(()=>{timer=0;ensureLoop();},delay);
    }
  }
  function setFollowerState(state){
    if(followerState===state)return;
    followerState=state;follower.dataset.state=state;follower.classList.toggle('is-running',state==='run');
    const pose=state==='sit'||state==='wake'?'sit':state==='sleep'?'lie':state==='deep-sleep'?'curl':'stand';
    if(pose!==followerPose){followerPose=pose;follower.innerHTML=window.DogArt.companion(followerBreed,pose);if(!follower.hidden)window.DogArt.anchorJoints(follower);}
  }
  const smooth=t=>t*t*(3-2*t);
  function returnToPlay(){
    if(!chasing||returning||!on()||dialog?.open)return;
    const home=document.querySelector('.dog-play .dog-painted');
    if(!home){stop();cursor(false);return;}
    window.dispatchEvent(new Event('dogreturning'));
    pauseLoop();velocity={x:0,y:0};
    const now=performance.now();mood.movement(now);
    const wakeUntil=mood.state==='wake'?mood.wakeUntil:now;
    setFollowerState(wakeUntil>now?'wake':'run');
    const pickupFacing=point.x>position.x?-1:1;
    const pickup={x:point.x+pickupFacing*12.6*dogScale,y:point.y-12*dogScale};
    returning={from:{...position},ball:{...point},pickup,pickupFacing,wakeUntil,
      pickupTime:Math.max(300,Math.min(900,Math.hypot(pickup.x-position.x,pickup.y-position.y)/.65)),home:null};
    follower.dataset.returnStage=wakeUntil>now?'wake':'pickup';
    cursor(true);document.body.classList.remove('has-ball-cursor');live.textContent='犬がボールを拾って遊び場へ戻ります。';ensureLoop();
  }
  function returnTick(now){
    const trip=returning;if(now<trip.wakeUntil){ensureLoop();return;}
    setFollowerState('run');
    const elapsed=now-trip.wakeUntil;
    const scale=dogScale;
    if(elapsed<trip.pickupTime){
      follower.dataset.returnStage='pickup';
      const t=smooth(elapsed/trip.pickupTime);facing=trip.pickupFacing;
      position={x:trip.from.x+(trip.pickup.x-trip.from.x)*t,y:trip.from.y+(trip.pickup.y-trip.from.y)*t};
      ball.style.transform=`translate(${trip.ball.x}px,${trip.ball.y}px)`;
    }else{
      if(!trip.home){
        follower.dataset.returnStage='home';
        // Keep the same size while matching the painted silhouettes at home.
        follower.style.transform=`translate(${position.x}px,${position.y}px) scale(${dogScale})`;
        follower.querySelector('svg').style.transform='scaleX(-1)';
        const home=document.querySelector('.dog-play .dog-painted')?.getBoundingClientRect();
        if(!home?.width){stop();cursor(false);return;}
        const own=follower.querySelector('.dog-painted').getBoundingClientRect(),wrap=follower.getBoundingClientRect();
        trip.home={x:home.left+home.width/2-(own.left+own.width/2-wrap.left-wrap.width/2),
          y:home.top+home.height/2-(own.top+own.height/2-wrap.top-wrap.height/2)};
        trip.homeTime=Math.max(500,Math.min(1600,Math.hypot(trip.home.x-trip.pickup.x,trip.home.y-trip.pickup.y)/.48));
        trip.homeFacing=trip.home.x>trip.pickup.x?-1:1;
      }
      const t=Math.min(1,(elapsed-trip.pickupTime)/trip.homeTime),ease=smooth(t);
      if(t>=1){stop();cursor(false);return;}
      facing=t>.85?-1:trip.homeFacing;
      position={x:trip.pickup.x+(trip.home.x-trip.pickup.x)*ease,y:trip.pickup.y+(trip.home.y-trip.pickup.y)*ease};
      ball.style.transform=`translate(${position.x-facing*12.6*scale}px,${position.y+12*scale}px) scale(${.52*scale})`;
    }
    follower.style.transform=`translate(${position.x}px,${position.y}px) scale(${scale})`;
    follower.querySelector('svg').style.transform=`scaleX(${facing})`;ensureLoop();
  }
  window.addEventListener('dogreturnrequest',returnToPlay);
  function modalState(){
    if(returning)stop();
    pauseLoop();cursor(false);wiggle.reset();
    if(dialog?.open){follower.hidden=true;dressHanger();dialog.append(ball);}
    else{document.body.append(ball);if(chasing){follower.hidden=false;ensureLoop();}}
  }
  window.addEventListener('projectview',modalState);dialog?.addEventListener('close',modalState);if(dialog?.open)modalState();
  const fields='input,textarea,select,[contenteditable="true"]';
  document.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||!mouse.matches||!on())return;
    if(returning)return;
    if(event.buttons){if(pressed&&Math.hypot(event.clientX-pressed.x,event.clientY-pressed.y)>6)cursor(false);return;}
    keyboard=false;point={x:event.clientX,y:event.clientY};const now=performance.now();
    if(Math.hypot(point.x-activityPoint.x,point.y-activityPoint.y)>=4){activityPoint={...point};movement(now);}
    cursor(!event.target.closest(fields));ball.classList.toggle('is-link',!!event.target.closest('a,button,summary'));
    if(dialog?.open&&hanger){const bounds=hanger.getBoundingClientRect(),dx=point.x-(bounds.left+bounds.width/2);hanger.querySelector('.hanging-eyes').style.transform=`translate(${Math.max(-2,Math.min(2,dx/65))}px,0)`;}
    if(!chasing&&now>=summonAfter&&!dialog?.open&&!event.target.closest(fields)&&!document.activeElement?.closest(fields)&&wiggle.push(point.x,point.y,now))start();
  },{passive:true});
  document.addEventListener('pointerdown',event=>{if(returning)return;pressed={x:event.clientX,y:event.clientY};cursor(false);},{passive:true});
  document.addEventListener('pointerup',event=>{pressed=null;if(returning)return;if(event.pointerType==='mouse'&&mouse.matches&&on())cursor(!event.target.closest(fields));},{passive:true});
  document.addEventListener('pointerout',event=>{if(!returning&&!event.relatedTarget)cursor(false);},{passive:true});
  function escape(event){
    if(event.key!=='Escape'&&event.key!=='Esc'&&event.code!=='Escape'&&event.keyCode!==27)return;
    const active=chasing||document.querySelector('.dog-play')?.getAttribute('aria-busy')==='true';
    stop();keyboard=false;pressed=null;cursor(false);
    if(active&&!dialog?.open)event.preventDefault();
  }
  window.addEventListener('keydown',escape,{capture:true});
  window.addEventListener('keyup',escape,{capture:true});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'||event.key==='Esc')return;
    if(returning)return;
    if(event.target.closest(fields)||event.ctrlKey||event.metaKey||event.altKey||!on()||dialog?.open)return;
    if(event.key.toLowerCase()==='b'){keyboard=true;point={x:Math.max(16,Math.min(innerWidth-16,point.x)),y:Math.max(16,Math.min(innerHeight-16,point.y))};cursor(true);if(chasing)movement(performance.now());else start();event.preventDefault();}
    else if(keyboard&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      point.x=Math.max(16,Math.min(innerWidth-16,point.x+({ArrowLeft:-25,ArrowRight:25}[event.key]||0)));
      point.y=Math.max(16,Math.min(innerHeight-16,point.y+({ArrowUp:-25,ArrowDown:25}[event.key]||0)));
      putBall();movement(performance.now());start();event.preventDefault();
    }
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseLoop();cursor(false);}else ensureLoop();});
  window.addEventListener('blur',()=>{pauseLoop();cursor(false);});window.addEventListener('focus',ensureLoop);
  window.addEventListener('motionchange',()=>{if(!on()){stop();cursor(false);}});
  mouse.addEventListener('change',()=>{stop();cursor(false);});
  window.addEventListener('resize',()=>{if(returning)stop();cursor(false);position.x=Math.max(48,Math.min(innerWidth-48,position.x));position.y=Math.max(48,Math.min(innerHeight-48,position.y));clearTimeout(timer);timer=0;ensureLoop();});
  function nextProject(id){
    if(!id||!dialog)return;
    const projects=window.PORTFOLIO_CONTENT.projects,current=projects.findIndex(project=>project.id===id);if(current<0)return;
    const next=projects[(current+1)%projects.length];
    const nav=document.createElement('nav');nav.className='project-pager';nav.setAttribute('aria-label','次の作品');
    const link=document.createElement('a');link.href=`projects/${next.id}/`;link.textContent='次の作品を見る ↗';link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();window.openPortfolioProject(next.id);});nav.append(link);dialog.querySelector('#dialog-body').append(nav);
  }
  window.addEventListener('projectview',event=>nextProject(event.detail.id));if(dialog?.open)nextProject(dialog.dataset.projectId);
})();
