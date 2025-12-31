# Proxmox VE 書籍プロジェクト

本リポジトリは、Proxmox VE を活用したインフラ設計・運用の知見を、書籍（Markdown 原稿）として整理・管理するためのリポジトリです。
単なる機能紹介ではなく、「なぜその設計にするのか」「どのような運用体制を前提にしているのか」を言語化し、読者が自分の現場に持ち帰って応用できることを目標とします。

## 想定読者と前提知識

主な読者像と前提知識は `manuscript/ja/part0/preface.md` を参照してください。

## 対象バージョン

- 原則として **Proxmox VE 9.1（9.x 系）** を前提にします（詳細: `manuscript/ja/part0/preface.md` / `manuscript/ja/part0/env-setup.md`）。

## 目次（日本語版）

- `manuscript/ja/SUMMARY.md`

## ビルド（日本語版）

このリポジトリでは、各章の Markdown を連結し、`build/ja/book.md`（+ 任意で PDF）を生成できます。

```bash
make build-ja
```

- `pandoc` が存在する場合: `build/ja/book-ja.pdf` も生成します。
- `pandoc` がない場合: Markdown の連結のみを行います。

## ディレクトリ構成（概要）

- `manuscript/`: 原稿（章ごとの Markdown）
- `diagrams/`: 図版（SVG 等）
- `images/`: 画像（スクリーンショット等）
- `plans/`: 執筆・編集の ExecPlan

