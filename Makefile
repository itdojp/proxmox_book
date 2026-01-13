JA_BUILD_DIR := build/ja
JA_CHAPTERS := \
	manuscript/ja/part0/preface.md \
	manuscript/ja/part0/env-setup.md \
	manuscript/ja/part1/chapter1-overview.md \
	manuscript/ja/part1/chapter2-architecture.md \
	manuscript/ja/part1/chapter3-proxmox-install.md \
	manuscript/ja/part1/chapter4-vm-basics.md \
	manuscript/ja/part2/chapter5-storage.md \
	manuscript/ja/part2/chapter6-network.md \
	manuscript/ja/part3/chapter7-cluster-ha.md \
	manuscript/ja/part3/chapter8-backup.md \
	manuscript/ja/part4/chapter9-operations.md \
	manuscript/ja/part4/chapter10-enterprise.md

.PHONY: build-ja sync-docs-ja check-ja

build-ja: $(JA_BUILD_DIR)/book.md
	@echo "build-ja: combined manuscript is at $(JA_BUILD_DIR)/book.md"
	@if command -v pandoc >/dev/null 2>&1; then \
		echo "pandoc detected; generating PDF at $(JA_BUILD_DIR)/book-ja.pdf"; \
		pandoc -o $(JA_BUILD_DIR)/book-ja.pdf $(JA_BUILD_DIR)/book.md || echo "pandoc failed; check your pandoc installation."; \
	else \
		echo "pandoc not found; skipped PDF generation. You can install pandoc and rerun make build-ja to produce a PDF."; \
	fi

sync-docs-ja:
	python3 tools/sync_docs_ja.py

check-ja: build-ja sync-docs-ja
	@git diff --exit-code
	@echo "check-ja: OK (no diff after build-ja + sync-docs-ja)"

$(JA_BUILD_DIR):
	mkdir -p $(JA_BUILD_DIR)

$(JA_BUILD_DIR)/book.md: $(JA_CHAPTERS) | $(JA_BUILD_DIR)
	cat $(JA_CHAPTERS) | sed -e 's|../../../images/|../../images/|g' -e 's|../../../diagrams/|../../diagrams/|g' > $(JA_BUILD_DIR)/book.md
