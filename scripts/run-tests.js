import { spawn } from 'node:child_process';
import { once } from 'node:events';

const port = process.env.PORT || '3000';
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

const server = spawn('node', ['src/server.js'], {
  env: { ...process.env, PORT: port, BASE_URL: baseUrl },
  stdio: ['ignore', 'inherit', 'inherit'],
});

const waitForServer = async () => {
  const maxAttempts = 60;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(baseUrl).catch(() => null);
    if (res && res.ok) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Servidor não respondeu em ${baseUrl} dentro do timeout.`);
};

const runTests = async () => {
  const mocha = spawn('npx', ['mocha', 'test/**/*.test.js', '--exit'], {
    env: { ...process.env, PORT: port, BASE_URL: baseUrl },
    stdio: 'inherit',
  });

  const [code] = await once(mocha, 'close');

  server.kill('SIGTERM');
  process.exit(code ?? 1);
};

try {
  await waitForServer();
  await runTests();
} catch (error) {
  console.error(error.message);
  server.kill('SIGTERM');
  process.exit(1);
}
