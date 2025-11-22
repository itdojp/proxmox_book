# PLANS for Proxmox Book Project
- [ ] Draft section "3.1 Proxmox VE の概要" with focus on use cases and positioning vs competitors.
- [ ] Draft section "3.2 システム要件と推奨構成" with hardware and network considerations.
- [ ] Add diagram `diagrams/part1/ch3/proxmox-architecture.svg` explaining the main components.
- [ ] Add example configuration snippets under `examples/part1/ch3/`.
- [ ] Update `SUMMARY.md` or TOC file to include the new chapter/sections.
- [ ] Run `make build-ja` to generate the Japanese PDF.


Where relevant, include exact commands or scripts, but avoid using nested code fences; use indentation instead.




# 7. Validation and acceptance


Define observable acceptance criteria.


Examples:
- [ ] `make build-ja` completes successfully without errors.
- [ ] The chapter file `manuscript/ja/part1/chapter3-proxmox-install.md` exists and covers the agreed outline.
- [ ] All Proxmox version numbers and commands have been cross-checked against the official documentation.
- [ ] Internal linting or style checks (if any) pass.
- [ ] Reviewer checklist items are addressed (link to their list if available).


Include instructions on how to run these validations and what outputs to expect.




# 8. Progress


Maintain a running log of progress with timestamps.


Examples:
- [2025-11-16 10:30] Created initial outline for Chapter 3.
- [2025-11-16 12:00] Drafted sections 3.1 and 3.2.
- [2025-11-16 15:30] Added architecture diagram and wiring into manuscript.


Each entry should mention what was done and any partial completion of steps.




# 9. Surprises & discoveries


Record unexpected findings, obstacles, or important clarifications.


Examples:
- Discovered that the Proxmox installer UI changed in version 8.x; screenshots and flow need updating.
- Found that existing diagram overlaps conceptually with a later chapter; decided to reference instead of duplicating.


This section is critical for future readers to understand why the plan evolved.




# 10. Decision log


Record important decisions and their reasoning.


Examples:
- Decision: Use a single chapter for installation (bare metal + nested virtualization) instead of two separate chapters.
- Reason: Reduces duplication and keeps the TOC shallow.
- Decision: Use Japanese UI labels instead of English for screenshots.
- Reason: Matches the environment most readers will see.




# 11. Outcomes & retrospective


Summarize what was actually achieved and any lessons learned.


- What new or updated files were produced?
- Does the result differ from the original plan? Why?
- What should we do differently for the next similar ExecPlan?


This section is especially useful for improving future book tasks.




# 12. Idempotence & recovery


Document how safe it is to re-run the steps and how to recover from partial execution.


- Which steps are safe to repeat? (e.g., regenerating diagrams, rebuilding PDFs)
- Which steps require caution? (e.g., renaming or deleting files)
- If the work is partially completed, how should a new contributor proceed?


The goal is to make it safe to resume or adjust the plan without losing work.
