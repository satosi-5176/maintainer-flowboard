# Maintainer Flowboard

Maintainer Flowboard is a lightweight, local-first board that helps open-source maintainers organize issues and pull requests before making decisions.

It does **not** replace maintainers. It does **not** close issues. It does **not** merge pull requests. It does **not** post replies automatically.

**Less triage fatigue. More maintainer clarity.**

## Live demo

Open the GitHub Pages demo:

https://satosi-5176.github.io/maintainer-flowboard/

If the demo is not available yet, open `index.html` directly in a browser after cloning or downloading the repository.

## Why it exists

Maintainers have helped users for years. Maintainer Flowboard exists to help maintainers keep their workspace clear.

Many maintainers do not need another bot that makes decisions for them. They need a clearer board: what needs info, what needs reproduction, what is waiting for review, what is stale, and what might belong in release notes.

Maintainer Flowboard is meant to organize information **before** human judgment.

## Features in v0.1

- Local-first `index.html` app
- No login, server, or external API
- Sample issue and PR data
- JSON paste/import
- Board columns for common maintainer triage states
- Collapsible columns and cards
- Classification reasons and suggested next actions
- Manual classification override with buttons
- Maintainer notes
- Clickable board snapshot jumps
- Weekly Markdown summary
- JSON export/import for board state

## Quick start

1. Open the live demo or open `index.html` locally.
2. Click **Load sample data**.
3. Review the grouped issue and PR cards.
4. Tap a card to expand its reason, suggested next action, note field, and move buttons.
5. Move cards manually if needed.
6. Click **Generate weekly summary**.
7. Copy the Markdown summary.

## What it does not do

- It does not auto-close issues.
- It does not auto-merge PRs.
- It does not post comments.
- It does not claim that a classification is correct.
- It does not replace repository-specific maintainer judgment.

## Local-first policy

v0.1 runs locally in the browser. Data stays in your browser unless you export it manually.

There is no login, server, database, tracking, or external API in v0.1.

## Current limitations

- Classification rules are simple and transparent, not intelligent.
- The tool currently uses pasted/imported JSON rather than GitHub API integration.
- It has not yet been validated against many real repositories.
- It should be treated as a triage aid, not as a source of truth.
- Column/card expansion state is UI state and may reset between sessions.

## Documentation

- [Project handoff](HANDOFF.md)
- [Project philosophy](PROJECT_PHILOSOPHY.md)
- [Spec](SPEC.md)
- [Workflow](docs/workflow.md)
- [Non-goals](docs/non-goals.md)
- [Maintainer use cases](docs/maintainer-use-cases.md)
- [Decision log](DECISIONS.md)
- [Roadmap](ROADMAP.md)

## Project status

Early v0.1 prototype. The goal is to validate whether this kind of board genuinely reduces maintainer triage friction.

The current priority is not automation. The current priority is maintainer clarity.
