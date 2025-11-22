# ExecPlan: JA Part II / Chapter 5 – ストレージ構成（ZFS/LVM/Ceph の基礎）


## 1. Metadata


- Plan ID: plans/execplan-ja-part2-ch5-storage.md
- Title: JA Part II / Chapter 5 – ストレージ構成（ZFS/LVM/Ceph の基礎）
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2025-11-16
- Related issues/PRs: [TBD]




## 2. Purpose and big picture


Provide a practical introduction to the main storage options in Proxmox VE and how to choose between them.




## 3. Context and orientation


- Reader has basic VM management knowledge.
- Storage concepts (RAID, thin provisioning) may need brief review.


Files:
- `manuscript/ja/part2/chapter5-storage.md`
- `diagrams/part2/ch5/storage-layout.svg`




## 4. Constraints and assumptions


- Do not attempt to cover all Ceph details; focus on what is needed for this book's scenarios.
- Emphasize trade-offs and typical patterns.
- Align examples with the lab patterns defined in Part 0 (single-node and 3-node nested cluster) and the cluster/HA ExecPlan in Part III.




## 5. Plan of work


- Phase 1: Summarize ZFS, LVM, Ceph roles.
- Phase 2: Draft decision guidelines.
- Phase 3: Write configuration examples at a high level.
- Phase 4: Align with later HA/cluster chapters.




## 6. Concrete steps


- [x] List supported storage backends relevant to the book.
- [x] Draft sections for each backend (concept + when to use).
- [x] Add comparison table (features, pros/cons).
- [x] Add one or two typical storage layout examples.




## 7. Validation and acceptance


- [x] Reader can pick a suitable backend for small lab vs larger deployment, based on the guidance in the chapter.
- [x] Diagrams and examples are conceptually consistent with later cluster/HA chapters and the lab patterns defined in Part 0.




## 8. Progress


- [2025-11-16 11:55] Plan created.
- [2025-11-16 14:45] Drafted `manuscript/ja/part2/chapter5-storage.md` with sections for LVM, ZFS, and Ceph, including lab-oriented selection patterns and created placeholder diagram `diagrams/part2/ch5/storage-layout.svg`.
- [2025-11-16 15:40] Added a concise comparison table summarizing LVM/ZFS/Ceph use cases, strengths, and caveats.




## 9. Surprises & discoveries


- Clearly tying storage choices to the previously defined lab patterns (single-node vs 3-node cluster) makes it easier for readers to decide without exhaustive feature-by-feature comparisons.




## 10. Decision log


- Decision: Focus configuration-level discussion on when to use LVM/ZFS/Ceph and their trade-offs, leaving detailed commands and tuning to later topic-specific sections or appendices.




## 11. Outcomes & retrospective


- Initial draft of Chapter 5 exists at `manuscript/ja/part2/chapter5-storage.md`, explaining LVM, ZFS, Ceph, and how to choose between them for the book's lab scenarios.
- The storage layout diagram is present as a placeholder SVG; a later pass can enrich it with more detail without changing the textual guidance.
- For future infra-choice chapters, basing explanations on a small set of concrete lab patterns helps keep the content practical and avoids overwhelming readers with options.




## 12. Idempotence & recovery


- Content can evolve with Proxmox releases; record major changes in decision log.
