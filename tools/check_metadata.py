#!/usr/bin/env python3
"""Validate repository metadata and published route consistency for proxmox_book."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
EXPECTED_REPO = "https://github.com/itdojp/proxmox_book"
EXPECTED_REPO_GIT = f"{EXPECTED_REPO}.git"
EXPECTED_HOMEPAGE = "https://itdojp.github.io/proxmox_book/"
EXPECTED_ORIGIN = "https://itdojp.github.io"
EXPECTED_BASEURL = "/proxmox_book"
REQUIRED_ASSETS = [
    "docs/assets/css/main.css",
    "docs/assets/css/syntax-highlighting.css",
    "docs/assets/js/theme.js",
    "docs/assets/js/search.js",
    "docs/assets/js/code-copy-lightweight.js",
    "docs/_layouts/book.html",
    "docs/_includes/page-navigation.html",
    "docs/_includes/sidebar-nav.html",
]

errors: list[str] = []


def fail(path: str, message: str) -> None:
    errors.append(f"{path}: {message}")


def read_text(rel: str) -> str:
    path = ROOT / rel
    try:
        return path.read_text(encoding="utf-8")
    except OSError as exc:
        fail(rel, f"ファイルを読めません: {exc}")
        return ""


def read_json(rel: str) -> dict[str, Any]:
    text = read_text(rel)
    if not text:
        return {}
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        fail(rel, f"JSONを解析できません: {exc}")
        return {}
    if not isinstance(data, dict):
        fail(rel, "JSON root は object にしてください")
        return {}
    return data


def unquote(value: str) -> str:
    value = value.strip()
    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
        return value[1:-1]
    return value


def parse_top_level_yaml(rel: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for raw in read_text(rel).splitlines():
        if not raw.strip() or raw.lstrip().startswith("#") or raw.startswith((" ", "\t", "-")):
            continue
        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", raw)
        if match and match.group(2).strip():
            result[match.group(1)] = unquote(match.group(2))
    return result


def parse_front_matter(rel: str) -> dict[str, str]:
    text = read_text(rel)
    if not text.startswith("---\n"):
        fail(rel, "YAML front matter がありません")
        return {}
    end = text.find("\n---", 4)
    if end < 0:
        fail(rel, "YAML front matter の終了マーカーがありません")
        return {}
    result: dict[str, str] = {}
    for raw in text[4:end].splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", raw)
        if match:
            result[match.group(1)] = unquote(match.group(2))
    return result


def parse_navigation(rel: str) -> list[dict[str, str | int]]:
    entries: list[dict[str, str | int]] = []
    current: dict[str, str | int] | None = None
    current_indent = 0
    for line_no, raw in enumerate(read_text(rel).splitlines(), start=1):
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        stripped = raw.strip()
        item = re.match(r"^-\s+(title|path):\s*(.+)$", stripped)
        if item:
            if current and current.get("title") and current.get("path"):
                entries.append(current)
            current = {item.group(1): unquote(item.group(2)), f"{item.group(1)}_line": line_no}
            current_indent = indent
            continue
        if stripped.startswith("- "):
            if current and current.get("title") and current.get("path"):
                entries.append(current)
            current = None
            continue
        field = re.match(r"^(title|path):\s*(.+)$", stripped)
        if field and current is not None and indent > current_indent:
            current[field.group(1)] = unquote(field.group(2))
            current[f"{field.group(1)}_line"] = line_no
    if current and current.get("title") and current.get("path"):
        entries.append(current)
    return entries


def expect_equal(path: str, field: str, actual: Any, expected: Any) -> None:
    if actual != expected:
        fail(path, f"{field} は {expected!r} にしてください（現在: {actual!r}）")


def safe_route(route: Any, context: str, source: str) -> str | None:
    if not isinstance(route, str):
        fail(source, f"{context} の path は文字列である必要があります")
        return None
    if not route.startswith("/"):
        fail(source, f"{context} の path は / から始めてください: {route}")
    if ".." in route or "//" in route or re.search(r"[?#%\\]", route):
        fail(source, f"{context} の path が不正です: {route}")
    if not route.endswith("/"):
        fail(source, f"{context} の path は / で終えてください: {route}")
    return route


def route_candidates(route: str) -> list[Path]:
    if route == "/":
        return [DOCS / "index.md"]
    rel = route.strip("/")
    return [DOCS / rel / "index.md", DOCS / f"{rel}.md"]


def route_exists(route: str) -> bool:
    return any(path.is_file() and path.stat().st_size > 0 for path in route_candidates(route))


book = read_json("book-config.json")
for field in ["title", "description", "author", "version", "language", "license"]:
    if not book.get(field):
        fail("book-config.json", f"{field} を設定してください")
expect_equal("book-config.json", "homepage", book.get("homepage"), EXPECTED_HOMEPAGE)
expect_equal("book-config.json", "repository.url", (book.get("repository") or {}).get("url"), EXPECTED_REPO_GIT)
expect_equal("book-config.json", "repository.branch", (book.get("repository") or {}).get("branch"), "main")

cfg = parse_top_level_yaml("docs/_config.yml")
for field in ["title", "description", "author", "version", "license"]:
    expect_equal("docs/_config.yml", field, cfg.get(field), book.get(field))
expect_equal("docs/_config.yml", "lang", cfg.get("lang"), book.get("language"))
expect_equal("docs/_config.yml", "url", cfg.get("url"), EXPECTED_ORIGIN)
expect_equal("docs/_config.yml", "baseurl", cfg.get("baseurl"), EXPECTED_BASEURL)
expect_equal("docs/_config.yml", "repository", cfg.get("repository"), EXPECTED_REPO)
expect_equal("docs/_config.yml", "homepage", cfg.get("homepage"), EXPECTED_HOMEPAGE)

front = parse_front_matter("docs/index.md")
for field in ["title", "description", "author", "version"]:
    expect_equal("docs/index.md", field, front.get(field), book.get(field))
expect_equal("docs/index.md", "permalink", front.get("permalink"), "/")

nav_entries = parse_navigation("docs/_data/navigation.yml")
if not nav_entries:
    fail("docs/_data/navigation.yml", "navigation entry がありません")
seen_paths: set[str] = set()
for index, entry in enumerate(nav_entries):
    context = f"entry[{index}]"
    if not entry.get("title"):
        fail("docs/_data/navigation.yml", f"{context}.title を設定してください")
    route = safe_route(entry.get("path"), context, "docs/_data/navigation.yml")
    if not route:
        continue
    if route in seen_paths:
        fail("docs/_data/navigation.yml", f"path が重複しています: {route}")
    seen_paths.add(route)
    if not route_exists(route):
        candidates = ", ".join(str(p.relative_to(ROOT)) for p in route_candidates(route))
        fail("docs/_data/navigation.yml", f"{context}.path に対応する docs ソースがありません: {route}（候補: {candidates}）")

chapter_count = len((book.get("structure") or {}).get("chapters") or [])
if chapter_count != 10:
    fail("book-config.json", f"structure.chapters は 10 件にしてください（現在: {chapter_count}）")
nav_chapter_count = sum(1 for route in seen_paths if route.startswith("/chapters/"))
if nav_chapter_count != chapter_count:
    fail("docs/_data/navigation.yml", f"chapter navigation は book-config の章数 {chapter_count} 件と一致させてください（現在: {nav_chapter_count}）")

for asset in REQUIRED_ASSETS:
    path = ROOT / asset
    if not path.is_file() or path.stat().st_size == 0:
        fail(asset, "公開サイトに必要なアセットまたはレイアウトがありません")

readme = read_text("README.md")
for needle in [EXPECTED_HOMEPAGE, "make check-ja", "tools/check_metadata.py"]:
    if needle not in readme:
        fail("README.md", f"{needle} を記載してください")

if errors:
    print("Metadata consistency check failed:", file=sys.stderr)
    for error in errors:
        print(f"- {error}", file=sys.stderr)
    raise SystemExit(1)

print(f"Metadata consistency check passed: {len(nav_entries)} navigation routes, {len(REQUIRED_ASSETS)} required assets.")
