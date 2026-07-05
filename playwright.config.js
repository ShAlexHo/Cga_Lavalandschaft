import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:5183',
        ...devices['Desktop Chrome'],
        launchOptions: {
            // Headless Chromium needs to be told explicitly to allow WebGL via
            // software rendering (SwiftShader/ANGLE) - without these flags the
            // canvas silently fails to acquire a WebGL context in CI.
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
