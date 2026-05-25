import { exec as _exec } from 'node:child_process'
import { realpath } from 'node:fs/promises'
import { EOL } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const exec = promisify(_exec)

/**
 * Check if a local git repository is clean.
 * Ignore files defined in [git-ignore-patterns](git-ignore-patterns),
 * which contains commonly git-ignored files for node project.
 * @param dir (optional). Default to `process.cwd()`
 * @return Object { `isClean`, `untracked`, `unstaged`, `uncommitted` }
 */
export async function checkGitClean(dir = process.cwd()) {
  try {
    // the dir or its ancestor may contains symbolic link
    const cwd = await realpath(dir)
    const repoRoot = (await exec('git rev-parse --show-toplevel', {
      cwd,
    })).stdout.trim()
    const currentDir = path.relative(repoRoot, cwd)

    const excludeFilePath = path.resolve(__dirname, 'git-ignore-patterns')

    // Get untracked files
    const untrackedFiles = (await exec(`git ls-files --others --exclude-standard --exclude-from=${excludeFilePath}`, {
      cwd,
    })).stdout.trim()

    // Get unstaged files
    const unstagedFiles = (await exec('git diff --name-only', {
      cwd,
    })).stdout.trim()

    // Get uncommitted files (staged but not committed)
    const uncommittedFiles = (await exec('git diff --cached --name-only', {
      cwd,
    })).stdout.trim()

    // Filter files in the current directory
    const CURRENT_DIR_PATH_PREFIX = `${currentDir ? `${currentDir}/` : ''}`
    const untracked = untrackedFiles.split(EOL).filter(v => !!v)
    const unstaged = unstagedFiles.split(EOL).filter(file => file.startsWith(CURRENT_DIR_PATH_PREFIX)).map(file => file.replace(CURRENT_DIR_PATH_PREFIX, '')).filter(v => !!v)
    const uncommitted = uncommittedFiles.split('\n').filter(file => file.startsWith(CURRENT_DIR_PATH_PREFIX)).map(file => file.replace(CURRENT_DIR_PATH_PREFIX, '')).filter(v => !!v)
    const isClean = untracked.length === 0 && unstaged.length === 0 && uncommitted.length === 0

    return {
      isClean,
      untracked,
      unstaged,
      uncommitted,
    }
  }
  catch (error) {
    throw new Error(`Failed to check in dir ${dir}. ${error}`)
  }
}
