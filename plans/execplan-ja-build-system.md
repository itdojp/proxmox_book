# ExecPlan: JA Build System – `make build-ja`


## 1. Metadata


- Plan ID: plans/execplan-ja-build-system.md
- Title: JA Build System – `make build-ja`
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2025-12-21
- Related issues/PRs: [TBD]




## 2. Purpose and big picture


Provide a simple, reproducible build entry point (`make build-ja`) that:
- Concatenates the Japanese manuscript files in the intended reading order into a single Markdown file.
- Optionally generates a PDF when tools like `pandoc` are available.




## 3. Context and orientation


- Manuscript files live under `manuscript/ja/`.
- A high-level TOC exists at `manuscript/ja/SUMMARY.md`.
- The `build/` directory is available for outputs.


Relevant files:
- `Makefile` (to be created or updated)
- `manuscript/ja/SUMMARY.md`
- All chapter files under `manuscript/ja/part*/`.




## 4. Constraints and assumptions


- Do not introduce heavy new dependencies in this pass; rely on external tools (e.g., `pandoc`) only if they are already installed.
- `make build-ja` must succeed even if `pandoc` is not present (e.g., by generating Markdown only and emitting a clear message).
- Keep the build logic simple and transparent; avoid complex scripting.




## 5. Plan of work


- Phase 1: Define chapter order for the Japanese edition based on `SUMMARY.md`.
- Phase 2: Implement a Makefile with a `build-ja` target that concatenates chapters into `build/ja/book.md`.
- Phase 3: Add optional PDF generation using `pandoc` when available.
- Phase 4: Run `make build-ja` once and record the outcome.




## 6. Concrete steps


- [x] Confirm the desired chapter order via `manuscript/ja/SUMMARY.md`.
- [x] Add a `Makefile` with:
  - A `build-ja` target.
  - A rule to create `build/ja/book.md` by concatenating all chapter files in order.
  - An optional rule to create `build/ja/book-ja.pdf` using `pandoc` when available.
- [x] Run `make build-ja` and note whether `pandoc` is available.
- [x] Update relevant ExecPlans (e.g., Chapter 3 sample plan) to reflect that `make build-ja` now exists and can be used for validation.




## 7. Validation and acceptance


The build system is considered acceptable for this pass when:

- [x] `make build-ja` completes successfully on a typical environment without additional setup.
- [x] `build/ja/book.md` exists and contains all chapters in the order defined by `manuscript/ja/SUMMARY.md`.
- [ ] When `pandoc` is installed, `build/ja/book-ja.pdf` is generated without errors.
- [x] ExecPlans that reference `make build-ja` as a validation step explicitly note any remaining limitations (e.g., layout checks or reviewer confirmation).




## 8. Progress


- [2025-11-16 15:50] Plan created; TOC at `manuscript/ja/SUMMARY.md` reflects all current JA chapters.
- [2025-11-16 15:55] Implemented `Makefile` with `build-ja` target, generated `build/ja/book.md`, and confirmed that `make build-ja` succeeds; PDF generation is skipped when `pandoc` is not installed.
- [2025-12-21] Fixed a Makefile dependency issue so `build/ja/book.md` is rebuilt when chapter files change; reran `make build-ja` (Markdown ok / `pandoc` not installed).




## 9. Surprises & discoveries


- `make build-ja` can provide useful value (combined manuscript) even without PDF tooling, and clearly messaging the optional `pandoc` step avoids confusing failures.
- The initial `build/ja/book.md` rule did not depend on chapter files, so `make build-ja` could leave stale output; adding `$(JA_CHAPTERS)` as a dependency fixes this.




## 10. Decision log


- Decision: Keep the JA build pipeline minimal for now (concatenated Markdown plus optional `pandoc`), and iterate later if a richer toolchain (e.g., dedicated book builder) is introduced.




## 11. Outcomes & retrospective


- Status: build-validated (`make build-ja` は成功 / `build/ja/book.md` 生成済み)
- Status: assets-pending (`pandoc` がある環境での PDF 生成は未確認)
- A working `build-ja` entry point now exists via the project `Makefile`, producing `build/ja/book.md` in chapter order based on the JA manuscript.
- The pipeline is intentionally simple and safe to rerun; future improvements can layer on top without breaking the current behavior.




## 12. Idempotence & recovery


- Running `make build-ja` is safe and can be repeated as manuscripts evolve.
- If chapter files are added or renamed, update the Makefile chapter list (and `SUMMARY.md`) accordingly, then rerun the build.
