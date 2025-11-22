# ExecPlan: JA Part I / Chapter 2 – アーキテクチャと主要コンポーネント


## 1. Metadata


- Plan ID: plans/execplan-ja-part1-ch2-architecture.md
- Title: JA Part I / Chapter 2 – アーキテクチャと主要コンポーネント
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2025-11-16
- Related issues/PRs: [TBD]




## 2. Purpose and big picture


Explain the internal architecture of Proxmox VE and its main components so that readers can reason about later configuration chapters.




## 3. Context and orientation


- Target: Readers who will design or troubleshoot Proxmox environments.
- Prerequisites: Basic understanding of Linux services and clustering.


Relevant files:
- `manuscript/ja/part1/chapter2-architecture.md`
- `diagrams/part1/ch2/architecture.svg`




## 4. Constraints and assumptions


- Focus on conceptual clarity rather than every low-level daemon.
- Align terminology with official docs.
- This pass produces an initial draft of the architecture chapter; later review passes should record their context and changes in Progress and Decision log.




## 5. Plan of work


- Phase 1: Identify key components (pve-cluster, corosync, QEMU/KVM, LXC, storage stack, etc.).
- Phase 2: Draft architecture diagrams.
- Phase 3: Write explanatory text.
- Phase 4: Cross-check with later chapters (cluster, storage).




## 6. Concrete steps


- [x] List main components and their roles in bullet form.
- [x] Design `architecture.svg` showing relationships.
- [x] Draft sections describing components and data flow.
- [x] Ensure diagrams are referenced from the text.




## 7. Validation and acceptance


- [x] Architecture diagram exists and is technically accurate at a conceptual level suitable for an initial draft.
- [x] Manuscript explains each component clearly enough for later chapters to reference.




## 8. Progress


- [2025-11-16 11:45] Plan created.
- [2025-11-16 14:05] Drafted `manuscript/ja/part1/chapter2-architecture.md` covering main components, layers, and relationships; created placeholder `diagrams/part1/ch2/architecture.svg` and referenced it from the text.




## 9. Surprises & discoveries


- Focusing on layers（ハードウェア／ホスト・仮想化基盤／ストレージ・ネットワーク／ゲスト）の整理により、詳細な daemon 名を列挙しなくても読者に全体像を伝えやすくなった。




## 10. Decision log


- Decision: Keep the architecture description at a conceptual level (layers and major components) and leave deep dives into specific services to later, topic-focused chapters.




## 11. Outcomes & retrospective


- Initial draft of Chapter 2 exists at `manuscript/ja/part1/chapter2-architecture.md`, explaining core components and their relationships with references to the lab and later chapters.
- The current architecture diagram is a placeholder SVG; a more detailed version can be added without changing the textual structure.
- For similar chapters, explicitly mapping components to later chapters (cluster, storage, backup) helps maintain consistency across the book.




## 12. Idempotence & recovery


- Safe to refine diagrams and text as understanding deepens; keep versioning via Git.
