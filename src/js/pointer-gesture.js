(() => {
  'use strict';
  // A deliberate shake: three wide reversals along one axis in a short burst.
  // Project onto its principal axis so diagonal and vertical shakes also work.
  class BallWiggle {
    constructor(){this.samples=[];}
    reset(){this.samples=[];}
    push(x,y,time){
      const last=this.samples.at(-1);
      if(last&&time-last.time>350)this.reset();
      this.samples=this.samples.filter(point=>time-point.time<=1100);
      const previous=this.samples.at(-1);
      if(previous&&Math.hypot(x-previous.x,y-previous.y)<4)return false;
      this.samples.push({x,y,time});
      if(this.samples.length<5)return false;
      const mean=this.samples.reduce((sum,p)=>({x:sum.x+p.x/this.samples.length,y:sum.y+p.y/this.samples.length}),{x:0,y:0});
      let xx=0,xy=0,yy=0;
      for(const p of this.samples){const dx=p.x-mean.x,dy=p.y-mean.y;xx+=dx*dx;xy+=dx*dy;yy+=dy*dy;}
      const angle=.5*Math.atan2(2*xy,xx-yy),cx=Math.cos(angle),cy=Math.sin(angle);
      const along=this.samples.map(p=>(p.x-mean.x)*cx+(p.y-mean.y)*cy);
      const across=this.samples.map(p=>-(p.x-mean.x)*cy+(p.y-mean.y)*cx);
      const extent=Math.max(...along)-Math.min(...along),drift=Math.max(...across)-Math.min(...across);
      if(extent<90||drift>Math.max(18,extent*.38))return false;
      let direction=0,extreme=along[0],turns=0,travel=0;
      for(let i=1;i<along.length;i++){
        travel+=Math.abs(along[i]-along[i-1]);
        if(!direction){if(Math.abs(along[i]-extreme)>=50){direction=Math.sign(along[i]-extreme);extreme=along[i];}continue;}
        if(direction>0){if(along[i]>extreme)extreme=along[i];else if(extreme-along[i]>=50){direction=-1;extreme=along[i];turns++;}}
        else{if(along[i]<extreme)extreme=along[i];else if(along[i]-extreme>=50){direction=1;extreme=along[i];turns++;}}
      }
      if(turns>=3&&travel>=300){this.reset();return true;}
      return false;
    }
  }
  if(typeof window!=='undefined')window.BallWiggle=BallWiggle;
  if(typeof module!=='undefined')module.exports=BallWiggle;
})();
