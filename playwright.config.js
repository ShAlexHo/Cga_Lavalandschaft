import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    workers: 1,
    timeout: 180_000,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:5183',
        ...devices['Desktop Chrome'],
        launchOptions: {
            args: [
                '--use-gl=angle',
                '--use-angle=swiftshader',
                '--enable-unsafe-swiftshader',
                '--ignore-gpu-blocklist',
            ],
        },
    },
    webServer: {
        command: 'npx vite --port 5183 --strictPort',
        url: 'http://localhost:5183',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
});
