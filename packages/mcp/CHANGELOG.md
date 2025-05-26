# Changelog

## 0.1.7 Updated docs

- [x] Updated docs.

## 0.1.6 Tried to fix the publishing issue caused by NPM

## 0.1.5 Updated docs and deps

- [x] Updated usage guide in README and change the example config file name.
- [x] Updated deps.

## 0.1.5-alpha.4 Debugging issues

- [x] Implemented a custom logger to log to stderr.
- [x] Handled errors better.

## 0.1.5-alpha.3 Debugging issues

- [x] Removed mcps-logger because it didn't help.

## 0.1.5-alpha.2 Debugging issues

- [x] Added mcps-logger to see console.log messages.
- [x] Switched from pnpx to npx in the claude_desktop_config.json.
- [x] Replaced console.log with process.stdout.write in the server script.
- [x] Updated deps.

## 0.1.5-alpha.1 Debugging issues

- [x] Reverted the `bin` field back because it's needed actually.

## 0.1.5-alpha.0 Debugging issues

- [x] Removed console output from the server, which is recommended by MCP docs, to try to fix the issue.
- [x] Corrected `main` and `types` paths.
- [x] Removed the `bin` field from the package.json because it's not planned to be used.
- [x] Added shebang to the server script in order to make it run through Node.js.

## 0.1.4 Made it possible to pass the env config path to tools

- [x] MCP doesn't read the env config file and only passes its path to tools.
- [x] Changed `--env-file` to `--env-config-file` parameter.
- [x] Improved `claude_desktop_config.json` example config.
- [x] Updated docs.
- [x] Updated dependencies.
