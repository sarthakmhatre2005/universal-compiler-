# Universal Compiler

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]

A lightweight, educational compiler project built to analyze, parse, and generate intermediate code for a custom programming language. This project demonstrates key compiler-design stages — lexical analysis, syntax analysis, semantic checking, and intermediate-code generation — and includes a web UI / tools layer implemented in TypeScript.

Author: sarthakmhatre2005  
License: MIT (see LICENSE file)

---

## Project overview (short)
Universal Compiler is an educational compiler that converts source programs in a custom language into an intermediate representation (IR). The project is intended for learning and experimentation with compiler concepts: tokens → AST → semantic checks → IR/codegen. A TypeScript-based UI/demo is included to visualize source and generated IR or to provide a web playground.

## Key features
- Tokenization / Lexer
- Syntax analysis / Parser → AST construction
- Semantic analysis: symbol tables, scope resolution, type checking, error reporting
- Intermediate code generation (three-address/custom IR)
- Web-based UI / tools for visualization and demos (TypeScript + HTML + CSS)
- Example source programs and unit tests (update paths below)

---

## Architecture & components (what each part does)
This section explains the main compiler components and the typical tools/techniques used in each. Replace the file paths and tool names below with the exact ones from your project.

- Lexer (tokenizer)
  - Purpose: Convert source text to a token stream (identifiers, literals, keywords, symbols).
  - Typical implementation: Hand-written scanner using regexes or a lexer generator (PLY, flex, etc.).
  - Files to point to: `src/lexer.*` or `compiler/lexer.*`.

- Parser / AST
  - Purpose: Take the token stream and build an Abstract Syntax Tree (AST) that represents program structure.
  - Typical implementation: Recursive-descent parser or a generated parser (ANTLR / yacc / PLY).
  - Files to point to: `src/parser.*`, `src/ast.*`.

- Semantic Analysis
  - Purpose: Build symbol tables, resolve identifiers, enforce type rules and semantics, produce informative error messages with locations.
  - Files to point to: `src/semantic.*`, `src/symbol_table.*`.

- Intermediate Representation (IR) & Code Generation
  - Purpose: Translate AST into a platform-independent IR (e.g., three-address code). IR can be used for optimizations or for lowering to a target backend later.
  - Files to point to: `src/codegen.*`, `src/ir.*`.

- Frontend / UI (TypeScript + HTML + CSS)
  - Purpose: Visualize source, tokens, AST, and IR; provide an interactive demo or playground.
  - Files to point to: `web/` or `frontend/` with `*.ts`, `index.html`, `styles.css`.

- Tests & Examples
  - Purpose: Example input programs and unit tests that exercise language features and error handling.
  - Files to point to: `examples/` and `tests/`.

---

## Technologies & tools (what was used for what)
Below is a mapping of common tools/technologies to the roles they typically serve. If your repo uses different tools, replace them accordingly.

- Programming languages:
  - Compiler core: Python 3.x and/or C++17 (used for implementing lexer/parser/semantic/codegen).
  - UI / tools: TypeScript, HTML, CSS (visualizer/demo).
- Build & package managers:
  - C++: CMake, Make, or plain g++ compilation commands (use for building native parts).
  - Python: pip, virtualenv (use for running Python-based parts).
  - TypeScript/Web: Node.js, npm or yarn, bundler (Vite/webpack) for dev server and build.
- Common libraries & tools (if used — update according to repo):
  - Python parser tools: PLY, ANTLR (for lexing/parsing).
  - C++ testing: Google Test (gtest).
  - Python testing: pytest / unittest.
  - IR / backend: LLVM/Clang (only if used).
- Version control / CI (optional):
  - Git for source control; GitHub Actions for CI (add workflows to run tests/builds).

---

## How to run (example commands — replace with your repo's commands)
I couldn't read files automatically, so the exact commands may differ. Replace the paths/filenames with those in your repo.

1. Prepare environment
   - Install system dependencies:
     - Python 3.8+ (if using Python core)
     - C++ toolchain (gcc/clang) and CMake (if using C++)
     - Node.js 16+ and npm/yarn (for TypeScript UI)

2. Run the Python version (if present)
```bash
# from repo root
python3 src/main.py examples/hello.lang
# or
python3 -m compiler.run examples/hello.lang
```

3. Build & run the C++ version (if present)
```bash
mkdir -p build
cd build
cmake ..
make
# run compiled binary with an example file
./compiler ../examples/hello.lang
```

4. Run the TypeScript web UI / demo (if present)
```bash
cd web
npm install
npm run dev    # or: npm start
# Open http://localhost:3000 (or the port printed by the dev server)
```

5. Run tests
```bash
# Python tests
pytest tests/

# C++ tests (after building)
cd build
ctest --output-on-failure

# TypeScript unit tests (if present)
cd web
npm test
```

---

## Examples
Provide in-repo sample programs (replace with exact example filenames in your repo):

Example source: `examples/hello.lang`
```
func main() {
  print("Hello, Universal Compiler!");
}
```

Expected IR (example three‑address style):
```
FUNC main
  PUSH "Hello, Universal Compiler!"
  CALL print
END FUNC
```

Add the actual example files and correct expected outputs in the repo.

---

## Project structure (recommended / example)
Update this section with exact folders and filenames from your repository.

- README.md — this file
- LICENSE — MIT license file
- src/ or compiler/ — core compiler code (lexer, parser, ast, semantic, codegen)
  - src/lexer.py or src/lexer.cpp
  - src/parser.py or src/parser.cpp
  - src/ast.py
  - src/semantic.py
  - src/codegen.py
- web/ or frontend/ — TypeScript UI / demo
  - web/package.json
  - web/src/*.ts
  - web/index.html
- examples/ — sample programs
- tests/ — unit/integration tests
- docs/ — optional design notes, language spec, grammar

---

## How to extend the language
1. Extend the grammar in the parser and update parsing rules.
2. Add corresponding AST node types for new constructs.
3. Implement semantic checks for the new constructs (scope, type rules).
4. Add lowering/codegen to produce IR for the new constructs.
5. Add tests and examples exercising new features and update UI/demos.

---

## Troubleshooting / common issues
- Build errors (C++): ensure correct CMake version, correct compiler flags, and that third‑party libs are installed.
- Python runtime errors: use virtualenv and install `requirements.txt`.
- Frontend not starting: ensure Node.js and npm versions are correct; delete node_modules and run `npm install` again.
- Missing files referenced in README: edit README to point to correct file paths.

---

## Contribution guide
- Fork the repo → create a feature branch → open a pull request.
- Write tests for new features or bug fixes.
- Keep PRs small and focused; include a description and testing steps.
- Use consistent code style; run formatters/linters if available.

---

## License
This project is licensed under the MIT License — see the included LICENSE file for details. Adding the MIT license grants permissions to others to use, modify, and distribute the code but does not transfer copyright ownership; you remain the copyright holder.

---

## Contact
Author: sarthakmhatre2005  
Email / GitHub handle: sarthakmhatre2005

---

## Notes for maintainers (what I used to create this README)
- I used the repository description you provided and the language composition stats (TypeScript 93.3% / CSS 5.6% / HTML 1.1%) plus your note that the project demonstrates lexical analysis, parsing, semantic checking, and code generation (implemented in Python/C++/TypeScript layers).
- Because I couldn't read file contents automatically, I added placeholders and example commands. To finalize the README I need the actual file paths and exact build/run/test commands from your repo. Once you provide them (or grant access), I will replace the placeholders and produce a ready-to-commit README and optionally open a branch with the change.