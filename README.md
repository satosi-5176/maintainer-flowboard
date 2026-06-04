# Maintainer Flowboard

Maintainer Flowboard is a lightweight local tool that helps open-source maintainers organize issues and pull requests before making decisions.

It does **not** replace maintainers. It does **not** close issues. It does **not** merge pull requests. It does **not** post replies automatically.

**Less triage fatigue. More maintainer clarity.**

## Why it exists

Maintainers have helped users for years. Maintainer Flowboard exists to help maintainers keep their workspace clear.

Many maintainers do not need another bot that makes decisions for them. They need a clearer board: what needs info, what needs reproduction, what is waiting for review, what is stale, and what might belong in release notes.

## Features in v0.1

- Local-first `index.html` app
- No login, server, or external API
- Sample issue and PR data
- JSON paste/import
- Board columns for common maintainer triage states
- Classification reasons and suggested next actions
- Manual classification override
- Maintainer notes
- Weekly Markdown summary
- JSON export/import for board state

## Quick start

1. Open `index.html` in a browser.
2. Click **Load sample data**.
3. Review the classified issue and PR cards.
4. Move cards manually if needed.
5. Click **Generate weekly summary**.
6. Copy the Markdown summary.

## What it does not do

- It does not auto-close issues.
- It does not auto-merge PRs.
- It does not post comments.
- It does not claim that a classification is correct.
- It does not replace repository-specific maintainer judgment.

## Local-first policy

v0.1 runs locally in the browser. Data stays in your browser unless you export it manually.

## Project status

Early v0.1 prototype. The goal is to validate whether this kind of board genuinely reduces maintainer triage friction.
