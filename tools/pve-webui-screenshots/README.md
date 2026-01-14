# Proxmox VE Web UI スクリーンショット取得（自動化）

本ツールは、Proxmox VE 9.1 の Web UI から、本書向けのスクリーンショット（Issue #2 の項目）をヘッドレスで取得するための補助スクリプトです。

## 重要（先に確認）

- **機微情報（実 IP / 実ホスト名 / メール / トークンなど）を写さない**こと。
  - 可能なら、撮影用ラボのホスト名・IP を本文の例（例: `pve1` / `192.168.10.11`）に寄せてください。
- 自動化は UI 変更に弱いため、最初は **少数の画面から** 動作確認することを推奨します。
- 本ツールは **Proxmox の実機環境**（Web UI に到達できること）が必要です。

スクリーンショットの共通ルールは `images/README.md` を参照してください。

## 事前準備

Node.js が必要です（このリポジトリの作業環境では Node 22 を想定）。

依存関係の導入:

    npm --prefix tools/pve-webui-screenshots install

## 使い方

環境変数を指定して実行します。

必須:
- `PVE_BASE_URL` 例: `https://192.168.10.11:8006`
- `PVE_USERNAME` 例: `root@pam`
- `PVE_PASSWORD`（値はシェル履歴等に残さない運用を推奨）
  - 代替: `PVE_PASSWORD_FILE`（パスワードだけ入ったファイルのパス）

任意:
- `PVE_INSECURE=1` 自己署名証明書を許容（学習環境向け）
- `PVE_CAPTURE_CH4=1` 第4章の「Create VM wizard」スクショも取得する
- `PVE_CAPTURE_EXTENDED=1` 追加の安全な画面（ch5/ch6/ch7/ch8）も取得する

実行例:

    PVE_BASE_URL="https://192.168.10.11:8006" \\
    PVE_USERNAME="root@pam" \\
    PVE_PASSWORD="***" \\
    PVE_INSECURE=1 \\
    node tools/pve-webui-screenshots/capture.mjs

`PVE_PASSWORD_FILE` を使う例（シェル履歴にパスワードを残さない）:

    export PVE_PASSWORD_FILE="$HOME/.config/proxmox_book/pve_password"
    export PVE_BASE_URL="https://192.168.10.11:8006"
    export PVE_USERNAME="root@pam"
    export PVE_INSECURE=1
    node tools/pve-webui-screenshots/capture.mjs

出力先:
- `images/part*/ch*/`（Issue #2 のパス）

## トラブルシュート

- `PVE_INSECURE=1` を付けても TLS エラーになる場合:
  - まずブラウザで同じ URL にアクセスできるか確認してください。
- ログイン後に画面が表示されない / クリックに失敗する:
  - UI 変更や環境差分でセレクタが合っていない可能性があります。該当ログを添えて相談してください。
