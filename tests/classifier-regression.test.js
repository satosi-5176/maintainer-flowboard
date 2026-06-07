const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `${name} should exist`);
  const bodyStart = source.indexOf('{', start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

function loadClassifier(file, name) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const context = { Date };
  vm.createContext(context);
  vm.runInContext(`function daysOld(iso){return Math.floor((Date.now()-new Date(iso||Date.now()).getTime())/86400000)}\n${extractFunction(source, name)}\nthis.classify = ${name};`, context);
  return context.classify;
}

const classify = loadClassifier('index.html', 'classifyItem');
const classifyImported = loadClassifier('public-import.html', 'classifyImportedItem');

function loadBoardAttention() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'board.html'), 'utf8');
  const names = ['attentionSignalText', 'attentionTitleLabelText', 'dependencyMaintenance', 'dependencySecurityRisk', 'dashboardAggregate', 'ciTokenPermissionHardening', 'securityDataRisk', 'apiKeyRisk', 'secondarySignals'];
  const context = { Date };
  vm.createContext(context);
  vm.runInContext(`function daysOld(iso){return Math.floor((Date.now()-new Date(iso||Date.now()).getTime())/86400000)}\n${names.map((name) => extractFunction(source, name)).join('\n')}\nthis.secondarySignals = secondarySignals;`, context);
  return context.secondarySignals;
}

const secondarySignals = loadBoardAttention();

function item(overrides) {
  return {
    number: overrides.number || 1,
    repo: overrides.repo || 'example/repo',
    type: overrides.type || 'issue',
    title: overrides.title,
    labels: overrides.labels || [],
    body: overrides.body || '',
    author: overrides.author || 'human',
    updatedAt: overrides.updatedAt || '2026-06-01T00:00:00Z',
    ...overrides,
  };
}

function assertFixture(fixture) {
  const result = classify(item(fixture));
  assert.equal(result.column, fixture.expectedColumn, fixture.title);
  if (fixture.expectedFacet) assert.ok(result.facets?.includes(fixture.expectedFacet), `${fixture.title} expected facet ${fixture.expectedFacet}; got ${result.facets}`);
  if (fixture.unexpectedColumn) assert.notEqual(result.column, fixture.unexpectedColumn, fixture.title);
  if (fixture.unexpectedFacets) {
    for (const facet of fixture.unexpectedFacets) assert.ok(!result.facets?.includes(facet), `${fixture.title} unexpected facet ${facet}; got ${result.facets}`);
  }
  if (fixture.expectedFacets) {
    for (const facet of fixture.expectedFacets) assert.ok(result.facets?.includes(facet), `${fixture.title} expected facet ${facet}; got ${result.facets}`);
  }
  if (fixture.actionIncludes) assert.match(result.nextAction, fixture.actionIncludes, fixture.title);
  if (fixture.reasonIncludes) assert.match(result.reason, fixture.reasonIncludes, fixture.title);
  if (fixture.actionIntent) assert.equal(result.actionIntent, fixture.actionIntent, fixture.title);
  if (fixture.expectedConfidence) assert.equal(result.confidence, fixture.expectedConfidence, fixture.title);
  if (fixture.evidenceIncludes) assert.match(result.evidenceSummary, fixture.evidenceIncludes, fixture.title);
}

const fixtures = [
  // A. Linked open PR detection before issue action packets.
  { repo: 'storybookjs/storybook', number: 35067, title: 'Custom viewport toolbar active-state is wrong', labels: ['bug', 'addon: viewport'], body: 'Steps to reproduce with expected and actual active toolbar state.', linkedPullRequests: [{ number: 35068, state: 'open' }], expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'linked_open_pr_review', actionIntent: 'review_validate_linked_pr', actionIncludes: /Candidate PR exists.*#35068/ },
  { repo: 'floating-ui/floating-ui', number: 3032, title: 'CSS zoom causes incorrect popover positioning', labels: ['bug'], body: 'Expected placement differs from actual placement. Steps included.', linkedPullRequests: [{ number: 3463, state: 'open' }], expectedColumn: 'Ready for Maintainer Review', expectedFacets: ['linked_open_pr_review', 'environment_specific'], actionIncludes: /review and verify the linked PR/ },
  { repo: 'vitest-dev/vitest', number: 10520, title: 'Browser mode path with + hangs during URL encoding', labels: ['bug'], body: 'Reproduction steps use a deterministic browser mode path with +.', linkedPullRequests: [{ number: 10521, state: 'open' }], expectedColumn: 'Ready for Maintainer Review', expectedFacets: ['linked_open_pr_review', 'environment_specific'] },
  { repo: 'withastro/astro', number: 16974, title: 'Node adapter logger throws in runtime', labels: ['bug', 'adapter'], body: 'Minimal repro with expected and actual logger output.', linkedPullRequests: [{ number: 16985, state: 'open' }], expectedColumn: 'Ready for Maintainer Review', expectedFacets: ['linked_open_pr_review', 'environment_specific'] },
  { repo: 'remotion-dev/remotion', number: 8206, title: 'Line between keyframes should be selectable', labels: ['enhancement', 'studio'], body: 'Feature request for Studio timeline interaction.', linkedPullRequests: [{ number: 8208, state: 'open' }], expectedColumn: 'Feature / Request', expectedFacet: 'linked_open_pr_review' },

  // B. Issue/PR separation.
  { repo: 'prettier/prettier', number: 19256, title: 'Fix YAML blockLiteral and blockFolded value', type: 'issue', labels: ['bug'], body: 'Expected output differs from actual output in playground.', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'storybookjs/storybook', number: 35055, title: 'UI: Fix args not preserved in isolation mode', type: 'pr', body: 'Adds regression tests.', expectedColumn: 'Ready for Maintainer Review', actionIncludes: /CI|test coverage|linked issue/ },
  { repo: 'floating-ui/floating-ui', number: 3396, title: 'ci(.github): update actions/checkout and actions/setup-node to v5', type: 'pr', expectedColumn: 'Dependency / Bot Maintenance', expectedFacet: 'ci_infra_maintenance' },
  { repo: 'honojs/hono', number: 4995, title: 'test-only: add websocket fixture coverage', type: 'pr', expectedColumn: 'Dependency / Bot Maintenance', expectedFacet: 'test_only_maintenance' },
  { repo: 'vitest-dev/vitest', number: 10524, title: 'feat(cli): filter by name string', type: 'pr', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'withastro/astro', number: 16990, title: 'chore: merge main into next', type: 'pr', draft: true, baseBranch: 'next', expectedColumn: 'Waiting for Author Response', expectedFacet: 'draft_not_ready' },

  // C/D. Tracking, bot workflow, release automation, branch sync.
  { repo: 'storybookjs/storybook', number: 34824, title: '[Tracking]: Docgen Server', labels: ['addon: docs', 'docgen', 'server'], githubType: 'Tracking', body: 'Architecture plan for docgen server.', expectedColumn: 'Tracking / Release Follow-up', expectedFacet: 'tracking_roadmap_architecture', reasonIncludes: /Tracking|roadmap|multi-area/ },
  { repo: 'storybookjs/storybook', number: 35025, title: '[aw] Duplicate Code Detector failed (pre-agent)', labels: ['agentic-workflows', 'build'], author: 'automation-bot', body: 'Workflow failed before agent execution.', expectedColumn: 'Dependency / Bot Maintenance', expectedFacets: ['internal_workflow_failure', 'bot_generated'] },
  { repo: 'storybookjs/storybook', number: 35076, title: 'Release: Prerelease 10.5.0-alpha.6', type: 'pr', author: 'github-actions[bot]', body: 'Generated prerelease.', expectedColumn: 'Tracking / Release Follow-up', expectedFacet: 'release_automation' },
  { repo: 'withastro/astro', number: 16972, title: '[ci] release', type: 'pr', author: 'github-actions[bot]', body: 'Changesets release PR. Release-blocking checks are failing.', expectedColumn: 'Tracking / Release Follow-up', expectedFacets: ['release_automation', 'release_blocked'], actionIncludes: /release-blocking/ },
  { repo: 'withastro/astro', number: 16991, title: 'merge main into next', type: 'pr', baseBranch: 'next', body: 'Branch sync only. Included commit text mentions features.', expectedColumn: 'Dependency / Bot Maintenance', expectedFacet: 'branch_sync' },

  // E/F/G. Regressions, repro state, environment specifics.
  { repo: 'vercel/next.js', number: 94041, title: 'Route handler build regression 16.1.7 → 16.2.0', labels: ['bug'], body: 'Expected build passes in 16.1.7, actual fails in 16.2.0. Reproduction steps included.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'regression_release_migration' },
  { repo: 'vitest-dev/vitest', number: 10525, title: 'vitest 4 broke stubEnv(name, undefined)', labels: ['bug'], body: 'Vitest 3 passed but Vitest 4 and 5 beta fail. Expected and actual included.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'regression_release_migration' },
  { repo: 'withastro/astro', number: 16949, title: 'Dynamic route regression after upgrade', labels: ['bug', 'needs repro'], body: 'Detailed analysis, but no minimal reproduction or reduced test case.', expectedColumn: 'Needs Reproduction', expectedFacets: ['regression_release_migration', 'needs_repro_hard'] },
  { repo: 'withastro/astro', number: 16954, title: 'Build error with content collection', labels: ['bug', 'needs repro'], body: 'StackBlitz reproduction: https://stackblitz.com/edit/astro-repro Expected and actual included.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'repro_present_despite_stale_label' },
  { repo: 'floating-ui/floating-ui', number: 3464, title: 'iOS Safari smooth scrolling overlay does not update position', labels: ['bug'], body: 'No CodeSandbox, but steps: on iOS Safari, run this minimal code sample and scroll. Expected and actual included.', expectedColumn: 'Ready for Maintainer Review', expectedFacets: ['environment_specific', 'repro_inline_ok'] },
  { repo: 'floating-ui/floating-ui', number: 3413, title: 'Tooltip positioning wrong in Next.js nested use client', labels: ['bug'], body: 'Placeholder steps. Hard to provide a repro because app uses external framework.', expectedColumn: 'Needs Reproduction', expectedFacet: 'needs_repro_hard' },
  { repo: 'honojs/hono', number: 4976, title: "WebSocket doesn't work", labels: ['bug'], body: 'Bun on WSL context. Actual fails but no clear minimal reproduction.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'environment_specific' },
  { repo: 'vitest-dev/vitest', number: 10465, title: 'macOS Chromium userEvent keyboard behaves deterministically incorrectly', labels: ['bug'], body: 'Steps and expected actual included; not intermittent or CI-only.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'environment_specific' },
  { repo: 'remotion-dev/remotion', number: 8198, title: 'selectComposition stalls on Node 24.16.0 but not Node 24.15.0', labels: ['bug'], body: 'Version regression with expected and actual behavior.', expectedColumn: 'Ready for Maintainer Review', expectedFacets: ['environment_specific', 'regression_release_migration'] },
  { repo: 'vercel/next.js', number: 92978, title: 'Turbopack workspace root misdetected causing RAM exhaustion', labels: ['bug', 'css'], body: 'Stray parent lockfile and pnpm symlink context. Expected and actual included.', expectedColumn: 'Ready for Maintainer Review', expectedFacets: ['environment_specific', 'performance'] },

  // H/I. Docs distinctions and feature/API design traps.
  { repo: 'vercel/next.js', number: 94458, title: 'Docs: prefetchInlining not described anywhere', githubType: 'Documentation', body: 'No labels.', expectedColumn: 'Docs Candidate', expectedFacet: 'docs_review' },
  { repo: 'vercel/next.js', number: 94499, title: 'Instrumentation.onRequestError error parameter type does not match the docs', labels: ['bug'], body: 'Docs say a type but runtime contract differs.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'api_docs_contract_mismatch' },
  { repo: 'remotion-dev/remotion', number: 8089, title: 'Canvas runtime exception on docs page example', labels: [], body: 'The docs URL is where the browser/canvas runtime exception happens. Expected actual steps.', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'honojs/hono', number: 4993, title: 'Feature Request: WebExtensions runtime support', labels: ['bug'], body: 'Bug template includes code examples, but this asks to add support.', expectedColumn: 'Feature / Request' },
  { repo: 'prettier/prettier', number: 19224, title: '[Feature] Add option to preserve object wrapping', labels: ['type:option'], body: 'Playground input/output included to illustrate desired option.', expectedColumn: 'Feature / Request' },
  { repo: 'prettier/prettier', number: 19255, title: 'Add support for Django Template and Jinja', labels: ['language support'], body: 'Proposal with examples.', expectedColumn: 'Feature / Request' },
  { repo: 'floating-ui/floating-ui', number: 3314, title: 'Mark popper.js deprecated', labels: ['enhancement'], body: 'Ecosystem maintenance request.', expectedColumn: 'Feature / Request' },

  // J/K/L/M. Privacy, hardening, performance, maintenance, draft/WIP.
  { repo: 'vercel/next.js', number: 94475, title: 'Illegal collection of data', labels: ['bug'], body: 'Telemetry sent without consent; GDPR privacy complaint.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'privacy_compliance_escalation' },
  { repo: 'honojs/hono', number: 4989, title: 'Add WWW-Authenticate realm option to bearer auth middleware', labels: ['enhancement'], body: 'Standards compliance request, not vulnerability disclosure.', expectedColumn: 'Feature / Request', expectedFacet: 'security_sensitive_enhancement' },
  { repo: 'prettier/prettier', number: 19140, title: 'Proposal: add OSS-Fuzz coverage', labels: ['enhancement'], body: 'Fuzzing hardening proposal.', expectedColumn: 'Feature / Request', expectedFacet: 'security_hardening' },
  { repo: 'prettier/prettier', number: 19302, title: 'chore: disable Yarn lifecycle scripts during install', type: 'pr', body: 'Supply-chain hardening maintenance.', expectedColumn: 'Dependency / Bot Maintenance', expectedFacets: ['ci_infra_maintenance', 'security_hardening'] },
  { repo: 'vitest-dev/vitest', number: 10436, title: 'Inline snapshots are slow in browser mode with V8 coverage', labels: ['bug'], body: 'Minimal reproduction repo and benchmark details included.', expectedColumn: 'Ready for Maintainer Review', expectedFacets: ['performance', 'environment_specific'] },
  { repo: 'withastro/astro', number: 16973, title: 'Cloudflare build time increased after upgrade', labels: ['performance'], body: 'No minimal reproduction; no reduced test case for the build time increase.', expectedColumn: 'Needs Reproduction', expectedFacets: ['performance', 'needs_repro_hard'] },
  { repo: 'vitest-dev/vitest', number: 10519, title: 'perf: improve browser startup', type: 'pr', draft: true, body: 'TODO benchmark and discussion label.', expectedColumn: 'Waiting for Author Response', expectedFacet: 'draft_not_ready' },
  { repo: 'honojs/hono', number: 2543, title: 'WIP PoC: v5 routing experiment', type: 'pr', body: 'No current merge plan; for v5 roadmap hold.', expectedColumn: 'Stale Candidate', expectedFacet: 'wip_backlog_hold' },
  { repo: 'vercel/next.js', number: 94516, title: 'feat: flip experimental.appShells default', type: 'pr', body: 'Experimental default flip; release risk needs docs/changelog.', expectedColumn: 'Ready for Maintainer Review' },

  // N/O/P/Q/R. Formatter/parser, UI visual, a11y, external integration, AI/bot-review.
  { repo: 'prettier/prettier', number: 19203, title: 'SCSS declaration flags inside strings print incorrectly', labels: ['bug'], body: 'Playground expected output and actual output show parser/printer bug.', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'prettier/prettier', number: 19195, title: 'Issues resolved by #19079', labels: ['release'], body: 'Meta release follow-up list.', expectedColumn: 'Tracking / Release Follow-up' },
  { repo: 'prettier/prettier', number: 19153, title: '[codex] prune safe ignore globs for faster CLI traversal', labels: ['performance'], body: 'Expected faster ignore traversal; [codex] is provenance only.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'performance' },
  { repo: 'storybookjs/storybook', number: 35030, title: 'Pseudo-states :where() wrapping breaks selector specificity', labels: ['bug', 'addon'], body: 'Reproduction shows CSS selector rewrite logic changes expected specificity.', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'remotion-dev/remotion', number: 8210, title: 'Noise pass effect idea for Studio', labels: ['enhancement'], body: 'Inspiration: looks cool as a visual effect.', expectedColumn: 'Feature / Request' },
  { repo: 'floating-ui/floating-ui', number: 3440, title: 'FloatingArrow edge-doubling artifact', labels: ['bug'], body: 'Visual rendering bug with proposed SVG fix. Expected and actual screenshots.', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'floating-ui/floating-ui', number: 3412, title: 'Tooltip accessibility guidance for existing config workaround', labels: ['docs', 'accessibility'], body: 'Clarified as docs guidance, not code bug.', expectedColumn: 'Docs Candidate' },
  { repo: 'floating-ui/floating-ui', number: 3424, title: 'FloatingPortal with FocusManager tablist axe violation', labels: ['bug', 'accessibility'], body: 'Repro steps with axe violation and expected result.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'accessibility' },
  { repo: 'floating-ui/floating-ui', number: 3414, title: 'React 19 RadixUI useOptimistic infinite rerender', labels: ['bug'], body: 'Reporter says this is not a bug per se and needs isolation.', expectedColumn: 'Needs Reproduction' },
  { repo: 'withastro/astro', number: 16952, title: 'advancedRouting with astro/hono custom 500 runtime handling fails', labels: ['bug', 'integration'], body: 'Focused reproduction with expected and actual behavior.', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'vitest-dev/vitest', number: 10521, title: 'fix(browser)!: encode path with plus sign', type: 'pr', labels: ['maybe automated'], body: 'Bot comment asks for human ownership and AI disclosure.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'ai_disclosure_review' },
  { repo: 'storybookjs/storybook', number: 35080, title: 'Restore QR code share tool popover removed by v10.4 refactor', type: 'pr', body: 'CodeRabbit summary says New Features, but human title links regression restoration.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'regression_release_migration' },

  // S. Priority regression fixes from real-repo rechecks.
  { repo: 'eslint/eslint', number: 20902, title: 'Bug: Inaccurate and missing typings for AST node parent references in the JS rule API', labels: ['bug', 'types'], body: 'The JS rule API typings have inaccurate parent references and missing node parent references.', expectedColumn: 'Ready for Maintainer Review', unexpectedColumn: 'Feature / Request' },
  { repo: 'tldraw/tldraw', number: 9054, title: 'Lock down Supabase Data API / public schema exposure (RLS disabled)', body: 'Public schema exposure risk with RLS disabled should be locked down.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'security_data_exposure', unexpectedColumn: 'Feature / Request' },
  { repo: 'tldraw/tldraw', number: 9025, title: 'Google Maps embeds broken on tldraw.com due to expired API key', body: 'Embeds are broken because the API key expired in production config.', expectedColumn: 'Ready for Maintainer Review', expectedFacet: 'api_key_operational', unexpectedColumn: 'Feature / Request' },
  { repo: 'TanStack/query', number: 10792, title: 'docs(useMutationState): TMutation safety warning is missing from hook JSDoc — only visible on type definition', body: 'The hook JSDoc is missing the type safety warning that appears on the type definition.', expectedColumn: 'Docs Candidate', unexpectedColumn: 'Ready for Maintainer Review', expectedConfidence: 'high', evidenceIncludes: /Title starts with docs/ },
  { repo: 'tldraw/tldraw', number: 9048, title: 'Make tool post-create behavior easier to customize', body: 'Product/API ergonomics request for custom tool post-create behavior.', expectedColumn: 'Feature / Request', unexpectedColumn: 'Ready for Maintainer Review', expectedConfidence: 'medium', evidenceIncludes: /labels are absent/ },
  { repo: 'tldraw/tldraw', number: 7893, title: 'Add waitForSync method to TLSyncClient', body: 'API request to add a method for sync readiness.', expectedColumn: 'Feature / Request', unexpectedColumn: 'Ready for Maintainer Review', expectedConfidence: 'medium', evidenceIncludes: /labels are absent/ },
  { repo: 'tldraw/tldraw', number: 9059, title: 'Expand text shape indicator so the cursor is visible at the start and end of the text box', body: 'UI behavior improvement for text cursor visibility.', expectedColumn: 'Feature / Request', unexpectedColumn: 'Unclassified', expectedConfidence: 'medium', evidenceIncludes: /labels are absent/ },
  { repo: 'vitejs/vite', number: 4790, title: 'Dependency Dashboard', labels: ['dependencies'], body: 'This dashboard aggregates updates. Linked items mention token permissions and workflow permission hardening.', expectedColumn: 'Dependency / Bot Maintenance', unexpectedFacets: ['security_hardening'] },
  { repo: 'TanStack/query', number: 9991, title: 'chore(deps): update dependency vite to v6.4.2 [security]', type: 'pr', author: 'renovate[bot]', body: 'Automated dependency update. Body includes old roadmap-held linked context.', expectedColumn: 'Dependency / Bot Maintenance', expectedFacet: 'dependency_security_update', unexpectedColumn: 'Stale Candidate' },
  { repo: 'vitejs/vite', number: 22617, title: 'fix(bundled-dev): errors should be kept when incremental build fails', type: 'pr', body: 'Normal fix PR. Linked issue body mentions backlog and roadmap-held context but title and labels do not.', expectedColumn: 'Ready for Maintainer Review', unexpectedColumn: 'Stale Candidate' },

  // S. Existing validated repo smoke checks.
  { repo: 'TanStack/query', number: 1, title: 'Query observer stops responding after reconnect', labels: ['bug'], body: 'Steps to reproduce, expected and actual included.', expectedColumn: 'Ready for Maintainer Review' },
  { repo: 'tldraw/tldraw', number: 2, title: 'Add modifier shortcut for custom tool', labels: ['enhancement'], body: 'Feature request.', expectedColumn: 'Feature / Request' },
  { repo: 'vitejs/vite', number: 3, title: 'Docs: clarify troubleshooting for HMR websocket', githubType: 'Documentation', body: 'Documentation update.', expectedColumn: 'Docs Candidate' },
  { repo: 'eslint/eslint', number: 4, title: 'chore(deps): update dependency dashboard', type: 'pr', author: 'renovate[bot]', body: 'Dependency update.', expectedColumn: 'Dependency / Bot Maintenance' },
];

test('cross-repo OSS classifier regression fixtures use conservative columns and facets', () => {
  for (const fixture of fixtures) assertFixture(fixture);
});


test('classifier confidence metadata covers representative strong, medium, and weak signals', () => {
  const samples = [
    { title: 'docs: clarify cache invalidation guide', type: 'pr', expectedColumn: 'Docs Candidate', expectedConfidence: 'high', evidenceIncludes: /docs/i },
    { title: 'Bug: cache observer stops responding', labels: ['bug'], body: 'Expected update, actual stale state. Steps included.', expectedColumn: 'Ready for Maintainer Review', expectedConfidence: 'high', evidenceIncludes: /Bug:.*labels include bug/ },
    { title: 'Dependency Dashboard', labels: ['dependencies'], body: 'Aggregated dependency updates.', expectedColumn: 'Dependency / Bot Maintenance', expectedConfidence: 'high', evidenceIncludes: /Dependency Dashboard/ },
    { title: 'Allow custom API shape for cache keys', body: 'It would help to support a different option shape.', expectedColumn: 'Feature / Request', expectedConfidence: 'medium', evidenceIncludes: /labels are absent/ },
    { title: 'Google Maps embeds broken on tldraw.com due to expired API key', body: 'Expired API key breaks production embeds.', expectedColumn: 'Ready for Maintainer Review', expectedConfidence: 'high', unexpectedColumn: 'Feature / Request', evidenceIncludes: /API-key|operational/ },
    { title: 'Question about something unclear', body: 'Not sure where this belongs.', expectedColumn: 'Unclassified', expectedConfidence: 'low', evidenceIncludes: /No strong/ },
  ];
  for (const sample of samples) assertFixture(sample);
});

test('attention flags ignore dependency dashboard body-only token and exposure noise', () => {
  const dashboard = classify(item({ repo: 'vitejs/vite', number: 4790, title: 'Dependency Dashboard', labels: ['dependencies'], body: 'Token permissions, public schema exposure, and workflow permission hardening appear only in aggregated linked update text.' }));
  const signals = secondarySignals(dashboard);
  assert.equal(dashboard.column, 'Dependency / Bot Maintenance');
  assert.ok(!signals.some((signal) => signal.startsWith('CI/token permission hardening check')), signals.join(' | '));
  assert.ok(!signals.some((signal) => signal.startsWith('Security / data exposure check')), signals.join(' | '));
});

test('attention flags keep direct security and API-key issue signals', () => {
  const dataRisk = classify(item({ title: 'Lock down Supabase Data API / public schema exposure (RLS disabled)', body: 'Direct public schema exposure.' }));
  const apiKey = classify(item({ title: 'Google Maps embeds broken on tldraw.com due to expired API key', body: 'Direct expired API key operational outage.' }));
  assert.ok(secondarySignals(dataRisk).some((signal) => signal.startsWith('Security / data exposure check')));
  assert.ok(secondarySignals(apiKey).some((signal) => signal.startsWith('API key / operational check')));
});

test('public importer classifier stays aligned with repository selector classifier for core guards', () => {
  const samples = [
    fixtures.find((fixture) => fixture.number === 35067),
    fixtures.find((fixture) => fixture.number === 34824),
    fixtures.find((fixture) => fixture.number === 35076),
    fixtures.find((fixture) => fixture.number === 94475),
    fixtures.find((fixture) => fixture.number === 16954),
    fixtures.find((fixture) => fixture.number === 20902),
    fixtures.find((fixture) => fixture.number === 9054),
    fixtures.find((fixture) => fixture.number === 9025),
    fixtures.find((fixture) => fixture.number === 10792),
    fixtures.find((fixture) => fixture.number === 9048),
    fixtures.find((fixture) => fixture.number === 7893),
    fixtures.find((fixture) => fixture.number === 9059),
    fixtures.find((fixture) => fixture.number === 9991),
    fixtures.find((fixture) => fixture.number === 22617),
  ];
  for (const fixture of samples) {
    const result = classify(item(fixture));
    const importedResult = classifyImported(item(fixture));
    assert.equal(importedResult.column, result.column, fixture.title);
    assert.equal(importedResult.actionIntent, result.actionIntent, fixture.title);
    if (fixture.expectedFacet) assert.ok(importedResult.facets?.includes(fixture.expectedFacet), fixture.title);
  }
});
