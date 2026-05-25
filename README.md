<h1 align="center">Welcome to Tmpl Base 👋</h1>

![GitHub License](https://img.shields.io/github/license/robertwang1001/check-git-clean)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/robertwang1001/check-git-clean)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/robertwang1001/check-git-clean/release.yaml)
![GitHub Release](https://img.shields.io/github/v/release/robertwang1001/check-git-clean)
![GitHub Release Date](https://img.shields.io/github/release-date/robertwang1001/check-git-clean)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/robertwang1001/check-git-clean)
![GitHub watchers](https://img.shields.io/github/watchers/robertwang1001/check-git-clean)
![GitHub forks](https://img.shields.io/github/forks/robertwang1001/check-git-clean)
![GitHub Repo stars](https://img.shields.io/github/stars/robertwang1001/check-git-clean)
![NPM Version](https://img.shields.io/npm/v/check-git-clean)
![NPM Type Definitions](https://img.shields.io/npm/types/check-git-clean)
![NPM Downloads](https://img.shields.io/npm/dw/check-git-clean)
![Node Current](https://img.shields.io/node/v/check-git-clean)

Check the cleanliness of a Git working directory, identifying untracked, unstaged, and uncommitted changes.

## Install

Using pnpm:

```bash
pnpm add check-git-clean
```

Using yarn:

```bash
yarn add check-git-clean
```

Using npm:

```bash
npm install check-git-clean
```

## Usage

```javascript
import { checkGitClean } from 'check-git-clean'

/**
 * Check if a local git repository is clean.
 * Ignore files defined in [git-ignore-patterns](git-ignore-patterns),
 * which contains commonly git-ignored files for node project.
 * @param dir (optional). Default to `process.cwd()`
 * @return Object { `isClean`, `untracked`, `unstaged`, `uncommitted` }
 */
const { isClean, untracked, unstaged, uncommitted } = await checkGitClean()
```

## Contributing

Contributions are welcome! If you have ideas, bug fixes, or improvements, please open an issue or submit a pull request on the
[GitHub repository](https://github.com/robertwang1001/check-git-clean).

Give a ⭐️ if this project helped you!

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
