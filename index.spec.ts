import { exec as _exec } from 'node:child_process'
import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { checkGitClean } from './index'

const exec = promisify(_exec)

describe('checkGitClean', () => {
  let repoDir: string

  beforeEach(async () => {
    // Create a temporary directory
    repoDir = await fs.mkdtemp(path.join(tmpdir(), 'check-git-clean-test'))
  })

  afterEach(async () => {
    // Remove the temporary directory
    await fs.rm(repoDir, { recursive: true, force: true })
  })

  describe('non git working directory', () => {
    it('should throw an error if working directory is not a git working directory', async () => {
      await expect(() => checkGitClean(repoDir)).rejects.toThrow()
    })
  })

  describe('git working directory', () => {
    beforeEach(async () => {
      // Initialize a new git repository
      await exec('git init', { cwd: repoDir })
    })

    it('should return clean status for a clean repo', async () => {
      const result = await checkGitClean(repoDir)

      expect(result.isClean).toBe(true)
      expect(result.untracked).toEqual([])
      expect(result.unstaged).toEqual([])
      expect(result.uncommitted).toEqual([])
    })

    it('should detect untracked files', async () => {
      await fs.writeFile(path.join(repoDir, 'untracked-file.js'), 'console.log("untracked");')

      const result = await checkGitClean(repoDir)

      expect(result.isClean).toBe(false)
      expect(result.untracked).toEqual(['untracked-file.js'])
    })

    it('should detect unstaged changes', async () => {
      const filePath = path.join(repoDir, 'file.js')
      await fs.writeFile(filePath, 'console.log("initial");')
      await exec('git add file.js', { cwd: repoDir })
      await exec('git -c user.name="test" -c user.email="test@example.com" commit -m "Initial commit"', { cwd: repoDir })
      await fs.writeFile(filePath, 'console.log("modified");')

      const result = await checkGitClean(repoDir)

      expect(result.isClean).toBe(false)
      expect(result.unstaged).toEqual(['file.js'])
    })

    it('should detect uncommitted changes', async () => {
      const filePath = path.join(repoDir, 'file.js')
      await fs.writeFile(filePath, 'console.log("initial");')
      await exec('git add file.js', { cwd: repoDir })
      await exec('git -c user.name="test" -c user.email="test@example.com" commit -m "Initial commit"', { cwd: repoDir })
      await fs.writeFile(filePath, 'console.log("modified");')
      await exec('git add file.js', { cwd: repoDir })

      const result = await checkGitClean(repoDir)

      expect(result.isClean).toBe(false)
      expect(result.uncommitted).toEqual(['file.js'])
    })

    it('should handle mixed changes', async () => {
      const filePath = path.join(repoDir, 'file.js')
      await fs.writeFile(filePath, 'console.log("initial");')
      await exec('git add file.js', { cwd: repoDir })
      await exec('git -c user.name="test" -c user.email="test@example.com" commit -m "Initial commit"', { cwd: repoDir })
      // Create an untracked file
      await fs.writeFile(path.join(repoDir, 'untracked-file.js'), 'console.log("untracked");')
      // Modify the tracked file
      await fs.writeFile(filePath, 'console.log("modified");')
      // Stage the modified file
      await exec('git add file.js', { cwd: repoDir })

      const result = await checkGitClean(repoDir)

      expect(result.isClean).toBe(false)
      expect(result.untracked).toEqual(['untracked-file.js'])
      expect(result.unstaged).toEqual([])
      expect(result.uncommitted).toEqual(['file.js'])
    })
  })
})
