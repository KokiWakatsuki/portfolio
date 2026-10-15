(() => {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const assets = () => document.body.dataset.assetBase || 'assets/';
  const screens = {
    mongene: {
      problems: ['出題','mongene-engine-problem-ui.jpg','本物のエンジン出力を表示するモンジェネの出題画面','単元別に問題を出題する画面です。問題と図は問題生成エンジンの出力です。'],
      map: ['学習マップ','mongene-current-ui.jpg','モンジェネの学習マップ','単元ごとの学習状況を確認する画面です。学習状況は表示例です。']
    },
    research: {
      latent: ['潜在空間','research-latent.png','組織の型を色で示す学習済みモデルの潜在空間','点は組織、色は組織の型を表します。黒い点は実データです。'],
      simulation: ['組織の変化','research-simulation.png','同じ7人の構成で目標の組織の形へ移した実際の結果','同じ7人の構成で組織の形を変えた結果です。右端のクラスター型には到達していません。']
    },
    festival: {
      home: ['GM2のホーム','gm-current-ui.jpg','GM2 Next.js版の申請状況とお知らせ','チームで開発したGM2の申請状況とお知らせです。画面のデータは表示例です。自身の担当範囲は本文に記載しています。']
    },
    sporty: {
      comparison: ['並列比較','sporty-comparison-ui.jpg','sportyの並列動画比較画面','比較に使っている動画は表示例です。'],
      overlay: ['透過比較','sporty-overlay-ui.jpg','sportyの透過動画比較画面','比較に使っている動画は表示例です。'],
      settings: ['遅延設定','sporty-ui.jpg','sportyの遅延再生設定画面','遅延時間、カメラ、解像度を選ぶ実際の設定画面です。'],
      menu: ['比較メニュー','sporty-menu-ui.jpg','sportyの比較メニュー','並列・交互・透過の3種類の比較方法を選ぶメニューです。']
    }
  };
  window.projectGalleryMarkup = id => {
    const choices=screens[id];
    if(!choices) return '';
    const [key,screen]=Object.entries(choices)[0];
    return `<figure class="project-detail-screen" data-ui-gallery="${id}">${Object.keys(choices).length>1?`<div class="ui-shot-switch" role="group" aria-label="${id==='research'?'研究の図':'アプリの画面'}">${Object.entries(choices).map(([name,s])=>`<button type="button" data-ui-view="${name}" aria-pressed="${name===key}">${s[0]}</button>`).join('')}</div>`:''}<a href="${assets()+screen[1]}" target="_blank" rel="noreferrer" class="ui-browser-frame" data-ui-enlarge><img src="${assets()+screen[1]}" alt="${escape(screen[2])}"></a><figcaption><span data-ui-caption>${escape(screen[3])}</span><a href="${assets()+screen[1]}" target="_blank" rel="noreferrer" data-ui-enlarge>画像を大きく見る ↗</a></figcaption></figure>`;
  };
  window.decisionMarkup = () => `<figure id="problem-generation-flow" class="decision-study" data-decision-mode="after"><div class="ui-shot-switch" role="group" aria-label="問題生成の方式"><button type="button" data-decision="before" aria-pressed="false">ETSUZAN2025</button><button type="button" data-decision="after" aria-pressed="true">現在の設計</button></div><div class="decision-stages"><section class="decision-preparation" aria-label="出題前の準備"><p class="decision-phase">出題前の準備</p><div class="decision-node decision-ai"><span>AI</span><strong>問題の設計図を作る</strong><small>条件・数値の範囲・解き方など</small></div><span class="decision-arrow" aria-hidden="true">↓</span><div class="decision-node"><span>人による確認</span><strong>数学・教育の内容を確認する</strong></div><span class="decision-arrow" aria-hidden="true">↓</span><div class="decision-node"><span>保存</span><strong>確認した設計図を保存する</strong></div></section><section class="decision-execution" aria-label="出題時"><p class="decision-phase">出題時</p><div class="decision-node"><span>入力</span><strong data-decision-field="input">単元・形式・難易度</strong></div><span class="decision-arrow" aria-hidden="true">↓</span><div class="decision-node decision-engine"><span data-decision-field="engineLabel">エンジン</span><strong data-decision-field="engine">設計図から問題を組み立てる</strong></div><span class="decision-arrow" aria-hidden="true">↓</span><div class="decision-node"><span>出力</span><strong data-decision-field="output">問題文・解答・解説・図</strong></div></section></div><figcaption data-decision-field="caption">AIで作った設計図の内容を確認し、出題時は保存した設計図からプログラムが問題を生成します。答案の採点にはAIを使います。</figcaption></figure>`;
  window.initializeProjectGalleries = container => {
    container.querySelectorAll('[data-ui-gallery]').forEach(figure => {
      figure.querySelectorAll('[data-ui-view]').forEach(button => button.addEventListener('click', () => {
        const [,file,alt,caption]=screens[figure.dataset.uiGallery][button.dataset.uiView];
        const image=figure.querySelector('img');image.src=assets()+file;image.alt=alt;
        figure.querySelector('[data-ui-caption]').textContent=caption;
        figure.querySelectorAll('[data-ui-enlarge]').forEach(link=>link.href=assets()+file);
        figure.querySelectorAll('[data-ui-view]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
      }));
    });
    const designs={before:{input:'作りたい問題の指示',engineLabel:'LLM',engine:'文章とプログラムを生成',output:'プログラムが計算・作図',caption:'ETSUZAN2025では、LLMが問題文とプログラムを生成し、プログラムで計算と作図を行いました。'},after:{input:'単元・形式・難易度',engineLabel:'エンジン',engine:'設計図から問題を組み立てる',output:'問題文・解答・解説・図',caption:'AIで作った設計図の内容を確認し、出題時は保存した設計図からプログラムが問題を生成します。答案の採点にはAIを使います。'}};
    container.querySelectorAll('.decision-study').forEach(figure=>{
      figure.querySelectorAll('[data-decision]').forEach(button=>button.addEventListener('click',()=>{
        const design=designs[button.dataset.decision];figure.dataset.decisionMode=button.dataset.decision;
        figure.querySelectorAll('[data-decision-field]').forEach(field=>field.textContent=design[field.dataset.decisionField]);
        figure.querySelectorAll('[data-decision]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
      }));
    });
  };
})();
