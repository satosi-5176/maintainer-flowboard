# Maintainer Flowboard v0.1 Spec

## Scope

v0.1 is a local browser-based board for organizing issue and pull request data.

## Input format

Input is JSON. The app accepts arrays of objects with fields such as number, title, body, labels, author, updatedAt, comments, type, draft, and files.

## Board columns

- Unclassified
- Needs Info
- Needs Reproduction
- Waiting for Maintainer Review
- Waiting for Author Response
- Docs Candidate
- Stale Candidate
- Release Notes Candidate

## Non-goals

- No automatic issue closing
- No automatic PR merging
- No automatic replies
- No repository-specific correctness claims
- No AI decision-making in v0.1
