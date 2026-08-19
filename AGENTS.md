# ⚡ AGENTS.en.md | Global AI Agent Protocol

> **Project Author**: HSU, CHE-CHENG
> **Standard Specification**: The top-tier engineering standard for AI-Human collaboration. This document contains the global environment configuration directives for all AI Agents (including web UIs, CLI tools, IDE extensions, and autonomous agents). Strict compliance with this protocol is mandatory.
> *Version: 3.1.0 | Last Updated: 2026-08-19*

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 3.1.0](https://img.shields.io/badge/Version-3.1.0-blue?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-000000?style=flat-square)](#)
[![Compliance: Strict IP](https://img.shields.io/badge/Compliance-Strict_IP-green?style=flat-square)](#)
[![Agent: Ready](https://img.shields.io/badge/AI_Agent-Ready-00C7B7?style=flat-square)](#)

---

## 0. 🏆 Priority Adjudication (Conflict Resolution)

When rule conflicts occur, the Agent MUST strictly resolve them in the following order of priority:
1. **Mandatory Questioning for Ambiguity**: When a user's request lacks core parameters, technical selection criteria, or clear direction, the Agent is **STRICTLY PROHIBITED from making assumptions or hallucinating details**. It must immediately pause and actively ask the user specific questions to clarify the direction.
2. **Automatic Interception of Requirement Conflicts**: If a new prompt conflicts with `docs/development-plan.md` or core security rules, the Agent **MUST immediately pause execution**, actively report the conflict details to the human, and wait for instructions before proceeding.
3. **Security, IP Compliance, and Zero-Hallucination Principles** (Zero Trust, confidentiality, strict authorization, and NO fabricating unverified APIs/packages).
4. **Strict Modification Boundaries**: When a prompt specifies a clear modification scope (e.g., "change button color"), it is **ABSOLUTELY FORBIDDEN** to alter, refactor, or change any code, text, or styles outside that scope.
5. **Explicit Human Overrides**: Temporary overrides are permitted ONLY when the user explicitly instructs to "ignore a rule," which must be noted in the final task report.
6. **Framework & Language Extension Clauses**: Native framework or language-specific conventions (e.g., Unity `AGENTS.UNITY.zh-TW.md`, Next.js App Router) **ABSOLUTELY OVERRIDE** general naming or directory rules.
7. **Global Agent Protocol** (The rules in this document).
8. **Default Aesthetics and Visual Settings**.

---

## 1. 🧠 Interaction Protocol & Capability Boundaries

- **Language Matrix**: In the chat interface, you must ALWAYS reply in **Traditional Chinese (繁體中文)**. The character "臺" must be used instead of "台". Simplified characters are strictly prohibited. Source code, system architecture configurations, and code comments must remain in professional English. Retain standard English technical terms; strictly avoid mixing Chinese and English syntaxes or adding English translations in parentheses after Chinese terms.
- **Formatting Requirements**: A short introductory paragraph MUST follow every heading (`#`, `##`, `###`). It is strictly prohibited to place subheadings, lists, or code blocks directly below a heading without an introduction.
- **Execution & Reporting**: After completing a task, provide a precise summary of modified files, key architectural decisions, and testing validation status.
- **Capability Routing**:
  - **Conversational Agents (e.g., ChatGPT, Gemini Web)**: Provide absolutely precise code blocks, shell commands, and step-by-step execution guides.
  - **Autonomous Agents (e.g., Cursor, Claude Code, Windsurf)**: Authorized to autonomously execute terminal commands, inspect directory structures, run test suites, and launch local development servers.

---

## 2. 🛡️ Human Verification Points & Version Control Workflow

- **Human Verification Points (Mandatory Confirmation)**: The Agent is **ABSOLUTELY PROHIBITED** from autonomously executing the following destructive or sensitive operations without explicit human confirmation:
  1. Executing `git add`, `git commit`, `git push`, or triggering CI/CD deployments.
  2. Database schema migrations or destructive queries (e.g., `DROP`, `DELETE`).
  3. Making breaking changes to public-facing APIs.
  4. Large-scale, destructive codebase refactoring.
- **Branching Strategy (Git-Flow)**: `main` (Production), `feature/<name>` (New features), `fix/<name>` (Bug fixes).
- **Commit Semantic Standard**: Mandatory use of strict English formatting per **Conventional Commits**.
  - *Strictly Limited Types*: `feat`, `fix`, `refactor`, `perf`, `chore`, `docs`, `style`, `test` (AI inventing random types is strictly forbidden).
  - *Format*: `<type>(<scope>): <short imperative description>` (Example: `feat(auth): inject JWT validation middleware`).

---

## 3. 📜 Dynamic Documentation Protocol (Stored in `docs/`)

> **Global Mandatory Dynamic Documents**: Every project MUST contain three core documents (`docs/development-plan.md`, `docs/check-list.md`, `docs/change-log.md`). All three MUST be tracked by Git version control and committed/pushed normally.

### A. Dynamic Document Matrix

| Document Name | Update Trigger | Mandatory Action & Format | Git Tracking Status |
| :--- | :--- | :--- | :--- |
| **`docs/development-plan.md`**<br>(Project Master Plan) | Project initialization, adding features, architecture changes, or spec adjustments | **Extremely comprehensive project specification**: Must cover all functional lists, architecture design, non-functional requirements, UI/UX style guidelines, tech stack selection, API specs, data models, and future roadmap. Any new feature added must be synchronized here to maintain 100% coverage of the project. | **Tracked by Git**<br>(Must Commit/Push) |
| **`docs/check-list.md`**<br>(Single-Session Checklist) | Every time the user makes a request and executes a task | **Complete overwrite/refresh per session**: Strictly regenerated every conversation without retaining old items. Recorded line-by-line:<br>1. **User's Explicit Request**: Detail the command and goal.<br>2. **AI's Actual Execution**: List the actual files created/modified and implemented items. | **Tracked by Git**<br>(Must Commit/Push) |
| **`docs/change-log.md`**<br>(All-Chinese Changelog) | Before task completion or staging | **Append-only in pure Chinese**: Never modify historical records. Every completed item from `check-list.md` must be appended directly to the bottom of this file with an exact timestamp. Format: `[YYYY-MM-DD HH:mm] \| [Type] \| [User Request & Execution Details] \| [Affected Modules]`. | **Tracked by Git**<br>(Must Commit/Push) |

### B. Development Plan (`docs/development-plan.md`) Standards
1. **Depth & Coverage**: Must be written at a top-tier architect level. Vague, brief, or "TBD" placeholder text is strictly prohibited.
2. **Mandatory Core Sections**:
   - **Vision & Goals**: Business scenarios, core values, and target users.
   - **Functional Requirements**: Breakdown of modules, user journeys, and detailed function points per page/system.
   - **Non-Functional Requirements**: Performance metrics, security, WCAG contrast compatibility, and cross-platform standards.
   - **Design System**: Color palette, typography hierarchy, responsive breakpoints, orientation behavior, animations.
   - **Tech Stack & Architecture**: Core frameworks, state management, DB architecture, data flow diagrams.
   - **API & Data Schema**: Endpoint definitions, data structures, error code definitions.
   - **Roadmap**: Current implementation progress and future version expansion plans.
3. **Real-time Synchronization**: If the user adds or modifies features during the chat, the Agent must update this plan first, ensuring the document remains the project's "Single Source of Truth."

---

## 4. ⚙️ Quality, Security & Zero-Hallucination Mechanisms

- **Ambiguous Requirement Immediate Questioning Protocol**: When user instructions are ambiguous, lack implementation details, or miss key technical parameters, the Agent **MUST actively list questions and request guidance**, and never assume or decide the system direction on its own.
- **Zero-Hallucination & Hard Refusal Protocol**: Cross-reference all external data, APIs, and packages. **If the required assets, packages, or API data cannot be verified on legitimate public sites, fabricating them is strictly prohibited. The Agent must immediately interrupt the task and explicitly report the missing items to the user.**
- **Strict Scope Isolation**: Strictly limit modifications to the targets explicitly requested by the user. Zero tolerance for unrequested side-effect changes.
- **Strict IP & Open Source Governance**: Use only open-source resources (MIT, Apache 2.0) or synthesized content. Unlicensed assets are strictly forbidden.
- **SOLID & Defensive Programming**: Implement SRP and DIP. Explicitly handle `null/undefined`, network timeouts, and edge cases.
- **Zero-Trust Security**: Hardcoding credentials is strictly forbidden. Isolate via `.env` and continuously synchronize `.env.example`.
- **Testing Validation**: Guarantee unit tests for core logic. Code must pass static type checking (`tsc`, `mypy`) and Linters.

---

## 5. 🌐 UI/UX & Design System Standards

### A. Cross-Device RWD & Orientation Compatibility
- All Web and App UI designs **MUST be fully compatible** with **PC, Tablet, and Mobile** screens in both **Portrait and Landscape** orientations.

### B. Dark/Light Mode Contrast & Readability
- When switching between **Dark Mode and Light Mode**, the design must strictly comply with WCAG contrast standards to ensure clear readability and prevent visual fatigue.

### C. Typography, Brand Logos & Icon Resource System
- **Fonts**: Prioritize **Google Fonts** (e.g., Inter, Roboto, Noto Sans TC).
- **Resource Localization & Strict Format Rules (No Hotlinking)**:
  - All brand logos and UI icons **MUST strictly use `SVG` format**.
  - General image assets **MUST strictly use `WebP` format**.
  - **External links (Hotlinking / CDN images) are ABSOLUTELY PROHIBITED**. All visual assets must be downloaded and stored as physical files within the project directory.
- **App/Tech/Brand Logo Priority**: 1. Simple Icons | 2. Vector Logo Zone | 3. World Vector Logo | 4. SVGRepo
- **UI Icon Library Priority**: 1. Heroicons | 2. Ionicons | 3. Font Awesome | 4. Phosphor Icons | 5. Boxicons | 6. Icons8

### D. Resource Optimization Matrix
- **Web/Mobile Apps**: Actively compress visual resources and strictly comply with the physical file storage, WebP, and SVG formatting rules above.
- **Game/Desktop Engines**: Strictly retain native texture formats (PNG, TGA, EXR, FBX). Converting these to WebP is **strictly prohibited**.

---

## 6. 🖋️ Syntax & Naming Conventions

- **File System Naming**: General directories and non-code assets must strictly follow **`kebab-case`** (e.g., `jwt-auth-middleware.ts`). Language/framework-specific exceptions (e.g., C# / Unity enforcing `PascalCase`) must follow standalone extension guidelines (`AGENTS.UNITY.zh-TW.md`). Dynamic documents are uniformly stored in `docs/`.
- **Code Documentation**: Source code comments must be written in top-tier **English**, focusing on explaining architectural intent (*"Why"*).

---

## 7. 🚀 Protocol: Strict Project Optimization

When receiving the **"Strict Project Optimization"** command, the Agent must execute:
1. Read and review `docs/development-plan.md` to ensure all implemented features and architectural specs are fully covered without omissions.
2. Execute the task checklist: completely refresh `docs/check-list.md`, and append the results in pure Chinese to the bottom of `docs/change-log.md`.
3. Purge the codebase (dead code, unused dependencies, empty directories).
4. Inspect all images and icons to ensure there are no external links and that they are physical local SVG or WebP files (excluding game engine assets).
5. Review cross-device RWD orientation and WCAG contrast for dark/light modes.
6. Inject semantic SEO and custom `favicon`.
7. Before executing `git add`, synchronize `.env.example` and ensure dynamic documents and the bilingual `README.md` are fully prepared.

---

## 8. 📦 Pre-Git-Add Staging Protocol

Before executing any `git add`, ensure that the `README.md` in the root directory is fully synchronized and updated to a **precise bilingual format (English & Traditional Chinese)**. The `README.md` MUST **strictly contain only** the following 4 major sections:

1. **Project Overview (專案簡介)**: Includes project summary, vision, core values, and author info (Project Author: HSU, CHE-CHENG).
2. **Technology Stack (技術棧)**: Tech stack matrix, frameworks, libraries, and core dependencies.
3. **Directory Structure (目錄結構)**: Project directory tree structure conforming to `kebab-case` conventions.
4. **Local Development Setup (本地開發配置)**: Prerequisites, `.env` configurations, installation steps, and local startup commands.