# ⚡ AGENTS.md | Universal AI Agent Protocol

> **Author**: HSU, CHE-CHENG (許哲誠)
> **Standard**: Elite Engineering Standard for AI-Human Symbiosis. Global workspace instructions for all AI Agents (LLM Web UI, CLI, IDE Extensions, Autonomous Agents). Strict adherence is mandatory.
> *Version: 2.7.0 | Last Updated: 2026-07-29*

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 2.7.0](https://img.shields.io/badge/Version-2.7.0-blue?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-000000?style=flat-square)](#)
[![Compliance: Strict IP](https://img.shields.io/badge/Compliance-Strict_IP-green?style=flat-square)](#)
[![Agent: Ready](https://img.shields.io/badge/AI_Agent-Ready-00C7B7?style=flat-square)](#)

---

## 0. 🏆 Priority Hierarchy (Rule Resolution)

Order of precedence upon directive conflicts:
1. **Conflict Resolution Intercept**: If a new prompt conflicts with an existing `[X]` item in `docs/check-list.md` or core security rules, STOP immediately and report the conflict to the user.
2. **Active Checklist Items**: Any unresolved `[X]` item in `docs/check-list.md` holds top operational priority until marked `[O]` by human or explicitly cancelled.
3. **Security, Strict IP & Zero-Hallucination Compliance** (Zero-Trust, Secret Protection, No License Violations).
4. **Explicit Scope Constraints**: When a prompt defines a specific modification scope, DO NOT touch, refactor, or alter unrelated code, text, or styles outside that scope.
5. **Explicit Human Overrides**: Rules can be temporarily overridden ONLY when the user explicitly commands "ignore [rule]". Note this in the final task report.
6. **Framework & Language Extensions**: Native conventions (e.g., Unity `AGENTS.UNITY.md`, Next.js App Router) override universal naming or structure rules.
7. **Universal Agent Protocol** (This document).
8. **Aesthetic Defaults**.

---

## 1. 🧠 Interaction Protocol & Capabilities

- **Language Matrix**: You MUST ALWAYS respond in **Traditional Chinese (繁體中文)** in the chat interface. Source code, architectural configurations, and comments MUST remain in professional English.
- **Execution & Reporting**: Summarize modified files, key architectural decisions, and testing status upon task completion.
- **Capability Routing**:
  - **Conversational Agents (e.g., ChatGPT, Gemini Web)**: Provide strictly accurate code blocks, shell commands, and step-by-step execution guidance.
  - **Autonomous Agents (e.g., Cursor, Claude Code, Windsurf)**: Authorized to autonomously execute terminal commands, inspect repository trees, run test suites, and orchestrate local development servers.

---

## 2. 🛡️ Human-in-the-Loop & Version Control

- **Human Verification Points**: **NEVER** autonomously execute without explicit human confirmation:
  1. `git add`, `git commit`, `git push`, or triggering CI/CD pipelines.
  2. Database schema migrations or destructive queries (`DROP`, `DELETE`).
  3. Breaking changes to public APIs.
  4. Large-scale, destructive codebase refactoring.
- **Branching Strategy (Git-Flow)**: `main` (Production), `feature/<name>` (Features), `fix/<name>` (Fixes).
- **Commit Semantics**: Enforce **Conventional Commits** in precise English.
  - *Allowed Types ONLY*: `feat`, `fix`, `refactor`, `perf`, `chore`, `docs`, `style`, `test` (DO NOT invent custom types).
  - *Format*: `<type>(<scope>): <short imperative description>` (e.g., `feat(auth): inject JWT validation middleware`).

---

## 3. 📜 Dynamic Documentation & Feature Acceptance Protocol (`docs/`)

> **CRITICAL AI INSTRUCTION**: All dynamic project documentation MUST reside in the `docs/` directory using `kebab-case`. To maximize context window efficiency, strictly batch documentation updates.
> **MANDATORY PRESENCE GATE**: The 2 core dynamic documentation files (`docs/check-list.md`, `docs/change-log.md`) ARE MANDATORY FOR EVERY SINGLE PROJECT TYPE WITHOUT EXCEPTION. Upon task completion, verify both files physically exist in `docs/` with fully populated, valid content.
> **DEVELOPMENT VS. PRE-GIT-ADD LANGUAGE MATRIX (TOKEN OPTIMIZED)**:
> - **In-Development Phase (Unstaged)**: `docs/check-list.md` MUST contain Traditional Chinese at minimum for human review. `docs/change-log.md` MAY remain in professional English during active coding.
> - **Pre-Git-Add Phase (Before Staging)**: Prior to ANY `git add` or staging action, ONLY the root `README.md` MUST be fully updated/generated in BILINGUAL format (English & Traditional Chinese) with strict semantic translation accuracy.
> **MINOR EDIT CLAUSE**: For minor modifications, DO NOT write directly. State "Suggest updating [file]" in the task report instead.

### A. Dynamic Documentation Matrix

| Document | Trigger Condition | Mandatory Content Action |
| :--- | :--- | :--- |
| **`docs/check-list.md`** | **Initial Step of Task Execution**: Immediately upon receiving ANY new user prompt | 1. Parse and append new requirement items marked as `[X]` (Must include Traditional Chinese) at the bottom.<br>2. **Rolling Queue (Max 20 Items)**: Keep appending entries sequentially. DO NOT overwrite or randomly replace items. ONLY when total entries exceed 20, automatically purge the oldest entry at the top.<br>3. **Git Isolation**: Local acceptance tool ONLY. MUST be added to `.gitignore` and NEVER pushed to remote Git repositories. |
| **`docs/change-log.md`** | Completion of a structural `feat`, `fix`, or `refactor` | **Append-Only Chronological History**: NEVER overwrite or erase existing logs. Always append a new line at the very bottom with exact Date & Time: `[ISO-8601 Date & Time] \| [Type] \| [Specific Feature Changes & Modifications] \| [Impacted Modules]`. AI agents DO NOT need to read this file during context loading. |

### B. Dynamic Feature Acceptance (`docs/check-list.md`) Rules & Git Isolation
1. **Local Isolation & `.gitignore` Enforcement**: `docs/check-list.md` (and any branch checklists in `docs/check-lists/`) is an ephemeral local task tracker. **It MUST NEVER be staged or pushed via Git**. The Agent MUST ensure `docs/check-list.md` and `docs/check-lists/` are explicitly present in the root `.gitignore` file.
2. **Early Task Initialization & Rolling Queue**: At the VERY BEGINNING of processing any command:
   - Parse user instructions and append new requirement items to `docs/check-list.md` formatted as `- [X] [Requirement Description]` (Include Traditional Chinese) at the bottom.
   - **Fixed Queue Size Enforcement**: Maintain a maximum history of **20 items**. DO NOT purge items upon `[O]` marking. Purge the oldest entry at the top ONLY when total line items exceed 20.
3. **Acceptance Ownership**: ONLY the human user is authorized to change `[X]` to `[O]`. The Agent MUST NEVER change `[X]` to `[O]` autonomously.
4. **Persistent Execution**: As long as there are unresolved `[X]` items within the active 20-item queue, the Agent MUST prioritize implementing and completing those items in the current command execution, unless the user explicitly states to abandon or remove the requirement.
5. **Requirement Conflict Reporting Protocol**: If a new prompt conflicts with an existing unresolved `[X]` item in `docs/check-list.md`, the Agent MUST NOT guess or execute silently. The Agent MUST **halt execution immediately** and output a structured conflict report asking for human clarification.

---

## 4. ⚙️ Quality Gates, Security & Zero-Hallucination

- **Zero-Hallucination & Hard Refusal Protocol**: Cross-verify all external data, APIs, and libraries. Explicitly reject or flag ambiguous information. **DO NOT** fabricate endpoints, mock data, or package versions. **If a required asset, library, or data cannot be found on legitimate public websites/sources, DO NOT fabricate it. STOP immediately and explicitly report the missing item to the user in the response.**
- **Strict Scope Isolation**: Strictly limit modifications to explicitly requested targets. Zero tolerance for unrequested side-effect changes.
- **Strict IP Governance**: ONLY utilize open-source assets (MIT, Apache 2.0) or synthetically generated content. Absolutely NO unlicensed media.
- **SOLID & Defensive Coding**: Enforce SRP and DIP exhaustively. Handle `null/undefined`, network timeouts, and boundaries explicitly.
- **Zero-Trust Security**: NEVER hardcode credentials. Enforce `.env` isolation and continuously synchronize `.env.example`.
- **Testing Validation**: Guarantee unit tests for core logic. Code MUST pass static type-checking (`tsc`, `mypy`) and linters.

---

## 5. 🌐 Context-Aware & Design System Directives

### A. Comprehensive Responsive Design (RWD) & Orientation
- All web and app UI designs MUST adapt seamlessly across **PC, Tablet, and Mobile** viewports.
- Explicitly verify optimal layout readability for BOTH **Portrait and Landscape** orientations on mobile and tablet devices.

### B. Color Contrast & Dark/Light Mode Legibility
- Strictly enforce WCAG contrast ratios across BOTH **Dark Mode and Light Mode**.
- Ensure background/foreground color pairings provide optimal readability and zero visual fatigue in all themes.

### C. Typography, Brand Logos & Icon Ecosystem Hierarchy
- **Typography**: Default to **Google Fonts** (e.g., Inter, Roboto, Noto Sans TC).
- **App, Brand & Tech Logos Hierarchy**: Prioritize SVG resources from authorized sites in order:
  1. [Simple Icons](https://simpleicons.org/)
  2. [Vector Logo Zone](https://www.vectorlogo.zone/)
  3. [World Vector Logo](https://worldvectorlogo.com/)
  4. [SVGRepo](https://www.svgrepo.com/)
- **UI Icon Library Hierarchy**: Prioritize icons from authorized resources in order:
  1. [Heroicons](https://heroicons.com/)
  2. [Ionicons](https://ionic.io/ionicons)
  3. [Font Awesome](https://fontawesome.com/)
  4. [Phosphor Icons](https://phosphoricons.com/)
  5. [Boxicons](https://boxicons.com/)
  6. [Icons8](https://icons8.com/)

### D. Asset Optimization Matrix
- **Web/Mobile Ecosystem**: Aggressively compress visual assets to `WebP/AVIF`.
- **Game Engines**: Preserve native texture formats (PNG, TGA, EXR, FBX). DO NOT convert game assets to WebP.

---

## 6. 🖋️ Syntax & Naming Conventions

- **File System Nomenclature**: Universal directories and non-code assets MUST adhere to strict **`kebab-case`** (e.g., `jwt-auth-middleware.ts`). Language/framework specific naming exceptions (e.g., C# / Unity) MUST follow dedicated extension rules (`AGENTS.UNITY.md`). All dynamic docs MUST reside inside `docs/`.
- **Code Documentation**: Write source code comments exclusively in elite **English**. Explain the *"Why"* (architectural intent) rather than the *"What"* (syntax).

---

## 7. 🚀 PROTOCOL: Strict Project Optimization

When commanded to execute **"Strict Project Optimization"** (嚴格專案最佳化), the Agent MUST perform:
1. Audit `docs/check-list.md` for conflicts and pending `[X]` items (maintain maximum 20-item rolling queue). Ensure `.gitignore` excludes `docs/check-list.md`.
2. Eradicate dead code, unused dependencies, obsolete imports, and empty directories. Ensure `kebab-case` compliance.
3. Compress Web/App images (WebP/AVIF) while bypassing Game Engine assets.
4. Verify RWD layouts across PC/Tablet/Mobile (Portrait & Landscape) and check Dark/Light mode WCAG contrast ratios.
5. Inject missing metadata tags, explicitly configure custom `favicon`, enforce `alt` text compliance, and maximize Lighthouse scores.
6. Prior to executing `git add`, reconcile `.env.example`, append to `docs/change-log.md` with exact timestamp, update root `README.md` (Bilingual), and verify both mandatory dynamic docs exist in `docs/`.

---

## 8. 📦 Pre-Git-Add Staging Specification

Prior to ANY `git add` or staging action, ensure the root **`README.md`** is completely synchronized and updated in BILINGUAL format (**English & Traditional Chinese**). It MUST strictly contain ONLY the following 4 structured sections:

1. **Project Overview (專案簡介)**: Brief summary, manifesto, vision, core value, and Author Info (Author: HSU, CHE-CHENG 許哲誠).
2. **Technology Stack (技術棧)**: Tech stack matrix, frameworks, libraries, and core dependencies.
3. **Directory Structure (目錄結構)**: `kebab-case` compliant project tree layout.
4. **Local Development Setup (本地開發配置)**: Prerequisites, `.env` config, installation steps, and local dev server execution commands.