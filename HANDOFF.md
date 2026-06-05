# Maintainer Flowboard Handoff

## Core principle

Maintainer Flowboard does not make decisions.

It does not close issues, merge pull requests, post replies, judge contributor intent, or replace repository-specific maintainer judgment.

It organizes issue and pull request information before human judgment.

Tagline:

> Less triage fatigue. More maintainer clarity.

## Repository

`satosi-5176/maintainer-flowboard`

## Current product shape

Maintainer Flowboard is a local-first browser board for OSS maintainer triage.

v0.1 accepts pasted/imported JSON issue and PR data, classifies items into board columns, lets maintainers manually move cards, add private notes, and generate a weekly Markdown summary.

There is no login, server, database, tracking, GitHub API integration, auto-close, auto-merge, or auto-reply behavior in v0.1.

## Current implemented features

- Local-first `index.html` app
- Sample issue and PR data
- JSON paste/import
- JSON export/import for board state
- Board columns for maintainer triage
- Collapsible columns
- Collapsed-by-default cards
- Expanded card details
- Manual move buttons
- Maintainer notes
- Classification reasons
- Suggested next actions
- Board snapshot jump buttons
- Weekly Markdown summary
- Recommended next review order
- Visible item limit for large boards
- `Show remaining N items` button
- Summary overflow line for hidden detailed items
- `Ready for Maintainer Review` issue/PR breakdown

## Important prior PRs

### #1 Improve flowboard scanning interactions

- Added collapsible columns and cards.
- Replaced native select controls with explicit move buttons.
- Preserved local-first behavior.

### #2 Scroll to weekly summary after generation

- Added smooth scroll to the weekly summary after generation.

### #4 Improve triage classification rules

- Added `Ready for Maintainer Review`, `Dependency / Bot Maintenance`, `Feature / Request`, and `Tracking / Release Follow-up`.
- Improved issue/PR triage heuristics.

### #5 Improve issue and PR classification heuristics

- Improved Prettier-style classification cases.
- `#19112`-style markdown issue should classify as `Ready for Maintainer Review`.
- `#19270`-style tracking issue should classify as `Tracking / Release Follow-up`.
- `#18533`-style PR should avoid false `Docs Candidate` classification.

### #6 Improve classification robustness for varied issue/PR payloads

- Added helper functions for varied REST/GraphQL-like payloads.
- Improved type, body, comments, files, and labels extraction.

### #7 / #8 Add Recommended next review order

- Added a prioritized weekly summary section.
- Empty categories are excluded.

### #9 Scale board and weekly summary display

- Added `VISIBLE_ITEM_LIMIT = 5`.
- Added `Show remaining N items`.
- Limited detailed weekly summary entries to the first five items per category.
- Added an overflow line for hidden items.
- Added `Ready for Maintainer Review` issue/PR breakdown.

## Current roadmap

### v0.1

- Local board
- JSON paste/import
- Markdown summary

### v0.2

- Configurable rules
- Better duplicate candidate detection
- Release notes draft view

### v0.3

- Optional GitHub API import helper
- Repository workflow profiles
- More examples from real public workflows

## Next safe tasks

1. Keep this handoff note updated when the project direction changes.
2. Add a visible README pointer to this handoff only if it helps maintain continuity.
3. Add large sample data after this handoff is merged.
4. Update `SPEC.md` to match the current columns, because it still mentions older column names such as `Waiting for Maintainer Review` and `Release Notes Candidate`.
5. Then proceed to v0.2 work:
   - configurable rules
   - duplicate candidate detection
   - release notes draft view

## Do not do next

- Do not add GitHub API integration yet.
- Do not add auto-close, auto-merge, or auto-reply.
- Do not turn this into an AI maintainer.
- Do not make classification look authoritative.
- Do not start unrelated app work from this repository.

## Review note

This file is a continuity document. It exists so future development chats can recover project context from the repository itself instead of relying only on chat history.
