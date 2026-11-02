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

async function openDetailScene(page, { start_link, scene_name }) {
    await page.goto('/');
    const preview = page.getByRole('link', { name: start_link });
    await preview.scrollIntoViewIfNeeded();
    await preview.click();
    await expect(page).toHaveURL(new RegExp(`/${scene_name}$`), { timeout: 60_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
}

function guiRow(page, label) {
    return page.locator('.dg li.cr .property-name', { hasText: new RegExp(`^${label}$`) });
}

test('metaballs detail opens its own scene with an explanation below it', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Implementation details' })).toBeAttached();
    await openDetailScene(page, { start_link: 'Start metaballs scene', scene_name: 'metaballs-scene' });

    await page.getByRole('button', { name: 'About metaballs' }).click();
    await expect(page.getByRole('heading', { name: 'Metaballs', level: 2 })).toBeInViewport({ timeout: 60_000 });
    await expect(page.getByText('Description in work')).toBeVisible();

    await page.getByRole('link', { name: 'Back to start page' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: 'Start metaballs scene' }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});

const DETAIL_SCENE_CASES = [
    {
        scene_name: 'noise-scene', start_link: 'Start noise scene', labels: ['Primary colour', 'Secondary colour'],
        scroll_hint: 'About noise', title: 'Noise',
    },
    {
        scene_name: 'surface-scene', start_link: 'Start surface scene', labels: ['Noise', 'Bump mapping', 'Displacement mapping', 'Displacement strength'],
        scroll_hint: 'About surface irregularities', title: 'Surface irregularities',
    },
    {
        scene_name: 'ground-scene', start_link: 'Start ground scene', labels: ['Count', 'Visible', 'Height'],
        scroll_hint: 'About lava with bloom on the ground', title: 'Lava with bloom on the ground',
    },
    {
        scene_name: 'volcano-scene', start_link: 'Start volcano scene', labels: ['Speed', 'Spawn height', 'Flow slope', 'Visible'],
        previous_link: 'Previous scene: 4. Lava with bloom on the ground',
        scroll_hint: 'About the volcano as a lathe and the lava flow along a straight line', title: 'Volcano as a lathe, lava flow along a straight line',
    },
    {
        scene_name: 'radial-flow-scene', start_link: 'Start radial flow scene',
        labels: ['Speed', 'Decreasing, no longer constant', 'Split into sectors', 'Sector count', 'Visible'],
        absent_labels: ['Flow slope'], folders: ['Flow speed', 'Distribution', 'Ground'],
        previous_link: 'Previous scene: 5. Volcano as a lathe, lava flow along a straight line',
        scroll_hint: 'About the way from single metaballs to a lava flow', title: 'From single metaballs to a lava flow',
    },
];

for (const detail of DETAIL_SCENE_CASES) {
    test(`${detail.scene_name} opens with its own controls and its explanation`, async ({ page }) => {
        const console_errors = collectConsoleErrors(page);
        await openDetailScene(page, detail);

        for (const label of detail.labels) await expect(guiRow(page, label)).toHaveCount(1);
        for (const label of detail.absent_labels ?? []) await expect(guiRow(page, label)).toHaveCount(0);
        for (const folder of detail.folders ?? []) {
            await expect(page.locator('.dg li.title', { hasText: new RegExp(`^${folder}$`) })).toHaveCount(1);
        }
        if (detail.previous_link) await expect(page.getByRole('link', { name: detail.previous_link })).toBeVisible();

        await page.getByRole('button', { name: detail.scroll_hint }).click();
        await expect(page.getByRole('heading', { name: detail.title, level: 2 })).toBeInViewport({ timeout: 60_000 });

        expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
    });
}

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
