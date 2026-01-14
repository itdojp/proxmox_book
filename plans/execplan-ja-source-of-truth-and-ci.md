# ExecPlan: JA Source of Truth + CI（原稿の正本化と品質ゲート）

## 1. Metadata

- Plan ID: plans/execplan-ja-source-of-truth-and-ci.md
- Title: JA Source of Truth + CI（原稿の正本化と品質ゲート）
- Author: AuthorExecAgent（with human reviewer）
- Date created: 2026-01-13
- Last updated: 2026-01-13
- Related issues/PRs: #38

## 2. Purpose and big picture

- 原稿の「正本（source of truth）」を明確化し、二重管理による差分発生を防ぐ。
- GitHub Actions で最低限の品質ゲートを追加し、レビューしやすい状態を保つ。

## 3. Context and orientation

現状は次のディレクトリが併存している。

- `manuscript/ja/` : `make build-ja` の入力（書籍本文の章ファイル）
- `docs/` : GitHub Pages 公開（Web 向けの章ファイル/導入ページ/レイアウト）

特に `docs/chapters/` と `manuscript/ja/part*/` は同内容を二重管理しており、同期漏れが起きやすい。

## 4. Constraints and assumptions

- 破壊的な大規模 rename/delete は行わない（縮退/廃止は別 ExecPlan で扱う）。
- 依存を増やしすぎない（CI はまず `make build-ja` と同期チェックを中心にする）。
- 本書の対象バージョン前提（UI/スクショ）は **Proxmox VE 9.1（9.x）**。

## 5. Plan of work

- Phase 1: 正本方針の決定（A案: `manuscript/ja/` を正本）
- Phase 2: `docs/` への同期手順の自動化（スクリプト + Makefile ターゲット）
- Phase 3: GitHub Actions で `make build-ja` と同期チェックを実行
- Phase 4: README / Issue を更新して運用ルールを固定

## 6. Concrete steps

- [x] 正本方針を Decision log に記録（A案を採用）
- [x] `tools/` に同期スクリプトを追加（`manuscript/ja/` → `docs/`）
- [x] Makefile に `sync-docs-ja` / `check-ja`（CI 用）を追加
- [x] GitHub Actions を追加（PR/Push で `make check-ja`）
- [x] README と `docs/index.md` の説明を更新
- [ ] Issue #38 を更新（チェックリスト反映）してクローズ

## 7. Validation and acceptance

- [x] `make build-ja` が成功する（`pandoc` 無しでも OK）
- [x] `make sync-docs-ja` を実行しても差分が意図どおりに収まる（再実行で差分が出ない）
- [ ] CI が PR で実行され、成功する
- [x] README に「正本」「同期」「ビルド」の手順が明記されている

## 8. Progress

- [2026-01-13] ExecPlan 作成（Issue #38 対応の作業計画を明文化）
- [2026-01-13] `tools/sync_docs_ja.py` を追加し、`manuscript/ja/` → `docs/`（chapters/introduction + images/diagrams）を同期可能にした。
- [2026-01-13] Makefile に `sync-docs-ja` / `check-ja` を追加し、ローカル/CI の確認手順を一本化した。
- [2026-01-13] GitHub Actions を追加し、PR で `make check-ja` が走るようにした。
- [2026-01-13] README と `docs/index.md` の説明を更新（正本の明確化、ライセンス参照の追加）。

## 9. Surprises & discoveries

- Web 公開側（`docs/`）で画像/図を参照するには、サイト配下に静的ファイルとして存在する必要がある。
  - 方針: `images/` / `diagrams/` を `docs/images/` / `docs/diagrams/` に同期して同梱する。

## 10. Decision log

- Decision: A案（`manuscript/ja/` を正本、`docs/` は派生物として同期）を採用する。
  - Reason: 既存の `make build-ja` / ExecPlan 群が `manuscript/ja/` を基準としており、変更コストが小さいため。

## 11. Outcomes & retrospective

- Status: build-validated（`make build-ja` / `make check-ja` 成功）
- Status: workflow-added（GitHub Actions での最低限のゲート追加）
- 成果:
  - 正本を `manuscript/ja/`（本文）+ `images/` + `diagrams/` に固定し、`docs/` は同期で生成/更新する運用へ移行した。
  - CI により「ビルド/同期漏れ」の見落としを防げるようになった。
- 今後の改善（次フェーズ候補）:
  - Jekyll build（`docs/`）の検証やリンクチェックを CI に追加する（依存/運用コストと相談）。
  - 英語版の正本/同期方針を同様に整理する（英語版を着手するタイミングで）。

## 12. Idempotence & recovery

- `make build-ja` / `make sync-docs-ja` は繰り返し実行できること（同じ入力なら同じ出力）。
- 途中で止まった場合は、`git status` を見て未コミット差分を確認し、再度 `make build-ja` と `make sync-docs-ja` を実行してから再開する。
