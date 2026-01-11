---
layout: book
order: 1
title: "Proxmox VE 実践ガイド"
description: "Proxmox VE を実務で活用するための設計・運用の考え方を体系的に学ぶ技術書"
author: "株式会社アイティードゥ"
version: "1.0.0"
permalink: /
---

# Proxmox VE 実践ガイド

Proxmox VE をこれから本格的に活用したいインフラエンジニア／システムインテグレータ向けに、実務で役に立つ知識と設計・運用の考え方を体系的に整理した技術書です。

## 対象バージョン

本書の画面・操作例は、原則として **Proxmox VE 9.1（9.x 系）** を前提にしています。
マイナーバージョンの差で UI の位置や文言が変わることがあるため、本書の「画面の開き方（どこをクリックするか）」を手がかりに読み替えてください。

## この本でできるようになること

- Proxmox VE の位置づけと、想定しやすい利用シーン（向き・不向き）を説明できるようになる。
- 単一ノードから小〜中規模クラスタまでを前提に、ストレージ・ネットワーク・クラスタ・バックアップの設計判断を整理できるようになる。
- UI 手順や運用の観点を読み替えながら、自分の現場に持ち帰って応用できるようになる。

## 読み方の目安

- まずは「はじめに」と「執筆環境・検証環境の準備」を読み、ラボ環境の前提を決めてから読み進めることを推奨します。
- 単一ノード構成で基本操作（第1〜4章）を確認したうえで、関心の高い領域（ストレージ／ネットワーク／クラスタ／バックアップ）へ進んで構いません。
- 既存の仮想化基盤からの移行・並行運用を検討している場合は、第9〜10章も早めに参照し、運用観点の差分を把握すると手戻りを減らせます。

## 📚 目次

### はじめに
- **[はじめに](introduction/)** - 本書の目的と読み方
- **[執筆環境・検証環境の準備](introduction/env-setup/)** - ラボ構成の前提と準備

### Part I: 基本操作
- **[第1章　Proxmox VE の概要とポジショニング](chapters/chapter-01-overview/)**
- **[第2章　アーキテクチャと主要コンポーネント](chapters/chapter-02-architecture/)**
- **[第3章　Proxmox VE のインストール](chapters/chapter-03-proxmox-install/)**
- **[第4章　仮想マシンの作成と基本操作](chapters/chapter-04-vm-basics/)**

### Part II: 設計（ストレージ／ネットワーク）
- **[第5章　ストレージ構成（ZFS / LVM / Ceph の基礎）](chapters/chapter-05-storage/)**
- **[第6章　ネットワーク設計と VLAN](chapters/chapter-06-network/)**

### Part III: クラスタ・保護
- **[第7章　クラスタ構成と HA](chapters/chapter-07-cluster-ha/)**
- **[第8章　バックアップ・リストアとレプリケーション](chapters/chapter-08-backup/)**

### Part IV: 運用・エンタープライズ連携
- **[第9章　運用・監視・トラブルシュート](chapters/chapter-09-operations/)**
- **[第10章　エンタープライズ連携・事例ベースの設計指針](chapters/chapter-10-enterprise/)**

## 📄 ライセンス

本書は **Creative Commons BY-NC-SA 4.0** ライセンスで公開されています。  
詳細は https://github.com/itdojp/it-engineer-knowledge-architecture/blob/main/LICENSE.md を参照してください。

{% include page-navigation.html %}
