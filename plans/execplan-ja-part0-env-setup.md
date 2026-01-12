# ExecPlan: JA Part 0 – 執筆環境・検証環境の準備




## 2. Purpose and big picture


This plan produces a chapter explaining how readers can prepare their environment to follow the book:
- Local PC requirements.
- Virtualization options (bare metal, nested, cloud).
- Sample Proxmox lab topology used throughout the book.




## 3. Context and orientation


Target audience:
- Readers who will reproduce screenshots and examples.


Prerequisites:
- Basic OS installation and virtualization knowledge.


Relevant files:
- `manuscript/ja/part0/env-setup.md`
- `diagrams/part0/lab-topology.svg`




## 4. Constraints and assumptions


- Do not prescribe a single vendor; show a few feasible options.
- Proxmox VE version: 9.1 (9.x).
- Avoid over-detailed tuning; keep focus on "getting a usable lab".
- At the time of writing, later chapters (cluster/HA, storage, network) are planned via ExecPlans but not yet fully drafted; lab patterns should be defined so that those plans are realistically achievable in a nested or small on-prem lab.
- This revision pass prioritizes beginner-friendliness (short checklists, concrete example values, and common pitfalls).




## 5. Plan of work


- Phase 1: Define minimum and recommended lab setups.
- Phase 2: Draft text explaining options and trade-offs.
- Phase 3: Create lab topology diagram.
- Phase 4: Consistency check with later chapters.
- Phase 5: Beginner pass (checklists, example values, terminology).




## 6. Concrete steps


- [x] Define 1–2 lab patterns (e.g., single-node, 3-node cluster in nested virtualization).
- [x] Describe hardware and network requirements for each pattern.
- [x] Create `diagrams/part0/lab-topology.svg` illustrating the main lab.
- [x] Draft `env-setup.md` covering:
  - 準備する PC / サーバのスペック
  - 仮想化環境の選択肢
  - 本書で想定するラボ構成
  - 注意点（ストレージ・バックアップ）
- [x] Cross-check with cluster/HA chapters to ensure the lab is sufficient.
- [x] Update wording to explicitly target Proxmox VE 9.1 (9.x) and add a short caution about kernel/driver compatibility (link to Roadmap known issues).
- [x] Add “最初に決めること” checklists (naming/IP plan, management vs VM vs storage network, DNS/NTP) and concrete example values.
- [x] Replace placeholder `diagrams/part0/lab-topology.svg` with a minimal-but-real diagram matching the chapter text.




## 7. Validation and acceptance


- [x] `env-setup.md` explains at least one complete lab pattern that can support all examples in the book.
- [x] Lab topology diagram exists and is referenced from the text.
- [x] The diagram is no longer a placeholder and matches the two lab patterns (single-node / 3-node).
- [x] The chapter clearly states the target version (Proxmox VE 9.1) and flags version-sensitive areas as such.




## 8. Progress


- [2025-11-16 11:35] Plan created.
- [2025-11-16 13:40] Drafted `manuscript/ja/part0/env-setup.md` with minimum and recommended lab specs, virtualization options, and two lab patterns; created placeholder `diagrams/part0/lab-topology.svg` and referenced it from the text.
- [2025-11-16 13:45] Reviewed cluster/HA ExecPlan (Chapter 7) to confirm that a 3-node nested lab pattern defined here is sufficient for the planned scenarios.
- [2025-12-21] Updated plan for a beginner-focused revision pass aligned to Proxmox VE 9.1.
- [2025-12-21] Added “最初に決めること” checklists and example values to `env-setup.md`, updated 9.1 notes, and replaced the lab topology SVG placeholder with a minimal real diagram.
- [2026-01-11] Updated the Debian base OS wording in `env-setup.md` to “Debian 13（Trixie）” to reduce staleness risk (minor version numbers change more frequently).
- [2026-01-11] Added “章のゴール” and “この章で分かること/分からないこと” sections to `env-setup.md` for consistency with other beginner-friendly chapters.




## 9. Surprises & discoveries


- Nested lab patterns can cover most later chapters (cluster/HA, backup, storage) even when only one physical host is available, but performance caveats must be emphasized.




## 10. Decision log


- Decision: Provide two representative lab patterns (single-node and 3-node cluster) and design them so that they are feasible both on physical hardware and as nested labs on a single host.




## 11. Outcomes & retrospective


- Status: text-draft
- Status: build-validated (`build/ja/book.md` に含まれることを確認済み)
- Initial environment setup chapter draft exists at `manuscript/ja/part0/env-setup.md`, covering hardware requirements, virtualization options, lab patterns, and key caveats.
- The lab topology diagram at `diagrams/part0/lab-topology.svg` is now a minimal-but-real diagram that matches the two lab patterns; it can be refined later without changing the textual guidance.
- For future environment-related chapters, clearly distinguishing between "minimum" and "recommended" setups helped keep expectations realistic for readers with limited hardware.




## 12. Idempotence & recovery


- Safe to revise descriptions as lab design evolves; keep final lab assumptions synchronized with later chapters.
