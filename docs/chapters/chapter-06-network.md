# 第6章　ネットワーク設計と VLAN

## 章のゴール

本章では、Proxmox VE でよく利用されるネットワーク構成（Linux ブリッジ、ボンディング、VLAN）の考え方を整理し、
単一ノードおよび小規模クラスタのラボ環境で再現しやすいパターンを身につけることを目標とします。
本章の画面・操作例は Proxmox VE 9.1（9.x 系）を前提とします。

## この章で分かること / 分からないこと

- 分かること:
  - Linux ブリッジ/ボンディング/VLAN の役割と、ラボでの組み合わせ方
  - 単一ノード/3 ノードクラスタでの「迷いにくい」ネットワーク分け
- 分からないこと（後続章または別パスで扱います）:
  - UI の画面操作を 1 クリックずつ追う詳細手順（本章では入口の例と設計の考え方を優先）
  - SDN/EVPN などの発展トピック（本書では優先度低）

## 最初に決めること（チェックリスト）

ネットワークは後から変更すると影響範囲が大きいので、ラボでも最初に方針を決めておくと手戻りが減ります。

- 管理ネットワーク（ノードの Web UI に入るための経路）をどれにするか
- VM 用ネットワークを分けるか（最初は共用で開始し、必要なら VLAN で分離）
- ストレージ/バックアップ用ネットワークを分けるか（Ceph を使うなら検討）
- VLAN を使う場合: VLAN ID と用途の対応（例: 10=管理、20=VM、30=ストレージ）

例（学習用のシンプルな割り当て）:

- VLAN 10（管理）: `192.168.10.0/24`
- VLAN 20（VM）: `192.168.20.0/24`
- VLAN 30（ストレージ/バックアップ）: `192.168.30.0/24`（必要な場合のみ）

## 用語メモ（最小）

- ブリッジ: VM/コンテナを物理 NIC に「つなぐ」ための仮想スイッチ
- ボンド: 複数 NIC を束ねて冗長化/帯域確保する仕組み
- VLAN: 1 本のリンクを論理的に分割する仕組み（スイッチ側と整合が必要）

## 設計パターン（最小から段階的に）

初心者は、最初から「理想の分離」を作ろうとするとネットワークで詰まりやすくなります。
ここではラボで再現しやすい順に、よくあるパターンを整理します。

| パターン | 構成 | 向いている場面 | 注意点 |
| --- | --- | --- | --- |
| A: 1ブリッジ（最小） | `vmbr0` 1つに管理/VM を集約 | まず動かす、単一ノード | 影響範囲が広い（誤設定すると全部落ちやすい） |
| B: VLANで分離 | `vmbr0` + VLAN（10=管理、20=VM…） | 物理 NIC が少ないが分離したい | スイッチ側 VLAN 設定が前提 |
| C: 物理分離（余裕がある場合） | 管理用NICとVM用NICを分ける | 本番に近い検証 | 物理ポート/スイッチ側も含めた設計が必要 |

判断の目安（最小）:

- VLAN を使うなら「スイッチ側の VLAN 設定を変更できるか」を先に確認する
- Ceph を使うなら「ストレージ用トラフィックを分ける必要があるか」を検討する（第5章/第7章と接続）

## ラボ環境で想定するネットワークパターン

Part 0 で紹介したラボパターンに合わせて、シンプルなネットワーク構成を想定します。

### パターン A（単一ノードラボ）

- 1 本の物理 NIC を Linux ブリッジ（例: vmbr0）として利用し、その上に VM の仮想 NIC を接続する
- 必要に応じて、管理用ネットワークとゲスト用ネットワークを VLAN で分離する

### パターン B（3 ノードクラスタラボ）

- 各ノードで、管理用と VM／ストレージ用のネットワークを分ける前提でブリッジを構成する
- クラスタ通信や Ceph 用トラフィックを流すネットワークは、可能であれば物理的または VLAN で分離する

これらの関係は、`diagrams/part2/ch6/network-topology.svg` に概略図として示します。

## Linux ブリッジの基本

Proxmox VE では、Linux ブリッジを用いて仮想マシンやコンテナを物理ネットワークに接続します。
標準インストール直後は、物理 NIC（例: eno1）に対して vmbr0 が作成され、そのブリッジにホスト自身と仮想マシンが接続される構成が一般的です。

Node -> Network 一覧の例:

![Node -> Network（例）](../../images/part2/ch6/01-node-network-list.png)

ブリッジ（例: `vmbr0`）の設定を確認する入口（編集ダイアログ）:

![Edit: Linux Bridge（例）](../../images/part2/ch6/02-vmbr0-settings.png)

注意: ネットワーク設定を変更するとアクセス断のリスクがあります。**この章のスクリーンショットは「編集画面の例」であり、適用操作は行いません**。

### 最小手順（Web UI）

1. 左のツリー（Server View）で対象ノードをクリックする
2. 左のナビで `System` → `Network` を開く
3. 一覧で `vmbr0` があること、`CIDR`（IP/サブネット）などが想定どおりかを確認する
4. `vmbr0` を選択して `Edit` を開き、設定値（Bridge ports / VLAN aware など）を確認する

注意: `Apply Configuration` は押すと設定が反映され、アクセス断になる可能性があります。コンソールが確保できていない場合は、安易に実行しないでください。

## ネットワーク変更の反映と安全策（重要）

ネットワーク設定を変更して適用すると、ノードにアクセスできなくなるリスクがあります。
特に本番環境では、適用前に必ず「コンソールに入れる手段（物理/リモートコンソール）」を確保してください。

補足（挙動のイメージ）:

- Proxmox VE のネットワーク設定は `/etc/network/interfaces` に反映されます。
- Web UI で設定を変更した場合、いきなり `/etc/network/interfaces` を書き換えるのではなく、まず `/etc/network/interfaces.new` に変更内容が書かれます。
- その後、Web UI の `Apply Configuration`（または同等のボタン）で設定を反映します。

手動で `/etc/network/interfaces` を編集した場合は、`ifupdown2` が利用できる環境では `ifreload -a` で反映できます。
ただし、適用に失敗すると復旧作業が必要になるため、ラボでも「いつでも戻せる」前提（スナップショットやコンソール確保）で試してください。

### スクショ無しでの最小確認（CLI）

スクリーンショットが無い段階でも、最低限次の確認ができると「今どこで詰まっているか」を切り分けやすくなります。
可能なら、反映直後はいったんノードのコンソールで確認してください（遠隔からの接続が切れていると切り分けが難しくなるためです）。

- IP アドレスの状態: `ip -br a`
- ルーティング（デフォルトゲートウェイ等）: `ip r`
- ブリッジの紐づき: `bridge link`
- VLAN を使っている場合: `bridge vlan show`

見るポイント（最低限）:

- 管理用 IP が想定したインターフェースに付いており、状態が `UP` である
- デフォルトルート（`default`）が存在する
- ブリッジや VLAN 設定が「さっき設定した内容」と整合している（物理 NIC の紐づき、VLAN-aware の有無など）

復旧の入口（最小）:

- 適用前に設定を退避: `cp -a /etc/network/interfaces /etc/network/interfaces.bak`
- 反映後にアクセス不能になった場合は、コンソールから退避ファイルへ戻して `ifreload -a` で反映する

### よくあるつまずきポイント（ネットワーク変更）

- `Apply Configuration` を押した後に Web UI へ入れなくなった:
  - まずはコンソールで IP 状態とルーティングを確認します（`ip -br a` / `ip r`）。
  - 変更前に退避した設定へ戻し、`ifreload -a` で反映して復旧できる状態を作ります。
- 変更が反映されない/意図と違う:
  - Web UI 変更直後は `/etc/network/interfaces.new` 側に書かれていることがあります。適用済みかどうかを意識します。

## 設定ファイル例（/etc/network/interfaces）

注意: 以下は「学習用の例」です。**インターフェース名（`eno1` 等）や VLAN ID、IP アドレスは環境ごとに異なります**。
適用前に必ず「コンソール確保」と「設定退避」を行ってください（誤適用するとノードへ入れなくなるためです）。

### パターン A: 物理 NIC + `vmbr0`（最小）

管理用 IP をブリッジ（`vmbr0`）側に持たせる、最小構成の例です。

```ini
auto lo
iface lo inet loopback

iface eno1 inet manual

auto vmbr0
iface vmbr0 inet static
  address 192.168.10.11/24
  gateway 192.168.10.1
  bridge-ports eno1
  bridge-stp off
  bridge-fd 0
```

ポイント:

- 物理 NIC（例: `eno1`）には IP を付けず、ブリッジ側（例: `vmbr0`）に IP を設定します。

### パターン B: VLAN-aware bridge + 管理用 VLAN（例: VLAN 10）

スイッチ側が VLAN（トランク）に対応しており、管理用ネットワークを VLAN で分離したい場合の例です。
ブリッジを VLAN-aware にし、ホスト管理用の IP を `vmbr0.<VLAN>` に載せます。

```ini
auto lo
iface lo inet loopback

iface eno1 inet manual

auto vmbr0
iface vmbr0 inet manual
  bridge-ports eno1
  bridge-stp off
  bridge-fd 0
  bridge-vlan-aware yes
  bridge-vids 2-4094

auto vmbr0.10
iface vmbr0.10 inet static
  address 192.168.10.11/24
  gateway 192.168.10.1
```

ポイント（最低限）:

- `vmbr0` は VLAN-aware の “土台” になり、VM 側の仮想 NIC に VLAN タグを指定して使い分けます。
- `vmbr0.10` のような VLAN インターフェースは、ホスト（Proxmox VE 自身）がその VLAN で通信したいときに使います（管理用 VLAN など）。

### パターン C: `bond0` + `vmbr0`（冗長化）

2 本の物理 NIC をボンド（`bond0`）として束ね、その上にブリッジ（`vmbr0`）を構成する例です。
ラボで始める場合は、まず `active-backup` のようなシンプルなモードから検証すると安全です（LACP/802.3ad はスイッチ側設定が必要）。

```ini
auto lo
iface lo inet loopback

iface eno1 inet manual
iface eno2 inet manual

auto bond0
iface bond0 inet manual
  bond-slaves eno1 eno2
  bond-miimon 100
  bond-mode active-backup

auto vmbr0
iface vmbr0 inet static
  address 192.168.10.11/24
  gateway 192.168.10.1
  bridge-ports bond0
  bridge-stp off
  bridge-fd 0
```

### 反映・切り戻しの最小手順（例）

手動編集を行う場合は、まず退避してから反映します（編集方法は利用できるエディタに合わせてください）。

```bash
cp -a /etc/network/interfaces /etc/network/interfaces.bak.$(date +%F)
# /etc/network/interfaces を編集する
ifreload -a
```

復旧の入口（最小）:

```bash
cp -a /etc/network/interfaces.bak.<DATE> /etc/network/interfaces
ifreload -a
```

## ボンディングの概要

冗長性や帯域確保が必要な場合、複数の物理 NIC をボンドインターフェースとして束ね、その上にブリッジを構成することができます。
ラボ環境では、実際にリンク障害を再現してみることで、フェイルオーバの動作を確認できます。

ボンド作成ダイアログの例（入口）:

![Create: Linux Bond（例）](../../images/part2/ch6/03-bond-settings.png)

### 最小手順（Web UI: Bond 作成の入口）

1. 左のツリーで対象ノードをクリックする
2. 左のナビで `System` → `Network` を開く
3. 上部の `Create` から `Linux Bond` を選ぶ
4. ボンド名（例: `bond0`）とモード、束ねる物理 NIC（Slaves）を指定して作成する

## VLAN の基本と Proxmox VE での扱い

VLAN を利用すると、1 本の物理リンク上で論理的にネットワークを分離できます。
Proxmox VE では、VM の仮想 NIC に VLAN タグを指定して使い分けることができます。
ただし、VLAN の扱い（VLAN-aware bridge か、従来方式か、OVS か等）はブリッジ設定によって変わるため、
まずはラボで 1 つの VLAN から動作確認すると安全です。

ラボ環境では、次のような使い分けが考えられます。

- VLAN 10: 管理用ネットワーク
- VLAN 20: ゲスト VM 用ネットワーク
- VLAN 30: ストレージ／バックアップ用ネットワーク（必要に応じて）

これらの設定は、Proxmox VE の Web UI またはテキスト形式の設定ファイルを通じて行います。
本書では、本章で最低限の設定ファイル例（`/etc/network/interfaces`）を示しつつ、設計の考え方とパターンに焦点を当てます。
SDN/EVPN のような発展トピックや、環境依存が大きいチューニングは別パスで扱います。

VLAN 作成ダイアログの例（入口）:

![Create: Linux VLAN（例）](../../images/part2/ch6/04-vlan-subif-settings.png)

### 最小手順（Web UI: VLAN インターフェース作成の入口）

1. 左のツリーで対象ノードをクリックする
2. 左のナビで `System` → `Network` を開く
3. 上部の `Create` から `Linux VLAN` を選ぶ
4. 親（raw）デバイス（例: `vmbr0` や `bond0`）と VLAN ID を指定して作成する

VM の仮想 NIC に VLAN タグを割り当てる例（Hardware → Network Device の編集）:

![VM NIC: VLAN Tag（例）](../../images/part2/ch6/05-vm-nic-vlan-id.png)

### 最小手順（Web UI: VM の VLAN Tag を設定する）

1. 左のツリーで対象 VM をクリックする
2. `Hardware` を開き、`Network Device`（例: `net0`）を選択して `Edit` を開く
3. `VLAN Tag` に VLAN ID（例: `20`）を指定して保存する

注意: VLAN を使う場合は、**スイッチ側がトランク設定になっていること**、およびノード側のブリッジ設定（VLAN-aware 等）と整合していることが前提です。

## 設計時の注意点

- 単一障害点を避ける（管理用ネットワークやストレージトラフィックが 1 本のリンクに集中しないようにする）
- VLAN 設定はスイッチ側とホスト側で整合性を取る
- ラボ環境では、複雑な構成を無理に再現するのではなく、目的に合った最小限のパターンで検証する

本章で整理したネットワークパターンは、後続のクラスタ・Ceph・バックアップの章で利用される前提となります。

## まとめ

- ラボでも、管理/VM/ストレージ（必要なら）といったネットワークの分け方を先に決めると手戻りを減らせます。
- Proxmox VE では Linux ブリッジを基本に、必要に応じてボンディングや VLAN を組み合わせます。
- VLAN はスイッチ側設定との整合が前提です。まずはシンプルなパターンで検証し、目的に応じて分離を進めます。
- 次に読む章: 第7章「クラスタ構成と HA」で、複数ノードの前提と流れを扱います。
