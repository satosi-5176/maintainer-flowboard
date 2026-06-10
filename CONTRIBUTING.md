# Contributing to Maintainer Flowboard

Thank you for helping improve Maintainer Flowboard. This guide explains how to make focused, safe, maintainer-centered changes without breaking the project's core safety model.

## Project purpose

Maintainer Flowboard helps open-source maintainers organize issues and pull requests before human judgment.

It is a local-first triage and review aid. It can group public GitHub issues and pull requests, explain rule-based classifications, surface review hints, preserve local notes, and export Markdown drafts for maintainer workflows.

It does **not**:

- replace maintainers
- close issues
- merge pull requests
- post comments
- publish releases
- decide severity
- decide priority
- act as a source of truth

Contributions should preserve that purpose. The app should make maintainer review clearer, not make decisions for maintainers.

## Safety model

Maintainer Flowboard has intentionally narrow safety boundaries:

- The app is local-first.
- Public GitHub import reads public repository data.
- Local notes stay in the browser unless manually exported.
- The app must not add GitHub write actions without an explicit project-level decision.
- OAuth, tokens, private repository support, auto-comment, auto-close, auto-merge, and release publishing must not be added casually.

When in doubt, prefer read-only behavior, transparent wording, and manual maintainer action. A feature that can affect a public repository, contact users, modify project state, or imply official maintainer judgment requires explicit project-level discussion before implementation.

## Classifier contribution rules

Classifier changes should be small, transparent, and easy to review.

Follow these rules when changing classification behavior:

- Keep pull request rules and issue rules separate where possible.
- Prefer titles and labels for strong classification signals.
- Use body text carefully, especially for aggregate items such as Dependency Dashboards or broad dependency updates.
- Do not broaden keyword matching without regression tests.
- Do not add vague "AI-like" conclusions.
- Treat attention flags as review hints, not severity or priority decisions.
- Treat classification confidence as a description of match strength, not correctness.
- Keep classification changes small and reviewable.

Classifier wording should explain why a rule matched. It should not imply that the app knows the true severity, priority, owner, intent, or correctness of an issue or pull request.

## Regression test policy

Classifier changes should add or update regression tests in `tests/classifier-regression.test.js`.

The project already uses real open-source repository patterns as validation examples, including:

- `TanStack/query`
- `tldraw/tldraw`
- `vitejs/vite`
- `eslint/eslint`

Testing principles:

- Add a positive fixture when adding a rule.
- Add a negative fixture when fixing a false positive.
- Preserve prior columns unless intentionally changing them.
- Test attention flags separately from classification columns.
- Test wording changes when they affect Action Packet output.

When a classifier change is relevant, run:

```sh
node --test tests/classifier-regression.test.js
```

If a classifier behavior change does not include a test, explain why in the pull request.

## UI contribution rules

UI changes should keep human review at the center of the product.

- Keep the board and cards as the primary human review surface.
- Treat Action Packet and release notes textareas as Markdown export and draft surfaces.
- Avoid broad CSS redesigns inside classifier or logic pull requests.
- Keep mobile readability in mind.
- Do not hide safety disclaimers.
- Do not make local notes look like GitHub actions.

UI copy should make the difference between local review state, exported Markdown, and GitHub repository state obvious.

## Local notes contribution rules

Local review notes are browser-local maintainer notes.

- They should not write to GitHub.
- They should not automatically reclassify items.
- Items with local notes should remain visible in exports.
- Local review state should use stable item keys based on repository, item type, and item number.

Local notes can support maintainer memory and handoff, but they must not become hidden automation or a substitute for repository actions.

## Pull request expectations

Before opening a pull request, check the items that apply:

- [ ] The change is focused.
- [ ] No GitHub write action was added.
- [ ] No OAuth/token/private repo behavior was added.
- [ ] Existing safety wording was preserved.
- [ ] Classifier changes include regression tests.
- [ ] UI wording changes do not change classifier behavior.
- [ ] `node --test tests/classifier-regression.test.js` was run when relevant.
- [ ] Manual testing notes are included when behavior changes.

Small pull requests are easier to review and safer to merge. If a change touches classification, UI, exports, and storage at the same time, consider splitting it.

## Documentation contribution rules

Documentation should be practical, accurate, and careful about the project's boundaries.

- Keep `README.md` visitor-focused.
- Keep `CONTRIBUTING.md` developer-focused.
- Keep non-goals clear.
- Do not overclaim AI capability or classifier correctness.
- Prefer practical examples over abstract claims.

When updating documentation, preserve the distinction between what Maintainer Flowboard helps organize and what maintainers decide.
