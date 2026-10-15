(() => {
  'use strict';
  class CompanionMood {
    constructor(){this.reset();}
    reset(){this.state='run';this.idleSince=null;this.wakeUntil=0;}
    movement(now){
      if(this.state==='sleep'||this.state==='deep-sleep'){
        this.wakeUntil=now+(this.state==='deep-sleep'?1250:750);
        this.state='wake';
      }else if(this.state!=='wake')this.state='run';
      this.idleSince=null;
    }
    holdsPosition(now){return this.state==='sleep'||this.state==='deep-sleep'||(this.state==='wake'&&now<this.wakeUntil);}
    tick(now,running){
      if(this.state==='wake'){
        if(now<this.wakeUntil)return this.state;
        this.state='run';this.idleSince=null;return this.state;
      }
      if(running){this.state='run';this.idleSince=null;return this.state;}
      if(this.idleSince===null)this.idleSince=now;
      const idle=now-this.idleSince;
      this.state=idle<3000?'wait':idle<9000?'sit':idle<18000?'sleep':'deep-sleep';
      return this.state;
    }
  }
  if(typeof window!=='undefined')window.CompanionMood=CompanionMood;
  if(typeof module!=='undefined')module.exports=CompanionMood;
})();
