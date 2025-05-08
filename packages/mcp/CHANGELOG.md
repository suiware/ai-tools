## 1.4.0 Made it possible to pass the env config path to tools

- [x] MCP doesn't read the env config file and only passes its path to tools.
- [x] Changed `--env-file` to `--env-config-file` parameter.
- [x] Improved `claude_desktop_config.json` example config.
- [x] Updated docs.
- [x] Updated dependencies.

## 0.1.5-alpha.0 Debugging issues

- [x] Removed console output from the server, which is recommended by MCP docs, to try to fix the issue.
- [x] Corrected `main` and `types` paths.
- [x] Removed the `bin` field from the package.json because it's not planned to be used.
- [x] Added shebang to the server script in order to make it run through Node.js.
