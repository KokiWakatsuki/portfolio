import {DogActor,WAKE_DURATION} from './dog-animator.js';
export {WAKE_DURATION};
const supported=new Set(['shiba','husky','poodle','dachshund','chihuahua','golden','schnauzer','maltese']);
const cache=new Map();
function trimToLayer(markup,layer){
 const root=new DOMParser().parseFromString(markup,'image/svg+xml').documentElement;
 const breath=root.querySelector('[data-role="breath"]');
 for(const g of [...breath.children])if(layer?g.dataset.pose!==layer:g.dataset.pose?.startsWith('hang-'))g.remove();
 const defs=root.querySelector('defs'),index=new Map([...defs.children].filter(n=>n.id).map(n=>[n.id,n])),needed=new Set();
 function references(node){for(const n of [node,...node.querySelectorAll('*')])for(const a of n.attributes){for(const m of a.value.matchAll(/url\(#([^)]*)\)/g))needed.add(m[1]);if((a.name==='href'||a.name==='xlink:href')&&a.value.startsWith('#'))needed.add(a.value.slice(1));}}
 references(breath);let count=-1;while(count!==needed.size){count=needed.size;for(const id of [...needed])if(index.has(id))references(index.get(id));}
 for(const n of [...defs.children])if(!needed.has(n.id))n.remove();
 return new XMLSerializer().serializeToString(root);
}
export async function loadBreed(id){
 if(!supported.has(id))throw Error(`Unknown breed: ${id}`);
 if(!cache.has(id))cache.set(id,(async()=>{
  const asset=new URL(`../assets/dogs/${id}.svg`,import.meta.url);asset.search=new URL(import.meta.url).search;
  const markup=await fetch(asset).then(r=>{if(!r.ok)throw Error(`${id}: vector drawing unavailable`);return r.text();});
  // Modal layers are parsed only when a modal actually needs this breed.
  let front,back;
  return{type:'vector',markup:trimToLayer(markup,null),layers:{get 'hang-front'(){return front??=trimToLayer(markup,'hang-front');},get 'hang-back'(){return back??=trimToLayer(markup,'hang-back');}},id};
 })());
 return cache.get(id);
}
export function createBreedActor(art,options={}){
 const actor=new DogActor(art.layers?.[options.layer]||art.markup,options);
 actor.svg.dataset.breed=art.id;actor.svg.dataset.animation='hand-authored-vector';
 return actor;
}

export const breeds=[
 {id:'shiba',name:'柴犬'},{id:'husky',name:'シベリアンハスキー'},
 {id:'poodle',name:'プードル'},{id:'dachshund',name:'ダックスフンド'},
 {id:'chihuahua',name:'チワワ'},{id:'golden',name:'ゴールデンレトリバー'},
 {id:'schnauzer',name:'シュナウザー'},{id:'maltese',name:'マルチーズ'}
];
export function chooseBreed(exclude){const choices=breeds.filter(b=>b.id!==exclude);return choices[Math.floor(Math.random()*choices.length)];}
export function createPicker(first){let previous=first;return()=>{const breed=chooseBreed(previous);previous=breed.id;return breed;};}
