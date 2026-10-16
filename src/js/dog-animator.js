let serial=0;
const NS='http://www.w3.org/2000/svg';
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
export const WAKE_DURATION=2.8;
export class DogActor{
 constructor(markup,{layer=null}={}){
  const prefix=`dog-${++serial}-`;
  markup=markup.replace(/id="([^"]+)"/g,(_,id)=>`id="${prefix+id}"`).replace(/url\(#([^\)]+)\)/g,(_,id)=>`url(#${prefix+id})`).replace(/(href|xlink:href)="#([^"]+)"/g,(_,attr,id)=>`${attr}="#${prefix+id}"`);
  this.svg=new DOMParser().parseFromString(markup,'image/svg+xml').documentElement;
  this.svg.removeAttribute('width');this.svg.removeAttribute('height');this.svg.setAttribute('focusable','false');
  const mouth=(this.svg.querySelector('[data-pose=stand]')?.dataset.mouth||'385 633').split(' ').map(Number);this.mouthOffset={x:650-mouth[0],y:1148-mouth[1]};
  this.groups=[...this.svg.querySelectorAll('[data-pose]')];this.breath=this.svg.querySelector('[data-role=breath]');
  this.state='sit';this.elapsed=0;this.clock=0;this.transition=null;this.pose='sit';this.lastBlink=-50;this.nextBlink=2;
  this.warpPaths=[...this.svg.querySelectorAll('[data-warp] path')].map(node=>{const original=node.getAttribute('d'),raw=original.match(/[a-zA-Z]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?/g),tokens=[];for(let i=0;i<raw.length;){if(Number.isFinite(Number(raw[i]))){tokens.push([Number(raw[i]),Number(raw[i+1])]);i+=2;}else tokens.push(raw[i++]);}const region=node.closest('[data-warp]').dataset,pose=node.closest('[data-pose]').dataset;return{node,original,tokens,gait:region.gait,split:pose.gaitSplit?Number(pose.gaitSplit):null,top:Number(pose.gaitTop||475),bottom:Number(pose.gaitBottom||650),phase:region.warp==='far'?Math.PI:0};});this.wasWarping=false;
  this.fixedLayer=layer;this.svg.dataset.state=this.state;
  this.sleepMarks=document.createElementNS(NS,'g');this.sleepMarks.setAttribute('aria-hidden','true');this.sleepMarks.setAttribute('fill','#8c927d');this.sleepMarks.setAttribute('stroke','none');
  for(let i=0;i<3;i++){const z=document.createElementNS(NS,'text');z.textContent='z';z.setAttribute('x',String(470+i*72));z.setAttribute('y',String(450-i*45));z.setAttribute('font-size',String(43+i*8));z.setAttribute('font-family','Georgia,serif');z.setAttribute('font-style','italic');this.sleepMarks.append(z);}
  this.svg.append(this.sleepMarks);
  if(layer)this.pose=layer;
  this.draw(0,false);
 }
 setState(state,{instant=false}={}){
  if(this.state===state&&!instant)return;
  const wakingPose=state==='wake'&&this.pose==='deep-rest'?'deep-rest':'lie';
  this.state=state;this.elapsed=0;this.svg.dataset.state=state;
  const next=this.fixedLayer||({run:'stand',wait:'stand',sit:'sit',yawn:'sit',sleep:'lie','deep-sleep':'deep-rest',wake:wakingPose,stretch:'stretch',hanging:'hang-front'}[state]||'sit');
  this.changePose(next,instant);
 }
 changePose(next,instant=false){
  if(next===this.pose&&!instant)return;
  this.transition=instant?null:{from:this.pose,to:next,at:this.clock};this.pose=next;
 }
 sampleAt(time){this.clock=time;this.elapsed=time;this.transition=null;this.draw(0,true);}
 update(dt,enabled=true){if(!enabled)this.transition=null;this.clock+=enabled?dt:0;this.elapsed+=enabled?dt:0;this.draw(dt,enabled);}
 draw(dt,enabled){
  const t=this.clock,e=this.elapsed,state=this.state;
  const transitioning=this.transition?clamp((t-this.transition.at)/.22):1;
  for(const g of this.groups){
   const name=g.dataset.pose;
   let opacity=name===this.pose?1:0;
   if(this.transition){opacity=name===this.transition.to?smooth(transitioning):name===this.transition.from?1-smooth(transitioning):0;}
   g.setAttribute('opacity',String(opacity));g.setAttribute('visibility',opacity>0?'visible':'hidden');
  }
  if(transitioning>=1)this.transition=null;
  const sleep=state==='sleep'||state==='deep-sleep',running=state==='run';
  if(running&&enabled){
   for(const item of this.warpPaths){const d=item.tokens.map(token=>{if(typeof token==='string')return token;const [x,y]=token,w=smooth((y-item.top)/(item.bottom-item.top)),limbPhase=item.gait==='hind'?Math.PI:item.gait==='front'?0:item.split!==null?(x<item.split?0:Math.PI):clamp((x-400)/100)*Math.PI,phase=t*12+limbPhase+item.phase;return `${(x+Math.sin(phase)*22*w).toFixed(2)} ${(y-Math.max(0,-Math.cos(phase))*14*w).toFixed(2)}`;}).join(' ');item.node.setAttribute('d',d);}this.wasWarping=true;
  }else if(this.wasWarping){this.warpPaths.forEach(item=>item.node.setAttribute('d',item.original));this.wasWarping=false;}
  const inhale=enabled?(1-Math.cos(t*Math.PI*2/(sleep?5.2:4.8)))/2:0;
  const hop=enabled&&running?-Math.abs(Math.sin(t*12))*10:0;
  this.breath.setAttribute('transform',`translate(565 ${1148+hop}) scale(${1+inhale*.0018} ${1+inhale*(sleep?.006:.0045)}) translate(-565 -1148)`);
  if(enabled&&t>=this.nextBlink){this.lastBlink=t;this.nextBlink=t+4+Math.random()*3;}
  let blink=0,bt=t-this.lastBlink;
  if(bt>=0&&bt<.26)blink=bt<.09?smooth(bt/.09):bt<.13?1:1-smooth((bt-.13)/.13);
  if(!enabled)blink=0;
  if(sleep)blink=1;
  if(state==='wake')blink=e<.55?1:1-smooth((e-.55)/.9);
  const yawning=state==='yawn'?(enabled?Math.sin(Math.PI*clamp(e/2.6))**.8:1):0;
  if(yawning>.1)blink=Math.max(blink,yawning*.92);
  const tilted=state==='sit'&&enabled?4.2*(Math.sin(t*.28)**8):0;
  for(const g of this.groups){
   if(g.getAttribute('visibility')==='hidden')continue;
   const head=g.querySelector('[data-role=head]');
   if(head){
    let angle=tilted+(running?Math.sin(t*12)*1.2:0);
    if(this.fixedLayer==='hang-front')angle=enabled?Math.sin(t*.85)*2.2:0;
    if(state==='yawn')angle=-yawning*3;
    if(state==='wake')angle=-2*(1-smooth((e-.7)/1.1));
    angle*=Number(head.dataset.swayScale||1);
    head.setAttribute('transform',`rotate(${angle} ${head.dataset.pivot||'550 715'})`);
    for(const side of ['left','right']){
     const eye=head.querySelector('[data-role=eye-'+side+']'),lid=head.querySelector('[data-role=lid-'+side+']');
     if(!eye)continue;
     const [x,y]=(eye.dataset.center||(side==='left'?'434.5 462':'674 489')).split(' ').map(Number);
     eye.setAttribute('transform',`translate(${x} ${y}) scale(1 ${Math.max(.015,1-blink)}) translate(${-x} ${-y})`);
     eye.setAttribute('opacity',blink>.96?'0':'1');lid.setAttribute('opacity',blink>.96?'1':'0');
     eye.querySelector('circle')?.setAttribute('opacity',String(Math.max(0,1-blink*2)));
    }
    const smile=head.querySelector('[data-role=smile]'),mouth=head.querySelector('[data-role=yawn]');
    smile?.setAttribute('opacity',yawning>.12?'0':'1');mouth?.setAttribute('opacity',yawning>.12?'1':'0');
    const [mx,my]=(mouth?.dataset.center||'540 570').split(' ').map(Number);
    mouth?.setAttribute('transform',`translate(${mx} ${my}) scale(1 ${Math.max(.08,yawning)}) translate(${-mx} ${-my})`);
   }
   for(const tail of g.querySelectorAll('[data-role=tail]')){
    const pivot=tail.dataset.pivot;
    const wag=enabled&&!sleep?Math.sin(t*(running?11:7))*(running?5:state==='wait'?8:3.5):sleep&&enabled?Math.sin(t*.5)*.4:0;
    tail.setAttribute('transform',`rotate(${wag*Number(tail.dataset.wagScale||1)} ${pivot})`);
   }
   for(const ear of g.querySelectorAll('[data-role=ear]')){
    const soft=Number(ear.dataset.soft||1),side=ear.dataset.side==='left'?1:-1;
    const angle=enabled&&!sleep?(running?Math.sin(t*12+side*.4)*5.5:Math.sin(t*.85+side*.8)*1.4)*soft:0;
    ear.setAttribute('transform',`rotate(${angle} ${ear.dataset.pivot})`);
   }
   for(const leg of g.querySelectorAll('[data-role=leg]')){
    const phase=t*12+Number(leg.dataset.phase);
    const angle=running&&enabled?Math.sin(phase)*24*Number(leg.dataset.swing||1):0;
    leg.setAttribute('transform',`rotate(${angle} ${leg.dataset.pivot})`);
    const shin=leg.querySelector('[data-role=shin]');
    shin?.setAttribute('transform',`rotate(${running&&enabled?Math.max(0,-Math.sin(phase))*32:0} ${shin.dataset.pivot})`);
   }
  }
  this.sleepMarks.setAttribute('visibility',sleep?'visible':'hidden');
  const zOrigin=this.groups.find(g=>g.dataset.pose===this.pose)?.dataset.zOrigin;
  const [zx,zy]=(zOrigin||'470 450').split(' ').map(Number);
  this.sleepMarks.setAttribute('transform',`translate(${zx-470} ${zy-450})`);
  [...this.sleepMarks.children].forEach((z,i)=>{
   const phase=(t/(state==='deep-sleep'?3.4:4.3)+i*.33)%1;
   z.setAttribute('opacity',(!enabled?.55:Math.sin(phase*Math.PI))*(i===2&&state!=='deep-sleep'?0:1));
   z.setAttribute('transform',`translate(${enabled?phase*20:0} ${enabled?-phase*60:0})`);
  });
  this.svg.dataset.pose=this.pose;this.svg.dataset.phase=String(Math.round(e*100)/100);
 }
}
