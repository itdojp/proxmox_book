#!/usr/bin/env python3
from __future__ import annotations

import shutil
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MANUSCRIPT_JA_DIR = REPO_ROOT / "manuscript" / "ja"
DOCS_DIR = REPO_ROOT / "docs"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not content.endswith("\n"):
        content += "\n"
    path.write_text(content, encoding="utf-8")


def strip_first_heading(markdown: str) -> str:
    lines = markdown.splitlines()
    if lines and lines[0].lstrip().startswith("#"):
        lines = lines[1:]
        while lines and not lines[0].strip():
            lines = lines[1:]
    return "\n".join(lines).rstrip() + "\n"


def rewrite_asset_paths_for_docs(markdown: str) -> str:
    return (
        markdown.replace("../../../images/", "../../images/")
        .replace("../../../diagrams/", "../../diagrams/")
        .rstrip()
        + "\n"
    )


def sync_tree(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def sync_introduction_pages() -> None:
    preface_src = MANUSCRIPT_JA_DIR / "part0" / "preface.md"
    env_setup_src = MANUSCRIPT_JA_DIR / "part0" / "env-setup.md"

    preface_body = rewrite_asset_paths_for_docs(strip_first_heading(read_text(preface_src)))
    intro_index = (
        "---\n"
        "layout: book\n"
        'title: "はじめに"\n'
        "order: 2\n"
        "---\n\n"
        "# はじめに\n\n"
        f"{preface_body}"
    )
    write_text(DOCS_DIR / "introduction" / "index.md", intro_index)

    env_setup_body = rewrite_asset_paths_for_docs(read_text(env_setup_src))
    intro_env = (
        "---\n"
        "layout: book\n"
        'title: "執筆環境・検証環境の準備"\n'
        "order: 3\n"
        "---\n\n"
        f"{env_setup_body}"
    )
    write_text(DOCS_DIR / "introduction" / "env-setup.md", intro_env)


def sync_chapter_pages() -> None:
    mapping: list[tuple[Path, Path]] = [
        (
            MANUSCRIPT_JA_DIR / "part1" / "chapter1-overview.md",
            DOCS_DIR / "chapters" / "chapter-01-overview.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part1" / "chapter2-architecture.md",
            DOCS_DIR / "chapters" / "chapter-02-architecture.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part1" / "chapter3-proxmox-install.md",
            DOCS_DIR / "chapters" / "chapter-03-proxmox-install.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part1" / "chapter4-vm-basics.md",
            DOCS_DIR / "chapters" / "chapter-04-vm-basics.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part2" / "chapter5-storage.md",
            DOCS_DIR / "chapters" / "chapter-05-storage.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part2" / "chapter6-network.md",
            DOCS_DIR / "chapters" / "chapter-06-network.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part3" / "chapter7-cluster-ha.md",
            DOCS_DIR / "chapters" / "chapter-07-cluster-ha.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part3" / "chapter8-backup.md",
            DOCS_DIR / "chapters" / "chapter-08-backup.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part4" / "chapter9-operations.md",
            DOCS_DIR / "chapters" / "chapter-09-operations.md",
        ),
        (
            MANUSCRIPT_JA_DIR / "part4" / "chapter10-enterprise.md",
            DOCS_DIR / "chapters" / "chapter-10-enterprise.md",
        ),
    ]

    for src, dst in mapping:
        write_text(dst, rewrite_asset_paths_for_docs(read_text(src)))


def main() -> int:
    if not MANUSCRIPT_JA_DIR.exists():
        raise SystemExit(f"missing directory: {MANUSCRIPT_JA_DIR}")
    if not DOCS_DIR.exists():
        raise SystemExit(f"missing directory: {DOCS_DIR}")

    sync_introduction_pages()
    sync_chapter_pages()

    sync_tree(REPO_ROOT / "images", DOCS_DIR / "images")
    sync_tree(REPO_ROOT / "diagrams", DOCS_DIR / "diagrams")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

