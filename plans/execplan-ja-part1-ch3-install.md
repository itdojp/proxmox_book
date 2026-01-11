# ExecPlan: JA Part I / Chapter 3 – Proxmox VE のインストール


## 1. Metadata


- Plan ID: plans/execplan-ja-part1-ch3-install.md
- Title: JA Part I / Chapter 3 – Proxmox VE のインストール
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-12-21
- Last updated: 2026-01-11
- Related issues/PRs:
  - Issue #2（スクリーンショット取得タスクリスト）
  - plans/execplan-ja-pve9.1-alignment.md（実機検証・スクショ・本文反映の横断計画）




## 2. Purpose and big picture


初心者が Proxmox VE を 1 台インストールし、Web UI にログインして「次章の VM 作成」へ進める状態まで到達できるようにする。




## 3. Context and orientation


対象読者:
- 初心者〜初級エンジニア（新卒〜実務経験2年未満）

前提:
- Part 0 のラボ準備を完了している（最低限、インストール先ノードと管理用 PC がある）。

対象バージョン:
- Proxmox VE 9.1（9.x 系、スクリーンショットと UI 手順の前提）

対象ファイル:
- `manuscript/ja/part1/chapter3-proxmox-install.md`
- `diagrams/part1/ch3/install-flow.svg`
- `images/part1/ch3/`（スクリーンショット配置、後続パスで追加）




## 4. Constraints and assumptions


- UI 文言や画面遷移が不明な箇所は **推測で断定しない**（「要確認」または TODO として残す）。
- 機密情報（実 IP、実ホスト名、実メール、シリアル等）を本文・画像に含めない。
- 本パスは「本文の初心者向けブラッシュアップ（テキスト中心）」を主目的とし、スクリーンショット取得は `plans/execplan-ja-pve9.1-alignment.md` と Issue #2 に委譲する（環境が無い場合は TODO のまま残す）。




## 5. Plan of work


- Phase 1: 章の導入を初心者向けに整える（ゴール、分かること/分からないこと、用語）
- Phase 2: インストール前チェックリストと入力値の例を用意する（ホスト名、IP、DNS/NTP など）
- Phase 3: インストーラの流れを図と文章で整理する（画面名の推測は避ける）
- Phase 4: 初回ログインと最低限の確認（成功判定、つまずき→切り分け）
- Phase 5: ビルド確認（`make build-ja`）と ExecPlan 更新




## 6. Concrete steps


- [x] `manuscript/ja/part1/chapter3-proxmox-install.md` に以下を追加・整理する:
  - 章のゴール
  - この章で分かること / 分からないこと
  - インストール前のチェックリスト（BIOS/UEFI、ネットワーク、ホスト名・IP 計画）
  - インストーラの流れ（概要）と「どこで何を決めるか」
  - 初回 Web UI ログインと成功判定（例: ノード概要、ストレージ、時刻）
  - よくあるつまずきポイント（アクセスできない/インストール先誤り等）と最小限の切り分け
- [x] `diagrams/part1/ch3/install-flow.svg` のプレースホルダを、最小限の実図に置換する（インストール〜初回ログインの全体フロー）。
- [x] スクリーンショット取得タスクは Issue #2 / 横断 ExecPlan に集約し、本文はスクリーンショット無しでも読み進められる形にする（課題管理情報は本文に出さない）。
- [x] `make build-ja` を実行し、結合原稿に本章が含まれることを確認する（生成物はコミットしない）。
- [x] Progress / Outcomes を更新する（このパスでやったこと、残タスク、次回再開地点）。




## 7. Validation and acceptance


- [x] 本章が初心者でも読み進められるよう、チェックリストと成功判定がある（「次に何を確認すればよいか」が明確）。
- [x] `diagrams/part1/ch3/install-flow.svg` がプレースホルダではない。
- [x] UI 断定が必要な箇所は「要確認/TODO」として残し、推測で断定しない。
- [x] `make build-ja` が成功する。




## 8. Progress


- [2025-12-21] Plan created (Chapter 3 ExecPlan was missing; added a dedicated plan for beginner-friendly text/diagram pass aligned to Proxmox VE 9.1).
- [2025-12-21] Updated `chapter3-proxmox-install.md` with beginner framing, pre-install checklist/example values, and a minimal troubleshooting checklist; replaced the install-flow SVG placeholder; ran `make build-ja` successfully (output not committed).
- [2026-01-11] Added first-login notes (`root@pam`) and kept the chapter text usable without screenshots; screenshot tracking remains in Issue #2 and the cross-cutting 9.1 alignment ExecPlan.




## 9. Surprises & discoveries


- [placeholder]




## 10. Decision log


- Decision: 本章は「テキストで再現できる最小限の流れ」を先に整え、スクリーンショットと UI の詳細確定は横断 ExecPlan（9.1 実機検証）でまとめて進める。




## 11. Outcomes & retrospective


- Status: text-draft
- Status: assets-pending（インストール画面のスクショ取得は後続パス）
- Status: build-validated（`make build-ja` は成功、ただし生成物は別管理）
- 本章は「どこで何を決めるか」と「成功判定」を先に整え、実機の UI スクリーンショットは Issue #2 と横断 ExecPlan（9.1 実機検証）で後追いする方針にした。
- `diagrams/part1/ch3/install-flow.svg` はプレースホルダを解消し、手順の全体像を見失わないための最小フロー図に更新した。




## 12. Idempotence & recovery


- テキスト修正と図の差し替えは繰り返し実行可能。
- スクリーンショット取得が途中で止まった場合は、Issue #2 のチェック状況と本 ExecPlan の Progress 末尾から再開する。
