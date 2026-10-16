import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../dist');
const option=process.argv.indexOf('--port');
const port=option<0?8870:Number(process.argv[option+1]);
const types={'.html':'text/html; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};
createServer(async(request,response)=>{try{let path=resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));if(path!==root&&!path.startsWith(root+sep)){response.writeHead(403).end();return;}if((await stat(path)).isDirectory())path=resolve(path,'index.html');response.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});response.end(await readFile(path));}catch{response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+'/'));
