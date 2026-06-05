# Maintainer Flowboard v0.1 Spec

## Scope

v0.1 is a local browser-based board for organizing issue and pull request data before maintainer judgment.

The app is a triage aid. It does not decide whether an issue is valid, whether a pull request should be merged, or what a maintainer should say.

## Input format

Input is JSON. The app accepts arrays of GitHub-like issue and pull request objects.

Supported fields include, but are not limited to:

- `number`
- `title`
- `body`
- `bodyText`
- `body_text`
- `bodyMarkdown`
- `description`
- `labels`
- `comments`
- `author`
- `user.login`
- `updatedAt`
- `updated_at`
- `type`
- `__typename`
- `kind`
- `stateReason`
- `pull_request`
- `isPullRequest`
- `draft`
- `files`
- `changedFiles`
- `changed_files`

The parser should tolerate common REST-like and GraphQL-like payload shapes where practical.

## Board columns

The current v0.1 board columns are:

- Unclassified
- Needs Info
- Needs Reproduction
- Ready for Maintainer Review
- Waiting for Author Response
- Docs Candidate
- Dependency / Bot Maintenance
- Feature / Request
- Tracking / Release Follow-up
- Stale Candidate

## Classification behavior

Classification is rule-based and transparent. It is a starting point for review, not a source of truth.

The app may classify items using signals such as:

- bug-like wording
- reproduction or actionability details
- draft pull request state
- documentation labels or docs-only file changes
- dependency or bot-maintenance wording
- feature/request wording
- tracking or release-follow-up wording
- stale `updatedAt` / `updated_at` dates

Maintainers can manually move cards between columns.

## Board interaction behavior

v0.1 supports:

- collapsible columns
- collapsed-by-default cards
- expanded card details
- manual move buttons
- maintainer notes
- board snapshot jump buttons
- visible item limiting for large columns
- `Show remaining N items` expansion for hidden cards

## Weekly summary behavior

The app can generate a Markdown weekly maintainer summary.

The summary includes:

- repository name
- generated date
- optional maintainer note
- snapshot counts
- recommended next review order
- detailed items grouped by column

For large categories, the detailed section lists only the first visible group of items and includes an overflow line for hidden items.

`Ready for Maintainer Review` includes an issue/PR breakdown in the recommended review order section.

## Persistence and privacy

v0.1 is local-first.

- No login
- No server
- No database
- No tracking
- No external API calls
- No GitHub App integration

Board state is stored locally in the browser unless the user exports it manually.

## Non-goals

- No automatic issue closing
- No automatic PR merging
- No automatic replies
- No repository-specific correctness claims
- No AI decision-making in v0.1
- No claim that a classification is correct
- No replacement of maintainer judgment
