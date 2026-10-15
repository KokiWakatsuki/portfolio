import {readFileSync,writeFileSync,readdirSync,mkdirSync,rmSync,cpSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'dist');
const read=name=>readFileSync(resolve(root,name),'utf8');
const data=JSON.parse(read('content/site.json'));
for(const project of data.projects){project.detail=read('content/'+project.detailFile);delete project.detailFile;}
const cssFiles=["base.css","motion.css","project-media.css","layout.css","timeline.css","typography.css","problem-viewer.css","components.css","playground.css","companion.css"];
const css=cssFiles.map(name=>read('src/styles/'+name)).join('\n');
const hash=createHash('sha256').update(JSON.stringify(data)).update(css).update(read('content/problem-examples.json')).update(read('src/js/vendor/budoux-ja.js'));
for(const name of readdirSync(resolve(root,'src/js')).filter(name=>name.endsWith('.js')).sort())hash.update(read('src/js/'+name));
const revision=hash.digest('hex').slice(0,12);
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const render=(source,values)=>source.replace(/{{([A-Z_]+)}}/g,(_,key)=>escape(values[key]??''));
const shared={REVISION:revision,DATE:data.lastUpdated,DATE_LABEL:data.lastUpdated.replaceAll('-','.')};
rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});
cpSync(resolve(root,'public'),output,{recursive:true});cpSync(resolve(root,'src/js'),resolve(output,'js'),{recursive:true});
mkdirSync(resolve(output,'styles'));writeFileSync(resolve(output,'styles/site.css'),css);
writeFileSync(resolve(output,'js/site-data.js'),'window.PORTFOLIO_CONTENT = '+JSON.stringify(data)+';\n');
writeFileSync(resolve(output,'js/problem-data.js'),'window.ENGINE_EXAMPLES = '+JSON.stringify(JSON.parse(read('content/problem-examples.json')))+';\n');
writeFileSync(resolve(output,'index.html'),render(read('src/index.html'),shared));
for(const project of data.projects){const folder=resolve(output,'projects',project.id);mkdirSync(folder,{recursive:true});writeFileSync(resolve(folder,'index.html'),render(read('src/project.html'),{...shared,ID:project.id,TITLE:project.detailTitle,YEAR:project.year}));}
console.log('Built '+(data.projects.length+1)+' pages in dist/');
