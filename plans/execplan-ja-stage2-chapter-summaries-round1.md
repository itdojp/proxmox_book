# ExecPlan: Stage2 章末まとめ（Round 1）

## Purpose and big picture（目的・ゴールの全体像）
- 目的: Stage2 の要件（各章が「導入 → 本論 → まとめ」の流れを持つ）を満たすため、章末に「まとめ」を追加して学習の着地点を明確化する。
- ゴール: 第1章・第3章〜第9章に `## まとめ` を追加し、読者が「この章で持ち帰る要点」と「次に読む章」を判断しやすい状態にする。

## Context and orientation（読者像・前提・対象ファイル）
- 想定読者: `manuscript/ja/part0/preface.md` に準拠（インフラエンジニア、SI、移行/並行運用を検討する技術リーダー等）
- 対象:
  - `manuscript/ja/part1/chapter1-overview.md`
  - `manuscript/ja/part1/chapter3-proxmox-install.md`
  - `manuscript/ja/part1/chapter4-vm-basics.md`
  - `manuscript/ja/part2/chapter5-storage.md`
  - `manuscript/ja/part2/chapter6-network.md`
  - `manuscript/ja/part3/chapter7-cluster-ha.md`
  - `manuscript/ja/part3/chapter8-backup.md`
  - `manuscript/ja/part4/chapter9-operations.md`
- 非対象（この ExecPlan では触れない）:
  - Part 0（序章/環境準備）と、第2章・第10章（既に「まとめ」相当がある）
  - 章立ての入れ替えや統合などの大規模な再構成

## Constraints and assumptions（制約・前提条件）
- 趣旨を変えない（新規の主張・要件・仕様を追加しない）。
- 事実関係が不明な箇所は補完しない（本文の範囲で要点を要約する）。
- 章末「まとめ」は、既存の本文内容の要約と、次章への導線に留める。

## Plan of work（作業フェーズ設計）
1. 各章の「章のゴール / 分かること」を再確認する
2. 章末に `## まとめ` を追加し、要点を 3〜6 点の箇条書きで整理する
3. 必要に応じて、次章への導線（参照章）を 1 行で追記する

## Concrete steps（具体タスク）
- [x] 対象章を通読し、章末に `## まとめ` を追加する
- [x] 章末に「次に読む章」を明示する（章番号ベース）
- [x] 変更差分を確認し、過剰な言い換え・意味の追加がないことを確認する

## Validation and acceptance（完了条件・確認方法）
- [x] 対象章すべてに `## まとめ` が存在する
- [x] `make build-ja` がエラーなく完了する（pandoc の有無は問わない）

## Progress（進捗ログ）
- [2025-12-31] ExecPlan 作成。章末まとめ追加の作業を開始。
- [2025-12-31] 第1章・第3章〜第9章に `## まとめ` を追加し、章末に「次に読む章」の導線を追記。
- [2025-12-31] `make build-ja` を実行し成功（pandoc 未導入のため PDF 生成はスキップ）。

## Surprises & discoveries（想定外・学び）
- `pandoc` が環境に存在しないため、`make build-ja` では PDF 生成がスキップされる。

## Decision log（意思決定と理由）
- 決定: まとめは「本文の要約 + 次章導線」に限定する。
- 理由: Stage2 の目的（読者の学習曲線と章構造の整合）に集中し、内容追加によるリスクを避けるため。

## Outcomes & retrospective（成果と振り返り）
- Status: text-draft（章末まとめ追加）
- 章末の要点整理により、章単位での学習完了と次章の導線が明確になった。

## Idempotence & recovery（繰り返し実行の安全性・復旧手順）
- 本 ExecPlan の変更は章末の追記が中心であり、各章末の `## まとめ` を削除すれば概ね元に戻せる。
