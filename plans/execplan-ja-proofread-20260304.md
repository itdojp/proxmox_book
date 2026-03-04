# ExecPlan: JA 全章 校正・リライト（2026-03-04）

## 1. Metadata

- Plan ID: plans/execplan-ja-proofread-20260304.md
- Title: JA 全章 校正・リライト（誤字脱字/表記ゆれ/論理/章間整合/実務適用性）
- Author: AuthorExecAgent
- Date created: 2026-03-04
- Last updated: 2026-03-04
- Scope: `manuscript/ja/**`（正本）を校正し、`docs/**` は同期スクリプトで更新する
- Target version: Proxmox VE 9.1（9.x 系）
- Constraints:
  - 推測で断定しない。不明は「要確認」と明示する
  - 見出し番号/アンカー/公開 URL 互換性を不用意に壊さない
  - 自動生成物を手修正しない（`docs/**` は `tools/sync_docs_ja.py` で生成・同期）
  - `git add -A` は使用しない（ファイル指定で add）
- Related: `.agent/PLANS.md`, `STYLEGUIDE.md`, `POLICY.md`

## 5. Plan of work

- Phase 1: 現状把握（正本/公開物の関係、検証手順の確認）
- Phase 2: 全章の精読校正（誤字脱字、表記ゆれ、論理展開、章間整合）
- Phase 3: 実務適用性の補強（前提/対象バージョン/運用注意点、危険操作の抑制）
- Phase 4: `docs/` 同期とリンク/構造/ビルド検証
- Phase 5: コミット分割（レビュー容易性）→ push → PR 作成

## 6. Concrete steps

- [x] リポジトリ構造の確認（正本の特定、生成物の扱い）
- [x] `manuscript/ja/` を全章精読し、章ごとに校正・リライト（見出しの互換性維持）
- [x] 章間参照・内部リンク・画像参照の整合確認
- [ ] `make build-ja` → `make sync-docs-ja` → `make check-ja` を実行（`check-ja` はコミット後に再実行して差分ゼロを確認）
- [x] Book QA 相当（pinned book-formatter）: unicode/textlint/links/layout-risk/structure を実行
- [ ] Jekyll build（GitHub Pages 互換）を実行（要確認: ローカル実行の前提/手順）
- [ ] ブランチ `qa/proofread-20260304` でコミット→ push → PR 作成

## 7. Validation and acceptance

- [ ] `make check-ja` が成功する（`build-ja` + `sync-docs-ja` 後に差分なし）
- [x] Book QA 相当のチェックが成功する
- [ ] PR には変更ファイル、主要改善点、断定更新しなかった箇所と理由、手動確認点、検証結果を記載する

## 8. Progress

- [2026-03-04] Plan created.
- [2026-03-04] `manuscript/ja/**` を校正（表記ゆれ/文体/安全注意の明確化）。`make build-ja` / `make sync-docs-ja` 実行。book-formatter（unicode/textlint/links/layout-risk/structure）実行。
