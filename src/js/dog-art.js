(() => {
  'use strict';
  // Shared linework and animation joints, with breed-specific silhouettes.
  const breeds=[
    {id:'husky',name:'シベリアンハスキー',coat:'#fffef9',patch:'#707b84',line:'#5e6d78',ear:'#c9aaa0',eye:'#568fbb',shape:'pointed'},
    {id:'shiba',name:'柴犬',coat:'#cc945f',patch:'#fff5df',line:'#805f49',ear:'#ae7656',shape:'pointed'},
    {id:'retriever',name:'ゴールデンレトリバー',coat:'#e3bd79',patch:'#fae8c3',line:'#8b724d',ear:'#c79957',shape:'floppy'},
    {id:'poodle',name:'トイプードル',coat:'#ae7b51',patch:'#cc9c70',line:'#76553f',ear:'#98673f',shape:'curly'},
    {id:'pomeranian',name:'ポメラニアン',coat:'#dc9a4c',patch:'#f6d6a5',line:'#9b7045',ear:'#bf874c',shape:'puff'},
    {id:'corgi',name:'コーギー',coat:'#d5a171',patch:'#fff5e6',line:'#8a6c52',ear:'#c38f79',shape:'wide'},
    {id:'dachshund',name:'ダックスフンド',coat:'#a77857',patch:'#d7b495',line:'#765947',ear:'#886348',shape:'long'},
    {id:'beagle',name:'ビーグル',coat:'#fff8ee',patch:'#aa784f',line:'#80674f',ear:'#b48660',shape:'hound'},
    {id:'dalmatian',name:'ダルメシアン',coat:'#fffef9',patch:'#424c4a',line:'#64736a',ear:'#c9bab0',shape:'spotted'},
    {id:'collie',name:'ボーダーコリー',coat:'#717a78',patch:'#fffdf3',line:'#586761',ear:'#8f9690',shape:'collie'},
    {id:'schnauzer',name:'シュナウザー',coat:'#a2aaa7',patch:'#e5e8df',line:'#6b7770',ear:'#858f88',shape:'bearded'},
    {id:'samoyed',name:'サモエド',coat:'#fffdf3',patch:'#e9e7db',line:'#929a88',ear:'#d9c9bc',shape:'fluffy'},
    {id:'papillon',name:'パピヨン',coat:'#fff9ee',patch:'#997a62',line:'#7c6d5a',ear:'#bb9282',shape:'butterfly'},
    {id:'pug',name:'パグ',coat:'#decb9f',patch:'#524b42',line:'#817661',ear:'#675c4b',shape:'round'},
    {id:'chihuahua',name:'チワワ',coat:'#d0b392',patch:'#fff4e2',line:'#8c7965',ear:'#c59c91',shape:'tiny'}
  ];
  function choose(previous){const choices=breeds.filter(breed=>breed.id!==previous);return choices[Math.floor(Math.random()*choices.length)];}
  // A shuffled bag lets every dog appear before cycling; avoid repeats at the seam.
  function createPicker(previous){let bag=[];return ()=>{if(!bag.length)bag=[...breeds];const choices=bag.filter(breed=>breed.id!==previous);const breed=choices[Math.floor(Math.random()*choices.length)];bag=bag.filter(item=>item!==breed);previous=breed.id;return breed;};}
  const palette=breed=>`--dog-coat:${breed.coat};--dog-patch:${breed.patch};--dog-line:${breed.line};--dog-inner-ear:${breed.ear};--dog-eye:${breed.eye||'#49382e'}`;
  let artworkId=0;
  // Outline the union of the painted shapes, not every animation joint.
  function ink(breed,art){
    const id=`dog-ink-${++artworkId}`;
    return `<defs><filter id="${id}" x="-30%" y="-35%" width="160%" height="180%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="1.3" result="edge"/><feFlood flood-color="${breed.line}" result="ink"/><feComposite in="ink" in2="edge" operator="in" result="outline"/><feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g class="dog-painted" filter="url(#${id})" style="stroke:none">${art}</g>`;
  }
  function head(breed,hanging=false){
    // Original soft silhouettes: ears behind a broad, rounded cheek shape.
    let outline='M-24 -10C-27 -23 -15 -30 0 -29C15 -30 27 -23 24 -10C32 7 15 21 0 20C-15 21 -32 7 -24 -10Z';
    let ears='<path d="M-23 -11C-31 -20 -29 -38 -23 -39C-17 -40 -8 -27 -9 -18ZM23 -11C31 -20 29 -38 23 -39C17 -40 8 -27 9 -18Z"/><path class="dog-ear-fill" d="M-23 -19Q-27 -29 -23 -33Q-17 -32 -13 -22ZM23 -19Q27 -29 23 -33Q17 -32 13 -22Z"/>';
    let patch='<ellipse class="dog-mask" cx="0" cy="9" rx="19" ry="11"/>',extra='';
    if(['floppy','long','hound','spotted'].includes(breed.shape)){
      ears=breed.shape==='long'?'<path class="dog-floppy-ear" d="M-19 -21C-38 -26 -39 -4 -33 16C-28 30 -20 24 -20 9C-20 -3 -15 -12 -19 -21ZM19 -21C38 -26 39 -4 33 16C28 30 20 24 20 9C20 -3 15 -12 19 -21Z"/>':'<path class="dog-floppy-ear" d="M-20 -23C-36 -25 -39 -9 -34 10C-31 22 -23 21 -22 9Q-19 -6 -16 -18ZM20 -23C36 -25 39 -9 34 10C31 22 23 21 22 9Q19 -6 16 -18Z"/>';
      if(breed.shape==='long')outline='M-21 -10C-24 -24 -12 -29 0 -28C12 -29 24 -24 21 -10C27 8 13 21 0 20C-13 21 -27 8 -21 -10Z';
      if(breed.shape==='hound')patch='<path class="dog-mask" d="M-23 -20Q-15 -31 -4 -28Q-1 -21 -5 -12Q-10 -6 -21 -3ZM23 -20Q15 -31 4 -28Q1 -21 5 -12Q10 -6 21 -3Z"/>';
      if(breed.shape==='spotted'){ears=ears.replace('dog-floppy-ear','dog-floppy-ear dog-spots');patch='<ellipse class="dog-mask" cx="-16" cy="-17" rx="7" ry="6"/><circle class="dog-mask" cx="18" cy="7" r="3"/>';}
    }
    if(breed.shape==='curly'){
      outline='M-26 -7Q-36 -12 -30 -22Q-33 -33 -20 -35Q-13 -46 -3 -39Q8 -45 16 -37Q29 -38 30 -27Q40 -21 32 -11Q34 0 24 4Q22 22 0 22Q-22 22 -24 4Q-35 3 -26 -7Z';
      ears='<path class="dog-floppy-ear" d="M-23 -20Q-37 -26 -35 -12Q-44 -4 -36 5Q-40 16 -27 19Q-15 18 -18 4ZM23 -20Q37 -26 35 -12Q44 -4 36 5Q40 16 27 19Q15 18 18 4Z"/>';patch='<ellipse class="dog-mask" cx="0" cy="10" rx="15" ry="10"/>';
    }
    if(['wide','tiny'].includes(breed.shape)){
      const tip=breed.shape==='tiny'?46:42;
      ears=`<path d="M-21 -13C-36 -26 -34 -${tip} -26 -${tip}C-18 -${tip} -8 -31 -8 -19ZM21 -13C36 -26 34 -${tip} 26 -${tip}C18 -${tip} 8 -31 8 -19Z"/><path class="dog-ear-fill" d="M-23 -23Q-30 -33 -26 -${tip-6}Q-18 -${tip-5} -13 -24ZM23 -23Q30 -33 26 -${tip-6}Q18 -${tip-5} 13 -24Z"/>`;
      if(breed.shape==='wide')extra='<path class="dog-mask" d="M-3 -28Q0 -30 3 -28Q6 -17 0 -7Q-6 -17 -3 -28Z"/>';
    }
    if(breed.id==='husky')patch='<path class="dog-mask" d="M-23 -21Q-16 -30 -5 -28Q0 -22 5 -28Q16 -30 23 -21Q25 -9 18 -5Q9 -1 5 -8Q0 -18 -5 -8Q-9 -1 -18 -5Q-25 -9 -23 -21Z"/>';
    if(breed.shape==='collie')patch='<path class="dog-mask" d="M-4 -28Q0 -30 4 -28Q8 -18 4 -8Q24 -1 21 11Q15 22 0 20Q-15 22 -21 11Q-24 -1 -4 -8Q-8 -18 -4 -28Z"/>';
    if(breed.shape==='bearded'){
      ears='<path class="dog-floppy-ear" d="M-20 -26Q-34 -31 -31 -14Q-26 -9 -17 -19ZM20 -26Q34 -31 31 -14Q26 -9 17 -19Z"/>';
      outline='M-24 -13Q-25 -29 -12 -30H12Q25 -29 24 -13Q30 2 20 12Q14 22 0 21Q-14 22 -20 12Q-30 2 -24 -13Z';
      patch='<path class="dog-mask" d="M-19 1Q-10 -6 0 0Q10 -6 19 1Q26 11 16 15Q12 24 0 22Q-12 24 -16 15Q-26 11 -19 1Z"/>';extra='<path class="dog-brow" d="M-16 -8Q-10 -12 -5 -9M5 -9Q10 -12 16 -8"/>';
    }
    if(['fluffy','puff'].includes(breed.shape)){
      outline=breed.shape==='puff'?'M-24 -14Q-31 -22 -22 -27Q-14 -35 -6 -29Q4 -36 13 -29Q25 -33 28 -21Q36 -14 29 -4Q36 9 25 15Q20 27 8 24Q0 30 -8 24Q-20 27 -25 15Q-36 9 -29 -4Q-33 -10 -24 -14Z':'M-25 -12Q-32 -23 -21 -27Q-12 -34 -4 -29Q5 -35 13 -29Q27 -32 28 -19Q37 -9 29 0Q33 11 23 15Q18 26 7 22Q0 28 -7 22Q-18 26 -23 15Q-33 11 -29 0Q-36 -6 -25 -12Z';
      patch='<path class="dog-mask" d="M-20 5Q-13 -4 0 2Q13 -4 20 5Q21 17 9 18Q0 23 -9 18Q-21 17 -20 5Z"/>';
      ears='<path d="M-20 -20Q-27 -31 -20 -37Q-13 -38 -8 -25ZM20 -20Q27 -31 20 -37Q13 -38 8 -25Z"/>';
    }
    if(breed.shape==='butterfly'){
      ears='<path class="dog-floppy-ear" d="M-15 -18C-23 -33 -41 -40 -41 -26Q-47 -17 -37 -10Q-36 4 -23 3Q-16 -1 -15 -18ZM15 -18C23 -33 41 -40 41 -26Q47 -17 37 -10Q36 4 23 3Q16 -1 15 -18Z"/>';
      patch='<path class="dog-mask" d="M-23 -20Q-14 -30 -4 -28Q-2 -18 -7 -10Q-12 -4 -23 -5ZM23 -20Q14 -30 4 -28Q2 -18 7 -10Q12 -4 23 -5Z"/>';
    }
    if(breed.shape==='round'){
      ears='<path class="dog-floppy-ear" d="M-21 -24Q-34 -31 -31 -18Q-30 -8 -20 -14Q-14 -20 -21 -24ZM21 -24Q34 -31 31 -18Q30 -8 20 -14Q14 -20 21 -24Z"/>';
      patch='<ellipse class="dog-mask" cx="0" cy="10" rx="16" ry="12"/>';extra='<path class="dog-wrinkles" d="M-7 -16Q0 -20 7 -16M-5 -11Q0 -14 5 -11"/>';
    }
    const eyeSize=breed.shape==='tiny'?4.1:3.7;
    return `<g class="dog-face" data-dog-pivot="0 14">${ears}<path d="${outline}"/>${patch}${extra}<g class="dog-cheeks" fill="#e5ada0" opacity=".55"><ellipse cx="-18" cy="7" rx="3.8" ry="2.5"/><ellipse cx="18" cy="7" rx="3.8" ry="2.5"/></g><g class="dog-eyes${hanging?' hanging-eyes':''}"><g class="dog-blink" data-dog-pivot="0 -2.5"><circle class="dog-eye" cx="-10" cy="-2" r="${eyeSize}"/><circle class="dog-eye" cx="9" cy="-3" r="${eyeSize-.25}"/><g class="dog-eye-glints"><circle cx="-10.7" cy="-2.8" r=".65"/><circle cx="8.4" cy="-3.7" r=".65"/></g></g><path class="dog-closed-eyes" d="M-14 -3Q-10 1 -6 -3M6 -3Q10 1 14 -3"/></g><path class="dog-nose" d="M-5 5Q0 2 5 5Q5 9 0 10Q-5 9 -5 5Z"/><path class="dog-smile" d="M0 9V12M0 12Q-5 19 -10 13M0 12Q5 19 10 13"/><path class="dog-tongue" d="M0 13Q-2 19 1 20Q5 20 5 14"/><ellipse class="dog-yawn" cx="0" cy="15" rx="5.5" ry="6"/></g>`;
  }
  function standing(breed,pose='stand'){
    const long=breed.shape==='long',short=['long','wide','round','puff'].includes(breed.shape),small=breed.shape==='tiny';
    const fluffy=['fluffy','puff','curly'].includes(breed.shape);
    const hip=long?51:small?31:42,foot=short?35:40;
    let tail=['shiba','pug'].includes(breed.id)?'M35 18C55 27 68 16 65 0C64 -13 46 -13 44 -3C42 5 53 10 56 3C58 13 44 18 38 10Z':breed.shape==='curly'?'M35 18Q56 15 58 -1Q46 -1 50 -10Q47 -21 59 -21Q70 -25 73 -14Q81 -6 69 0Q69 22 41 27Z':['puff','fluffy'].includes(breed.shape)?'M33 20Q61 34 69 14Q77 6 67 0Q68 -13 56 -11Q44 -9 50 1Q48 12 36 10Z':breed.id==='corgi'?'M34 16Q48 12 49 21Q47 31 35 27Z':breed.id==='retriever'?'M37 20Q61 25 69 3Q75 -9 69 -15Q63 -14 63 -3Q59 14 38 12Z':'M35 18Q60 20 65 -7Q69 -16 73 -9Q78 16 44 27Z';
    let body=long?'M-22 13C-24 -3 -9 -7 -2 1C9 5 29 -1 41 3C61 5 59 29 42 32C26 33 14 27 3 29C-15 36 -25 28 -22 13Z':small?'M-21 8C-24 -6 -12 -11 -4 -4Q8 -6 24 1C39 8 36 31 22 32Q7 32 -1 28C-17 35 -24 26 -21 8Z':'M-23 9C-27 -10 -11 -13 -3 -4C7 -6 19 -4 29 -2C48 0 52 17 45 29C39 38 24 34 16 30Q6 29 -3 30C-18 36 -25 24 -23 9Z';
    if(breed.shape==='curly')body='M-22 7Q-29 -4 -18 -9Q-7 -17 -1 -7Q9 -11 15 -4Q27 -8 33 0Q46 0 44 10Q54 18 44 26Q43 37 31 34Q20 39 14 31Q2 36 -5 30Q-19 35 -22 22Q-28 16 -22 7Z';
    if(breed.shape==='puff')body='M-23 5Q-26 -9 -13 -10Q-7 -19 3 -11Q14 -17 22 -8Q35 -12 38 0Q49 3 44 15Q50 28 35 31Q29 41 16 35Q6 40 -1 33Q-16 36 -21 25Q-31 19 -23 5Z';
    let farLegs=`<g class="dog-far-leg dog-leg-front" data-dog-pivot="-6 19"><path d="M-5 19Q-2 22 -3 ${foot-10}Q-4 ${foot-5} -11 ${foot-4}Q-19 ${foot-1} -13 ${foot}Q-3 ${foot+1} -3 ${foot-6}Q-6 27 -11 19Z"/></g><g class="dog-far-leg dog-leg-back" data-dog-pivot="${hip-7} 19"><path d="M${hip-4} 18Q${hip+2} 23 ${hip-4} ${foot-9}Q${hip-6} ${foot-5} ${hip-12} ${foot-4}Q${hip-21} ${foot-1} ${hip-16} ${foot}Q${hip-5} ${foot+1} ${hip-5} ${foot-6}Q${hip-9} 26 ${hip-13} 18Z"/></g>`;
    let legs=`<g class="dog-leg dog-leg-front" data-dog-pivot="-13 17"><path d="M-18 17Q-12 14 -8 18Q-7 25 -12 ${foot-10}Q-12 ${foot-5} -18 ${foot-4}Q-27 ${foot-1} -25 ${foot+1}Q-23 ${foot+2} -14 ${foot+1}Q-10 ${foot} -11 ${foot-4}Q-12 27 -18 17Z"/></g><g class="dog-leg dog-leg-back" data-dog-pivot="${hip-9} 18"><path d="M${hip-15} 15C${hip+1} 9 ${hip+5} 23 ${hip-7} ${foot-9}Q${hip-10} ${foot-5} ${hip-17} ${foot-4}Q${hip-26} ${foot-1} ${hip-22} ${foot+1}Q${hip-11} ${foot+3} ${hip-10} ${foot-3}Q${hip-12} ${foot-9} ${hip-16} ${foot-12}Q${hip-20} 24 ${hip-15} 15Z"/></g>`;
    let headTransform=long?'translate(-13 -8) rotate(-3) scale(1.02)':small?'translate(-10 -13) rotate(-4) scale(1.08)':'translate(-10 -13) rotate(-4) scale(1.1)';
    let tailAnchor={x:long?46:small?25:35,y:18},tailAngle=0;
    if(pose==='sit'){
      // A seated dog is drawn from the front: matching head, torso and paws.
      body='M-15 6C-23 15 -24 31 -16 38C-9 43 9 43 16 38C24 31 23 15 15 6Q0 -1 -15 6Z';
      farLegs='<g class="dog-far-leg"><ellipse cx="-17" cy="36" rx="9" ry="5"/><ellipse cx="17" cy="36" rx="9" ry="5"/></g>';
      legs='<g class="dog-leg dog-leg-front"><path d="M-14 14Q-8 11 -5 16L-5 36Q-4 43 -10 44Q-18 44 -17 37Z M5 16Q8 11 14 14L17 37Q18 44 10 44Q4 43 5 36Z"/></g>';
      headTransform='translate(0 -12) rotate(-4) scale(1.15)';tailAnchor={x:15,y:28};
    }else if(pose==='stretch'){
      body='M-23 20Q-12 12 2 13Q13 10 20 0C38 -16 52 10 39 24Q26 28 17 21Q2 31 -13 30Q-24 28 -23 20Z';
      farLegs='';legs='<g class="dog-leg"><path d="M-16 22Q-20 30 -29 31Q-38 38 -24 40Q-14 40 -9 33L1 25M27 15Q23 30 27 34Q16 36 18 40Q31 43 35 37Q40 25 35 13"/></g>';headTransform='translate(-22 8) scale(.93) rotate(-8)';tailAnchor={x:37,y:12};
    }else if(pose==='lie'){
      body='M-23 26C-27 15 -16 7 -4 12Q8 4 22 9C45 7 51 31 36 37Q14 40 -2 34Q-17 37 -23 26Z';
      farLegs='';legs='<g class="dog-leg"><path d="M-16 27Q-20 29 -25 30Q-37 37 -24 39H-10Q1 39 1 31M26 23Q43 18 39 29Q33 32 25 34Q17 35 12 36Q8 41 21 40Q32 40 34 34Q11 31 17 27"/></g>';headTransform='translate(-16 12) rotate(-5) scale(1.01)';tailAnchor={x:32,y:27};tailAngle=20;
    }else if(pose==='curl'){
      body='M-22 24C-33 7 -4 -6 15 2C38 7 46 28 32 36C15 46 -12 38 -22 24Z';
      farLegs='';legs='<path class="dog-leg" d="M-10 31Q-14 38 -2 38H8M22 22C8 17 9 34 23 33Q30 33 31 29"/>';headTransform='translate(-9 16) rotate(-13) scale(.99)';tail='M30 13C53 28 31 47 5 41C-16 40 -28 31 -22 26C-19 23 -17 25 -15 27Q3 39 24 33Q38 28 30 13Z';tailAnchor={x:30,y:13};
    }
    const front=pose==='sit';
    let markings='';
    if(breed.shape==='spotted')markings=front?'<g class="dog-mask"><ellipse cx="-19" cy="28" rx="3.5" ry="4"/><circle cx="18" cy="30" r="3.3"/><circle cx="0" cy="35" r="2.7"/></g>':'<g class="dog-mask"><ellipse cx="14" cy="8" rx="5" ry="4"/><circle cx="29" cy="17" r="4"/><circle cx="-6" cy="12" r="3"/><circle cx="38" cy="10" r="2"/></g>';
    else if(breed.id==='beagle')markings=front?'<path class="dog-saddle" d="M-22 6Q-13 0 -9 6Q-7 19 -17 23Z M22 6Q13 0 9 6Q7 19 17 23Z"/>':'<path class="dog-saddle" d="M3 -2Q28 -5 37 9Q39 19 25 19Q16 17 12 10Z"/>';
    else if(['husky','collie','schnauzer'].includes(breed.id))markings=front?(breed.id==='husky'?'<path class="dog-back" d="M-23 3Q-12 -3 -10 7Q-8 18 -18 24Z M23 3Q12 -3 10 7Q8 18 18 24Z"/>':'<path class="dog-mask" d="M-9 3Q0 -2 9 3Q13 15 7 30Q0 35 -7 30Q-13 15 -9 3Z"/>'):'<path class="dog-back" d="M1 -3Q28 -7 41 10Q44 17 31 18Q15 14 10 5Z"/>';
    const lightChest=['shiba','corgi','chihuahua','retriever','pomeranian'].includes(breed.id);
    const chest=lightChest?(front?'<path class="dog-mask" d="M-10 3Q0 -1 10 3Q12 20 5 31Q0 35 -5 31Q-12 20 -10 3Z"/>':'<path class="dog-mask" d="M-21 2Q-11 -3 -7 8Q-5 23 -11 27Q-21 28 -21 2Z"/>'):'';
    const detail=front?'<path class="dog-detail" d="M-5 21V36M5 21V36M-13 40V42M-9 40V42M9 40V42M13 40V42"/>':pose==='lie'?'<path class="dog-detail" d="M-16 31Q-6 34 0 31M22 24Q31 22 30 30"/>':pose==='curl'?'<path class="dog-detail" d="M20 22Q10 18 12 29Q15 34 25 31"/>':`<path class="dog-detail" d="M-10 19Q-8 24 -11 28M${hip-12} 18Q${hip-3} 16 ${hip-5} 24"/>`;
    const bodyId=`dog-coat-${++artworkId}`;
    const paintedBody=`<g class="dog-body"><defs><clipPath id="${bodyId}" clipPathUnits="userSpaceOnUse"><path d="${body}"/></clipPath></defs><path class="dog-body-silhouette" d="${body}"/><g class="dog-coat-markings" clip-path="url(#${bodyId})">${markings}${chest}</g></g>`;
    const root=tail.match(/^M(-?\d+) (-?\d+)/);
    const art=`<g class="dog-tail-position" transform="translate(${tailAnchor.x} ${tailAnchor.y}) rotate(${tailAngle})"><g class="dog-tail" data-dog-pivot="0 0"><g transform="translate(${-Number(root[1])} ${-Number(root[2])})"><path d="${tail}"/></g></g></g>${farLegs}${paintedBody}${legs}${detail}<g class="dog-neck" transform="${headTransform}">${head(breed)}</g>`;
    return ink(breed,art);
  }
  function companion(breed,pose='stand'){return `<svg viewBox="-22 -12 154 132" data-dog-breed="${breed.id}" data-dog-pose="${pose}" style="${palette(breed)}" aria-hidden="true" focusable="false"><ellipse class="companion-shadow" cx="52" cy="106" rx="38" ry="3"/><g class="toy-dog" transform="translate(43 64)">${standing(breed,pose)}</g><g class="companion-sleep"><text x="70" y="27">z</text><text x="83" y="17">z</text><text class="deep-sleep-letter" x="96" y="7">z</text></g></svg>`;}
  function hanging(breed,layer){
    // Only the tip clears the paper edge. The body stays behind the opaque paper.
    const tip=breed.shape==='curly'?'M84 74Q104 56 104 36Q100 32 103 27Q102 20 109 21Q115 16 119 24Q127 27 120 32Q120 54 97 70Z':['shiba','pug'].includes(breed.id)?'M84 74Q110 54 105 35Q100 22 110 22Q124 20 122 33Q120 41 114 39Q119 29 111 29Q120 56 96 72Z':'M84 74Q107 56 105 33Q103 24 110 24Q117 40 112 53Q108 64 96 72Z';
    const back=`<g class="hanging-tail"><path d="${tip}"/></g><g class="hanging-body"><path d="M36 46Q28 61 35 88L42 112Q60 122 78 112L85 87Q92 61 84 46Z"/><path class="dog-mask" d="M40 55Q60 64 80 55L78 83Q59 95 42 82Z"/></g><g class="hanging-feet"><path d="M40 102L42 126Q45 132 51 128L54 108M68 108L70 128Q77 131 79 125L80 102"/></g>`;
    const front=`<g class="hanging-swing"><g class="hanging-head" transform="translate(60 29) scale(1.05)">${head(breed,true)}</g></g><g class="hanging-paws"><path d="M31 43Q25 40 26 48Q26 58 37 55Q45 55 43 46Q41 40 37 43Z M83 43Q78 40 77 46Q75 55 83 55Q94 58 94 48Q95 40 89 43Z"/><path d="M31 48V53M36 48V54M84 48V54M89 48V53"/></g>`;
    return `<svg viewBox="0 0 120 140" data-dog-breed="${breed.id}" style="${palette(breed)}" aria-hidden="true" focusable="false">${ink(breed,layer==='back'?back:front)}</svg>`;
  }
  let previous;try{previous=sessionStorage.getItem('portfolio-dog');}catch{}
  const pageBreed=choose(previous);try{sessionStorage.setItem('portfolio-dog',pageBreed.id);}catch{}
  // Map local joint coordinates into each SVG group's fill-box coordinates.
  function anchorJoints(scope){
    scope.querySelectorAll('[data-dog-pivot]').forEach(part=>{
      const [x,y]=part.dataset.dogPivot.split(' ').map(Number),box=part.getBBox();
      if(!box.width&&!box.height)return;
      part.style.transformBox='fill-box';part.style.transformOrigin=`${x-box.x}px ${y-box.y}px`;
    });
  }
  window.DogArt={breeds,choose,createPicker,companion,hanging,pageBreed,anchorJoints};
  window.companionDogSvg=companion(pageBreed);
  const hero=document.querySelector('.dog-play .toy-dog');
  if(hero){hero.setAttribute('style',palette(pageBreed));hero.dataset.dogBreed=pageBreed.id;hero.innerHTML=standing(pageBreed);anchorJoints(hero);}
})();
