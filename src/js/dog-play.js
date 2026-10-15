(() => {
  'use strict';
  const play=document.querySelector('.dog-play');if(!play)return;
  const arena=play.querySelector('.dog-arena');const svg=arena.querySelector('svg');
  const dog=svg.querySelector('.toy-dog'),ball=svg.querySelector('.toy-ball');
  const eyes=svg.querySelector('.dog-eyes'),tail=svg.querySelector('.dog-tail'),heart=svg.querySelector('.dog-heart');
  const paws=svg.querySelector('.dog-paws'),button=play.querySelector('.dog-throw');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let frame=0,busy=false;
  const on=()=>document.body.classList.contains('motion-on')&&!reduced.matches;
  const move=(element,x,y,extra='')=>element.style.transform=`translate(${x}px,${y}px) ${extra}`;
  const smooth=t=>t*t*(3-2*t);
  // Artwork faces left. Mirror around its body centre when travelling right.
  const home=71,homeBall=107,mouthOffset=30;
  dog.style.transformBox='view-box';dog.style.transformOrigin='0px 0px';
  function moveDog(centre,y,facing){move(dog,centre-20*facing,y,`scaleX(${facing})`);}
  function rest(){moveDog(home,149,-1);move(ball,homeBall,173);eyes.style.transform='';tail.style.transform='';heart.style.opacity=0;play.classList.remove('is-playing','is-running');play.setAttribute('aria-busy','false');busy=false;button.disabled=!on();}
  function sync(){cancelAnimationFrame(frame);rest();paws.replaceChildren();}
  function throwBall(destination=245){
    if(document.body.classList.contains('dog-outside')){
      window.dispatchEvent(new Event('dogreturnrequest'));return;
    }
    if(busy||!on())return;
    busy=true;button.disabled=true;play.classList.add('is-playing');play.setAttribute('aria-busy','true');
    paws.innerHTML=Array.from({length:9},(_,i)=>`<use href="#paw-shape" x="${75+i*(destination-80)/9}" y="${181+(i%2?4:-3)}" transform="rotate(${i%2?12:-12} ${75+i*(destination-80)/9} 181)"/>`).join('');
    const began=performance.now();
    function tick(now){
      if(!on()){sync();return;}
      const time=now-began;
      let dogX=home,ballX=homeBall,ballY=173,facing=-1;
      const catchPosition=destination-mouthOffset,travel=catchPosition-home;
      if(time<850){
        const t=Math.min(1,time/750);ballX=homeBall+(destination-homeBall)*t;ballY=173-94*Math.sin(Math.PI*t);
        const follow=Math.max(0,Math.min(1,(time-180)/670));dogX=home+travel*smooth(follow);
      }else if(time<1200){
        dogX=catchPosition;
        const turn=smooth(Math.max(0,Math.min(1,(time-1000)/200)));
        facing=time<1100?-1:1;ballX=destination-2*mouthOffset*turn;ballY=173-22*turn;
        heart.style.opacity=1;move(heart,dogX+2,101);
      }
      else if(time<2050){
        const t=smooth((time-1200)/850);dogX=catchPosition-travel*t;facing=1;ballX=dogX-mouthOffset;ballY=151;heart.style.opacity=0;
      }else{
        const t=Math.min(1,(time-2050)/350);ballX=home-mouthOffset+(homeBall-home+mouthOffset)*t;ballY=151+22*t-10*Math.sin(Math.PI*t);dogX=home;
      }
      const running=(time>180&&time<850)||(time>=1200&&time<2050);
      play.classList.toggle('is-running',running);
      moveDog(dogX,149-(running?2.5*Math.abs(Math.sin(time/65)):0),facing);
      move(ball,ballX,ballY,`rotate(${time/5}deg) scale(${time>720&&time<800?1.12:1},${time>720&&time<800?.88:1})`);
      tail.style.transform=`rotate(${running?Math.sin(time/55)*12:0}deg)`;
      if(time<2400)frame=requestAnimationFrame(tick);else{rest();}
    }
    frame=requestAnimationFrame(tick);
  }
  button.addEventListener('click',()=>throwBall(200+Math.random()*80));
  arena.addEventListener('click',event=>{const bounds=arena.getBoundingClientRect();throwBall(Math.max(145,Math.min(290,(event.clientX-bounds.left)/bounds.width*340)));});
  arena.addEventListener('pointermove',event=>{
    if(!on()||busy)return;const box=arena.getBoundingClientRect();
    eyes.style.transform=`translate(${((event.clientX-box.left)/box.width-.5)*3}px,${((event.clientY-box.top)/box.height-.5)*2}px)`;
  });
  arena.addEventListener('pointerleave',()=>{eyes.style.transform='';});
  window.addEventListener('motionchange',sync);
  window.addEventListener('dogdeparture',sync);
  window.addEventListener('doghome',sync);
  window.addEventListener('dogreturning',()=>{sync();button.disabled=true;play.setAttribute('aria-busy','true');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&busy)sync();});
  sync();
})();
