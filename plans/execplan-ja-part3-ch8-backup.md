# ExecPlan: JA Part III / Chapter 8 – バックアップ・リストアとレプリケーション


## 1. Metadata


- Plan ID: plans/execplan-ja-part3-ch8-backup.md
- Title: JA Part III / Chapter 8 – バックアップ・リストアとレプリケーション
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2025-12-21
- Related issues/PRs: [TBD]




## 2. Purpose and big picture


Explain how to protect VMs and containers using Proxmox backup, restore, and replication features.




## 3. Context and orientation


- Assumes familiarity with storage and cluster basics.


Files:
- `manuscript/ja/part3/chapter8-backup.md`




## 4. Constraints and assumptions


- Focus on backup strategies suitable for small to medium deployments.
- Align examples with the lab patterns and storage choices defined earlier (LVM/ZFS/Ceph; single-node vs 3-node cluster).
- Target Proxmox VE version for this book: 9.1 (9.x).




## 5. Plan of work


- Phase 1: Describe backup concepts and options.
- Phase 2: Provide example backup/restore workflows.
- Phase 3: Cover basic replication patterns.
- Phase 4: Beginner pass (goals, terminology, diagram readability).




## 6. Concrete steps


- [x] Draft sections for backup concepts and strategies.
- [ ] Document step-by-step backup job creation and restore (to be detailed in a later pass when a reference environment is available).
- [x] Add example of replication between nodes at a conceptual level.
- [x] Add beginner-friendly framing (“分かること/分からないこと”, prerequisites checklist) and a minimal terminology memo.
- [x] Add a minimal diagram under `diagrams/part3/ch8/` to visualize backup → restore → test flow.
- [x] Reference Issue #2 screenshot checklist and mark screenshot insertion points as TODO in the manuscript.




## 7. Validation and acceptance


- [x] Readers can understand how to configure a backup job, perform backup, and restore in principle, based on the chapter.
- [ ] Practical validation of backup/restore workflows is performed against a live environment and recorded in a later pass.
- [x] Diagram exists and is no longer a placeholder.




## 8. Progress


- [2025-11-16 12:02] Plan created.
- [2025-11-16 15:10] Drafted `manuscript/ja/part3/chapter8-backup.md` covering backup concepts, job creation ideas, restore considerations, replication overview, and lab practice patterns.
- [2025-12-21] Updated plan for a beginner-focused revision pass aligned to Proxmox VE 9.1.
- [2025-12-21] Added beginner framing/terminology to `chapter8-backup.md`, added `diagrams/part3/ch8/backup-restore-flow.svg`, and referenced Issue #2 for future screenshots/UI walkthrough.




## 9. Surprises & discoveries


- Emphasizing restore and practice scenarios helps shift focus from “taking backups” to “being able to recover,” which is more valuable for readers.




## 10. Decision log


- Decision: Keep this chapter focused on concepts and patterns, and defer detailed UI/CLI walkthroughs and Proxmox Backup Server-specific topics to a separate, more advanced treatment.




## 11. Outcomes & retrospective


- Status: text-draft
- Status: assets-pending (UI 手順・スクリーンショット未完)
- Status: build-validated (`build/ja/book.md` に含まれることを確認済み)
- Initial draft of Chapter 8 exists at `manuscript/ja/part3/chapter8-backup.md`, explaining backup/restore and replication concepts tied to the book's lab patterns.
- A minimal backup→restore→test flow diagram is now available at `diagrams/part3/ch8/backup-restore-flow.svg`; detailed UI walkthroughs and screenshots are still pending and should be aligned to Proxmox VE 9.1 in a later pass.
- For future reliability-related chapters, centering the narrative on “recoverability” rather than individual features keeps guidance aligned with real-world needs.




## 12. Idempotence & recovery


- Backup/restore steps are safe to repeat; clearly mark any destructive test scenarios.
