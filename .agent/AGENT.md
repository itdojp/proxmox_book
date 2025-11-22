# AGENTS for Proxmox Book Project


## Project overview


This repository contains the source files for a Proxmox VE book (Japanese and English editions). The main goals are:


- Provide a practical, enterprise-grade introduction to Proxmox VE.
- Showcase the technical strengths and real-world experience of the author and the company.
- Keep the writing workflow reproducible and review-friendly using Git and AI agents.


The primary artifacts are:
- Book manuscripts in Markdown (one file per chapter/section).
- Diagrams (SVG/PNG), configuration snippets, and code examples.
- Build scripts for generating PDFs/EPUB and web docs.




## Agents


### AuthorExecAgent


An AI assistant (e.g., Codex CLI / ChatGPT) that plans and executes multi-hour writing and editing tasks using ExecPlans.


Responsibilities:
- Analyze the repository structure and existing manuscripts.
- Create ExecPlans for complex or multi-hour tasks.
- Execute the plan step by step, updating manuscripts, diagrams, and build configs.
- Keep the ExecPlan document up to date with progress, decisions, and outcomes.




## When to use ExecPlans


For any task that is:
- Larger than ~30–60 minutes of concentrated work, or
- Spanning multiple chapters/sections, or
- Involving significant restructuring of the book, or
- Coordinating writing, diagrams, and build / tooling changes,


you MUST create and use an ExecPlan (as defined in `.agent/PLANS.md`).


Examples of tasks that MUST use an ExecPlan:
- Writing a new Part (e.g., "Part II: Proxmox VE Clustering and HA")
- Substantial rewrite of an existing chapter based on reviewer feedback
- Adding a full English translation for a Part that already exists in Japanese
- Introducing new tooling (e.g., switching the build system or diagram tool) that impacts multiple files


Smaller, localized tasks (typo fixes, minor wording changes) may be done without an ExecPlan, but must still follow the general style and structure rules of the project.




## General rules for agents


1. **Read before you write**
- Before acting, read `.agent/PLANS.md`, the relevant ExecPlan file (if any), and the target chapter(s).
- Never rely only on the user prompt if it contradicts the documented plan.


2. **ExecPlans are the source of truth for complex work**
- When an ExecPlan exists for a task, follow it.
- If new information appears or constraints change, update the ExecPlan first, then continue execution.


3. **Prefer small, reviewable commits**
- Group changes logically (per chapter or per feature).
- Make it easy for a human reviewer to see what changed and why.


4. **Maintain consistency across languages**
- When working on Japanese and English editions, document the mapping between files (e.g., `part0-ja/chap1.md` ↔ `part0-en/chap1.md`).
- Record any intentional differences between editions in the ExecPlan.


5. **Validate with observable outcomes**
- For each plan, define acceptance as observable results (book builds successfully, lint passes, reviewers’ key comments addressed, etc.).
- Always run the documented validation steps and record their results in the ExecPlan.


6. **Do not silently drop or invent content**
- If required information is missing (e.g., exact metrics, confidential case names), clearly mark it as TODO and describe the assumption instead of inventing facts.


7. **Respect licensing and confidentiality**
- When including code/config/outputs from Proxmox or other tools, follow their licensing terms.
- Do not reveal customer names or confidential details; use anonymized descriptions as guided by the project owner.

8. Minimize unnecessary interruptions
- Do NOT pause to ask for subjective feedback (tone, style, wording) for every small change.
- Assume the current draft tone is acceptable if it is neutral, technically accurate, and consistent with the rest of the manuscript.
   - Only ask for human approval before:
     - Large structural changes to the book (Parts/chapters reorganization),
     - Destructive operations (mass delete/rename),
     - Changes that could significantly impact external expectations (positioning, promises, etc.).

Refer to `.agent/PLANS.md` for the detailed ExecPlan format and non-negotiable requirements.

