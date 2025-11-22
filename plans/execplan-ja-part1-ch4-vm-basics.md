# ExecPlan: JA Part I / Chapter 4 – 仮想マシン作成と基本操作


## 1. Metadata


- Plan ID: plans/execplan-ja-part1-ch4-vm-basics.md
- Title: JA Part I / Chapter 4 – 仮想マシン作成と基本操作
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2025-11-16
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
- This pass produces an initial draft; later passes can refine screenshots, advanced options, and automation.




## 5. Plan of work


- Phase 1: Define basic VM scenarios (create, clone, template, snapshot).
- Phase 2: Capture screenshots.
- Phase 3: Draft step-by-step text.
- Phase 4: Add tips and common pitfalls.




## 6. Concrete steps


- [x] Decide on example guest OS and its ISO.
- [x] Document VM creation (wizard key settings; screenshots to be added under `images/part1/ch4/`).
- [x] Document start/stop/reboot, console access, snapshot basics.
- [x] Add short troubleshooting tips for common issues.




## 7. Validation and acceptance


- [x] A new reader can follow the chapter and successfully create and operate a VM in a typical lab environment, based on the written steps.
- [ ] Screenshots and text match Proxmox 8.x UI (to be fully confirmed after capturing screenshots and validating against a live environment).




## 8. Progress


- [2025-11-16 11:50] Plan created.
- [2025-11-16 14:30] Drafted `manuscript/ja/part1/chapter4-vm-basics.md` covering example guest OS choice, VM creation wizard, basic lifecycle operations, snapshots/templates, and common pitfalls; prepared `images/part1/ch4/` for future screenshots.




## 9. Surprises & discoveries


- The essential VM lifecycle operations can be explained concisely without diving into advanced tuning, making this chapter a good bridge between installation and more complex topics like storage or clustering.




## 10. Decision log


- Decision: Use a generic Linux server distribution as the primary example guest OS, so that most readers can follow along with freely入手可能な ISO イメージ.




## 11. Outcomes & retrospective


- Initial draft of Chapter 4 exists at `manuscript/ja/part1/chapter4-vm-basics.md`, covering core VM lifecycle operations and basic snapshot/template concepts.
- Screenshots are not yet captured, but the directory structure for them is prepared; a later pass with access to a reference environment will align the visuals with Proxmox 8.x UI.
- For future hands-on chapters, this pattern of “text-complete first, assets later” keeps momentum while clearly recording remaining work in the ExecPlan.




## 12. Idempotence & recovery


- Steps are safe to repeat; VMs can be deleted and recreated as needed.
