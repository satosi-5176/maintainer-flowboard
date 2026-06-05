# Project Judgment Model

## Primary purpose

The purpose of Maintainer Flowboard is not only to build a tool for maintainers.

The purpose is to build an open-source project that helps OSS maintainers, and to maintain that project as its maintainer.

In other words, this repository is both:

1. a tool for reducing maintainer workload, and
2. a real maintainer practice ground where the project owner operates issues, pull requests, documentation, roadmap, release notes, and project decisions as an OSS maintainer.

## Main goal

The main goal is to greatly reduce and streamline OSS maintainer work.

Every feature, document, workflow, and technical decision should be judged by whether it helps that goal.

## Baseline premise: all maintainers must benefit

Maintainer Flowboard must help OSS maintainers whether or not they already use AI.

The project should not become useful only for AI-heavy workflows. A maintainer who does not use AI should still be able to feel that the tool reduces reading, sorting, remembering, prioritizing, documenting, and release-preparation work.

This is the baseline requirement.

If the tool only helps when paired with another AI assistant, it is not strong enough. AI-assisted value is an additional requirement, not a substitute for basic maintainer usefulness.

## Operating premise: many maintainers use AI

Maintainer Flowboard should also be developed under the assumption that modern OSS maintainers may use AI assistance as part of their maintenance workflow.

The project should not assume that every maintainer is doing every task manually, nor should it compete with AI coding agents by becoming another agent that makes decisions.

Instead, Maintainer Flowboard should help maintainers use AI more safely, clearly, and efficiently.

This means the project should focus on work such as:

- organizing issues and pull requests before AI or human review,
- turning scattered repository information into clean context for AI-assisted work,
- preserving maintainer judgment while reducing repeated reading and sorting,
- making handoffs, summaries, release candidates, and review priorities easier to inspect,
- helping maintainers decide what to ask AI to do next,
- and making AI-assisted maintenance less chaotic.

This premise changes the benchmark.

Maintainer Flowboard must be useful to maintainers who do not use AI, and it must still provide additional structure, memory, workflow clarity, and review support for maintainers who do use AI.

To score highly, the project must provide value that neither manual work nor a generic AI chat or coding agent reliably provides by itself.

## Development posture: route changes are allowed

Maintainer Flowboard should not become attached to a single implementation path.

The goal is stable. The route is flexible.

If a chosen route becomes too difficult, too indirect, too fragile, or no longer effective for helping maintainers, the project should abandon that route quickly rather than preserve it out of sunk cost.

When changing direction, the project should keep whatever was learned or built that remains useful, then move to a better route.

In short:

- The goal is stable.
- The route is flexible.
- Previous decisions are not sacred.
- Useful learnings are carried forward.
- Ineffective paths should be cut early.

Maintainer Flowboard should be maintained with the same mindset it tries to support: clear judgment, low friction, and practical progress.

## Evaluation responsibility

The project owner is starting with no prior OSS maintainer career.

Because of that, the project should not rely only on the owner's intuition about whether a feature helps maintainers.

AI assistance should be used as an objective review partner. Its role is not only to generate code, but to ask:

- Does this actually reduce OSS maintainer work?
- Does this make a maintainer's judgment, triage, review, documentation, release, or handoff work easier?
- Would a non-AI maintainer clearly feel the difference compared with doing the work manually?
- Would it still help if the maintainer already uses AI tools?
- Does it give AI-assisted maintainers better context, structure, or continuity than a generic AI chat alone?
- Is this adding another tool-shaped burden instead of removing work?
- Is the project drifting away from the main goal?

AI review must be willing to give low scores. It should not inflate the project level for encouragement.

## S evaluation scale

The S evaluation is not a general quality score.

It measures how strongly Maintainer Flowboard reduces OSS maintainer workload and creates results that would be difficult or impossible to reproduce manually, while also providing additional value for maintainers who already use AI assistance.

### S0

Nobody needs it, and it may make maintainer work more complicated.

### S1

It might be usable in some narrow way, but major implementation changes are needed before it can reliably help maintainers.

### S2

Using it can lighten maintainer work in some cases. However, for some maintainers or workflows, doing the work without the tool may still be smoother.

### S3

It is not perfect, but it can lighten many maintainer tasks.

The efficiency or result produced by the tool is clearly difficult to recover manually. A maintainer should be able to feel that the tool provides an advantage that is not practical to reproduce by hand.

For maintainers who do not use AI, S3 requires obvious practical workload reduction.

For AI-assisted maintainers, S3 also requires the tool to provide practical structure or continuity that a normal AI chat or coding-agent session would not reliably preserve by itself.

S3 is the minimum release condition.

### S4

The effect of the tool is impossible for an individual to reproduce manually.

It can streamline most maintainer work and may create devoted users.

### S5

It becomes a standing part of OSS maintenance.

Most maintainers would value it, and it would begin to sit near the center of their work.

### S6

It reaches a level where acquisition by GitHub or a similar platform would be plausible.

Nearly all maintainers would consider it essential for OSS maintenance.

### S7

It can generate major profit as a standalone product.

## Release rule

Maintainer Flowboard should not be treated as releasable until it reaches at least S3.

For release purposes, S3 means more than "the app works" or "the feature is useful."

S3 requires that maintainers can clearly feel a level of efficiency or output quality that they could not realistically achieve without the tool.

This applies first to maintainers doing the work without AI. The tool must be valuable on its own.

Because many maintainers also use AI, S3 additionally requires a clear advantage over using a generic AI assistant alone.

A release candidate should therefore answer yes to all of the following:

- Does the tool reduce multiple maintainer tasks, not just one small convenience?
- Is the saved work obvious to someone reviewing the workflow?
- Would recreating the same organization, prioritization, summary, release-candidate extraction, or handoff manually be very difficult?
- Would a maintainer who does not use AI still gain practical efficiency from this tool?
- Would a maintainer who already uses AI still gain clarity, continuity, or workflow structure from this tool?
- Does the tool avoid creating extra review burden that cancels out its benefit?
- Does the tool preserve maintainer judgment instead of replacing it?

If the answer is no, the project may still be useful, but it is not yet S3 and should not be treated as release-ready.

## Current-position review

Every major PR should include or support an honest current-position review.

The review should distinguish:

- implementation progress,
- documentation progress,
- maintainer-workload reduction for non-AI workflows,
- usefulness for AI-assisted maintainers,
- evidence of practical usefulness,
- remaining friction,
- and current S level.

A feature can be implemented successfully while the project still remains at S1 or S2.

## PR review questions

Before opening or merging a PR, ask:

1. What maintainer task does this reduce?
2. Who would feel the benefit?
3. Is the benefit larger than the new complexity?
4. Does this preserve human maintainer judgment?
5. Does this help a maintainer who does not use AI?
6. Does this help a maintainer who already uses AI?
7. Does it provide structure, continuity, or workflow memory beyond a generic AI chat?
8. Does this move the project toward S3?
9. If this route fails, what useful learning or component should be carried forward?

## Do not confuse activity with progress

More features, more documents, or more automation do not automatically raise the S level.

Progress means the project becomes better at reducing real OSS maintainer workload.

If a path creates activity without reducing workload, the path should be reconsidered or abandoned.
