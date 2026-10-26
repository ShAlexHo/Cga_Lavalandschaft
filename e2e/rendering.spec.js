import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';

const SAMPLED_PIXEL_STRIDE = 37;
const BRIGHT_LUMINANCE_THRESHOLD = 40;

function collectConsoleErrors(page) {
    const console_errors = [];
    page.on('console', message => {
        if (message.type() === 'error') console_errors.push(message.text());
    });
    page.on('pageerror', error => console_errors.push(error.message));
    return console_errors;
}

test('scene renders a non-blank image', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/main-scene');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(1000);

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);

    await page.evaluate(() => {
        document.querySelectorAll('.dg, .home-button').forEach(element => element.remove());
    });

    const bounding_box = await canvas.boundingBox();
    expect(bounding_box.width).toBeGreaterThan(0);
    expect(bounding_box.height).toBeGreaterThan(0);

    const screenshot = await canvas.screenshot();
    const png = PNG.sync.read(screenshot);

    const luminances = [];
    const distinct_colors = new Set();
    for (let i = 0; i < png.data.length; i += 4 * SAMPLED_PIXEL_STRIDE) {
        const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
        luminances.push(0.299 * r + 0.587 * g + 0.114 * b);
        distinct_colors.add((r << 16) | (g << 8) | b);
    }

    expect(distinct_colors.size).toBeGreaterThan(10);

    const bright_share = luminances.filter(luminance => luminance > BRIGHT_LUMINANCE_THRESHOLD).length / luminances.length;
    expect(bright_share).toBeGreaterThan(0.01);
});

test('landing page enters the scene via the play button and shows the left scene on return', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Unstill Life: Lava Landscape' })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);

    const preview = page.getByRole('link', { name: 'Start scene', exact: true });
    const play_button = preview.locator('.play-button');
    await expect(play_button).toHaveCSS('opacity', '0');
    await preview.hover();
    await expect(play_button).toHaveCSS('opacity', '1', { timeout: 60_000 });

    await preview.click();
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(1);
    await expect(page).toHaveURL(/\/main-scene$/, { timeout: 60_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
    await page.waitForTimeout(500);

    await page.getByRole('link', { name: 'Back to start page' }).click();
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(1);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('canvas')).toHaveCount(0, { timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
    await expect(preview).toBeVisible();
    await expect(page.locator('.preview:not(.preview-small) .preview-image')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});

test('language switch translates the landing page and the scene GUI, and is remembered', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'DE' }).click();
    await expect(page.getByRole('heading', { name: 'Unstill Life: Lavalandschaft' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page).toHaveTitle('Unstill Life: Lavalandschaft');

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Unstill Life: Lavalandschaft' })).toBeVisible();

    await page.getByRole('link', { name: 'Szene starten', exact: true }).click();
    await expect(page).toHaveURL(/\/main-scene$/, { timeout: 60_000 });
    await expect(page.locator('.dg .property-name', { hasText: 'Interaktionsmodus' })).toHaveCount(1, { timeout: 60_000 });
    await expect(page.locator('.dg .close-button')).toHaveText('Steuerung öffnen');
});

test('metaballs detail opens its own scene with an explanation below it', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Implementation details' })).toBeAttached();

    const preview = page.getByRole('link', { name: 'Start metaballs scene' });
    await preview.scrollIntoViewIfNeeded();
    await preview.click();
    await expect(page).toHaveURL(/\/metaballs-scene$/, { timeout: 60_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });

    await page.getByRole('button', { name: 'About metaballs' }).click();
    await expect(page.getByRole('heading', { name: 'Metaballs', level: 2 })).toBeInViewport({ timeout: 60_000 });
    await expect(page.getByText('Description in work')).toBeVisible();

    await page.getByRole('link', { name: 'Back to start page' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: 'Start metaballs scene' }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});

test('noise detail opens its own scene with the colour noise parameters', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    const preview = page.getByRole('link', { name: 'Start noise scene' });
    await preview.scrollIntoViewIfNeeded();
    await preview.click();
    await expect(page).toHaveURL(/\/noise-scene$/, { timeout: 60_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });

    for (const label of ['Primary colour', 'Secondary colour']) {
        await expect(page.locator('.dg li.cr .property-name', { hasText: label })).toHaveCount(1);
    }

    await page.getByRole('button', { name: 'About noise' }).click();
    await expect(page.getByRole('heading', { name: 'Noise', level: 2 })).toBeInViewport({ timeout: 60_000 });

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});

test('surface detail opens its own scene with the bump and displacement mapping parameters', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    const preview = page.getByRole('link', { name: 'Start surface scene' });
    await preview.scrollIntoViewIfNeeded();
    await preview.click();
    await expect(page).toHaveURL(/\/surface-scene$/, { timeout: 60_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });

    for (const label of ['Noise', 'Bump mapping', 'Displacement mapping', 'Displacement strength']) {
        await expect(page.locator('.dg li.cr .property-name', { hasText: new RegExp(`^${label}$`) })).toHaveCount(1);
    }

    await page.getByRole('button', { name: 'About surface irregularities' }).click();
    await expect(page.getByRole('heading', { name: 'Surface irregularities', level: 2 })).toBeInViewport({ timeout: 60_000 });

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});

test('ground detail opens its own scene with the ball count and the floor parameters', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    const preview = page.getByRole('link', { name: 'Start ground scene' });
    await preview.scrollIntoViewIfNeeded();
    await preview.click();
    await expect(page).toHaveURL(/\/ground-scene$/, { timeout: 60_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });

    for (const label of ['Count', 'Visible', 'Height']) {
        await expect(page.locator('.dg li.cr .property-name', { hasText: new RegExp(`^${label}$`) })).toHaveCount(1);
    }

    await page.getByRole('button', { name: 'About lava with bloom on the ground' }).click();
    await expect(page.getByRole('heading', { name: 'Lava with bloom on the ground', level: 2 })).toBeInViewport({ timeout: 60_000 });

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});

test('arrow buttons move between the numbered detail scenes directly, and the start page shows the last one on return', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: '1. Metaballs', level: 3 })).toBeAttached();
    await expect(page.getByRole('heading', { name: '4. Lava with bloom on the ground', level: 3 })).toBeAttached();

    const metaballs_preview = page.getByRole('link', { name: 'Start metaballs scene' });
    await metaballs_preview.scrollIntoViewIfNeeded();
    await metaballs_preview.click();
    await expect(page).toHaveURL(/\/metaballs-scene$/, { timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
    await expect(page.locator('.scene-button-disabled')).toHaveCount(1);

    await page.getByRole('link', { name: 'Next scene: 2. Noise' }).click();
    await expect(page).toHaveURL(/\/noise-scene$/, { timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0);
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole('heading', { name: '2. Noise', level: 2 })).toBeAttached();
    await expect(page.getByRole('link', { name: 'Previous scene: 1. Metaballs' })).toBeVisible();

    await page.getByRole('link', { name: 'Back to start page' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
    await expect(page.getByRole('link', { name: 'Start metaballs scene' }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    await expect(page.getByRole('link', { name: 'Start noise scene' }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    await expect(page.getByRole('link', { name: 'Start noise scene' })).toBeInViewport();

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});
