# ExecPlan: JA Stage3 – 初心者の「詰まりポイント」解消（テキスト中心 / PVE 9.1）

## 1. Metadata

- Plan ID: plans/execplan-ja-stage3-beginner-unblockers.md
- Title: JA Stage3 – 初心者の「詰まりポイント」解消（テキスト中心 / PVE 9.1）
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2026-01-11
- Last updated: 2026-01-11
- Related issues/PRs:
  - Issue #2（スクリーンショット取得タスクリスト）
  - Issue #25（Web UI スクリーンショット取得手順）

## 2. Purpose and big picture

本書（日本語版）の初学者〜初級者が、スクリーンショット無しでもハンズオンを進められるように、
序盤で「次に何を押せばよいか」「どこで詰まりやすいか」が明確になるよう最小限の追記・整形を行う。

特に、次の “止まりやすい点” を解消する。

- 初回 Web UI ログイン時のユーザー名（例: `root@pam`）が分からない
- ISO をどこに置けばよいか（Web UI 上でのアップロード先）が分からない
- デフォルトで作られるストレージ（例: `local` / `local-lvm`）と、置けるもの（ISO/ディスク/バックアップ）の関係が分からない
- 更新（リポジトリ/サブスクリプション）周りの前提がなく、運用章に着地しない

## 3. Context and orientation

- 想定読者: 初心者〜初級エンジニア（新卒〜実務経験2年未満）
- 対象バージョン: Proxmox VE 9.1（9.x 系）
- 方針: スクリーンショットは後回し（Issue #2/#25 に集約）。本文はスクリーンショットに依存しない。

対象ファイル:
- `manuscript/ja/part1/chapter3-proxmox-install.md`
- `manuscript/ja/part1/chapter4-vm-basics.md`
- `manuscript/ja/part2/chapter5-storage.md`
- `manuscript/ja/part4/chapter9-operations.md`
- `build/ja/book.md`（`make build-ja` で更新）
- `docs/chapters/`（`manuscript/ja` と同一内容に同期）

## 4. Constraints and assumptions

- 推測で断定しない。UI の細部が変わり得る箇所は「読み替え」「目印（タブ名/概念）」で誘導する。
- ただし、Proxmox VE 公式ドキュメントで確認できる事項（例: `root@pam`、リポジトリ種別、レプリケーション前提など）は明示してよい。
- GitHub Issue 番号などの「執筆管理情報」は、原則として読者向け本文に出さない（必要なら `plans/` や `images/README.md` に寄せる）。
- 章構成（Part/Chapter の分割・統合・番号変更）は行わない。

## 5. Plan of work

- Phase 1: “詰まりポイント” の追記方針を確定（どこに何を足すか）
- Phase 2: Chapter 3（初回ログイン/成功判定の具体化）
- Phase 3: Chapter 4（ISO 配置〜VM 作成の前提整備）
- Phase 4: Chapter 5（`local` / `local-lvm` を例にした「ストレージ=置き場」説明の補強）
- Phase 5: Chapter 9（更新/リポジトリ/メンテ方針の最小追記）
- Phase 6: `make build-ja` と docs 同期、ExecPlan 更新

## 6. Concrete steps

- [x] Chapter 3 に「初回ログイン（ユーザー名/realm の考え方）」を追記する（例: `root@pam` を明示）
- [x] Chapter 4 に「ISO をアップロードして選べる状態にする」を追記する（ストレージの Content / ISO images を説明）
- [x] Chapter 4 のスクリーンショット前提の文言を、スクリーンショット無しでも読める書き方に整える
- [x] Chapter 5 に「デフォルトストレージ（`local` / `local-lvm`）の役割分担」の短い補足を追加する（インストール方式で差分がある旨も明記）
- [x] Chapter 9 に「更新の基本（リポジトリ種別、実施前の確認、ロールバックできる前提づくり）」を最小追記する
- [x] `make build-ja` を実行して `build/ja/book.md` を更新する
- [x] `docs/chapters/*` を `manuscript/ja` と同一内容に同期する（差分が出ないこと）
- [x] Progress / Decision log / Outcomes を更新する

## 7. Validation and acceptance

- [x] Chapter 3: 初回 Web UI ログインで「何を入力すればよいか」が本文だけで分かる（`root@pam` など）
- [x] Chapter 4: ISO を用意→Proxmox 側に配置→VM 作成ウィザードで ISO を選ぶ、が本文だけで追える
- [x] Chapter 5: “ストレージ = 置き場” の概念が、具体例（`local` / `local-lvm`）で腹落ちする
- [x] Chapter 9: 更新の前提（サブスクリプション/リポジトリ/注意点）が最低限わかる
- [x] `make build-ja` が成功する
- [x] `docs/chapters/*` と `manuscript/ja` の差分が無い

## 8. Progress

- [2026-01-11] Plan created.
- [2026-01-11] Added initial Web UI login notes (`root@pam`) to Chapter 3.
- [2026-01-11] Added ISO upload guidance to Chapter 4 and adjusted wording to not depend on screenshots.
- [2026-01-11] Added a short “default storages (local/local-lvm)” explanation to Chapter 5.
- [2026-01-11] Added a minimal “updates + repositories” section to Chapter 9.
- [2026-01-11] Ran `make build-ja` and confirmed `docs/chapters/*` matches `manuscript/ja` (no diffs).

## 9. Surprises & discoveries

- [placeholder]

## 10. Decision log

- Decision: 初学者が詰まりやすい “次に何をすればよいか分からない点” は、スクリーンショット無しでも進められるレベルまで本文側で補う。
- Decision: GitHub Issue 番号などの執筆管理情報は本文に出さず、課題管理は Issues / `plans/` / `images/README.md` に寄せる。

## 11. Outcomes & retrospective

- Status: text-draft（初学者向けの詰まりポイントをテキストで補強）
- Status: build-validated（`make build-ja` は成功）
- 更新内容（要点）:
  - Chapter 3: 初回ログイン（`root@pam`）の説明を追加し、ログインで迷いにくくした。
  - Chapter 4: ISO のアップロード手順を追加し、VM 作成までの前提を明確化した（スクショ無し前提の文言に調整）。
  - Chapter 5: `local` / `local-lvm` を例に “ストレージ=置き場” のイメージを補強した。
  - Chapter 9: リポジトリと更新の最小前提（ラボ/本番の違い、更新前チェック）を追加した。
- 次の改善候補:
  - Web UI の実機スクリーンショット取得（Issue #2/#25）と、UI 手順の粒度の引き上げ（完全再現できるレベルまで）。

## 12. Idempotence & recovery

- 本 ExecPlan の変更は追記・整形が中心であり、基本的に安全に繰り返し実行できる。
- 途中で止まった場合は `Progress` の最終行から再開する。
