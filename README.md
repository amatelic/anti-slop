# @amatelic/anti-slop

Opinionated Oxlint rules that reject low-evidence, low-signal TypeScript and JavaScript patterns. This is an owned fork of [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) (MIT), packaged to be consumed as a **git dependency** instead of being vendored into each repository.

There is no install-time build: `dist/` is committed to this repository (ESM `.mjs`, esbuild `--packages=external` — Node refuses type-stripping `.ts` under `node_modules`, and ESM keeps the `default`-export shape Oxlint's plugin loader expects). After changing rules, run `pnpm build` and commit the regenerated `dist/`. Consumers point `jsPlugins` at the built entry.

## Usage

```bash
pnpm add -D @amatelic/anti-slop@github:amatelic/anti-slop
```

```ts
// oxlint.config.ts
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: [
    { name: "anti-slop", specifier: "@amatelic/anti-slop/dist/index.mjs" },
  ],
  rules: {
    "oxc/no-accumulating-spread": "error",
    "anti-slop/no-array-filter-map": "error",
    "anti-slop/no-reduce-accumulator-copy": "error",
    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "error",
    "anti-slop/no-known-value-widening": "error",
    "anti-slop/no-module-mocking": "error",
    "anti-slop/no-object-parameters": "error",
    "anti-slop/no-reflect-apply": "error",
    "anti-slop/no-reflect-get": "error",
    "anti-slop/no-runtime-typeof": "error",
    "anti-slop/no-shape-in-symbol-names": "error",
    "anti-slop/no-unknown-parameters": "error",
    "anti-slop/no-unknown-returns": "error",
    "anti-slop/no-unknown-type-aliases": "error",
    "anti-slop/no-unsafe-dictionary-type": "error",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/require-readable-spacing": "error",
    "anti-slop/require-safety-comment-for-type-assertion": "error",
  },
});
```

The Effect plugin (`src/effect/`) is opt-in — register `@amatelic/anti-slop/dist/effect/index.mjs` as a second plugin only in repositories with a direct `effect` dependency.

## Version lockstep

`@oxlint/plugins` is pinned exact in `dependencies`. Keep it in lockstep with the `oxlint` CLI version of the consuming repository.

## Provenance

See [UPSTREAM.md](./UPSTREAM.md) for the exact upstream commit this fork tracks and the intentional deviations.
