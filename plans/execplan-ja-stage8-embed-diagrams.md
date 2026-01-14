# ExecPlan: JA – Stage 8（diagrams を本文に埋め込み、GitHub 上でも見える化する）


## 1. Metadata

- Plan ID: plans/execplan-ja-stage8-embed-diagrams.md
- Title: JA – Stage 8（diagrams を本文に埋め込み、GitHub 上でも見える化する）
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2026-01-15
- Last updated: 2026-01-15
- Related issues/PRs:
  - Issue #83（JA: diagrams を本文に埋め込み（参照だけでなく見える化））
  - PR #84（JA: embed diagrams into chapters）


## 2. Purpose and big picture

現状の本文は、図を `diagrams/` に置いたうえで「参照してください」と書くだけになっている箇所がある。
初心者にとっては「どこを見ればよいか」が不明瞭になりやすく、GitHub 上の閲覧でも図が表示されない。

この Stage では、既存の SVG 図を本文に Markdown 画像として埋め込み、最低限の「見える化」を達成する。


## 3. Context and orientation

対象:
- 読者: 初心者〜初級エンジニア（新卒〜実務2年未満）
- 対象バージョン: Proxmox VE 9.1（9.x 系）

前提:
- `manuscript/ja` は執筆のソースで、`docs/` と `build/ja/book.md` はビルド・同期で生成/更新される。
- 図へのリンクは、`manuscript/ja` では `../../../diagrams/...`、`docs/` 側では `../../diagrams/...` になる（同期の都合）。

対象ファイル（主）:
- `manuscript/ja/part0/env-setup.md`
- `manuscript/ja/part1/chapter1-overview.md`
- `manuscript/ja/part1/chapter2-architecture.md`
- `manuscript/ja/part1/chapter3-proxmox-install.md`
- `manuscript/ja/part1/chapter4-vm-basics.md`
- `manuscript/ja/part2/chapter5-storage.md`
- `manuscript/ja/part2/chapter6-network.md`
- `manuscript/ja/part3/chapter7-cluster-ha.md`
- `manuscript/ja/part3/chapter8-backup.md`
- `manuscript/ja/part4/chapter9-operations.md`
- `manuscript/ja/part4/chapter10-enterprise.md`

対象ファイル（生成物）:
- `docs/introduction/env-setup.md`
- `docs/chapters/chapter-01-overview.md`〜`docs/chapters/chapter-10-enterprise.md`
- `build/ja/book.md`


## 4. Constraints and assumptions

- 章構成（見出しの大規模変更）や主張は変えない。図の埋め込み + 最小の補足に限定する。
- 図（SVG/PNG）そのものは新規作成しない（既存の `diagrams/` の活用に絞る）。
- 画像の alt テキストは「何の図か」を短く表し、本文では 1〜2 行で「図を見る目的」を説明する。


## 5. Plan of work

- Phase 1: 既存図を本文へ埋め込み（`manuscript/ja`）
- Phase 2: 同期・ビルドで `docs/` と `build/ja/book.md` を更新
- Phase 3: `make check-ja` で整合性を確認し、PR を作成して Issue を閉じる


## 6. Concrete steps

### 6.1 図の埋め込み（`manuscript/ja`）

- [x] 各章の適切な箇所に Markdown 画像（`![...](../../../diagrams/...)`）を追加する
- [x] 画像の前後に「この図で何が分かるか」を 1〜2 行追記する（過剰に増やさない）

### 6.2 生成物の同期

- [x] `make check-ja` を実行し、`docs/` と `build/ja/book.md` を更新する

### 6.3 PR 化とマージ

- [x] 変更が過剰でないか（alt テキスト、配置）を確認する
- [x] `make check-ja` が差分ゼロで成功する状態にする（コミット後に再実行）
- [x] Issue #83 を Fixes する PR を作成し、マージする


## 7. Validation and acceptance

- [x] 対象章で、図が「参照」ではなく本文に埋め込まれて表示される
- [x] `make check-ja` が成功し、差分ゼロ（`git diff` が空）である
- [x] PR がマージされ、Issue #83 がクローズされる


## 8. Progress

- [2026-01-15] Plan created (Issue #83).
- [2026-01-15] Embedded existing SVG diagrams into the Japanese manuscript chapters and refreshed generated docs via `make check-ja`.
- [2026-01-15] Confirmed `make check-ja` is clean (no diff), opened PR #84 (Fixes #83), and merged it.


## 9. Surprises & discoveries

- `manuscript/ja` と `docs/` で相対パスが異なるため、ソース側は `../../../diagrams/...` に統一し、生成側は同期で整合させるのが安全だった。


## 10. Decision log

- Decision: 図は「最初に登場する位置」付近に埋め込み、前後 1〜2 行で読む目的を添える。
- Reason: 初心者の迷子を減らしつつ、本文の密度を上げすぎないため。


## 11. Outcomes & retrospective

- Status: build-validated
- `diagrams/` に置いていた既存の SVG 図を、`manuscript/ja` の本文へ埋め込み（GitHub 上でも図が見える状態）にした。
- `make check-ja` を通し、`docs/` と `build/ja/book.md` へ同期できる状態を維持した。
- 次の改善点:
  - 図の「読み取りのコツ」（例: 何を見ればよいか）を、各章の学習ゴールに合わせて最小限だけ補強する
  - スクリーンショット反映（Issue #2 / #25）は、環境が整い次第まとめて対応する


## 12. Idempotence & recovery

- Markdown 追記と生成物更新が中心のため、基本的に繰り返し適用可能。
- `make check-ja` は生成物の差分を検出するため、途中で止まった場合は `git status` を確認し、差分をコミットしたうえで再実行する。
