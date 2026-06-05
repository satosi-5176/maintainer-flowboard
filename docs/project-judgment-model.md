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
- Would a maintainer clearly feel the difference compared with doing the work manually?
- Is this adding another tool-shaped burden instead of removing work?
- Is the project drifting away from the main goal?

AI review must be willing to give low scores. It should not inflate the project level for encouragement.

## S evaluation scale

The S evaluation is not a general quality score.

It measures how strongly Maintainer Flowboard reduces OSS maintainer workload and creates results that would be difficult or impossible to reproduce manually.

### S0

Nobody needs it, and it may make maintainer work more complicated.

### S1

It might be usable in some narrow way, but major implementation changes are needed before it can reliably help maintainers.

### S2

Using it can lighten maintainer work in some cases. However, for some maintainers or workflows, doing the work without the tool may still be smoother.

### S3

It is not perfect, but it can lighten many maintainer tasks.

The efficiency or result produced by the tool is clearly difficult to recover manually. A maintainer should be able to feel that the tool provides an advantage that is not practical to reproduce by hand.

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

A release candidate should therefore answer yes to all of the following:

- Does the tool reduce multiple maintainer tasks, not just one small convenience?
- Is the saved work obvious to someone reviewing the workflow?
- Would recreating the same organization, prioritization, summary, release-candidate extraction, or handoff manually be very difficult?
- Does the tool avoid creating extra review burden that cancels out its benefit?
- Does the tool preserve maintainer judgment instead of replacing it?

If the answer is no, the project may still be useful, but it is not yet S3 and should not be treated as release-ready.

## Current-position review

Every major PR should include or support an honest current-position review.

The review should distinguish:

- implementation progress,
- documentation progress,
- maintainer-workload reduction,
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
5. Does this move the project toward S3?
6. If this route fails, what useful learning or component should be carried forward?

## Do not confuse activity with progress

More features, more documents, or more automation do not automatically raise the S level.

Progress means the project becomes better at reducing real OSS maintainer workload.

If a path creates activity without reducing workload, the path should be reconsidered or abandoned.
