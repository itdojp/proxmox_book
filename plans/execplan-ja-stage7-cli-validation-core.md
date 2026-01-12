# ExecPlan: JA – Stage 7（第3〜5章/第9章の CLI 成功判定を補強してスクショ無しで進める）


## 1. Metadata

- Plan ID: plans/execplan-ja-stage7-cli-validation-core.md
- Title: JA – Stage 7（第3〜5章/第9章の CLI 成功判定を補強してスクショ無しで進める）
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2026-01-12
- Last updated: 2026-01-12
- Related issues/PRs:
  - Issue #2（スクリーンショット取得タスクリスト）


## 2. Purpose and big picture

Stage 6 で追加した「確認コマンド」の方針を、初心者が最初につまずきやすい章（インストール/VM/ストレージ/運用）にも広げる。

- スクリーンショットが無くても、CLI で最低限の成功判定ができる
- UI の位置/文言が変わっても、切り分けの入口を失わない


## 3. Context and orientation

対象:
- 読者: 初心者〜初級エンジニア（新卒〜実務2年未満）
- 対象バージョン: Proxmox VE 9.1（9.x 系）

対象ファイル:
- `manuscript/ja/part1/chapter3-proxmox-install.md`
- `manuscript/ja/part1/chapter4-vm-basics.md`
- `manuscript/ja/part2/chapter5-storage.md`
- `manuscript/ja/part4/chapter9-operations.md`
- `docs/chapters/chapter-03-proxmox-install.md`
- `docs/chapters/chapter-04-vm-basics.md`
- `docs/chapters/chapter-05-storage.md`
- `docs/chapters/chapter-09-operations.md`
- `build/ja/book.md`


## 4. Constraints and assumptions

- 「危険性が低い確認系」のコマンドを中心にする。
- 章の主張や構成は変えない（最小の追記で補強する）。
- UI の手順はスクショ反映時に精密化する（この Stage では増やしすぎない）。


## 5. Plan of work

- Phase 1: 章ごとに「成功判定（最低限）→ CLI の確認入口」を設計する
- Phase 2: `manuscript/ja` と `docs/chapters` を同内容で更新する
- Phase 3: `make build-ja` を実行し、結合原稿を更新する
- Phase 4: ExecPlan の Progress / Outcomes を更新する


## 6. Concrete steps

### 6.1 第3章（インストール）

- [x] インストール後の最小確認（例: `pveversion -v` / `ip -br a` / `ss -lntp | grep ':8006'`）を追記する
- [x] `docs/chapters/chapter-03-proxmox-install.md` に同期する

### 6.2 第4章（VM 基本操作）

- [x] ISO が見える/VM が存在する/起動している、を CLI で確認する入口（例: `pvesm list local --content iso` / `qm list` / `qm status <VMID>`）を追記する
- [x] `docs/chapters/chapter-04-vm-basics.md` に同期する

### 6.3 第5章（ストレージ）

- [x] ストレージ状態の確認入口（例: `pvesm status`）と、ZFS/LVM を使っている場合の確認コマンド（例: `zpool status` / `lvs`）を追記する
- [x] `docs/chapters/chapter-05-storage.md` に同期する

### 6.4 第9章（運用）

- [x] 更新系の「確認」コマンド（例: `pveversion -v`、`apt update` の位置づけ）と、ログ確認の入口を追記する
- [x] `docs/chapters/chapter-09-operations.md` に同期する

### 6.5 ビルドと整合

- [x] `make build-ja` を実行し、`build/ja/book.md` を更新する
- [x] 対象章で `manuscript/ja` と `docs/chapters` が同一本文であることを確認する

### 6.6 ExecPlan 更新

- [x] 本 ExecPlan の `Progress` と `Outcomes & retrospective` を更新する


## 7. Validation and acceptance

- [x] 第3〜5章/第9章に「CLI の確認入口」が追加されている
- [x] `make build-ja` が成功し、`build/ja/book.md` が更新されている
- [x] 対象章で `manuscript/ja` と `docs/chapters` が同一本文である


## 8. Progress

- [2026-01-12] Plan created.
- [2026-01-12] Added CLI verification entry points to Chapter 3/4/5/9 and synced the corresponding `docs/chapters/*` files.
- [2026-01-12] Ran `make build-ja` successfully and refreshed `build/ja/book.md`. Verified the updated chapters are identical between `manuscript/ja` and `docs/chapters`.


## 9. Surprises & discoveries

- 読者向け本文では `rg` のような追加コマンドを前提にせず、OS 標準の `grep` を使う方が安全だった。


## 10. Decision log

- Decision: コマンドは「成功判定/切り分けの入口」に限定し、詳細手順はスクショ反映時に補完する。
- Reason: UI 変更への耐性を上げつつ、本文の肥大化を避けるため。


## 11. Outcomes & retrospective

- Status: build-validated
- 第3〜5章/第9章に「スクショ無しでも成功判定できる」最小 CLI 確認を追記し、詰まりポイントの切り分けがしやすくなった。
- 次の改善点:
  - 実機（9.1）での画面遷移確認とスクリーンショット反映（Issue #2）
  - CLI セクションを「典型例: local 以外のストレージ」などにも広げる（必要なら）


## 12. Idempotence & recovery

- Markdown 追記が中心のため繰り返し適用可能。
- `make build-ja` は生成物更新のみ。
