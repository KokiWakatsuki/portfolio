(() => {
  'use strict';
  const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.projectTitleMarkup=(id,title)=>id==='mongene'?'<span>モンジェネ</span><small class="project-title-sub">学習塾向けの問題生成</small>':id==='research'?'<span class="research-title"><span class="title-chunk">組織コミュニケーションの</span><span class="title-chunk">生成モデル</span></span>':escape(title);
  // BudouX supplies phrase boundaries; authored groups express reading intent.
  const keep=[
    '中学数学の問題を、','単元・問題の形式・難易度を指定して',
    '自動で作るエンジンです。','2025年にETSUZAN2025に採択され、',
    'LLMで問題を生成する仕組みを開発しました。',
    '長岡技術科学大学大学院','長岡技術科学大学','長岡工業高等専門学校',
    '機械学習理論研究室','問題生成エンジン','組織コミュニケーション',
    'Webアプリの開発をしてきました。','学園祭実行委員会の情報局',
    '学園祭の運営システムを開発しました。',
    'LLMを使わない方式に','研究しながら','開発しています','担当しました','作り直しています',
    '組み立てます','作り替えています','できます','ETSUZAN2025',
    'TypeScript（Next.js、React）','Python（FastAPI、PyTorch）','Ruby on Rails',
    'GraphVAE','FastAPI','SymPy','PyTorch','Next.js'
  ];
  // Larger reading units are editorial hints, not word-segmentation predictions.
  // Matching the whole sentence prevents hints being applied to revised copy.
  const readingUnits=new Map([
    ['長岡高専でプログラミングを始め、','2021年からはアルバイトや業務委託で','Webアプリの開発をしてきました。'],
    ['長岡技術科学大学に編入してからは','学園祭実行委員会の情報局に入り、','学部4年次には約30人の局の代表を務めながら、','学園祭の運営システムを開発しました。'],
    ['高専4年から大学に編入するまでは、','学習塾で講師をしていました。'],
    ['今は4人のチームで、','学習塾向けのサービスを作っています。'],
    ['中学数学の問題を、','単元・問題の形式・難易度を指定して','自動で作るエンジンです。'],
    ['2025年にETSUZAN2025に採択され、','LLMで問題を生成する仕組みを開発しました。'],
    ['2026年からは4人のチームで、','LLMを使わない方式に作り直しています。'],
    ['2026年からは4人のチームで、','単元ごとの定義から','問題を組み立てる方式へ作り直しています。'],
    ['設計・実装にはAIを活用し、','答案の採点にもAIを使うサービスです。'],
    ['2026年からは4人のチームで、','問題生成の仕組みを作り直しています。'],
    ['AIで問題の設計図を作り、','プログラムがその設計図から問題を組み立てます。'],
    ['現在は4人のチームで、','問題生成の仕組みを作り直しています。'],
    ['2025年には3人のチームYukiwariで','ETSUZAN2025に採択され、','LLMで問題を生成する仕組みを開発しました。'],
    ['2023年に長岡技術科学大学へ編入し、','学園祭実行委員会の情報局で','運営システムを開発しました。'],
    ['2023年9月から1年間、','約30人の局の代表を務めました。'],
    ['学園祭の情報局で代表を務める中で、','マネジメントの難しさを感じました。'],
    ['組織の運営を補助できる理論やシステムがあればよいと考えたことが、','この研究を始めたきっかけです。'],
    ['中学数学の問題を、','単元・問題の形式・難易度を指定して','作るエンジンです。'],
    ['チームで開発している','学習塾向けのサービスの中で使います。'],
    ['サービスでは、','生徒がノートに解いた答案を撮影して送ると、','AIが採点します。'],
    ['通信の中断や出力トークン数の上限により、','問題文や解説の生成が途中で途切れることがある'],
    ['講師が問題をチェックしなくても使えるよう、','単元ごとの定義から問題を組み立てます。'],
    ['学生団体のSlackのやりとりをもとに、','組織の形を数値で表し、','メンバーを変えずにつながり方だけを変えたら','どうなるかを調べる研究です。'],
    ['深層学習のモデル（GraphVAE）を','組織向けに作り替えています。'],
    ['学園祭の参加団体の申請を管理するアプリと、','当日のシフト管理アプリです。'],
    ['学園祭実行委員会の情報局で、','2023年から2年間、','機能の追加と不具合の修正を担当しました。'],
    ['高専の卒業研究で作った、','体育の授業向けの運動学習アプリです。'],
    ['撮った動画の遅延再生やスロー再生、','2つの動画を並べての比較ができます。'],
    ['使ってもらった人の意見をもとに、','保存と拡大の機能を追加しました。']
  ].map(units=>[units.join(''),units]));
  const protectedPattern=new RegExp('(?:'+keep.sort((a,b)=>b.length-a.length).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+'|\\d+(?:,\\d{3})*(?:\\.\\d+)?(?:年|月|分|秒|人|件|単元|通り|回|cm³|cm|円|桁|つ|本|問|W))[、。，．]?','g');
  window.portfolioPhrases=text=>{
    const parsed=window.portfolioPhraseParser?.parse(text)||text.split(/(?<=[、。])/);
    let position=0;const boundaries=new Set();
    for(const part of parsed){position+=part.length;boundaries.add(position);}
    for(const match of text.matchAll(protectedPattern)){
      for(const boundary of boundaries)if(boundary>match.index&&boundary<match.index+match[0].length)boundaries.delete(boundary);
    }
    const phrases=[];let start=0;
    for(const end of [...boundaries].sort((a,b)=>a-b)){phrases.push(text.slice(start,end));start=end;}
    return phrases.filter(Boolean);
  };
  window.improveTextWrap=container=>{
    container.querySelectorAll('p,li').forEach(element=>{
      const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),nodes=[];
      while(walker.nextNode())if(!walker.currentNode.parentElement.closest('.prose-phrase,.prose-sentence,.katex,svg,button,a,code,pre'))nodes.push(walker.currentNode);
      for(const node of nodes){
        if(!node.textContent.trim())continue;
        const fragment=document.createDocumentFragment();
        for(const line of node.textContent.split(/(\n+)/)){
          if(/^\n+$/.test(line)){fragment.append(document.createTextNode(line));continue;}
          for(const text of line.match(/[^。！？!?]+[。！？!?]*|[。！？!?]+/g)||[]){
            const sentence=document.createElement('span');sentence.className='prose-sentence';
            const units=readingUnits.get(text)||[text];
            units.forEach((unit,index)=>{
              let parent=sentence;
              if(readingUnits.has(text)){
                if(index)sentence.append(document.createElement('wbr'));
                parent=document.createElement('span');parent.className='prose-unit';sentence.append(parent);
              }
              window.portfolioPhrases(unit).forEach((phrase,i)=>{
                if(i)parent.append(document.createElement('wbr'));
                const span=document.createElement('span');span.className='prose-phrase';
                const inner=window.portfolioPhraseParser?.parse(phrase)||[phrase];
                inner.forEach((part,j)=>{if(j)span.append(document.createElement('wbr'));span.append(document.createTextNode(part));});
                parent.append(span);
              });
            });
            fragment.append(sentence);
          }
        }
        node.replaceWith(fragment);
      }
    });
  };
})();
