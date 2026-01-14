# ExecPlan: JA Part II / Chapter 6 – ネットワーク設計と VLAN


## 1. Metadata


- Plan ID: plans/execplan-ja-part2-ch6-network.md
- Title: JA Part II / Chapter 6 – ネットワーク設計と VLAN
- Author: AuthorExecAgent (with human reviewer)
- Date created: 2025-11-16
- Last updated: 2026-01-14
- Related issues/PRs:
  - Issue #2（スクリーンショット取得タスクリスト）
  - Issue #73（UI 手順の最小補強）




## 2. Purpose and big picture


Explain how to design and configure Proxmox VE networking, including bridges, bonds, and VLANs.




## 3. Context and orientation


- Assumes readers understand basic TCP/IP and VLAN concepts.


Files:
- `manuscript/ja/part2/chapter6-network.md`
- `diagrams/part2/ch6/network-topology.svg`




## 4. Constraints and assumptions


- Focus on common, reproducible patterns.
- Avoid environment-specific edge cases.
- Align with the lab patterns and storage/cluster chapters so that readers can reuse the same network ideas throughout the book.
- Target Proxmox VE version for this book: 9.1 (9.x).




## 5. Plan of work


- Phase 1: Define reference network topologies.
- Phase 2: Draft conceptual explanation.
- Phase 3: Provide configuration examples.
- Phase 4: Ensure consistency with cluster and HA chapters.
- Phase 5: Beginner pass (goals, terminology, diagram readability).




## 6. Concrete steps


- [x] Define 1–2 reference topologies (single-node, small cluster).
- [x] Draft bridge/bond/VLAN explanation.
- [x] Add minimal Web UI navigation steps (entry points) for Node → Network and VM NIC VLAN Tag.
- [ ] Provide full step-by-step examples of configuring network in Proxmox UI (to be detailed in a later pass or appendix).
- [x] Add beginner-friendly framing (“分かること/分からないこと”, “最初に決めること” checklist) and a minimal terminology memo.
- [x] Replace `diagrams/part2/ch6/network-topology.svg` placeholder with a minimal-but-real diagram consistent with the chapter.




## 7. Validation and acceptance


- [x] Readers can design and reason about a basic VLAN-aware network pattern in their lab, based on the chapter.
- [x] Examples match Proxmox 9.1 behavior (cross-checked against live 9.1.1 Web UI screenshots).
- [x] Diagram is no longer a placeholder and is consistent with the text.




## 8. Progress


- [2025-11-16 11:58] Plan created.
- [2025-11-16 14:55] Drafted `manuscript/ja/part2/chapter6-network.md` with lab-oriented patterns for single-node and 3-node clusters, and created placeholder topology diagram `diagrams/part2/ch6/network-topology.svg`.
- [2025-12-21] Updated plan for a beginner-focused revision pass aligned to Proxmox VE 9.1.
- [2025-12-21] Added beginner framing/checklists to `chapter6-network.md` and replaced the placeholder topology SVG with a minimal real diagram.
- [2026-01-14] Added and embedded Web UI screenshots for Network list and representative dialogs (vmbr0 edit / Bond / VLAN) plus a VM NIC VLAN tag example (Issue #2).
- [2026-01-14] Added minimal Web UI navigation steps (entry points) so readers can locate Network/Bond/VLAN/VM VLAN Tag screens without screenshots alone (Issue #73).




## 9. Surprises & discoveries


- Reusing the same A/B lab patterns from earlier chapters simplifies the explanation of network design, especially around separating management, guest, and storage traffic.




## 10. Decision log


- Decision: Keep this chapter focused on design patterns and VLAN concepts, and defer detailed UI/CLI configuration walkthroughs to a later, more tooling-focused section.




## 11. Outcomes & retrospective


- Status: text-draft
- Status: assets-partial（代表的な画面（Network 一覧、vmbr0/Bond/VLAN ダイアログ、VM NIC の VLAN Tag）を追加。詳細 UI 手順は未完）
- Status: build-validated (`build/ja/book.md` に含まれることを確認済み)
- Initial draft of Chapter 6 exists at `manuscript/ja/part2/chapter6-network.md`, covering Linux bridges, bonding, VLANs, and lab-oriented topology patterns.
- The network topology diagram at `diagrams/part2/ch6/network-topology.svg` is now a minimal-but-real diagram; detailed interface names and VLAN tags can be added later without restructuring the text.
- For future networking chapters, starting from simple, repeatable patterns helps keep the content adaptable to different physical environments.




## 12. Idempotence & recovery


- Topologies and examples can be adjusted later; keep diagrams in sync with text.
