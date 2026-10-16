import {loadBreed,createBreedActor,chooseBreed,createPicker,WAKE_DURATION} from './dog-art.js';

const $=s=>document.querySelector(s),reduced=matchMedia('(prefers-reduced-motion:reduce)'),mouse=matchMedia('(hover:hover) and (pointer:fine)');
const on=()=>document.body.classList.contains('motion-on')&&!reduced.matches;
const dialog=$('#detail-dialog'),play=$('.dog-play'),scene=$('.dog-arena > svg'),slot=$('.native-dog-position'),button=$('.dog-throw'),sceneBall=$('.toy-ball');
const follower=document.createElement('div');follower.className='pointer-dog';follower.hidden=true;follower.setAttribute('aria-hidden','true');
const ball=document.createElement('div');ball.className='pointer-ball';ball.hidden=true;ball.setAttribute('aria-hidden','true');ball.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M5 5Q16 12 19 19M5 19Q8 11 19 5"/></svg>';
const live=document.createElement('p');live.className='presence-live';live.setAttribute('aria-live','polite');document.body.append(follower,ball,live);
const back=document.createElement('div'),front=document.createElement('div');
back.className='modal-hanger modal-hanger-back';front.className='modal-hanger modal-hanger-front';back.setAttribute('aria-hidden','true');front.setAttribute('aria-hidden','true');back.hidden=front.hidden=true;dialog?.append(back,front);
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),smooth=n=>{n=clamp(n);return n*n*(3-2*n);},mix=(a,b,t)=>a+(b-a)*t;
const home={x:85,y:180},homeBall={x:125,y:175},scale=.10,fields='input,textarea,select,[contenteditable="true"]';
const wiggle=new window.BallWiggle();
let actor,hangerFront,hangerBack,breed,frame=0,previous=0,clock=0,homeVisible=true,modalRevision=0;
let follow=false,returning=null,fetching=null,stretchUntil=0,facing=-1,followWidth=140,velocity={x:0,y:0},position={...home};
let point={x:innerWidth*.6,y:innerHeight*.55},activityPoint={...point},restAt=null,wakeUntil=0,summonAfter=0,keyboard=false;
let previousBreed;try{previousBreed=sessionStorage.getItem('portfolio-dog');}catch{}
breed=chooseBreed(previousBreed);try{sessionStorage.setItem('portfolio-dog',breed.id);}catch{}
const pickHanger=createPicker(breed.id);
function state(next,instant=false){if(!actor)return;actor.setState(next,{instant});follower.dataset.state=next;if(play)play.dataset.state=next;}
function putSceneBall(p=homeBall,rotation=0){sceneBall?.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${rotation}) scale(.6)`);}
function placeMain(){if(!slot)return;slot.setAttribute('transform',`translate(${position.x} ${position.y}) scale(${scale*facing} ${scale}) translate(-650 -1148)`);}
function scenePoint(p){return new DOMPoint(p.x,p.y).matrixTransform(scene.getScreenCTM());}
function cursor(show,p=point){const visible=show&&(follow||returning)&&!dialog?.open;ball.hidden=!visible;document.body.classList.toggle('has-ball-cursor',visible&&!returning&&!keyboard);if(visible)ball.style.transform=`translate(${p.x}px,${p.y}px) scale(${returning?.home&&scene?12*scene.getScreenCTM().a/22:1})`;}
function placeFollower(){const s=followWidth/1254;follower.style.width=follower.style.height=followWidth+'px';follower.style.transform=`translate(${position.x-650*s}px,${position.y-1148*s}px)`;actor.svg.style.transformOrigin=`${650/1254*100}% ${1148/1254*100}%`;actor.svg.style.transform=`scaleX(${facing})`;}
function mouthPosition(p=position,sign=facing){const s=followWidth/1254;return{x:p.x-actor.mouthOffset.x*s*sign,y:p.y-actor.mouthOffset.y*s};}
function syncStatus(){if(scene){for(const [key,value] of Object.entries({breed:breed.id,state:actor.state,fetching:String(!!fetching),following:String(follow),returning:String(!!returning)}))if(scene.dataset[key]!==value)scene.dataset[key]=value;}if(follower.dataset.breed!==breed.id)follower.dataset.breed=breed.id;}
function resetHome({stretch=false}={}){
 if(!actor)return;
 follow=false;returning=fetching=null;follower.hidden=true;cursor(false);wiggle.reset();summonAfter=performance.now()+1000;velocity={x:0,y:0};restAt=null;wakeUntil=0;
 actor.svg.style.transform='';actor.svg.style.width=actor.svg.style.height='1254px';actor.svg.setAttribute('width','1254');actor.svg.setAttribute('height','1254');
 if(slot)slot.replaceChildren(actor.svg);else actor.svg.remove();
 position={...home};facing=-1;stretchUntil=stretch&&on()?clock+2:0;state(stretchUntil?'stretch':'sit',true);actor.update(0,on());placeMain();putSceneBall();document.body.classList.remove('dog-outside');
 if(play)play.setAttribute('aria-busy','false');if(button)button.disabled=!on();live.textContent='';syncStatus();ensureLoop();
}
function startFollow(explicit=false){
 if(!actor||!on()||!mouse.matches||dialog?.open||follow||fetching||!explicit&&performance.now()<summonAfter)return;
 resetHome();summonAfter=performance.now();follow=true;stretchUntil=0;
 const bounds=scene?.getBoundingClientRect(),visible=bounds&&bounds.bottom>0&&bounds.top<innerHeight;
 followWidth=scene?scene.getScreenCTM().a*1254*scale:140;
 position=visible?scenePoint(home):{x:innerWidth-85,y:innerHeight-20};velocity={x:0,y:0};restAt=null;
 actor.svg.style.width=actor.svg.style.height='100%';follower.replaceChildren(actor.svg);follower.hidden=false;facing=-1;state('run',true);placeFollower();document.body.classList.add('dog-outside');cursor(true);syncStatus();ensureLoop();
 live.textContent='犬がボールを追いかけています。Escapeで定位置に戻ります。';
 if(!document.activeElement?.closest(fields)){document.body.tabIndex=-1;window.focus();document.body.focus({preventScroll:true});}
}
function activity(){if(!follow||returning)return;restAt=null;if(['sleep','deep-sleep'].includes(actor.state)){wakeUntil=clock+WAKE_DURATION;state('wake');}}
function returnHome(){
 if(!follow||returning)return;
 if(!scene){resetHome();return;}
 const sleeping=['sleep','deep-sleep','wake'].includes(actor.state),delay=sleeping?WAKE_DURATION:0;if(sleeping)state('wake');
 const s=followWidth/1254,sign=point.x>position.x?-1:1;
 returning={at:clock,delay,from:{...position},ball:{...point},pickup:{x:point.x+actor.mouthOffset.x*s*sign,y:point.y+actor.mouthOffset.y*s},sign};
 returning.pickupDuration=clamp(Math.hypot(returning.pickup.x-position.x,returning.pickup.y-position.y)/450,.4,1.3);
 document.body.classList.remove('has-ball-cursor');if(play)play.setAttribute('aria-busy','true');if(button)button.disabled=true;ensureLoop();
}
function returnTick(){
 const trip=returning,e=clock-trip.at-trip.delay;
 if(e<0){cursor(true,trip.ball);return;}
 state('run');
 if(e<trip.pickupDuration){const t=smooth(e/trip.pickupDuration);position={x:mix(trip.from.x,trip.pickup.x,t),y:mix(trip.from.y,trip.pickup.y,t)};facing=trip.sign;cursor(true,trip.ball);}
 else{
  const destination=scenePoint(home);
  if(!trip.home){trip.home=destination;trip.travel=clamp(Math.hypot(destination.x-trip.pickup.x,destination.y-trip.pickup.y)/380,.6,1.8);trip.homeFacing=destination.x>trip.pickup.x?-1:1;}
  const t=smooth((e-trip.pickupDuration)/trip.travel);position={x:mix(trip.pickup.x,destination.x,t),y:mix(trip.pickup.y,destination.y,t)};facing=trip.homeFacing;cursor(true,mouthPosition());
  if(e>=trip.pickupDuration+trip.travel){resetHome({stretch:true});return;}
 }
 placeFollower();
}
function followTick(dt){
 if(returning){returnTick();return;}
 if(clock<wakeUntil){state('wake');velocity={x:0,y:0};placeFollower();return;}
 const s=followWidth/1254;if(Math.abs(point.x-position.x)>35)facing=point.x>position.x?-1:1;
 const target={x:clamp(point.x+actor.mouthOffset.x*s*facing,followWidth*.48,innerWidth-followWidth*.48),y:clamp(point.y+actor.mouthOffset.y*s,followWidth*.93,innerHeight-15)};
 if(!['sleep','deep-sleep'].includes(actor.state)){
  velocity.x+=(28*(target.x-position.x)-11*velocity.x)*dt;velocity.y+=(28*(target.y-position.y)-11*velocity.y)*dt;
  const speed=Math.hypot(velocity.x,velocity.y);if(speed>450){velocity.x*=450/speed;velocity.y*=450/speed;}
  position.x+=velocity.x*dt;position.y+=velocity.y*dt;
 }
 const moving=Math.hypot(velocity.x,velocity.y)>22;if(moving)restAt=null;else if(restAt===null)restAt=clock;
 const idle=restAt===null?0:clock-restAt;
 state(moving?'run':idle<3?'wait':idle<6?'sit':idle<8.6?'yawn':idle<18?'sleep':'deep-sleep');placeFollower();cursor(true);
}
function throwBall(destination){
 if(!actor||!on()||dialog?.open)return;if(follow){returnHome();return;}if(fetching)return;
 resetHome();fetching={at:clock,destination:typeof destination==='number'?destination:245+Math.random()*45};stretchUntil=0;
 if(button)button.disabled=true;play?.setAttribute('aria-busy','true');ensureLoop();
}
function fetchTick(){
 const t=clock-fetching.at,destination=fetching.destination,mx=actor.mouthOffset.x*scale,my=actor.mouthOffset.y*scale,pickup=destination-mx;
 let dogX=home.x,ballX=homeBall.x,ballY=homeBall.y;
 if(t<1.25){facing=-1;const b=clamp(t/1.15);ballX=mix(homeBall.x,destination,b);ballY=mix(homeBall.y,home.y-my,b)-80*Math.sin(Math.PI*b);dogX=mix(home.x,pickup,smooth((t-.12)/1.08));state(t>.12?'run':'wait');}
 else if(t<1.55){dogX=pickup;facing=t<1.4?-1:1;state('wait');ballX=pickup+mx*(1-2*smooth((t-1.25)/.3));ballY=home.y-my;}
 else if(t<3.15){dogX=mix(pickup,home.x,smooth((t-1.55)/1.6));facing=1;state('run');ballX=dogX-mx;ballY=home.y-my;}
 else if(t<3.5){dogX=home.x;state('wait');facing=t<3.32?1:-1;ballX=home.x-mx+2*mx*smooth((t-3.15)/.35);ballY=home.y-my;}
 else if(t<4.1){dogX=home.x;facing=-1;state('wait');const d=clamp((t-3.5)/.6);ballX=mix(home.x+mx,homeBall.x,d);ballY=mix(home.y-my,homeBall.y,d*d)-3*Math.sin(d*Math.PI*2);}
 else{resetHome({stretch:true});return;}
 position={x:dogX,y:home.y};placeMain();putSceneBall({x:ballX,y:ballY},t*220);
}
async function dressHanger(){
 if(!dialog?.open)return;const token=++modalRevision,selection=pickHanger();back.hidden=front.hidden=true;
 try{const art=await loadBreed(selection.id);if(!dialog.open||token!==modalRevision)return;
  hangerFront=createBreedActor(art,{layer:'hang-front'});hangerBack=createBreedActor(art,{layer:'hang-back'});
  for(const a of [hangerFront,hangerBack]){a.setState('hanging',{instant:true});a.update(0,on());}
  front.replaceChildren(hangerFront.svg);back.replaceChildren(hangerBack.svg);front.hidden=back.hidden=false;dialog.dataset.dogBreed=selection.id;ensureLoop();
 }catch(error){console.error('Dog illustration unavailable',error);}
}
function modalState(){
 if(dialog.open){if(returning)resetHome();follower.hidden=true;cursor(false);wiggle.reset();dialog.append(ball);dressHanger();}
 else{++modalRevision;back.hidden=front.hidden=true;document.body.append(ball);if(follow){follower.hidden=false;activity();cursor(true);}previous=0;ensureLoop();}
}
function ensureLoop(){if(actor&&!frame&&!document.hidden&&on()&&(dialog?.open||follow||fetching||stretchUntil||homeVisible&&slot))frame=requestAnimationFrame(tick);}
function tick(time){
 frame=0;if(document.hidden){previous=0;return;}const dt=previous?Math.min((time-previous)/1000,.05):0;previous=time;
 if(on()){
  if(!dialog?.open){clock+=dt;if(follow)followTick(dt);else if(fetching)fetchTick();else if(stretchUntil&&clock>=stretchUntil){stretchUntil=0;state('sit');}actor.update(dt,true);}
  if(dialog?.open){hangerFront?.update(dt,true);hangerBack?.update(dt,true);}
 }
 syncStatus();ensureLoop();
}
function stop(){resetHome();keyboard=false;cursor(false);}
try{
 actor=createBreedActor(await loadBreed(breed.id));actor.svg.classList.add('native-dog-art');resetHome();
 if(play){play.dataset.breed=breed.id;scene.setAttribute('aria-label',breed.name+'とボールの小さな遊び場');}
 button?.addEventListener('click',()=>throwBall());
 $('.dog-arena')?.addEventListener('click',event=>{const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(scene.getScreenCTM().inverse());throwBall(clamp(p.x,190,290));});
 if(scene)new IntersectionObserver(([entry])=>{homeVisible=entry.isIntersecting;if(homeVisible){previous=0;ensureLoop();}},{rootMargin:'100px'}).observe(scene);
 if(dialog){new MutationObserver(modalState).observe(dialog,{attributes:true,attributeFilter:['open']});if(dialog.open)modalState();}
 document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!mouse.matches||!on()||dialog?.open||returning)return;
  keyboard=false;point={x:event.clientX,y:event.clientY};if(Math.hypot(point.x-activityPoint.x,point.y-activityPoint.y)>4){activityPoint={...point};activity();}
  if(follow){cursor(!event.target.closest(fields));return;}
  if(!event.buttons&&performance.now()>=summonAfter&&!event.target.closest(fields)&&!document.activeElement?.closest(fields)&&wiggle.push(point.x,point.y,performance.now()))startFollow();
 },{passive:true});
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget&&!returning)cursor(false);},{passive:true});
 window.addEventListener('keydown',event=>{
  if(event.key!=='Escape'||dialog?.open)return;if(follow||fetching){stop();event.preventDefault();}
 },{capture:true});
 document.addEventListener('keydown',event=>{
  if(event.target.closest(fields)||event.ctrlKey||event.metaKey||event.altKey||dialog?.open||!on())return;
  if(event.key.toLowerCase()==='b'){keyboard=true;startFollow(true);event.preventDefault();}
  if(follow&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
   point.x=clamp(point.x+({ArrowLeft:-30,ArrowRight:30}[event.key]||0),20,innerWidth-20);point.y=clamp(point.y+({ArrowUp:-30,ArrowDown:30}[event.key]||0),20,innerHeight-20);activity();event.preventDefault();
  }
 });
 window.addEventListener('motionchange',()=>{if(!on()){cancelAnimationFrame(frame);frame=0;stop();actor.update(0,false);hangerFront?.update(0,false);hangerBack?.update(0,false);}else{previous=0;ensureLoop();}});
 document.addEventListener('visibilitychange',()=>{previous=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;cursor(false);}else ensureLoop();});
 window.addEventListener('blur',()=>cursor(false));window.addEventListener('focus',()=>{previous=0;ensureLoop();});
 window.addEventListener('resize',()=>{if(follow)stop();});mouse.addEventListener('change',stop);reduced.addEventListener('change',()=>{if(reduced.matches)stop();});
 function nextProject(id){
  const data=window.PORTFOLIO_CONTENT.projects,current=data.findIndex(p=>p.id===id);if(current<0)return;
  const next=data[(current+1)%data.length],nav=document.createElement('nav');nav.className='project-pager';nav.setAttribute('aria-label','次の作品');
  const link=document.createElement('a');link.href=`projects/${next.id}/`;link.textContent='次の作品を見る ↗';link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();window.openPortfolioProject(next.id);});nav.append(link);$('#dialog-body').append(nav);
 }
 window.addEventListener('projectview',event=>nextProject(event.detail.id));if(dialog?.open)nextProject(dialog.dataset.projectId);
 ensureLoop();
}catch(error){console.error('Dog illustration unavailable',error);if(button)button.disabled=true;}
