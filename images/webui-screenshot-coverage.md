# Web UI スクリーンショット coverage

このファイルは、Issue #25 の完了判定で確認する Web UI スクリーンショットの配置・本文参照・残スコープを固定するための evidence です。スクリーンショットの共通ルール、マスク方針、命名規則は `images/README.md` を正とします。

## Issue #25 の完了境界

Issue #25 は、Proxmox VE 9.1（本書の対象バージョン）向け Web UI スクリーンショットの自動取得手順と、既に取得済みの主要 Web UI 画像を本文へ差し込める状態にすることを対象にします。

この完了境界に含めるもの:

- `tools/pve-webui-screenshots/` の手順で取得できる default / CH4 / EXTENDED / VM asset 系の Web UI 画像
- `images/part*/ch*/` への配置
- `manuscript/ja/` と `docs/` からの参照
- `make build-ja` / `make check-ja` で画像参照が破綻しないこと

この完了境界に含めないもの:

- インストーラ画面など、Web UI ではないスクリーンショット
- ZFS / Ceph / 3 ノードクラスタ / HA failover / replication のように、ラボ構成に強く依存する advanced 画像
- 追加撮影が必要な残項目の進捗管理

残項目は Issue #2 のチェックリストを正として扱います。

## Coverage summary

| capture group | screenshot files | manuscript/docs references | status |
| --- | ---: | ---: | --- |
| default | 7 | 7 | complete |
| CH4 wizard | 7 | 7 | complete |
| EXTENDED safe UI | 9 | 9 | complete |
| VM assets | 5 | 5 | complete |
| total in this coverage | 28 | 28 | complete |

## Files covered by Issue #25

| group | path | referenced from |
| --- | --- | --- |
| default | `images/part1/ch3/10-webui-first-login.png` | `manuscript/ja/part1/chapter3-proxmox-install.md`, `docs/chapters/chapter-03-proxmox-install.md` |
| default | `images/part1/ch3/11-webui-dashboard-node-summary.png` | `manuscript/ja/part1/chapter3-proxmox-install.md`, `docs/chapters/chapter-03-proxmox-install.md` |
| default | `images/part2/ch5/01-datacenter-storage-list.png` | `manuscript/ja/part2/chapter5-storage.md`, `docs/chapters/chapter-05-storage.md` |
| default | `images/part2/ch6/01-node-network-list.png` | `manuscript/ja/part2/chapter6-network.md`, `docs/chapters/chapter-06-network.md` |
| default | `images/part4/ch9/01-node-syslog.png` | `manuscript/ja/part4/chapter9-operations.md`, `docs/chapters/chapter-09-operations.md` |
| default | `images/part4/ch9/02-task-history.png` | `manuscript/ja/part4/chapter9-operations.md`, `docs/chapters/chapter-09-operations.md` |
| default | `images/part4/ch9/03-node-dashboard-resource-graphs.png` | `manuscript/ja/part4/chapter9-operations.md`, `docs/chapters/chapter-09-operations.md` |
| CH4 wizard | `images/part1/ch4/01-create-vm-wizard-general.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| CH4 wizard | `images/part1/ch4/02-create-vm-wizard-os.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| CH4 wizard | `images/part1/ch4/03-create-vm-wizard-system.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| CH4 wizard | `images/part1/ch4/04-create-vm-wizard-disks.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| CH4 wizard | `images/part1/ch4/05-create-vm-wizard-cpu.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| CH4 wizard | `images/part1/ch4/06-create-vm-wizard-memory.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| CH4 wizard | `images/part1/ch4/07-create-vm-wizard-network.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| EXTENDED safe UI | `images/part2/ch5/02-node-local-lvm-lvmthin.png` | `manuscript/ja/part2/chapter5-storage.md`, `docs/chapters/chapter-05-storage.md` |
| EXTENDED safe UI | `images/part2/ch6/02-vmbr0-settings.png` | `manuscript/ja/part2/chapter6-network.md`, `docs/chapters/chapter-06-network.md` |
| EXTENDED safe UI | `images/part2/ch6/03-bond-settings.png` | `manuscript/ja/part2/chapter6-network.md`, `docs/chapters/chapter-06-network.md` |
| EXTENDED safe UI | `images/part2/ch6/04-vlan-subif-settings.png` | `manuscript/ja/part2/chapter6-network.md`, `docs/chapters/chapter-06-network.md` |
| EXTENDED safe UI | `images/part3/ch7/01-datacenter-cluster-empty.png` | `manuscript/ja/part3/chapter7-cluster-ha.md`, `docs/chapters/chapter-07-cluster-ha.md` |
| EXTENDED safe UI | `images/part3/ch7/02-create-cluster-wizard.png` | `manuscript/ja/part3/chapter7-cluster-ha.md`, `docs/chapters/chapter-07-cluster-ha.md` |
| EXTENDED safe UI | `images/part3/ch7/03-join-cluster-wizard.png` | `manuscript/ja/part3/chapter7-cluster-ha.md`, `docs/chapters/chapter-07-cluster-ha.md` |
| EXTENDED safe UI | `images/part3/ch8/01-datacenter-backup-jobs.png` | `manuscript/ja/part3/chapter8-backup.md`, `docs/chapters/chapter-08-backup.md` |
| EXTENDED safe UI | `images/part3/ch8/02-create-backup-job-wizard.png` | `manuscript/ja/part3/chapter8-backup.md`, `docs/chapters/chapter-08-backup.md` |
| VM assets | `images/part1/ch4/08-vm-summary-and-console.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| VM assets | `images/part1/ch4/09-snapshot-dialog-and-list.png` | `manuscript/ja/part1/chapter4-vm-basics.md`, `docs/chapters/chapter-04-vm-basics.md` |
| VM assets | `images/part2/ch6/05-vm-nic-vlan-id.png` | `manuscript/ja/part2/chapter6-network.md`, `docs/chapters/chapter-06-network.md` |
| VM assets | `images/part3/ch8/03-manual-backup-task-log.png` | `manuscript/ja/part3/chapter8-backup.md`, `docs/chapters/chapter-08-backup.md` |
| VM assets | `images/part3/ch8/04-restore-dialog.png` | `manuscript/ja/part3/chapter8-backup.md`, `docs/chapters/chapter-08-backup.md` |

## Remaining screenshot backlog

以下は Issue #25 の closure boundary から外し、Issue #2 で継続管理します。

| path | reason |
| --- | --- |
| `images/part1/ch3/01-boot-menu.png` 〜 `09-console-webui-url.png` | インストーラ / コンソール画面であり Web UI 自動取得の対象外 |
| `images/part2/ch5/03-zfs-storage.png` | ZFS 構成のラボ状態に依存 |
| `images/part2/ch5/04-ceph-storage.png` | Ceph 構成のラボ状態に依存 |
| `images/part3/ch7/04-cluster-members-3nodes.png` | 3 ノードクラスタ状態に依存 |
| `images/part3/ch7/05-ha-add-vm-to-group.png` | HA グループ / VM 状態に依存 |
| `images/part3/ch7/06-ha-failover-task-log.png` | フェイルオーバ実施ログに依存 |
| `images/part3/ch8/05-replication-job-settings.png` | ノード間 replication 構成に依存 |

## Verification checklist

Issue #25 を close する前に、少なくとも次を確認します。

- `make build-ja`
- `make check-ja`
- `images/part*/ch*/*.png` のファイル存在確認
- 上記 28 画像が `manuscript/ja/` と `docs/` の両方から参照されていること
- 目視 contact sheet で、明らかな実ホスト名・実メールアドレス・トークン・未マスク秘密情報が露出していないこと
