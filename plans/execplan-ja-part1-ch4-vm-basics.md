# ExecPlan: JA Part I / Chapter 4 – 仮想マシン作成と基本操作


## 1. Metadata


- Plan ID: plans/execplan-ja-part1-ch4-vm-basics.md
- Title: JA Part I / Chapter 4 – 仮想マシン作成と基本操作
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2026-01-11
- Related issues/PRs: [TBD]




## 2. Purpose and big picture


Teach readers how to create, start, stop, and manage basic VMs in Proxmox VE after installation.




## 3. Context and orientation


- Assumes that Chapter 3 (installation) is complete.
- Readers have a working Proxmox node or lab.


Files:
- `manuscript/ja/part1/chapter4-vm-basics.md`
- `images/part1/ch4/` for screenshots.




## 4. Constraints and assumptions


- Focus on VM lifecycle and essential settings; advanced tuning in later chapters.
- Use a simple Linux guest as example.
- Target Proxmox VE version for this book: 9.1 (9.x).
- This pass produces an initial draft; later passes can refine screenshots, advanced options, and automation.




## 5. Plan of work


- Phase 1: Define basic VM scenarios (create, clone, template, snapshot).
- Phase 2: Capture screenshots.
- Phase 3: Draft step-by-step text.
- Phase 4: Add tips and common pitfalls.
- Phase 5: Beginner pass (goals, example values, success criteria, diagram readability).




## 6. Concrete steps


- [x] Decide on example guest OS and its ISO.
- [x] Document VM creation (wizard key settings; screenshots to be added under `images/part1/ch4/`).
- [x] Document start/stop/reboot, console access, snapshot basics.
- [x] Add short troubleshooting tips for common issues.
- [x] Add beginner-friendly framing (“この章で分かること/分からないこと”, prerequisites) and concrete example values (CPU/memory/disk).
- [x] Add a minimal diagram under `diagrams/part1/ch4/` to visualize the VM creation wizard and key decisions.




## 7. Validation and acceptance


- [x] A new reader can follow the chapter and successfully create and operate a VM in a typical lab environment, based on the written steps.
- [x] Screenshots and text match Proxmox 9.1 UI (Create VM wizard screenshots captured on a live 9.1.1 environment).
- [x] Diagram exists and is no longer a placeholder.




## 8. Progress


- [2025-11-16 11:50] Plan created.
- [2025-11-16 14:30] Drafted `manuscript/ja/part1/chapter4-vm-basics.md` covering example guest OS choice, VM creation wizard, basic lifecycle operations, snapshots/templates, and common pitfalls; prepared `images/part1/ch4/` for future screenshots.
- [2025-12-21] Updated plan for a beginner-focused revision pass aligned to Proxmox VE 9.1.
- [2025-12-21] Added beginner framing and example values to `chapter4-vm-basics.md`, added `diagrams/part1/ch4/vm-create-flow.svg`, and kept screenshots as TODO (Issue #2).
- [2026-01-11] Updated `chapter4-vm-basics.md` to avoid pointing readers to internal Issue numbers; clarified that screenshots are pending and how to proceed without them.
- [2026-01-14] Captured and embedded Create VM wizard screenshots (General/OS/System/Disks/CPU/Memory/Network) and validated `make check-ja` (PR #70).




## 9. Surprises & discoveries


- The essential VM lifecycle operations can be explained concisely without diving into advanced tuning, making this chapter a good bridge between installation and more complex topics like storage or clustering.




## 10. Decision log


- Decision: Use a generic Linux server distribution as the primary example guest OS, so that most readers can follow along with a freely available ISO image.
- Decision: Avoid referencing internal GitHub Issue IDs in reader-facing text; track screenshot work in Issues and `images/README.md` instead.




## 11. Outcomes & retrospective


- Status: text-draft
- Status: assets-partial（Create VM wizard は反映済み。VM 詳細/コンソール/スナップショットは未取得）
- Status: build-validated (`build/ja/book.md` に含まれることを確認済み)
- Initial draft of Chapter 4 exists at `manuscript/ja/part1/chapter4-vm-basics.md`, covering core VM lifecycle operations and basic snapshot/template concepts.
- The wizard flow diagram is available at `diagrams/part1/ch4/vm-create-flow.svg`, and Create VM wizard screenshots are now embedded in the chapter (Proxmox VE 9.1.1).
- For future hands-on chapters, this pattern of “text-complete first, assets later” keeps momentum while clearly recording remaining work in the ExecPlan.




## 12. Idempotence & recovery


- Steps are safe to repeat; VMs can be deleted and recreated as needed.
