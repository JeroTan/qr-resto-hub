## Deferred from: code review of 1-2-establish-ddd-api-middleware-lib-utils-and-component-structure (2026-05-08)

- [x] `src/lib/zod/wrappers.ts:181` - `zodArrayMinMax` calls `.min()` and `.max()` without reassigning returned schemas, so configured array length bounds are not enforced. Fixed on 2026-05-08 by reassigning returned schemas and adding regression coverage.
