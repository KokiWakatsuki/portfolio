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

## 使用素材

犬のイラストと動作はSVG・JavaScriptによるものです。文節の判定にはGoogle BudouX、GitHub・X・ZennのアイコンにはSimple Iconsを使用しています。ライセンスは `licenses/` を参照してください。制作物の画像・文章・デザインの権利はそれぞれの権利者に帰属します。
