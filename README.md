# Proxmox VE 実践ガイド

Proxmox VE をこれから本格的に活用したいインフラエンジニア／システムインテグレータ向けに、設計・運用の考え方を体系的に整理した技術書です。

- 公開ページ（GitHub Pages）: https://itdojp.github.io/proxmox_book/
- 目次（リポジトリ内）: `docs/index.md`
- シリーズ: https://github.com/itdojp/it-engineer-knowledge-architecture

## 対象読者

- これから Proxmox VE を評価・導入しようとしているインフラエンジニア
- 中小規模〜中堅規模のシステムインテグレータに所属し、オンプレミス環境の提案・構築を担当している技術者
- 既存の仮想化基盤（例: vSphere など）からの移行・並行運用を検討している技術リーダー

## 前提知識

- Linux サーバの基本的な操作（パッケージ管理、ログ確認、ネットワーク設定など）
- 仮想化の基本概念（ハイパーバイザ、仮想マシン、スナップショットなど）
- TCP/IP ネットワークの基礎（IP アドレス、ルーティング、VLAN の概要）

## 対象バージョン

本書の画面・操作例は、原則として **Proxmox VE 9.1（9.x 系）** を前提にしています。
Proxmox VE は定期的にアップデートされるため、マイナーバージョンの差で UI の位置や文言が変わることがあります。

## 執筆・ビルド（貢献者向け）

- 原稿: `manuscript/ja/`
- 章順: `manuscript/ja/SUMMARY.md`
- 結合（Markdown）: `make build-ja`（出力: `build/ja/book.md`）

## フィードバック（誤り指摘・改善提案）

誤字脱字、技術的な誤り、改善提案は Issues / Pull Request で受け付けます。

## ライセンス

本書は Creative Commons BY-NC-SA 4.0 で提供されています。詳細は `LICENSE.md` を参照してください。
