# 自治体DX課題診断 v0.1

自治体業務で感じている課題を選ぶと、DX改善の優先度・優先領域・おすすめ施策を表示するWebアプリです。

## 主な機能

- 8つの質問から当てはまる課題を複数選択
- 課題の重要度に応じた「DX改善優先度」を100点満点で算出
- 「業務プロセス」「データ活用・共有」「住民サービス」「情報発信」の4領域を分析
- 優先度の高い領域と具体的な改善施策を表示
- スマートフォン・タブレット・PCに対応

## 使用技術

- React
- Vite
- JavaScript
- CSS
- GitHub Actions / GitHub Pages

## ローカルで動かす

Node.js 22とpnpmを用意して、次を実行します。

```bash
pnpm install
pnpm dev
```

表示されたURLをブラウザで開くと確認できます。

## ビルド

```bash
pnpm build
pnpm preview
```

## 公開方法

`main`ブランチへ変更を送ると、GitHub Actionsが自動でビルドし、GitHub Pagesへ公開します。

初回のみ、GitHubリポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択してください。

## 診断スコアについて

各質問に設定した重要度を合計し、改善の優先度として表示しています。このツールは現状整理のきっかけをつくる簡易診断であり、自治体の正式な評価や監査を目的とするものではありません。

