import {escape} from './render-content.mjs';
export const siteUrl='https://portfolio.wakatsuki.app/';
const siteName='若月耕紀のポートフォリオ';
const description='長岡技術科学大学大学院・若月耕紀のポートフォリオ。数学の問題生成エンジン、組織コミュニケーションの研究、開発とデザインの制作物を紹介します。';
const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
export function metadata(project) {
  const url=project?`${siteUrl}projects/${project.id}/`:siteUrl;
  const title=project?`${project.detailTitle} | 若月耕紀のポートフォリオ`:`${siteName} | 開発・研究・デザイン`;
  const summary=project?project.summaryParagraphs[0]:description;
  const graph=[{'@type':'WebSite','@id':siteUrl+'#website',name:siteName,alternateName:'Koki Wakatsuki — Portfolio',url:siteUrl,inLanguage:'ja',author:{'@id':siteUrl+'#person'}},{'@type':'Person','@id':siteUrl+'#person',name:'若月耕紀',alternateName:'Koki Wakatsuki',url:siteUrl,sameAs:['https://github.com/KokiWakatsuki','https://zenn.dev/k_wakatsuki','https://x.com/koki_wakatsuki']}];
  const structured=project?{'@context':'https://schema.org','@type':'WebPage',url,name:title,description:summary,inLanguage:'ja',isPartOf:{'@id':siteUrl+'#website'},author:{'@id':siteUrl+'#person'}}:{'@context':'https://schema.org','@graph':graph};
  return `<title>${escape(title)}</title>
<meta name="description" content="${escape(summary)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="${siteName}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(summary)}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">${json(structured)}</script>`;
}
export function sitemap(data) {
  const urls=[siteUrl,...data.projects.map(project=>`${siteUrl}projects/${project.id}/`)];
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>`  <url><loc>${url}</loc><lastmod>${escape(data.lastUpdated)}</lastmod></url>`).join('\n')+'\n</urlset>\n';
}
