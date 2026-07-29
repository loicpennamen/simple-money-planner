#!/usr/bin/env node
/**
 * Force-(re)starts the web (Angular, port 4200) and api (Fastify, port 3000) dev servers.
 *
 * Why this exists: manually restarting these servers (find the stray process holding the
 * port, kill it and its children, relaunch, wait, re-check) is slow and error-prone —
 * `nx serve` spawns a process tree, and a half-killed tree leaves the port stuck in a state
 * where the next launch fails with EADDRINUSE even though nothing useful is listening.
 * This script kills whatever currently holds ports 3000/4200 (tracked PIDs first, then the
 * port itself as a fallback), relaunches both servers detached, and waits until each port
 * accepts connections before returning — so callers get a definitive ready/not-ready signal
 * instead of having to poll logs or curl by hand.
 *
 * Usage: pnpm run restart
 */
import { spawn, execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, openSync } from 'node:fs';
import { connect } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEV_DIR = path.join(ROOT, 'tmp', 'dev');
const PID_FILE = path.join(DEV_DIR, 'pids.json');

const SERVERS = [
  { name: 'api', port: 3000, args: ['nx', 'serve', 'api'] },
  { name: 'web', port: 4200, args: ['nx', 'serve', 'web'] },
];

mkdirSync(DEV_DIR, { recursive: true });

function readPidFile() {
  try {
    return JSON.parse(readFileSync(PID_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function killPid(pid) {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
    } else {
      // Negative pid targets the whole process group (servers are spawned detached below).
      process.kill(-pid, 'SIGKILL');
    }
  } catch {
    // Already dead, or never existed — nothing to do.
  }
}

function killWhateverHoldsPort(port) {
  try {
    if (process.platform === 'win32') {
      const pids = execSync(
        `powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue).OwningProcess"`,
        { stdio: ['ignore', 'pipe', 'ignore'] },
      )
        .toString()
        .split(/\s+/)
        .filter(Boolean);
      for (const pid of new Set(pids)) {
        killPid(pid);
      }
    } else {
      const pids = execSync(`lsof -ti tcp:${port} || true`, { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .split(/\s+/)
        .filter(Boolean);
      for (const pid of pids) {
        try {
          process.kill(Number(pid), 'SIGKILL');
        } catch {
          // Already dead.
        }
      }
    }
  } catch {
    // Port-finding tool unavailable or nothing listening — non-fatal, move on.
  }
}

function waitForPort(port, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;

  return new Promise((resolve) => {
    const attempt = () => {
      const socket = connect({ port, host: '127.0.0.1' }, () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() > deadline) {
          resolve(false);
        } else {
          setTimeout(attempt, 500);
        }
      });
    };
    attempt();
  });
}

async function main() {
  const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const previousPids = readPidFile();
  const newPids = {};

  for (const server of SERVERS) {
    console.log(`[restart] stopping ${server.name} (port ${server.port})...`);
    killPid(previousPids[server.name]);
    killWhateverHoldsPort(server.port);
  }

  for (const server of SERVERS) {
    const logPath = path.join(DEV_DIR, `${server.name}.log`);
    const logFd = openSync(logPath, 'a');

    console.log(`[restart] starting ${server.name}... (logs: ${path.relative(ROOT, logPath)})`);
    // A single command string (rather than command + args) avoids Node's shell-escaping
    // deprecation warning while still requiring `shell: true` — on Windows, `detached: true`
    // combined with a direct (non-shell) spawn of a .cmd file throws EINVAL.
    const child = spawn([pnpmCmd, ...server.args].join(' '), {
      cwd: ROOT,
      detached: true,
      shell: true,
      stdio: ['ignore', logFd, logFd],
    });
    child.on('error', (error) => {
      console.error(`[restart] ${server.name} failed to start:`, error);
    });
    child.unref();
    newPids[server.name] = child.pid;
  }

  writeFileSync(PID_FILE, JSON.stringify(newPids, null, 2));

  let allReady = true;
  for (const server of SERVERS) {
    const ready = await waitForPort(server.port, 45000);
    console.log(ready ? `[restart] ${server.name} is up on port ${server.port}` : `[restart] ${server.name} did NOT come up on port ${server.port} — check tmp/dev/${server.name}.log`);
    allReady &&= ready;
  }

  if (!allReady) {
    process.exitCode = 1;
  }
}

await main();
