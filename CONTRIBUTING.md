# Contributing

## Choosing an Issue

To maintain project quality and focus, Playwright **requires a corresponding issue** for every contribution, with the exception of minor documentation fixes.

If you would like to address a bug or feature that isn't currently listed, **please file a new issue first**. This allows the community and maintainers to provide early feedback and facilitates a discussion before you invest time in developing a pull request.

When submitting an issue, please state clearly if you intend to work on it. Once triaged and approved, the maintainers will determine the best path forward—whether the task should be handled by the **core team**, an **automated agent**, or a **community contributor**. If the issue is assigned to you, you may then proceed with your changes and submit a PR.

### Submission Policy
To ensure the maintainability of the project, please note the following:

* **Unsolicited PRs:** Pull requests submitted without a linked issue or prior approval will be closed.
* **Low-Quality AI Contributions:** PRs that do not meet our quality standards or lack human oversight (including low-quality agentic submissions) will be closed without explanation.
* **Approval Required:** Only proceed with a PR once the issue has been officially assigned to you or approved for community contribution.

## Make a change

> [!WARNING]
> The core of the Playwright MCP was moved to the [Playwright monorepo](https://github.com/microsoft/playwright).

Clone the Playwright repository. If you plan to send a pull request, it might be better to [fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) first.


```bash
git clone https://github.com/microsoft/playwright
cd playwright
```

Install dependencies and run the build in watch mode.
```bash
# install deps and run watch
npm ci
npm run watch
npx playwright install
```

Source code for Playwright MCP is located at [packages/playwright/src/mcp](https://github.com/microsoft/playwright/blob/main/packages/playwright/src/mcp).

```bash
# list source files
ls -la packages/playwright/src/mcp
```

Coding style is fully defined in [eslint.config.mjs](https://github.com/microsoft/playwright/blob/main/eslint.config.mjs). Before creating a pull request, or at any moment during development, run linter to check all kinds of things:
```bash
# lint the source base before sending PR
npm run lint
```

> **Personal note:** The upstream docs reference `npm run flint` which appears to be a typo. The correct script is `npm run lint`. Verified against `package.json` — use `npm run lint` to avoid a confusing "script not found" error.

Comments should have an explicit purpose and should improve readability rather than hinder it. If the code would not be understood without comments, consider re-writing the code to make it self-explanatory.

## Add a test

Playwright requires a test for the new or modified functionality. An exception would be a pure refactoring, but chances are you are doing more than that.

Th
