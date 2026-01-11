# ExecPlan: JA Stage4 – UI 手順の最小補強（スクリーンショット無し / PVE 9.1）

## 1. Metadata

- Plan ID: plans/execplan-ja-stage4-ui-text-without-screenshots.md
- Title: JA Stage4 – UI 手順の最小補強（スクリーンショット無し / PVE 9.1）
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2026-01-11
- Last updated: 2026-01-11
- Related issues/PRs:
  - Issue #2（スクリーンショット取得タスクリスト）
  - plans/execplan-ja-pve9.1-alignment.md（実機検証・スクショ・本文反映）

## 2. Purpose and big picture

スクリーンショットが未整備でも、初心者が該当機能を “試せる” レベルまで本文を具体化する。
特に UI 操作の入口が分からず止まりやすい以下を、テキストで補強する。

- ネットワーク設定の適用（変更が反映されない / 適用が怖い）
- クラスタ作成・参加（どこから始めるか分からない）
- バックアップジョブ作成・手動実行・リストア（どこにメニューがあるか分からない）

## 3. Context and orientation

- 想定読者: 初心者〜初級エンジニア（新卒〜実務経験2年未満）
- 対象バージョン: Proxmox VE 9.1（9.x 系）
- 方針:
  - UI ラベルは変わり得るため、本文は「入口（Datacenter/Node）」「タブ名」「成功判定」を重視して書く。
  - スクリーンショットは Issue #2 で後追いする（本文に課題管理情報を出さない）。

対象ファイル:
- `manuscript/ja/part2/chapter6-network.md`
- `manuscript/ja/part3/chapter7-cluster-ha.md`
- `manuscript/ja/part3/chapter8-backup.md`
- `build/ja/book.md`（`make build-ja` で更新）
- `docs/chapters/`（`manuscript/ja` と同一内容に同期）

## 4. Constraints and assumptions

- 推測で断定しない。Proxmox VE 公式ドキュメントで確認できる UI パスのみ “例” として書く。
- ネットワーク設定は誤るとノードへ入れなくなるため、必ず「安全策（コンソール確保）」を併記する。

## 5. Plan of work

- Phase 1: Chapter 6（ネットワーク変更の適用と安全策）
- Phase 2: Chapter 7（クラスタ作成/参加の UI 上の入口）
- Phase 3: Chapter 8（バックアップジョブ/リストアの UI 上の入口）
- Phase 4: `make build-ja` と docs 同期、ExecPlan 更新

## 6. Concrete steps

- [x] Chapter 6 に「ネットワーク変更の反映（`/etc/network/interfaces.new` と適用）」と「安全策」を追記する
- [x] Chapter 7 に「Datacenter → Cluster を起点にした作成/参加（概要）」を追記する
- [x] Chapter 8 に「Datacenter → Backup を起点にしたジョブ作成/実行」「リストアの入口（概要）」を追記する
- [x] `make build-ja` を実行して `build/ja/book.md` を更新する
- [x] `docs/chapters/*` を `manuscript/ja` と同一内容に同期する（差分が出ないこと）
- [x] Progress / Decision log / Outcomes を更新する

## 7. Validation and acceptance

- [x] Chapter 6: ネットワーク変更を “適用して反映する” までの入口と安全策が本文だけで分かる
- [x] Chapter 7: クラスタ作成/参加の入口（Datacenter → Cluster）が本文だけで分かる
- [x] Chapter 8: バックアップジョブ作成/実行とリストアの入口が本文だけで分かる
- [x] `make build-ja` が成功する
- [x] `docs/chapters/*` と `manuscript/ja` の差分が無い

## 8. Progress

- [2026-01-11] Plan created.
- [2026-01-11] Chapter 6: Added notes on applying network config changes safely (`/etc/network/interfaces.new`, Apply button, and recovery mindset).
- [2026-01-11] Chapter 7: Added a minimal Web UI entry point for cluster create/join (Datacenter → Cluster) with a simple success criterion.
- [2026-01-11] Chapter 8: Added minimal Web UI entry points for backup jobs (Datacenter → Backup) and restore (storage Backups tab).
- [2026-01-11] Ran `make build-ja` and confirmed `docs/chapters/*` matches `manuscript/ja` (no diffs).

## 9. Surprises & discoveries

- [placeholder]

## 10. Decision log

- Decision: UI 手順は “入口（どこから始めるか）” と “成功判定” を優先し、詳細なクリック手順はスクリーンショット整備後に引き上げる。
- Decision: ネットワークは誤設定のリスクが高いため、手順より先に「安全策（コンソール確保）」を明示する。

## 11. Outcomes & retrospective

- Status: text-draft（UI の入口を最小補強）
- Status: build-validated（`make build-ja` は成功）
- 更新内容（要点）:
  - Chapter 6: ネットワーク変更の反映（`/etc/network/interfaces.new` と適用）と安全策を追記した。
  - Chapter 7: クラスタ作成/参加の入口（Datacenter → Cluster）を追記した。
  - Chapter 8: バックアップジョブ作成（Datacenter → Backup）とリストア入口（ストレージ Backups タブ）を追記した。
- 次の改善候補:
  - 実機スクリーンショット整備（Issue #2）に合わせて、UI 手順を “1クリックずつ” の粒度に引き上げる。

## 12. Idempotence & recovery

- 本 ExecPlan の変更は追記・整形が中心であり、基本的に安全に繰り返し実行できる。
- 途中で止まった場合は `Progress` の最終行から再開する。
