# S3 Execution Plan

## Purpose of this plan

This plan defines how Maintainer Flowboard should move from its current position, **S2 candidate / not S3**, toward a defensible S3 evaluation.

It exists to prevent random feature selection.

Future PRs should be chosen because they close a named S3 gap, not because they are easy to implement or feel useful in isolation.

## S3 target

Maintainer Flowboard reaches S3 when it can clearly lighten many OSS maintainer tasks and produce efficiency or results that are very difficult to recover without the tool.

S3 requires both:

1. clear standalone value for maintainers who do not use AI, and
2. clear added value for maintainers who already use AI.

For non-AI maintainers, the tool must obviously reduce reading, sorting, remembering, prioritizing, summarizing, release preparation, or handoff work.

For AI-assisted maintainers, the tool must provide structure, continuity, workflow memory, or review framing that a generic AI chat or coding-agent session does not reliably preserve by itself.

## Current position

Current status: **S2 candidate / S3 not reached**.

The app is already more than a concept. It can:

- load sample or pasted issue/PR data,
- classify items into maintainer triage columns,
- allow manual card movement,
- store maintainer notes,
- generate a weekly maintainer summary,
- generate a release notes draft,
- preserve local-first non-automation principles.

However, it is not yet S3 because:

- real data input still has too much friction,
- classifications are simple heuristics,
- outputs are useful but not yet difficult to reproduce manually,
- generic AI chat can still approximate parts of the workflow,
- repeated real maintainer sessions have not been demonstrated,
- there is no evidence yet that the tool saves more work than it adds.

## S3 gaps

### Gap A: Input friction

A maintainer should not need to spend too much effort preparing data before the tool can help.

Current problem:

- The tool accepts JSON, but users need to know how to get or shape that JSON.
- Without a smooth input path, the tool may add work before it saves work.

S3 requirement:

- A maintainer should be able to reach a useful board from realistic repository data with minimal setup.

### Gap B: Decision-ready output

The output should not only list items. It should help maintainers decide what to review next.

Current problem:

- Weekly summaries and release-note drafts exist, but they are still shallow.
- A maintainer may still need to reread many cards to make decisions.

S3 requirement:

- Outputs should be strong enough that recreating the same review order, summaries, handoffs, or release candidates manually would be very difficult.

### Gap C: Workflow continuity

The tool must help maintainers resume work without rereading everything.

Current problem:

- Notes and local state exist, but there is not yet a strong maintainer handoff or session continuity model.

S3 requirement:

- A maintainer should be able to leave and return later with preserved context, review state, next actions, and rationale.

### Gap D: Value beyond generic AI chat

The tool must provide more than a one-off AI prompt.

Current problem:

- A maintainer can paste data into AI and get some summary, so the tool must justify why it is better.

S3 requirement:

- Maintainer Flowboard should provide persistent structure, visible state, reproducible grouping, manual corrections, and workflow memory that a normal chat session does not reliably preserve.

### Gap E: Evidence

The project needs proof of usefulness, not only implementation.

Current problem:

- The app has not yet been tested against enough realistic public repository workflows.

S3 requirement:

- The repository should contain evidence that Maintainer Flowboard reduces work in realistic scenarios.

## Execution pillars

### Pillar 1: Make realistic input easier

Goal: reduce the setup cost before the tool becomes useful.

Planned PRs:

1. Add realistic large sample data
   - Demonstrate columns with more than five items.
   - Exercise weekly summary overflow behavior.
   - Exercise release notes draft candidates.
   - Show what a real maintainer workload looks like.

2. Add import guide and example payloads
   - Document the accepted JSON shape.
   - Provide REST-like and GraphQL-like examples.
   - Explain how to collect issue/PR data manually without needing a GitHub App.

3. Add schema/reference examples
   - Provide minimal issue object.
   - Provide minimal PR object.
   - Provide richer examples with comments, labels, draft state, files, and updated dates.

S3 impact:

- Reduces first-use friction.
- Helps non-AI maintainers use the tool without inventing their own data format.
- Gives AI-assisted maintainers cleaner context to paste or export.

### Pillar 2: Make outputs more decision-ready

Goal: make the tool produce outputs that save meaningful maintainer thinking time.

Planned PRs:

1. Improve weekly summary structure
   - Include top risks.
   - Include blocked items.
   - Include quick wins.
   - Include stale-but-important candidates.
   - Keep output editable and non-authoritative.

2. Improve release notes draft
   - Separate user-facing changes from internal maintenance.
   - Mark uncertain items.
   - Add review-before-including prompts.
   - Avoid implying that the tool decides releases.

3. Add maintainer action packet
   - A generated Markdown packet containing next-review order, unresolved questions, release candidates, and handoff notes.
   - This should be useful for the maintainer themselves, a collaborator, or an AI assistant.

S3 impact:

- Moves the tool from passive board to reusable maintainer work product.
- Makes manual reconstruction significantly harder.
- Creates value beyond generic AI summarization because the output is tied to visible board state and manual corrections.

### Pillar 3: Preserve workflow continuity

Goal: make the tool useful across repeated sessions.

Planned PRs:

1. Add session review state
   - Track which items have been reviewed in the current session.
   - Track last touched / needs follow-up markers.
   - Keep this local-first.

2. Add handoff packet generation
   - Export a compact handoff that explains current board state and next actions.
   - Make it suitable for future self, collaborators, or AI context.

3. Add project memory export
   - Export board state plus judgment notes in a format that can be re-imported later.
   - Avoid server or account dependencies.

S3 impact:

- Reduces rereading.
- Helps maintainers resume work.
- Gives AI-assisted users durable context that a single chat may lose.

### Pillar 4: Add controlled configurability

Goal: respect repository-specific maintainer culture without pretending one heuristic fits all projects.

Planned PRs:

1. Add simple rule profile notes
   - Start with documentation and UI affordances, not a complex rule engine.
   - Let maintainers describe project-specific triage rules.

2. Add lightweight configurable keywords
   - Allow local configuration of labels or words that should count as docs, release, dependency, waiting, or feature signals.
   - Keep defaults simple.

3. Add export/import for configuration
   - Preserve local-first behavior.
   - Make configuration portable between sessions.

S3 impact:

- Makes the tool useful across more repositories.
- Avoids one-size-fits-all classification.
- Helps both non-AI and AI-assisted maintainers trust the board.

### Pillar 5: Collect evidence

Goal: prove that the tool reduces maintainer work.

Planned PRs:

1. Add workflow trials document
   - Record test runs against public repository-like data.
   - Note what the tool saved and where it failed.

2. Add manual vs Flowboard comparison
   - Compare manual review work against Flowboard-assisted review.
   - Include where generic AI chat can match it and where it cannot.

3. Add S-level review updates
   - After major milestones, update `docs/current-position-review.md`.
   - Do not inflate the S level without evidence.

S3 impact:

- Converts the project from "working prototype" to "validated maintainer aid."
- Provides the evidence needed for release readiness.

## Proposed milestone path

### Milestone 1: Solid S2

Goal: make the tool reliably useful in small realistic workflows.

Needed outcomes:

- Large sample data demonstrates scale.
- Import guide makes first-use less confusing.
- Weekly summary and release-note draft are easy to inspect.
- User can understand the workflow in under five minutes.

Likely PR sequence:

1. large sample data
2. import guide and payload examples
3. README quick-start update if needed
4. first workflow trial document

### Milestone 2: S2.5

Goal: make outputs strong enough that the tool saves visible review time.

Needed outcomes:

- Better weekly summary sections.
- Better release notes draft.
- Handoff/action packet generation.
- Clear distinction between reviewed, blocked, ready, and follow-up items.

Likely PR sequence:

1. decision-ready weekly summary
2. release notes draft refinement
3. maintainer action packet
4. current-position review update

### Milestone 3: S3 candidate

Goal: demonstrate that the tool creates results that are difficult to reproduce manually or with generic AI alone.

Needed outcomes:

- Realistic public workflow trials.
- Manual vs Flowboard comparison.
- AI chat vs Flowboard comparison.
- Repeat-session workflow demonstration.
- Updated current-position review stating whether S3 is reached or still not reached.

Likely PR sequence:

1. workflow trials and evidence
2. repeat-session continuity improvements
3. lightweight configurable rules
4. S3 candidate review

## S3 acceptance checklist

Maintainer Flowboard can be considered S3 only if all of the following are true:

- It reduces multiple maintainer tasks, not only one convenience.
- A non-AI maintainer can clearly feel efficiency gains.
- An AI-assisted maintainer still gains structure, continuity, or workflow memory beyond generic AI chat.
- The tool reduces repeated reading and sorting.
- The generated outputs are reusable with light editing.
- The tool preserves human maintainer judgment.
- The setup cost does not cancel out the benefit.
- Recreating the same result manually would be very difficult.
- There is evidence from realistic workflow trials.
- The current-position review agrees that S3 is reached.

If any item is missing, the project is not yet S3.

## Routes to cut if they fail

The project should abandon or defer routes that do not improve S3 progress.

Cut or defer:

- GitHub API integration if authentication and permissions distract from the core workflow.
- Complex automation that risks replacing maintainer judgment.
- Features that look impressive but only add another place to manage information.
- Generic AI-wrapper behavior that does not provide durable structure or workflow continuity.
- Heavy configuration systems before simple local-first workflows are proven.
- Polishing UI details if input friction and output usefulness remain weak.

Carry forward:

- Useful classification examples.
- Good sample data.
- Clear documentation.
- Handoff patterns.
- Release candidate grouping.
- Any evidence about what actually saves work.

## Immediate next PR after this plan

The next implementation PR should be:

**Add realistic large sample data.**

Reason:

- It supports the existing scale UI.
- It makes weekly summary overflow visible.
- It makes release notes draft behavior easier to test.
- It gives non-AI maintainers a concrete demo.
- It gives AI-assisted maintainers structured context to inspect.
- It is a low-risk step toward solid S2.

This PR should not add GitHub API integration, automation, or new dependencies.

## Review rule for future work

Every future feature PR should state which S3 gap it addresses.

If a PR does not address an S3 gap, it should explain why it is still worth doing.
