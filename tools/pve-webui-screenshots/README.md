# Proxmox VE Web UI スクリーンショット取得（自動化）

本ツールは、Proxmox VE 9.1 の Web UI から、本書向けのスクリーンショット（Issue #2 の項目）をヘッドレスで取得するための補助スクリプトです。

## 重要（先に確認）

- **機微情報（実 IP / 実ホスト名 / メール / トークンなど）を写さない**こと。
  - 可能なら、撮影用ラボのホスト名・IP を本文の例（例: `pve1` / `192.168.10.11`）に寄せてください。
- 自動化は UI 変更に弱いため、最初は **少数の画面から** 動作確認することを推奨します。
- 本ツールは **Proxmox の実機環境**（Web UI に到達できること）が必要です。

スクリーンショットの共通ルールは `images/README.md` を参照してください。

## 事前準備

Node.js が必要です（このリポジトリの作業環境では Node 22 を想定）。

依存関係の導入:

    npm --prefix tools/pve-webui-screenshots install

## 使い方

環境変数を指定して実行します。

必須:
- `PVE_BASE_URL` 例: `https://192.168.10.11:8006`
- `PVE_USERNAME` 例: `root@pam`
- `PVE_PASSWORD`（値はシェル履歴等に残さない運用を推奨）
  - 代替: `PVE_PASSWORD_FILE`（パスワードだけ入ったファイルのパス）

任意:
- `PVE_INSECURE=1` 自己署名証明書を許容（学習環境向け）
- `PVE_CAPTURE_CH4=1` 第4章の「Create VM wizard」スクショも取得する
- `PVE_CAPTURE_EXTENDED=1` 追加の安全な画面（ch5/ch6/ch7/ch8）も取得する
- `PVE_CAPTURE_ADVANCED=1` 追加の環境依存画面（ZFS/Ceph ストレージ、クラスタメンバー一覧、HA/Replication など）も取得する
- `PVE_CAPTURE_VM_ASSETS=1` VM/バックアップ関連の追加スクショも取得する（**デモ VM 作成 + 手動バックアップ実行あり: ラボ専用**）
  - `PVE_DEMO_VMID`（既定: `100`）作成するデモ VM の VMID（任意）
  - `PVE_DEMO_VM_NAME`（既定: `vm-ubuntu01`）作成するデモ VM 名（任意）

実行例:

    PVE_BASE_URL="https://192.168.10.11:8006" \\
    PVE_USERNAME="root@pam" \\
    PVE_PASSWORD="***" \\
    PVE_INSECURE=1 \\
    node tools/pve-webui-screenshots/capture.mjs

`PVE_PASSWORD_FILE` を使う例（シェル履歴にパスワードを残さない）:

    export PVE_PASSWORD_FILE="$HOME/.config/proxmox_book/pve_password"
    export PVE_BASE_URL="https://192.168.10.11:8006"
    export PVE_USERNAME="root@pam"
    export PVE_INSECURE=1
    node tools/pve-webui-screenshots/capture.mjs

出力先:
- `images/part*/ch*/`（Issue #2 のパス）

保存されるファイル（現時点）:

デフォルト:
- `images/part1/ch3/10-webui-first-login.png`
- `images/part1/ch3/11-webui-dashboard-node-summary.png`
- `images/part2/ch5/01-datacenter-storage-list.png`
- `images/part2/ch6/01-node-network-list.png`
- `images/part4/ch9/01-node-syslog.png`
- `images/part4/ch9/02-task-history.png`
- `images/part4/ch9/03-node-dashboard-resource-graphs.png`

`PVE_CAPTURE_CH4=1` の場合（Create VM wizard）:
- `images/part1/ch4/01-create-vm-wizard-general.png`
- `images/part1/ch4/02-create-vm-wizard-os.png`
- `images/part1/ch4/03-create-vm-wizard-system.png`
- `images/part1/ch4/04-create-vm-wizard-disks.png`
- `images/part1/ch4/05-create-vm-wizard-cpu.png`
- `images/part1/ch4/06-create-vm-wizard-memory.png`
- `images/part1/ch4/07-create-vm-wizard-network.png`

`PVE_CAPTURE_EXTENDED=1` の場合（安全に開ける一覧/設定ダイアログ/ウィザード中心）:
- `images/part2/ch5/02-node-local-lvm-lvmthin.png`
- `images/part2/ch6/02-vmbr0-settings.png`
- `images/part2/ch6/03-bond-settings.png`
- `images/part2/ch6/04-vlan-subif-settings.png`
- `images/part3/ch7/01-datacenter-cluster-empty.png`
- `images/part3/ch7/02-create-cluster-wizard.png`
- `images/part3/ch7/03-join-cluster-wizard.png`
- `images/part3/ch8/01-datacenter-backup-jobs.png`
- `images/part3/ch8/02-create-backup-job-wizard.png`

`PVE_CAPTURE_VM_ASSETS=1` の場合（デモ VM の作成/バックアップ実行を含む）:
- `images/part1/ch4/08-vm-summary-and-console.png`
- `images/part1/ch4/09-snapshot-dialog-and-list.png`
- `images/part2/ch6/05-vm-nic-vlan-id.png`
- `images/part3/ch8/03-manual-backup-task-log.png`
- `images/part3/ch8/04-restore-dialog.png`

`PVE_CAPTURE_ADVANCED=1` の場合（環境依存。該当リソースが無い場合はスキップされる）:
- `images/part2/ch5/03-zfs-storage.png`
- `images/part2/ch5/04-ceph-storage.png`
- `images/part3/ch7/04-cluster-members-3nodes.png`
- `images/part3/ch7/05-ha-add-vm-to-group.png`
- `images/part3/ch8/05-replication-job-settings.png`

## トラブルシュート

- `PVE_INSECURE=1` を付けても TLS エラーになる場合:
  - まずブラウザで同じ URL にアクセスできるか確認してください。
- ログイン後に画面が表示されない / クリックに失敗する:
  - UI 変更や環境差分でセレクタが合っていない可能性があります。該当ログを添えて相談してください。
- 失敗時に `images/_debug/` にデバッグ用スクリーンショットが保存されることがあります:
  - **機微情報が含まれ得るため、絶対にコミット/公開しないでください**。
