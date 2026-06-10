# Maintainer Flowboard

Maintainer Flowboard is a local-first issue and PR triage board that helps OSS maintainers organize work before making decisions.

It does **not** replace maintainers. It does **not** close issues. It does **not** merge pull requests. It does **not** post replies automatically. It organizes information before human judgment.

**Less triage fatigue. More maintainer clarity.**

## Live demo

Open the GitHub Pages demo:

https://satosi-5176.github.io/maintainer-flowboard/

You can also clone or download the repository and open `index.html` directly in a browser.

## Who it is for

Maintainer Flowboard is for open-source maintainers, project leads, release helpers, and contributors doing triage support who need a clearer view of an issue and PR queue before deciding what to do next.

It is especially useful when a repository has a mix of routine PRs, bug reports, feature requests, documentation follow-up, dependency updates, release-related work, and items that need careful human review.

## Why it exists

Maintainers have helped users for years. Maintainer Flowboard exists to help maintainers keep their workspace clear.

Many maintainers do not need another bot that makes decisions for them. They need a clearer board: what needs info, what needs reproduction, what is ready for review, what looks routine, what may need attention, and what might belong in release notes.

Maintainer Flowboard is meant to organize information **before** human judgment.

## What it does

- Imports public GitHub repository issues and pull requests from the browser.
- Provides a repository selector and recent repositories list.
- Opens a board route for the selected repository.
- Groups cards into common maintainer triage states.
- Shows transparent classification reasons for why an item landed where it did.
- Summarizes classification confidence so maintainers can see when a grouping is stronger or weaker.
- Surfaces attention flags for review areas such as release/docs overlap, dependency security updates, CSP/nonce hardening, API key or operational issues, and data exposure checks.
- Highlights compact routine-ready PR output for changes that appear straightforward to review.
- Lets maintainers add local review notes and status.
- Generates a Maintainer Action Packet Markdown export for handoff, review, notes, or external tools.
- Generates release notes Markdown drafts/exports from relevant items.
- Persists board state and local notes in the browser.
- Includes regression-tested classifier fixtures using patterns from real OSS repositories.

Classification is transparent and rule-based. It is a triage aid, not a source of truth, and it does not claim perfect accuracy.

## Quick start

1. Open the [live demo](https://satosi-5176.github.io/maintainer-flowboard/).
2. Enter a public GitHub repository, for example:
   - `TanStack/query`
   - `tldraw/tldraw`
   - `vitejs/vite`
   - `eslint/eslint`
3. Import public issues and PRs.
4. Review the grouped cards on the board.
5. Add local review notes or status where helpful.
6. Generate a Maintainer Action Packet Markdown export.
7. Copy the export into notes, a maintainer handoff, ChatGPT/Codex, or another external review document.

Use public GitHub repository import as the primary workflow. Example repository quick imports are available from the public import screen for a fast walkthrough.

## What it is good for

- Getting a quick overview of issue and PR queues.
- Separating ready review items from docs work, dependency updates, release follow-up, feature requests, and items that need more information.
- Preparing a maintainer handoff before a review session.
- Reducing triage fatigue before humans make repository-specific decisions.
- Using Action Packet Markdown as portable context for maintainers, collaborators, notes, or AI assistants.

## Local-first policy

- No backend server is required.
- No login is required.
- No OAuth token is required.
- Public GitHub import reads public repository data from the browser.
- Local review notes and board state stay in the browser unless you manually export or copy them.
- The app does not write to GitHub.

## What it does not do

- It does not auto-close issues.
- It does not auto-merge PRs.
- It does not auto-comment on GitHub.
- It does not automatically publish releases or release notes.
- It does not make severity decisions.
- It does not make priority recommendations.
- It does not claim that a classification is correct.
- It does not replace repository-specific maintainer judgment.

## Current limitations

- Public repository import only.
- GitHub public API and rate limits may apply.
- Classification is transparent and rule-based, not a source of truth.
- Repository-specific maintainer judgment is still required.
- Local notes are browser-local unless exported manually.
- No private repository support.
- No GitHub write actions.
- No automatic merge, close, reply, or release publishing.

## Documentation

- [Contributing](CONTRIBUTING.md)
- [Project handoff](HANDOFF.md)
- [Project philosophy](PROJECT_PHILOSOPHY.md)
- [Spec](SPEC.md)
- [Workflow](docs/workflow.md)
- [Non-goals](docs/non-goals.md)
- [Maintainer use cases](docs/maintainer-use-cases.md)
- [Decision log](DECISIONS.md)
- [Roadmap](ROADMAP.md)

## Project status

Working prototype under active validation.

The goal is to validate whether structured triage boards and portable maintainer action packets reduce maintainer review fatigue. The current priority is not automation. The current priority is maintainer clarity.
