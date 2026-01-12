# ExecPlan: JA Stage5 – インストールメディアと章内リンクの整備（PVE 9.1 / テキスト中心）

## 1. Metadata

- Plan ID: plans/execplan-ja-stage5-install-media-and-links.md
- Title: JA Stage5 – インストールメディアと章内リンクの整備（PVE 9.1 / テキスト中心）
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2026-01-11
- Last updated: 2026-01-11

## 2. Purpose and big picture

初心者が第3章でつまずきやすい「どこから ISO を入手して、どうやってインストールメディアを作るか」を、本文内で最小限フォローする。
併せて、結合原稿（`build/ja/book.md`）で壊れやすい “章ファイル前提の相対リンク” を避け、参照の一貫性を上げる。

## 3. Context and orientation

- 想定読者: 初心者〜初級エンジニア（新卒〜実務経験2年未満）
- 対象バージョン: Proxmox VE 9.1（9.x 系）
- 方針:
  - 推測で断定しない（OS/ツール差はあるため「例」として提示する）。
  - URL は公式ダウンロード案内への誘導に留め、特定環境に依存しすぎない。
  - `docs/chapters/*` は `manuscript/ja` と同一内容に同期する。

対象ファイル:
- `manuscript/ja/part0/preface.md`
- `manuscript/ja/part1/chapter3-proxmox-install.md`
- `docs/chapters/chapter-03-proxmox-install.md`
- `build/ja/book.md`（`make build-ja`）

## 4. Constraints and assumptions

- 章構成（Part/Chapter の分割・統合・番号変更）はしない。
- スクリーンショットは後回し（Issue 管理に集約）。

## 5. Plan of work

- Phase 1: Preface の章内リンクを “ファイル参照” から “章参照” に変更
- Phase 2: Chapter 3 に「ISO 入手とインストールメディア作成」の最小手順を追記
- Phase 3: `make build-ja` と docs 同期、ExecPlan 更新

## 6. Concrete steps

- [x] Preface の末尾を、章ファイルへの相対リンクではなく章参照の文章にする
- [x] Chapter 3 に「ISO 入手 / チェックサム確認 / USB 書き込み」の最小案内を追記する
- [x] `make build-ja` を実行して `build/ja/book.md` を更新する
- [x] `docs/chapters/chapter-03-proxmox-install.md` を `manuscript/ja` と同一内容に同期する
- [x] Progress / Outcomes を更新する

## 7. Validation and acceptance

- [x] 第3章に「ISO をどこから入手して何をすればよいか」が書かれている（完全手順ではなく、迷わない最小ガイド）
- [x] 結合原稿で壊れやすい章ファイルリンクが残っていない
- [x] `make build-ja` が成功する
- [x] `docs/chapters/chapter-03-proxmox-install.md` と `manuscript/ja/part1/chapter3-proxmox-install.md` が一致している

## 8. Progress

- [2026-01-11] Plan created.
- [2026-01-11] Updated Preface to avoid file-based chapter links (safer for the combined manuscript).
- [2026-01-11] Added minimal ISO download/checksum/USB writing guidance to Chapter 3.
- [2026-01-11] Ran `make build-ja` and confirmed Chapter 3 is synced to `docs/chapters/`.

## 9. Outcomes & retrospective

- Status: text-draft（つまずきやすい入口の補強）
- Status: build-validated（`make build-ja` は成功）
- 変更点:
  - Preface: 次章誘導をリンクではなく章参照に変更し、結合原稿でも破綻しにくくした。
  - Chapter 3: ISO 入手〜USB 書き込みの最小ガイドを追記し、インストール開始前の迷いを減らした。
