# ExecPlan: JA – Proxmox VE 9.1 実機検証・スクリーンショット・本文反映


## 1. Metadata


- Plan ID: plans/execplan-ja-pve9.1-alignment.md
- Title: JA – Proxmox VE 9.1 実機検証・スクリーンショット・本文反映
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-12-20
- Last updated: 2026-01-11
- Related issues/PRs:
  - Issue #2（スクリーンショット取得タスクリスト）
  - Issue #25（Web UI スクリーンショット取得手順）




## 2. Purpose and big picture


本書（日本語版）の操作例・スクリーンショット・UI 手順を **Proxmox VE 9.1** に合わせて実機検証し、
初心者が迷わず再現できるレベルまで本文を具体化する。




## 3. Context and orientation


対象:
- 読者: 初心者〜初級エンジニア（新卒〜実務2年未満）
- ターゲットバージョン: Proxmox VE 9.1（UI とスクリーンショット）


対象ファイル（代表）:
- `manuscript/ja/part1/chapter3-proxmox-install.md`（インストール）
- `manuscript/ja/part1/chapter4-vm-basics.md`（VM 作成）
- `manuscript/ja/part2/chapter6-network.md`（ネットワーク / VLAN）
- `manuscript/ja/part3/chapter7-cluster-ha.md`（クラスタ / HA）
- `manuscript/ja/part3/chapter8-backup.md`（バックアップ / レプリケーション）
- `images/part1/ch3/` `images/part1/ch4/`（スクリーンショット配置）
- `images/part2/ch5/` `images/part2/ch6/`
- `images/part3/ch7/` `images/part3/ch8/`
- `images/part4/ch9/`


参照:
- Issue #2: 取得すべき画面のチェックリスト
- `manuscript/ja/SUMMARY.md`（章順）




## 4. Constraints and assumptions


- 画面や UI 文言が不明な箇所は **推測で断定しない**（要確認として残す）。
- 機密情報（実 IP、実ホスト名、顧客名など）をスクリーンショットや本文に含めない。
- 章構成（Part/Chapter の分割・統合・番号変更）はこの ExecPlan のスコープ外（必要なら別途提案して合意を取る）。
- PDF 生成は `pandoc` の有無に依存する。`pandoc` が無い環境でも最低限 `make build-ja` で結合原稿が生成できることを優先する。

### スクリーンショット共通ルール（本書）

詳細は `images/README.md` を正とする。

- 形式: `png`（文字が潰れにくい）
- UI 言語: 英語（メニュー名の一貫性を優先。本文は日本語で補足する）
- テーマ: Light（印刷・PDF での可読性を優先）
- 取得時の方針:
  - 重要領域にトリミングし、不要な UI（ブラウザタブ等）は極力写さない
  - 端末・コンソール出力は等幅で読めるサイズにする（必要なら拡大して撮る）
- マスク方針:
  - 実 IP / 実ホスト名 / メール / API トークン等は必ずマスク
  - 例として本文で使うホスト名・IP に合わせる（例: `pve1` / `192.168.10.11`）
- 命名規則:
  - 保存先: `images/part{N}/ch{M}/`
  - ファイル名: `{NN}-{slug}.png`（`NN` は 2 桁、`slug` は英小文字の kebab-case）
- 本文への埋め込み:
  - 章ファイル（`manuscript/ja/part*/`）からは `../../../images/...` で参照する（GitHub 上のプレビューを優先）
  - `make build-ja` では `../../../images/` を `../../images/` に置換して結合原稿側の参照を成立させる




## 5. Plan of work


- Phase 1: ターゲットバージョン確認と方針統一（9.1）
- Phase 2: リリースノート確認（9.1 の変更点把握）と「古くなりやすい箇所」の洗い出し
- Phase 3: 実機でのハンズオン検証（インストール→VM→ネットワーク→クラスタ/HA→バックアップ）
- Phase 4: スクリーンショット取得と本文への埋め込み（初心者が迷わない粒度）
- Phase 5: ビルドと体裁確認（`make build-ja`、可能なら PDF）




## 6. Concrete steps


### 6.1 共通（方針・管理）

- [x] ターゲットを「Proxmox VE 9.1」としてドキュメント方針を統一（`.agent/PLANS.md`、Issue #2、関連 ExecPlan の表記）
- [x] 9.1 リリースノート（Roadmap）から、本書に影響しそうな変更点を章ごとに整理（インストーラ/UI/ネットワーク/クラスタ/バックアップ）
- [x] スクリーンショットの共通ルールを決める（例: 解像度、UI 言語、マスク方針、ファイル命名規則）
- [x] Issue #2 のチェックリストを「章 → 画面 → 保存先パス」まで確定させる
- [x] Web UI スクリーンショットの自動取得用ツールを追加（`tools/pve-webui-screenshots/`）
- [ ] ツールを実機（単一ノード / クラスタ）で動作確認し、Issue #2 の Web UI スクショを取得してコミットする


### 6.2 第3章（インストール）

- [ ] Proxmox VE 9.1 をクリーンインストールし、画面遷移を記録（要点メモを残す）
- [ ] Issue #2 のインストール関連スクリーンショットを取得し `images/part1/ch3/` に保存
- [ ] `manuscript/ja/part1/chapter3-proxmox-install.md` を UI に沿って具体化（入力例、注意点、成功判定）


### 6.3 第4章（VM 作成）

- [ ] VM 作成ウィザード各タブのスクリーンショットを取得し `images/part1/ch4/` に保存
- [ ] `manuscript/ja/part1/chapter4-vm-basics.md` を UI に沿って具体化（設定値例、つまずき→対処）


### 6.4 第6章（ネットワーク/VLAN）

- [ ] ブリッジ/ボンド/VLAN の設定画面を 9.1 UI で確認し、代表スクリーンショットを取得
- [ ] `manuscript/ja/part2/chapter6-network.md` に「UI 手順（最低限）」を追加（どこを開いて何を設定するか）


### 6.5 第7章（クラスタ/HA）

- [ ] 3 ノードラボでクラスタ作成〜参加までを実施し、画面と手順を記録
- [ ] HA 設定と簡単なフェイルオーバ確認を行い、タスクログ等のスクリーンショットを取得
- [ ] `manuscript/ja/part3/chapter7-cluster-ha.md` に「初心者向けの前提チェック」と「最小手順」を追記


### 6.6 第8章（バックアップ/レプリケーション）

- [ ] バックアップジョブ作成→実行→リストアを 9.1 で確認し、画面を取得
- [ ] レプリケーション設定例を確認し、画面を取得（可能な範囲で）
- [ ] `manuscript/ja/part3/chapter8-backup.md` に「復元確認（テスト）」の手順を追記


### 6.7 全体（ビルド・整合）

- [ ] スクリーンショットを本文に埋め込み（必要箇所はキャプションと参照）
- [ ] `make build-ja` を実行し、`build/ja/book.md` の見出し順・画像参照が破綻していないか確認
- [ ] （可能なら）`pandoc` で PDF 生成し、画像サイズ・改ページの破綻を確認
- [ ] 各章 ExecPlan の `Outcomes & retrospective` に `Status: live-validated` を付与し、残タスクを明記




## 7. Validation and acceptance


- [ ] Issue #2 のスクリーンショット項目が主要章（3/4/6/7/8）で概ね埋まっている
- [ ] 第3章/第4章は初心者が UI だけで迷わず操作できる粒度になっている（入力例・成功判定あり）
- [ ] `make build-ja` が成功し、結合原稿に章と画像参照が含まれている
- [ ] 9.1 で差分が出やすい箇所（UI、手順、スクショ）は、本文・ExecPlan ともに 9.1 前提になっている




## 8. Progress


- [2025-12-20] Plan created.
- [2025-12-20] Confirmed Proxmox VE 9.1 is current stable (ISO is 9.1-1 on proxmox.com downloads; package versions listed on pve.proxmox.com/Downloads) and updated policies/issues accordingly.
- [2025-12-21] Reviewed Roadmap “Proxmox VE 9.1” section and extracted book-relevant deltas (installer/UI/kernel known issues/SDN status).
- [2025-12-21] Added “Proxmox VE 9.1 前提” notes to JA manuscript (preface/env-setup and key UI-heavy chapters) and linked Roadmap known issues as a caution for kernel/driver compatibility.
- [2025-12-21] Ran `make build-ja` successfully and refreshed `build/ja/book.md` after fixing the Makefile dependency rule.
- [2025-12-21] Defined screenshot conventions in `images/README.md`, created initial `images/part*/ch*/` directories, and updated Issue #2 with canonical filenames/paths.
- [2025-12-21] Updated screenshot TODO blocks in Chapters 3/8/9 to list the canonical filenames (from Issue #2) to make later insertion straightforward.
- [2026-01-11] Added `tools/pve-webui-screenshots/` (Playwright-based) to help capture Web UI screenshots from CLI (login/dashboard as a first pass).




## 9. Surprises & discoveries


- Roadmap “Proxmox VE 9.1” より（2025-11-19 リリース）:
  - ベース OS は Debian Trixie (13.2)、デフォルトカーネルは 6.17.2-1。
  - GUI: グローバル検索バーの位置変更、Tag View の一括操作など（スクショ差分が出やすい）。
  - インストーラ: NIC 名の pin（GUI/TUI/auto installer）、Debian mirror 選択をしない（CDN 利用）など。
  - SDN: GUI のステータス表示が詳細化（Fabrics がリソースツリーに追加、学習 IP/MAC 等）。
  - Known issues: kernel 6.17 と NVIDIA vGPU、LINSTOR/DRBD、特定 Dell PowerEdge の起動問題（必要なら 6.14 kernel pin が推奨されるケースがある）。




## 10. Decision log


- Decision: 本文は “Proxmox VE 9.1（9.x）” を前提にしつつ、UI 変更・既知の互換性問題が絡む箇所は「古くなりやすい」「要確認」を明示する。
- Decision: Part 0 / 第3章に「Proxmox VE 9.1 前提」と「カーネル 6.17 周りの既知の注意点（該当者のみ）」を短いノートとして追加する（詳細は運用章に回す）。
- Decision: スクリーンショットは英語 UI（Light テーマ）を基本とし、本文側で日本語補足する。
- Reason: メニュー名・画面項目の表記ゆれを減らし、公式ドキュメントと照合しやすくするため。
- Decision: スクリーンショットの保存先と命名規則を `images/part{N}/ch{M}/{NN}-{slug}.png` に固定する。
- Reason: 章内の順序が追いやすく、差し替えやレビュー時の参照が容易になるため。




## 11. Outcomes & retrospective


- Status: assets-pending（スクリーンショット取得と実機検証が未完）
- スクリーンショットの共通ルール（UI 言語/テーマ/マスク/命名規則）を確定し、`images/` 配下の配置方針を固定した。
- Issue #2 のチェックリストを「章 → 画面 → 保存先パス（ファイル名）」まで落とし込んだ。
- 次の作業は、実機（単一ノード / 3 ノードクラスタ）での画面遷移確認とスクリーンショット取得を進め、本文へ埋め込みつつ `make build-ja` で破綻がないことを確認する。




## 12. Idempotence & recovery


- 実機検証は繰り返し実行可能だが、検証用 VM/ノードの作り直しを前提にする。
- スクリーンショット取得の途中で止まった場合は、Issue #2 のチェック状況と `Progress` の最後の記録から再開する。
