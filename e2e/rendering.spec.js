import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';

// This is a real-browser test: it launches the app in headless Chromium (with
// software WebGL enabled, see playwright.config.js), lets it render a few
// frames, then inspects the actual pixels of a screenshot. Unlike the
// mocked unit tests in src/__tests__, this is the only test that would catch
// a genuinely black/blank canvas (broken shader, failed WebGL context, an
// exception inside the animate loop, ...).

test('scene renders a non-blank image', async ({ page }) => {
    const console_errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') console_errors.push(msg.text());
    });
    page.on('pageerror', err => console_errors.push(err.message));

    await page.goto('/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Let the animate() loop run for a bit so lava/volcano/bloom have settled.
    await page.waitForTimeout(1000);

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);

    // The dat.GUI panel is a DOM overlay drawn on top of the canvas - remove it
    // so the screenshot only reflects what WebGL actually rendered.
    await page.evaluate(() => {
        document.querySelectorAll('.dg').forEach(el => el.remove());
    });

    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);

    const screenshot = await canvas.screenshot();
    const png = PNG.sync.read(screenshot);

    const luminances = [];
    const distinct_colors = new Set();
    for (let i = 0; i < png.data.length; i += 4 * 37) { // sample every 37th pixel for speed
        const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
        luminances.push(0.299 * r + 0.587 * g + 0.114 * b);
        distinct_colors.add((r << 16) | (g << 8) | b);
    }

    // A blank/black canvas (failed render) would be a single uniform color.
    expect(distinct_colors.size).toBeGreaterThan(10);

    // The lava glow + bloom pass should push a meaningful share of pixels
    // well above the scene's very dark background (#0a0505, luminance ~7.5).
    const bright_share = luminances.filter(l => l > 40).length / luminances.length;
    expect(bright_share).toBeGreaterThan(0.01);
});
