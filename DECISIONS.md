# Decisions

## Decision 001: Do not build an AI maintainer

Rejected:
- An AI that decides whether issues should be closed or PRs should be merged.

Reason:
- Repository culture and maintainer judgment vary too much.
- Replacing judgment is risky and disrespectful.

Accepted:
- Build a board that organizes information before human judgment.

## Decision 002: Start local-first

Rejected:
- GitHub App integration in v0.1.

Reason:
- Authentication, permissions, and security would distract from the core idea.

Accepted:
- Start with JSON paste/import and sample data.
