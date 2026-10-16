# Koki Wakatsuki — Portfolio

開発・研究・デザインの制作物を紹介する静的サイトです。HTML、CSS、JavaScriptで構成し、実行時のバックエンドは使いません。

## ローカルで開く

Node.js 24を使用します。追加パッケージのインストールは不要です。

```sh
npm run dev
```

http://127.0.0.1:8870/ を開きます。ファイルを編集したら別のターミナルで `npm run build` を実行して再読み込みします。

## ファイル構成

- `content/site.json`：自己紹介、技術、経歴、各作品の概要、最終更新日
- `content/projects/`：各作品の詳細本文
- `content/problem-examples.json`：実際に生成した数学の問題例
- `src/index.html`、`src/project.html`：ページのテンプレート
- `src/styles/`、`src/js/`：見た目と動作
- `public/assets/`：掲載する画像
- `scripts/`：静的ファイルの生成とローカル確認
- `licenses/`：同梱ライブラリのライセンス

## 更新と公開

文章は `content/`、画像は `public/assets/` を編集します。更新した日は `content/site.json` の `lastUpdated` を変更してください。

```sh
npm run build
```

生成先の `dist/` を静的ホスティングで公開します。ビルドコマンドは `npm run build`、出力ディレクトリは `dist` です。生成物はGitに含めません。

Gitは `main` を基本にし、小さな更新は直接コミット、大きな変更は必要な期間だけブランチを使って統合後に削除します。

## Cloudflare Pages

公開先はCloudflare Pagesの `portfolio`、独自ドメインは https://portfolio.wakatsuki.app/ です。

GitHubの `main` ブランチへのpushで公開します。ビルドコマンドは `npm run build`、出力ディレクトリは `dist`、ルートディレクトリはリポジトリのルートです。Node.jsは `.nvmrc` で指定しています。

公開前にはローカルでビルドと表示を確認し、大きな変更は別ブランチのプレビューでも確認してください。

参考：[Cloudflare PagesのGitHub連携](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)

## 検索向けの設定

本文と作品へのリンクはビルド時にHTMLへ出力します。ブラウザー側のJavaScriptは改行調整、モーダル、図や犬の操作を担当します。作品の個別ページも本文をHTMLに含め、読み込み後に画像の切り替えなどを追加します。

タイトル・説明文・canonical・構造化データは `scripts/seo.mjs`、トップページの本文出力は `scripts/render-content.mjs` で管理します。`sitemap.xml` と `robots.txt` はビルド時に生成します。サイトマップには公開する5ページだけを掲載し、最終更新日は `content/site.json` の値を使います。

Google Search Consoleでは `wakatsuki.app` のドメインプロパティを使用し、サイトマップは `https://portfolio.wakatsuki.app/sitemap.xml` を送信します。登録リクエストは検索掲載や順位を保証するものではありません。

## 使用素材

画像は表示用のWebPと拡大用の原本を分けています。ヘッダーの犬アイコンは132px、ファビコンは48pxです。研究図とEdu Insightも一覧では軽いプレビューを使い、「画像を大きく見る」では原本を開きます。

DM Sans・Noto Sans JP・Noto Serif JPは、使用する文字とウェイトを絞ったWOFF2を自サイトから配信します。書体は変更していません。本文やUIに新しい文字を追加した場合は、公開前に `node scripts/prepare-fonts.mjs` を実行してからビルドしてください。この準備コマンドだけはGoogle Fontsへの通信が必要です。通常のビルドと表示は外部フォント配信に依存しません。フォントのライセンスは `licenses/*-OFL.txt` を参照してください。

犬のイラストと動作はSVG・JavaScriptによるものです。`public/assets/dogs/` の8犬種を、`src/js/dog-art.js` と `dog-animator.js` で読み込んで動かし、`dog-companion.js` がボール遊び・追従・モーダルを制御します。同じページの遊び場と追従には同じ犬を使い、再読み込みでは前回と異なる犬を選びます。動きをオフにした場合と端末で動きを減らす設定の場合は静止画で表示します。文節の判定にはGoogle BudouX、GitHub・X・ZennのアイコンにはSimple Iconsを使用しています。ライセンスは `licenses/` を参照してください。制作物の画像・文章・デザインの権利はそれぞれの権利者に帰属します。
