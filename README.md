# NYANMUSUBI

猫の里親情報をスクレイピングするアプリケーションです。
ポートフォリオとして制作中です。

スクレイピング先は以下の 2 サイト。

- ネコジルシ
- ぺっとのおうち

## 技術スタック

- React
- GraphQL
- Firebase(予定)

## ディレクトリ構成

Yarn の workspace 機能を使って monorepo 化しています。
`src/backend` ... Graphpack を使った GraphQL の API サーバー
`src/frontend` ... React・Firebase を使ったフロントエンド

## メモ

Graphpack は子ワークスペースで管理しないとエラーが起きて起動できない。
workspace の root の package.json の`nohoist`に指定する必要がある。

```json
{
  "workspaces": {
    "packages": ["src/*"],
    "nohoist": ["**/graphpack", "**/graphpack/**"]
  }
}
```
