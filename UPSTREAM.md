# Provenance

- Upstream: https://github.com/dmmulroy/anti-slop (MIT, Dillon Mulroy)
- Forked at upstream commit: `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b` (2026-09-10, `main` at fork time)
- Fork date: 2026-09-12
- `src/` is byte-identical to upstream `src/` at the commit above, except upstream `src/**/*.test.ts` files are not included (they were not part of the installer bundle this fork started from).
- Packaging deviations (this fork only, no rule changes):
  - Standalone package `@amatelic/anti-slop` meant for git-dependency consumption (`pnpm add -D @amatelic/anti-slop@github:amatelic/anti-slop`).
  - Bundled to `dist/` (CommonJS, esbuild, `--packages=external`) by the `prepare` script on git install — Node refuses type-stripping `.ts` under `node_modules`, so a compiled entry is required. `src/` ships for reference/debugging only.
  - `@oxlint/plugins` is a pinned-exact production `dependency` so pnpm installs it transitively for git installs.
  - No publish to npm: the only consumer entry points are `dist/index.js` (generic) and `dist/effect/index.js` (opt-in); scripts are `build`, `prepare`, `typecheck`.
- Upstream's vendored `src/vendor/eslint-stylistic/LICENSE` travels with the `require-readable-spacing` rule.

## Syncing upstream

To pull upstream rule changes: diff `src/` against the upstream commit of interest, port changes manually into `src/`, bump `@oxlint/plugins` together with consuming repos' `oxlint` version, and record the new upstream commit here.
