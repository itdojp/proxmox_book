# ExecPlan: JA – Stage 6（スクショ無しで進めるための CLI 確認手順 + 9.1 追従の堅牢化）


## 1. Metadata

- Plan ID: plans/execplan-ja-stage6-cli-validation.md
- Title: JA – Stage 6（スクショ無しで進めるための CLI 確認手順 + 9.1 追従の堅牢化）
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2026-01-12
- Last updated: 2026-01-12
- Related issues/PRs:
  - Issue #2（スクリーンショット取得タスクリスト）
  - Issue #25（Web UI スクリーンショット取得手順 / 自動化）


## 2. Purpose and big picture

スクリーンショットが未整備でも、初心者が手を止めずに検証を進められるように、
各章に **最小限の CLI 確認コマンド**（成功判定と切り分けの入口）を追加する。

同時に、Proxmox VE 9.1（9.x）前提の記述のうち「マイナーアップデートで揺れやすい箇所」を整理し、
本文の断定を弱める/確認方法を添えることで、読者の環境差に耐える文章へ寄せる。


## 3. Context and orientation

対象:
- 読者: 初心者〜初級エンジニア（新卒〜実務2年未満）
- 対象バージョン: Proxmox VE 9.1（9.x 系）
- 目的: スクショ無しでも「成功判定」「最低限の復旧/切り分け」ができる本文にする

対象ファイル:
- `manuscript/ja/part0/env-setup.md`（対象バージョンの説明の堅牢化）
- `manuscript/ja/part2/chapter6-network.md`（ネットワーク変更の確認コマンド）
- `manuscript/ja/part3/chapter7-cluster-ha.md`（クラスタ/HA の確認コマンド）
- `manuscript/ja/part3/chapter8-backup.md`（バックアップ/リストアの確認コマンド）
- `docs/introduction/env-setup.md`（本文との同期）
- `docs/chapters/*`（本文との同期）
- `build/ja/book.md`（結合原稿の更新）

参照（根拠の確認に利用）:
- Proxmox VE Downloads（最新 ISO と更新日）
- Proxmox 公式フォーラム（カーネル更新に伴う互換性注意点の背景）
- Proxmox VE Admin Guide（各 CLI の位置づけ、用語）


## 4. Constraints and assumptions

- 推測で断定しない。UI の細部は「入口（Datacenter/Node）」「タブ名」「成功判定」で誘導する。
- 本文に Issue 番号や執筆管理の都合を持ち込まない（ExecPlan / Issue / README に集約）。
- コマンドは「読者が実行しても危険性が低い確認系」を中心にする。
  - 破壊的な操作（例: `pvecm delnode`、`ha-manager` の強制操作、`apt full-upgrade`）は原則として本文に入れない。
- スクリーンショットはこの Stage では扱わない（Issue #2 / #25 に寄せる）。


## 5. Plan of work

- Phase 1: 9.1 の「揺れやすい点（カーネル/UI）」の表現を点検し、本文の断定を調整する
- Phase 2: 章ごとの CLI 確認セクションを設計し、読者が迷う箇所に最小限で差し込む
- Phase 3: `docs/` と `manuscript/` の同期を維持し、`make build-ja` を通す
- Phase 4: ExecPlan/Progress/Outcomes の更新と、次ステージ（スクショ反映）に繋がる TODO を残す


## 6. Concrete steps

### 6.1 バージョン記述の堅牢化（Part 0）

- [x] `manuscript/ja/part0/env-setup.md` の「標準カーネルは 6.17 系」の断定を弱め、確認方法（`pveversion -v` / `uname -r`）を追加する
- [x] `docs/introduction/env-setup.md` に同内容を同期する

### 6.2 ネットワーク（第6章）

- [x] `chapter6-network.md` に「確認コマンド（例: `ip -br a` / `ip r` / `bridge link`）」と「戻し方の入口」を追記する
- [x] `docs/chapters/chapter-06-network.md` に同内容を同期する

### 6.3 クラスタ/HA（第7章）

- [x] `chapter7-cluster-ha.md` に、UI 成功判定に対応する CLI（例: `pvecm status` / `pvecm nodes`）を追記する
- [x] HA について、最低限の状態確認（例: `ha-manager status`）を追記する
- [x] `docs/chapters/chapter-07-cluster-ha.md` に同内容を同期する

### 6.4 バックアップ（第8章）

- [x] `chapter8-backup.md` に、ジョブ/ログの確認入口（例: `/var/log/vzdump/`、タスクログの見方）を追記する
- [x] `docs/chapters/chapter-08-backup.md` に同内容を同期する

### 6.5 ビルドと整合

- [x] `make build-ja` を実行し、`build/ja/book.md` を更新する
- [x] `manuscript/ja` と `docs/chapters` の差分が意図せず発生していないことを確認する

### 6.6 ExecPlan 更新

- [x] 本 ExecPlan の `Progress` に実施内容を記録する
- [x] 本 ExecPlan の `Outcomes & retrospective` に達成内容と次の改善点（例: スクショ反映、実機検証）を残す


## 7. Validation and acceptance

- [x] Part 0 / 第6章 / 第7章 / 第8章に「確認コマンド」または「成功判定の CLI 入口」が追加されている
- [x] 9.1 前提の記述で断定が強すぎる箇所は、確認方法（コマンド）か「要確認」が付いている
- [x] `make build-ja` が成功し、`build/ja/book.md` が更新されている
- [x] `docs/chapters/*` は対応する `manuscript/ja/*` と実質同一の本文を維持している


## 8. Progress

- [2026-01-12] Plan created.
- [2026-01-12] Updated Part 0 env-setup to avoid hard-coding a single “default kernel” version and added `pveversion -v` / `uname -r` as the reader-facing verification entry points.
- [2026-01-12] Added CLI verification sections to Chapter 6/7/8 (network, cluster/HA, backup) and kept `docs/` in sync with `manuscript/ja/`.
- [2026-01-12] Ran `make build-ja` successfully and refreshed `build/ja/book.md`. Confirmed the updated chapters are identical between `manuscript/ja` and `docs/chapters`.


## 9. Surprises & discoveries

- カーネル/UI の差分はマイナー更新でも発生しやすいため、本文は「断定」より「確認方法（コマンド）」を添える方が安全だった。


## 10. Decision log

- Decision: スクリーンショットが無い段階では、UI のクリック手順を増やしすぎず、CLI の確認コマンドで「成功判定」を補強する。
- Reason: UI の微差で初心者が迷うリスクを下げ、スクショ反映後に手順を精密化できるようにするため。


## 11. Outcomes & retrospective

- Status: build-validated
- Part 0 / 第6章 / 第7章 / 第8章に、スクリーンショット無しでも進めるための CLI 確認コマンド（成功判定と切り分けの入口）を追加した。
- 9.1（9.x）前提のうち、カーネル/UI の差分が出やすい箇所は「確認方法」で誘導する形に寄せた。
- 次の改善点:
  - スクリーンショット反映（Issue #2）で UI のクリック手順を精密化する
  - 実機（9.1）での確認を進め、必要なら各章 ExecPlan に `Status: live-validated` を付与する


## 12. Idempotence & recovery

- 本 ExecPlan の変更は、いずれも Markdown 追記が中心で安全に繰り返し適用できる。
- `make build-ja` は繰り返し実行可能（`build/ja/book.md` は生成物）。
