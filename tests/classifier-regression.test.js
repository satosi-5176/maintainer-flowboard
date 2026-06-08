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
  const names = ['attentionSignalText', 'attentionTitleLabelText', 'dependencyMaintenance', 'dependencySecurityRisk', 'dashboardAggregate', 'ciTokenPermissionHardening', 'cspNonceHardeningRisk', 'securityDataRisk', 'apiKeyRisk', 'isPullRequestItem', 'secondarySignals'];
  const context = { Date };
  vm.createContext(context);
  vm.runInContext(`function daysOld(iso){return Math.floor((Date.now()-new Date(iso||Date.now()).getTime())/86400000)}\n${names.map((name) => extractFunction(source, name)).join('\n')}\nthis.secondarySignals = secondarySignals;`, context);
  return context.secondarySignals;
}

const secondarySignals = loadBoardAttention();

function loadBoardPacketRenderer() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'board.html'), 'utf8');
  const names = ['attentionSignalText', 'attentionTitleLabelText', 'dependencyMaintenance', 'dependencySecurityRisk', 'dashboardAggregate', 'ciTokenPermissionHardening', 'cspNonceHardeningRisk', 'securityDataRisk', 'apiKeyRisk', 'isPullRequestItem', 'secondarySignals', 'confidenceLabel', 'packetConfidence', 'packetEvidence', 'packetCaution', 'normalizeReviewStatus', 'reviewStatusLabel', 'itemReviewKey', 'localReviewFor', 'hasLocalReview', 'compactRoutineReadyPR', 'appendPacketGroup'];
  const context = { Date };
  vm.createContext(context);
  vm.runInContext(`const state = {repoName:'TanStack/query'}; let reviewNotes = {}; const $ = () => ({value:'TanStack/query'});\nfunction daysOld(iso){return Math.floor((Date.now()-new Date(iso||Date.now()).getTime())/86400000)}\nfunction classificationConfidenceMeta(){return {confidence:'medium',evidenceSummary:'Fallback packet metadata.',caution:''}}\n${names.map((name) => extractFunction(source, name)).join('\n')}\nthis.appendPacketGroup = appendPacketGroup; this.setReviewNotes = (notes) => { reviewNotes = notes; };`, context);
  return { appendPacketGroup: context.appendPacketGroup, setReviewNotes: context.setReviewNotes };
}

const packetRenderer = loadBoardPacketRenderer();
const appendPacketGroup = packetRenderer.appendPacketGroup;

function packetItem(overrides) {
  return {
    number: overrides.number || 1,
    type: overrides.type || 'pr',
    title: overrides.title || 'Example title',
    labels: overrides.labels || [],
    body: overrides.body || '',
    author: overrides.author || 'human',
    updatedAt: overrides.updatedAt || '2026-06-01T00:00:00Z',
    column: overrides.column || 'Ready for Maintainer Review',
    confidence: overrides.confidence || 'high',
    evidenceSummary: overrides.evidenceSummary || 'GitHub PR state is non-draft; no stronger maintenance, docs, or release rule matched.',
    caution: overrides.caution || '',
    nextAction: overrides.nextAction || 'Inspect scope, test coverage, CI, linked issue verification, and risk before maintainer judgment.',
    note: overrides.note || '',
    ...overrides,
  };
}

function reviewKeyFor(itemUnderTest) {
  return `TanStack/query::${itemUnderTest.type === 'pr' ? 'pr' : 'issue'}::${itemUnderTest.number}`;
}

function renderPacketGroupFor(itemUnderTest, localReview) {
  packetRenderer.setReviewNotes(localReview ? { [reviewKeyFor(itemUnderTest)]: localReview } : {});
  const lines = [];
  appendPacketGroup(lines, 'Test group', [itemUnderTest], 'No items found.');
  packetRenderer.setReviewNotes({});
  return lines.join('\n');
}

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


test('action packet clarifies classification confidence wording without bare confidence label', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'board.html'), 'utf8');
  assert.ok(source.includes('REVIEW_NOTES_KEY="maintainerFlowboardReviewNotesV1"'));
  assert.ok(source.includes('["unreviewed","reviewed","revisit","classification_wrong"]'));
  assert.match(source, /Classification confidence: \$/);
  assert.ok(source.includes('Classification confidence describes how strongly the item matched this review bucket. It is not a merge, close, release, or priority recommendation.'));
  assert.ok(source.includes('Routine high-confidence ready PRs may be shown in a compact form. Items with medium/low confidence, cautions, attention flags, or local review notes remain expanded.'));
  assert.ok(source.includes('Local review notes are stored in this browser only and are not GitHub actions.'));
  assert.doesNotMatch(source, /- Confidence:/);
});


test('action packet compacts normal high-confidence ready PRs without attention flags', () => {
  const output = renderPacketGroupFor(packetItem({ number: 123, title: 'Example title' }));
  assert.match(output, /- PR #123: Example title/);
  assert.match(output, /Ready review candidate · High classification confidence/);
  assert.match(output, /Check: scope, tests, CI, linked issue, and risk\./);
  assert.doesNotMatch(output, /Current column:/);
  assert.doesNotMatch(output, /Why surfaced:/);
  assert.doesNotMatch(output, /Maintainer check:/);
});

test('action packet includes local review status without changing classification metadata', () => {
  const itemUnderTest = packetItem({ number: 129, title: 'Review noted PR', confidence: 'high' });
  const output = renderPacketGroupFor(itemUnderTest, { status: 'reviewed', note: '', updatedAt: '2026-06-07T00:00:00Z' });

  assert.match(output, /- PR #129: Review noted PR/);
  assert.match(output, /Current column: Ready for Maintainer Review/);
  assert.match(output, /Classification confidence: High/);
  assert.match(output, /Local review status: Reviewed/);
  assert.doesNotMatch(output, /Local note:/);
  assert.doesNotMatch(output, /Ready review candidate · High classification confidence/);
  assert.equal(itemUnderTest.column, 'Ready for Maintainer Review');
  assert.equal(itemUnderTest.confidence, 'high');
});

test('action packet includes local review note and keeps compact routine PR expanded', () => {
  const itemUnderTest = packetItem({ number: 130, title: 'Routine PR with local note' });
  const output = renderPacketGroupFor(itemUnderTest, {
    status: 'revisit',
    note: 'Check CSP behavior before next release.',
    updatedAt: '2026-06-07T00:00:00Z',
  });

  assert.match(output, /Current column: Ready for Maintainer Review/);
  assert.match(output, /Classification confidence: High/);
  assert.match(output, /Local review status: Revisit/);
  assert.match(output, /Local note: Check CSP behavior before next release\./);
  assert.match(output, /Why surfaced:/);
  assert.doesNotMatch(output, /Ready review candidate · High classification confidence/);
  assert.equal(itemUnderTest.column, 'Ready for Maintainer Review');
  assert.equal(itemUnderTest.confidence, 'high');
});

test('action packet keeps ready PRs with secondary signals expanded', () => {
  const output = renderPacketGroupFor(packetItem({ number: 124, title: 'Lock down public schema exposure', body: 'Security data exposure risk.' }));
  assert.match(output, /Current column: Ready for Maintainer Review/);
  assert.match(output, /Classification confidence: High/);
  assert.match(output, /Why surfaced:/);
  assert.match(output, /Maintainer check:/);
  assert.match(output, /Secondary signals: Security \/ data exposure check/);
  assert.doesNotMatch(output, /Ready review candidate · High classification confidence/);
});

test('action packet keeps medium-confidence issues expanded', () => {
  const output = renderPacketGroupFor(packetItem({
    number: 125,
    type: 'issue',
    title: 'Cache sometimes stops updating',
    confidence: 'medium',
    evidenceSummary: 'Title/body contains actionable bug wording with available evidence.',
    caution: 'Confirm reproduction quality and affected scope before acting.',
  }));
  assert.match(output, /- Issue #125: Cache sometimes stops updating/);
  assert.match(output, /Current column: Ready for Maintainer Review/);
  assert.match(output, /Classification confidence: Medium — Confirm reproduction quality and affected scope before acting\./);
  assert.match(output, /Why surfaced:/);
  assert.match(output, /Maintainer check:/);
  assert.doesNotMatch(output, /Ready review candidate · High classification confidence/);
});

test('action packet keeps docs, dependency, and release follow-up items expanded', () => {
  const docs = renderPacketGroupFor(packetItem({ number: 126, title: 'docs: clarify cache guide', column: 'Docs Candidate' }));
  const deps = renderPacketGroupFor(packetItem({ number: 127, title: 'chore(deps): update dependency dashboard', column: 'Dependency / Bot Maintenance', author: 'renovate[bot]' }));
  const release = renderPacketGroupFor(packetItem({ number: 128, title: 'Follow up migration notes after release', column: 'Tracking / Release Follow-up' }));

  for (const output of [docs, deps, release]) {
    assert.match(output, /Current column:/);
    assert.match(output, /Classification confidence: High/);
    assert.match(output, /Why surfaced:/);
    assert.match(output, /Maintainer check:/);
    assert.doesNotMatch(output, /Ready review candidate · High classification confidence/);
  }
});

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


test('question-shaped docs surface is limited to issue-like documentation items', () => {
  const prWithQuestionBody = classify(item({
    repo: 'TanStack/query',
    number: 10580,
    type: 'pull request',
    title: 'fix(vue-query): preserve discriminated union narrowing in UseBaseQueryReturnType',
    body: 'Should we add a follow-up FAQ entry? Does this need documentation? Generated checklist: Any questions?',
  }));
  const docsPr = classify(item({
    repo: 'example/repo',
    number: 42,
    type: 'pull request',
    title: 'docs: clarify Env API docs based on feedback',
    body: 'Should we mention the legacy behavior in the FAQ? Reviewer checklist includes questions.',
  }));
  const docsQuestionIssue = classify(item({
    repo: 'eslint/eslint',
    number: 43,
    type: 'issue',
    title: 'Question: is pnpm workspace mode supported?',
    labels: ['documentation', 'question'],
    body: 'The docs do not clearly say whether this is supported.',
  }));

  assert.ok(!secondarySignals(prWithQuestionBody).some((signal) => signal.startsWith('Question-shaped docs surface')));
  assert.equal(docsPr.column, 'Docs Candidate');
  assert.ok(!secondarySignals(docsPr).some((signal) => signal.startsWith('Question-shaped docs surface')));
  assert.equal(docsQuestionIssue.column, 'Docs Candidate');
  assert.ok(secondarySignals(docsQuestionIssue).some((signal) => signal.startsWith('Question-shaped docs surface')));
});

test('attention flags use CSP nonce hardening wording without changing classifier columns', () => {
  const cspPr = classify(item({
    repo: 'TanStack/query',
    number: 10893,
    type: 'pr',
    title: 'fix(query-devtools): set window.__nonce__ for goober CSP support',
    body: 'Set window.__nonce__ so goober works under Content Security Policy.',
  }));
  const cspIssue = classify(item({
    repo: 'TanStack/query',
    number: 10820,
    title: 'bug(query-devtools): styleNonce prop has no effect because goober 2.1.17+ overwrites the nonce via window.nonce',
    body: 'A strict style-src CSP needs the styleNonce to propagate.',
  }));
  const setupStyleSheetPr = classify(item({
    repo: 'TanStack/query',
    number: 10736,
    type: 'pr',
    title: 'fix(query-devtools): set window.nonce in setupStyleSheet',
    body: 'Wire the nonce before setupStyleSheet creates styles.',
  }));

  assert.equal(cspPr.column, 'Ready for Maintainer Review');
  assert.equal(cspIssue.column, 'Needs Reproduction');
  assert.equal(setupStyleSheetPr.column, 'Ready for Maintainer Review');

  for (const result of [cspPr, cspIssue, setupStyleSheetPr]) {
    const signals = secondarySignals(result);
    assert.ok(signals.some((signal) => signal.startsWith('CSP / nonce hardening check')), signals.join(' | '));
    assert.ok(!signals.some((signal) => signal.startsWith('Security / data exposure check')), signals.join(' | '));
  }
});

test('attention flags suppress body-only CSP nonce noise on dependency maintenance', () => {
  const broadDependencyUpdate = classify(item({
    repo: 'TanStack/query',
    number: 10780,
    type: 'pr',
    title: 'chore(deps): update all non-major dependencies',
    author: 'renovate[bot]',
    labels: ['dependencies'],
    body: 'Nested changelog text mentions styleNonce, window.nonce, goober CSP, and strict style-src fixes.',
  }));
  const dependencySecurityUpdate = classify(item({
    repo: 'TanStack/query',
    number: 10554,
    type: 'pr',
    title: 'chore(deps): update dependency astro to v6 [security]',
    author: 'renovate[bot]',
    labels: ['dependencies'],
    body: 'Dependency notes include Content Security Policy, styleNonce, and window.nonce details from linked releases.',
  }));
  const astroNodeSecurityUpdate = classify(item({
    repo: 'TanStack/query',
    number: 10333,
    type: 'pr',
    title: 'chore(deps): update dependency @astrojs/node to v10 [security]',
    author: 'renovate[bot]',
    labels: ['dependencies'],
    body: 'Aggregate dependency notes mention nonce propagation and goober CSP support.',
  }));
  const dashboard = classify(item({
    repo: 'TanStack/query',
    number: 1,
    title: 'Dependency Dashboard',
    labels: ['dependencies'],
    author: 'renovate[bot]',
    body: 'Dashboard content links updates mentioning token permissions, CSP, nonce, styleNonce, window.nonce, and dependency text.',
  }));

  for (const result of [broadDependencyUpdate, dependencySecurityUpdate, astroNodeSecurityUpdate, dashboard]) {
    const signals = secondarySignals(result);
    assert.equal(result.column, 'Dependency / Bot Maintenance', result.title);
    assert.ok(!signals.some((signal) => signal.startsWith('CSP / nonce hardening check')), `${result.title}: ${signals.join(' | ')}`);
  }

  assert.ok(secondarySignals(dependencySecurityUpdate).some((signal) => signal.startsWith('Dependency security update check')));
  assert.ok(secondarySignals(astroNodeSecurityUpdate).some((signal) => signal.startsWith('Dependency security update check')));
});

test('attention flags allow direct CSP nonce title or label signals on dependency maintenance', () => {
  const dependencyWithDirectTitle = classify(item({
    repo: 'TanStack/query',
    type: 'pr',
    title: 'chore(deps): update goober CSP nonce compatibility fixture',
    author: 'renovate[bot]',
    labels: ['dependencies'],
    body: 'Dependency update body is not needed for the signal.',
  }));
  const dependencyWithDirectLabel = classify(item({
    repo: 'TanStack/query',
    type: 'pr',
    title: 'chore(deps): update dependency goober to v3',
    author: 'renovate[bot]',
    labels: ['dependencies', 'Content Security Policy'],
    body: 'Dependency update body is not needed for the signal.',
  }));

  assert.equal(dependencyWithDirectTitle.column, 'Dependency / Bot Maintenance');
  assert.equal(dependencyWithDirectLabel.column, 'Dependency / Bot Maintenance');
  assert.ok(secondarySignals(dependencyWithDirectTitle).some((signal) => signal.startsWith('CSP / nonce hardening check')));
  assert.ok(secondarySignals(dependencyWithDirectLabel).some((signal) => signal.startsWith('CSP / nonce hardening check')));
});


test('attention flags preserve direct data exposure, API key, and dependency security wording', () => {
  const dataRisk = classify(item({ title: 'Lock down Supabase Data API / public schema exposure (RLS disabled)', body: 'Direct public schema exposure.' }));
  const apiKey = classify(item({ title: 'Google Maps embeds broken on tldraw.com due to expired API key', body: 'Direct expired API key operational outage.' }));
  const dependencySecurity = classify(item({ type: 'pr', title: 'chore(deps): update dependency vite to v7.1.5 [security]', author: 'renovate[bot]', body: 'Security update.' }));

  assert.ok(secondarySignals(dataRisk).some((signal) => signal.startsWith('Security / data exposure check')));
  assert.ok(secondarySignals(apiKey).some((signal) => signal.startsWith('API key / operational check')));
  assert.ok(!secondarySignals(apiKey).some((signal) => signal.startsWith('Security / data exposure check')));
  assert.ok(secondarySignals(dependencySecurity).some((signal) => signal.startsWith('Dependency security update check')));
});

test('public importer docs confidence reason omits file-list wording unless files are present', () => {
  const docsByLabel = classifyImported(item({
    type: 'pr',
    title: 'Update cache guide examples',
    labels: ['documentation'],
    body: 'Public import fetches issues/PRs but not changed files.',
  }));
  const docsByFiles = classifyImported(item({
    type: 'pr',
    title: 'Update cache guide examples',
    files: ['docs/cache.md'],
    body: 'Changed files supplied by fixture metadata.',
  }));

  assert.equal(docsByLabel.column, 'Docs Candidate');
  assert.equal(docsByLabel.evidenceSummary, 'Title, label, or GitHub Type gives a strong documentation signal.');
  assert.doesNotMatch(docsByLabel.evidenceSummary, /file list/i);
  assert.equal(docsByFiles.column, 'Docs Candidate');
  assert.equal(docsByFiles.evidenceSummary, 'Changed files are docs-only, a strong documentation signal.');
});

test('attention flags ignore dependency dashboard body-only token and exposure noise', () => {
  const dashboard = classify(item({ repo: 'vitejs/vite', number: 4790, title: 'Dependency Dashboard', labels: ['dependencies'], body: 'Token permissions, CSP, nonce, public schema exposure, and workflow permission hardening appear only in aggregated linked update text.' }));
  const signals = secondarySignals(dashboard);
  assert.equal(dashboard.column, 'Dependency / Bot Maintenance');
  assert.ok(!signals.some((signal) => signal.startsWith('CI/token permission hardening check')), signals.join(' | '));
  assert.ok(!signals.some((signal) => signal.startsWith('Security / data exposure check')), signals.join(' | '));
  assert.ok(!signals.some((signal) => signal.startsWith('CSP / nonce hardening check')), signals.join(' | '));
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

function loadBoardColumnLayoutHelpers() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'board.html'), 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${extractFunction(source, 'columnClassName')}\n${extractFunction(source, 'emptyColumnState')}\nthis.columnClassName = columnClassName; this.emptyColumnState = emptyColumnState;`, context);
  return context;
}

test('empty board columns use compact empty layout helpers', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'board.html'), 'utf8');
  const { columnClassName, emptyColumnState } = loadBoardColumnLayoutHelpers();

  assert.equal(columnClassName(false, 0), 'column empty');
  assert.equal(columnClassName(true, 0), 'column collapsed empty');
  assert.equal(columnClassName(false, 1), 'column');
  assert.equal(emptyColumnState(), '<p class="empty-state">No items in this section.</p>');
  assert.match(source, /\.column\.empty,\.column\.collapsed\{min-height:auto\}/);
  assert.match(source, /\.empty-state\{margin:0;padding:2px 6px;/);
});
