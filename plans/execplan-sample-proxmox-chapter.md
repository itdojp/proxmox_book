# ExecPlan: JA Part I / Chapter 3 – Proxmox VE 初期インストール


## 1. Metadata


- Plan ID: plans/execplan-sample-proxmox-chapter.md
- Title: JA Part I / Chapter 3 – Proxmox VE 初期インストール
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2025-11-16
- Confidentiality: do not show real IP addresses or hostname conventions from production; use neutral examples.
- Related issues/PRs: [TBD]




## 5. Plan of work


- Phase 1: Define detailed outline for the chapter.
- Phase 2: Draft text for all sections.
- Phase 3: Capture or generate screenshots and diagrams.
- Phase 4: Technical accuracy pass and cross-check against Proxmox 9.x behavior.
- Phase 5: Language/style pass for clarity and consistency.
- Phase 6: Build and validation.




## 6. Concrete steps


- [x] Read the preceding chapters (`chapter1-overview.md`, `chapter2-architecture.md`) to avoid duplication and ensure smooth transition.
- [x] Propose and write an outline for `chapter3-proxmox-install.md` including:
  1. 章のゴール
  2. 対象読者と前提
  3. インストール前の準備（ハードウェア・BIOS 設定・ISO 入手）
  4. インストーラの画面遷移と入力項目
  5. 初期 Web GUI アクセスと最低限の確認
  6. よくあるつまずきポイント
- [x] Implement the outline as headings and placeholder paragraphs in the manuscript file.
- [ ] Perform one clean installation run in the reference environment and record notes.
- [ ] Capture key screenshots for installer steps and initial login; save into `images/part1/ch3/` (placeholder directory and references can be created before actual screenshots).
- [x] Add at least one diagram in `diagrams/part1/ch3/install-flow.svg` showing the high-level install flow.
- [x] Fill in detailed step-by-step prose, using the screenshots and diagram as references.
- [x] Add a short troubleshooting subsection for common install issues.
- [x] Update any TOC or summary files (e.g., `SUMMARY.md`) to reflect the final section titles (once such a file exists).
- [x] Run `make build-ja` and confirm the chapter is included in `build/ja/book.md` (and, if `pandoc` is available, in `build/ja/book-ja.pdf`).




## 7. Validation and acceptance


This plan is complete when:


- [x] `manuscript/ja/part1/chapter3-proxmox-install.md` contains a full draft with all planned sections.
- [x] All referenced images and diagrams exist at the specified paths (screenshots may be represented by TODOs/placeholders until captured).
- [x] `make build-ja` completes successfully, and `build/ja/book.md` includes the chapter.
- [ ] (When `pandoc` is installed) `build/ja/book-ja.pdf` includes the chapter with acceptable page breaks.
- [ ] A technical reviewer (Ota) has skimmed the chapter and confirmed that installation steps match Proxmox 9.x behavior.


How to validate:


- Run `make build-ja` from the project root.
- Open the generated PDF and verify that:
- Headings hierarchy is correct.
- Screenshots are readable.
- Page layout around long screenshots is acceptable.




## 8. Progress


- [2025-11-16 11:00] Plan created and initial outline drafted.
- [2025-11-16 14:20] Created `manuscript/ja/part1/chapter3-proxmox-install.md` with all planned sections, added an initial install-flow diagram at `diagrams/part1/ch3/install-flow.svg`, and prepared `images/part1/ch3/` for future screenshots.
- [2025-11-16 15:35] Added `manuscript/ja/SUMMARY.md` and ensured Chapter 3 is listed with a consistent title and path.
- [2025-11-16 16:10] Ran `make build-ja` and confirmed that `build/ja/book.md` includes Chapter 3.


(Add further entries as work progresses.)




## 9. Surprises & discoveries


- `make build-ja` exists, but PDF generation depends on `pandoc`; in environments without `pandoc`, only the combined Markdown is generated.




## 10. Decision log


- Decision: Proceed with a text-complete draft and placeholder diagram/paths for screenshots, leaving the actual screenshot capture and PDF layout validation to a later pass when a reference environment and PDF tooling are available.




## 11. Outcomes & retrospective


- Status: text-draft
- Status: assets-pending (スクリーンショット未取得)
- Status: build-validated (`build/ja/book.md` に含まれることを確認済み)
- Initial draft of Chapter 3 exists at `manuscript/ja/part1/chapter3-proxmox-install.md`, covering goals, prerequisites, preparation, installer flow, first login, and common pitfalls.
- Placeholder diagram `diagrams/part1/ch3/install-flow.svg` and screenshot directory `images/part1/ch3/` are in place, making it straightforward to wire in real assets later.
- For future similar chapters, separating “text-complete draft” and “asset-complete & build-validated” states in the ExecPlan helps track what remains when tooling or environments are temporarily unavailable.




## 12. Idempotence & recovery


- It is safe to re-run the build step (`make build-ja`) at any time.
- When rewriting sections, keep previous versions in Git history rather than separate backup files.
- If a contributor stops mid-way, they should:
  - Read this ExecPlan from start to end.
  - Review `Progress`, `Decision log`, and the Git history for the manuscript file.
  - Continue from the next unchecked item in the Concrete steps checklist.
