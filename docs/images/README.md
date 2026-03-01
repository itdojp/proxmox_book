# images/（スクリーンショット）

このディレクトリには、本書で参照するスクリーンショット（画面キャプチャ）を配置します。

## 前提

- 対象バージョン: Proxmox VE 9.1（9.x）
- 取得対象は Issue #2（スクリーンショット取得タスクリスト）を正とする

## 共通ルール

- 形式: `png`
- UI 言語: 英語（メニュー名の一貫性を優先。本文は日本語で補足する）
- テーマ: Light（印刷・PDF での可読性を優先）
- 取得時の方針:
  - 重要領域にトリミングし、不要な UI（ブラウザタブ等）は極力写さない
  - 端末・コンソール出力は等幅で読めるサイズにする（必要なら拡大して撮る）
- マスク方針:
  - 実 IP / 実ホスト名 / メール / API トークン等は必ずマスク
  - 本文の例に合わせる（例: `pve1` / `192.168.10.11`）
- 命名規則:
  - 保存先: `images/part{N}/ch{M}/`
  - ファイル名: `{NN}-{slug}.png`
    - `NN`: 2 桁（章内の並び順）
    - `slug`: 英小文字の kebab-case（例: `boot-menu`）

## Web UI スクリーンショット（自動取得）

Web UI 由来の一部スクリーンショットは、CLI から自動取得できます（要: Proxmox VE 9.1 の実機/lab 環境）。

- ツール: `tools/pve-webui-screenshots/`
- 実行例:

      PVE_BASE_URL="https://192.168.10.11:8006" \
      PVE_USERNAME="root@pam" \
      PVE_PASSWORD_FILE="$HOME/.config/proxmox_book/pve_password" \
      PVE_INSECURE=1 \
      PVE_CAPTURE_EXTENDED=1 \
      make pve-webui-screenshots

取得対象（ファイル名/保存先パス）は Issue #2 と `tools/pve-webui-screenshots/README.md` を参照してください。

## 本文からの参照

章ファイル（`manuscript/ja/part*/`）からは `../../../images/...` で参照します（GitHub 上のプレビューを優先）。
`make build-ja` では `../../../images/` を `../../images/` に置換して、結合原稿（`build/ja/book.md`）側の参照が成立するようにします。
