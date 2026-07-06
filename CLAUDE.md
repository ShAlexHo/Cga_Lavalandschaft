# Coding Guidelines

## Naming convention (JS/src)

- **Variables**: `snake_case` (e.g. `metaball_y_offset`, `ground_parameters`).
- **Constants** (values that are never reassigned, e.g. config values, scale factors): `UPPER_SNAKE_CASE` (e.g. `MAX_BALLS`, `LIGHT_WORLD_POSITION`). A `const` binding to a mutable state object (e.g. `settings`) is **not** a constant in this sense and stays lowercase.
- **Functions/methods**: `camelCase` (e.g. `createMetaballs`, `setupGui`, `applyY`), regardless of whether declared via `function` or assigned to a `const` as an arrow function.
- **No abbreviations.** Spell names out in full (`callback` instead of `cb`, `parameters` instead of `params`, `position` instead of `pos`, `controller` instead of `ctrl`, `value` instead of `v`, `error`/`entry` instead of `e`, `message` instead of `msg`).
  - Exception: established technical terms/standard acronyms whose full form would be unusual (`hex`, `JSON`, `URL`, `DOM`, `PNG`, library names like `THREE`/`GUI`), as well as classic loop counters (`i`, `j`) and coordinate letters (`x`, `y`, `z`, `r`, `g`, `b`).

Applies to all `src/` code, including tests (`__tests__/`, `e2e/`).
