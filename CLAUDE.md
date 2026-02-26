# CLAUDE.md — r2mo-init (zero-ai)

## Project Overview

`r2mo-init` (npm: `zero-ai`, binary: `ai`) is a Node.js CLI tool for the **Zero Ecotope** ecosystem. It scaffolds full-stack Java applications (Spring Boot / Vert.x), React frontends, and manages RBAC permissions via Excel workflows. Dedicated to **Rachel Momo**.

- Version: 1.0.80
- Entry point: `src/ai.js`
- Author: Lang

## Tech Stack

- **Runtime**: Node.js (pure JavaScript, no TypeScript)
- **CLI Framework**: commander v11 + inquirer v8
- **Template Engines**: EJS, Handlebars
- **Excel Processing**: exceljs
- **Database**: MySQL (mysql2 driver, no ORM)
- **Data**: immutable, lodash, underscore, js-yaml
- **HTTP**: superagent
- **Crypto**: crypto-js, uuid

## Architecture

```
src/
├── ai.js                    # CLI entry (bin), wires header → body → end
├── commander/               # Command definitions (JSON configs)
├── commander-ai/            # Command implementations (fn.*.js)
├── commander-shared/        # Shared init/parse utilities
├── epic/                    # Core utility library (internal toolkit)
│   ├── ai.economy.*         # Code generation (Excel, Java, React, JSON, plugin)
│   ├── ai.export.*          # I/O, string utils, seek/parse
│   ├── ai.path.*            # File/dir operations, content output
│   ├── ai.string.*          # String utilities
│   ├── ai.uncork.*          # Element/feature transforms
│   ├── ai.under.*           # Evaluation, terminal functions
│   ├── ai.unified.*         # Logging, error codes, sorting, decisions
│   └── zero.__.*            # Constants, find utilities
├── cab/                     # Templates & resources
│   ├── form/                # React form templates
│   ├── list/                # React list templates
│   ├── perm/                # RBAC permission Excel templates
│   ├── plugin/              # Java plugin templates
│   └── resource/            # Resource files
├── _template/               # Project scaffolding templates
│   ├── SPRING/              # Spring Boot scaffold
│   ├── ZERO/                # Vert.x Zero scaffold
│   ├── MODULE/              # Module templates
│   ├── EXCEL/               # Excel templates (ex-api, ex-crud)
│   └── APP/                 # Application templates
└── previous/                # Legacy code (do not modify)
```

## Boot Sequence

```
ai.js → Ec.executeHeader()    # Print CLI banner
      → Ut.parseMetadata()    # Load JSON configs from src/commander/*.json
      → Ec.executeBody()      # Match command → dispatch to commander-ai executor
      → Ec.executeEnd()       # Print footer
```

Each command is defined by a JSON file in `src/commander/` with shape:
```json
{
  "executor": "executeFunctionName",
  "description": "...",
  "command": "commandName",
  "options": [{ "name": "...", "alias": "...", "description": "...", "default": "..." }]
}
```

The executor function is resolved from `src/commander-ai/index.js`.

## CLI Commands

| Command | Executor | Purpose |
|---------|----------|---------|
| `ai spring` | `executeSpring` | Generate Spring Boot scaffold |
| `ai zero` | `executeZero` | Generate Vert.x Zero scaffold |
| `ai web` | `executeWeb` | Clone React frontend from Gitee |
| `ai sync` | `executeFrontendSync` | Sync Zero UI framework updates |
| `ai ex-api` | `executeExApi` | Generate RBAC Excel from YAML metadata |
| `ai ex-crud` | `executeExCrud` | Generate CRUD Excel from YAML metadata |
| `ai ex-perm` | `executeExPerm` | Generate permission Excel files |
| `ai apply` | `executeApply` | Install Cursor AI rules from remote repo |
| `ai uuid` | `executeUuid` | Generate UUIDs (clipboard on macOS) |
| `ai str` | `executeString` | Generate random strings |
| `ai md5` | `executeMD5` | MD5 hash generation |
| `ai help` | `executeHelp` | Show help information |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `Z_DB_TYPE` | Database type |
| `Z_DB_HOST` | Database host |
| `Z_DB_PORT` | Database port |
| `Z_DBS_INSTANCE` | Database instance name |
| `Z_DB_APP_USER` | Database username |
| `Z_DB_APP_PASS` | Database password |
| `Z_APP_ID` | Application ID (multi-tenant) |
| `Z_TENANT` | Tenant identifier |
| `Z_SIGMA` | Sigma dimension key (multi-tenant) |
| `Z_AI_SYNC` | Skeleton project path for `ai sync` |

## Naming Conventions

### File Naming (src/epic/)
Pattern: `ai.<domain>.<layer>.<type>.<feature>.js`
- Domain: `economy`, `export`, `path`, `string`, `uncork`, `under`, `unified`
- Layer: `impl` (internal), `interface` (exported), `fn` (function)
- Type: `fn` (function), `io` (I/O), `v` (value/constant)

### File Naming (src/commander-ai/)
Pattern: `fn.<category>.<feature>.js`
- Categories: `source` (scaffold), `ex` (Excel), `random` (generators), `help`

### Module Exports
All modules use spread-merge pattern for flat namespace:
```js
module.exports = { ...moduleA, ...moduleB, ...moduleC };
```

## Adding a New Command

1. Create JSON config in `src/commander/<command>.json`
2. Create executor in `src/commander-ai/fn.<category>.<feature>.js`
3. Register executor in `src/commander-ai/index.js`
4. The CLI auto-discovers commands from JSON configs via `Ut.parseMetadata()`

## Key Modules

- **`Ec` (epic)**: Core utility library — import via `require('./epic')`. Provides file I/O, string manipulation, template rendering, Excel processing, Java/React code generation, logging, and terminal output.
- **`Ut` (commander-shared)**: Command parsing, project initialization helpers for Spring/Zero/Module/App scaffolds, input validation (`nameValid`).
- **`Executor` (commander-ai)**: Map of all command executor functions, dispatched by command name.

## Code Style

- Pure CommonJS (`require` / `module.exports`), no ES modules
- No TypeScript, no linter, no formatter configured
- Comments in Chinese (中文注释)
- Immutable.js used for data structures where applicable
- Generator-based async with `co` + `bluebird` (legacy pattern)
- No test framework configured (test script points to a single file)

## Development

```bash
# Install dependencies
npm install

# Link CLI globally for local dev
npm link

# Run a command
ai <command> [options]

# Example: generate Spring Boot scaffold
ai spring -n my-app -c app.json -o ./output
```

## Template System

- EJS templates in `src/cab/` and `src/_template/`
- Templates use `<%= variable %>` syntax for interpolation
- Excel templates in `src/cab/perm/` use `{TABLE}` markers for data injection
- Java templates generate Maven POM, Spring Boot configs, Vert.x verticles
- React templates generate form/list components

## Database Schema Patterns

- Multi-tenant: every table includes `SIGMA`, `TENANT_ID`, `APP_ID` columns
- RBAC tables: `S_USER`, `S_ROLE`, `S_PERMISSION`, `S_ACTION`, etc.
- Audit columns: `CREATED_AT`, `CREATED_BY`, `UPDATED_AT`, `UPDATED_BY`
- Soft delete: `ACTIVE` boolean column
- Primary key: `KEY` column (UUID)

## Important Notes

- `src/previous/` contains legacy code — do not modify
- `src/cab/perm/` has 66+ Excel template files — changes here affect RBAC generation for all projects
- `_template/` directories are scaffold blueprints — edits propagate to all newly generated projects
- The CLI copies to clipboard on macOS for uuid/str/md5 commands
- `package-lock.json` is gitignored — only `package.json` is tracked
