/* eslint-env node */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

const scriptsDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(scriptsDir, '..');
const resultsRoot = resolve(repoRoot, 'allure-results');
const outputDir = resolve(repoRoot, 'allure-report');

const resultExtensions = new Set(['.json', '.xml']);

const walkForResults = async (dir) => {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const dirs = [];
  let hasResultFiles = false;

  for (const entry of entries) {
    if (entry.isFile()) {
      const dotIndex = entry.name.lastIndexOf('.');
      const ext = dotIndex >= 0 ? entry.name.slice(dotIndex).toLowerCase() : '';
      if (resultExtensions.has(ext)) {
        hasResultFiles = true;
      }
    }
  }

  if (hasResultFiles) {
    dirs.push(dir);
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nested = await walkForResults(join(dir, entry.name));
      dirs.push(...nested);
    }
  }

  return dirs;
};

const createReport = async () => {
  if (!existsSync(resultsRoot)) {
    throw new Error('No allure-results directory found. Run tests first.');
  }

  const candidates = await walkForResults(resultsRoot);
  const uniqueCandidates = [...new Set(candidates)].sort();

  if (!uniqueCandidates.length) {
    throw new Error('No Allure result files found. Run tests first.');
  }

  await new Promise((resolve, reject) => {
    const child = spawn(
      'pnpm',
      ['exec', 'allure', 'generate', '--clean', ...uniqueCandidates, '-o', outputDir],
      {
        stdio: 'inherit',
        cwd: repoRoot,
      },
    );

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Allure CLI failed with exit code ${code}`));
      }
    });
  });
};

try {
  await createReport();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error during Allure run';
  global.console.error(message);
  global.process.exitCode = 1;
}
