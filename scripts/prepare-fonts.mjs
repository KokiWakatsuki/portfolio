import {readFileSync,readdirSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const generated=new Set();
const files=['content/site.json','content/problem-examples.json',...readdirSync(root+'content/projects').map(n=>'content/projects/'+n),...readdirSync(root+'src/js').filter(n=>n.endsWith('.js')).map(n=>'src/js/'+n),'src/index.html','src/project.html','scripts/render-content.mjs'];
const japanese=[...new Set(files.flatMap(f=>[...readFileSync(root+f,'utf8')].filter(c=>c.codePointAt(0)>255)))].sort().join('');
const fonts=[['DM Sans','400..700',Array.from({length:95},(_,i)=>String.fromCharCode(32+i)).join('')],['Noto Sans JP','400..700',japanese],['Noto Serif JP','500','若月 耕紀']];
mkdirSync(root+'public/assets/fonts',{recursive:true});let rules='';
for(const [family,weight,text] of fonts){
 const url=new URL('https://fonts.googleapis.com/css2');url.searchParams.set('family',family+':wght@'+weight);url.searchParams.set('text',text);url.searchParams.set('display','swap');
 const res=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}});if(!res.ok)throw Error(family+' '+res.status+' '+await res.text());
 const css=await res.text(),source=css.match(/url\((https:\/\/[^)]+)\)/)?.[1];if(!source)throw Error(family+' font source missing');
 if(new Set([...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map(m=>m[1])).size!==1)throw Error('Expected one variable font: '+family);
 const r=await fetch(source);if(!r.ok)throw Error('Font download '+r.status);const bytes=Buffer.from(await r.arrayBuffer());if(bytes.toString('ascii',0,4)!=='wOF2')throw Error('Expected WOFF2: '+family);
 const filename=family.toLowerCase().replaceAll(' ','-')+'-'+createHash('sha256').update(bytes).digest('hex').slice(0,10)+'.woff2';
 writeFileSync(root+'public/assets/fonts/'+filename,bytes);generated.add(filename);
 rules+=css.replaceAll(source,'../assets/fonts/'+filename).replace(/\/\*[^]*?\*\//g,'').trim()+'\n';console.log({family,filename,bytes:bytes.length});
}
writeFileSync(root+'src/styles/fonts.css',rules);
for(const file of readdirSync(root+'public/assets/fonts'))if(/^(dm-sans|noto-sans-jp|noto-serif-jp)-[a-f0-9]+\.woff2$/.test(file)&&!generated.has(file))rmSync(root+'public/assets/fonts/'+file);
for(const [slug,path] of [['DM-Sans','ofl/dmsans/OFL.txt'],['Noto-Sans-JP','ofl/notosansjp/OFL.txt'],['Noto-Serif-JP','ofl/notoserifjp/OFL.txt']]){
 const res=await fetch('https://raw.githubusercontent.com/google/fonts/main/'+path);if(!res.ok)throw Error('License '+res.status);writeFileSync(root+'licenses/'+slug+'-OFL.txt',await res.text());
}
