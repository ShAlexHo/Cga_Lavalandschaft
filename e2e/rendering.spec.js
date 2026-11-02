import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import { MESSAGES } from '../src/ui/messages.js';

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

const TEXT = MESSAGES.en;
const DETAIL_ORDER = ['metaballs', 'noise', 'surface', 'ground', 'volcano', 'radial_flow', 'landscape_volcano'];

function detailText(detail_key, text) {
    return TEXT[`details.${detail_key}.${text}`];
}

function numberedTitle(detail_key) {
    return `${DETAIL_ORDER.indexOf(detail_key) + 1}. ${detailText(detail_key, 'title')}`;
}

function neighbourLink(direction, detail_key) {
    return `${TEXT[`scene.${direction}`]}: ${numberedTitle(detail_key)}`;
}

function exactly(text) {
    return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
}

async function openDetailScene(page, { detail_key, scene_name }) {
    await page.goto('/');
    const preview = page.getByRole('link', { name: detailText(detail_key, 'start_scene') });
    await preview.scrollIntoViewIfNeeded();
    await preview.click();
    await expect(page).toHaveURL(new RegExp(`/${scene_name}$`), { timeout: 60_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
}

function guiRow(page, message_key) {
    return page.locator('.dg li.cr .property-name', { hasText: exactly(TEXT[message_key]) });
}

test('metaballs detail opens its own scene with an explanation below it', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: TEXT['landing.details_title'] })).toBeAttached();
    await openDetailScene(page, { detail_key: 'metaballs', scene_name: 'metaballs-scene' });

    await page.getByRole('button', { name: detailText('metaballs', 'scroll_hint') }).click();
    await expect(page.getByRole('heading', { name: numberedTitle('metaballs'), level: 2 })).toBeInViewport({ timeout: 60_000 });
    await expect(page.getByText(TEXT['scene.description_in_work'])).toBeVisible();

    await page.getByRole('link', { name: TEXT['scene.home'] }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: detailText('metaballs', 'start_scene') }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});

const DETAIL_SCENE_CASES = [
    { detail_key: 'noise', scene_name: 'noise-scene', labels: ['gui.noise.colour_1', 'gui.noise.colour_2'] },
    {
        detail_key: 'surface', scene_name: 'surface-scene',
        labels: ['gui.surface.noise', 'gui.surface.bump_mapping', 'gui.surface.displacement_mapping', 'gui.surface.displacement_strength'],
    },
    { detail_key: 'ground', scene_name: 'ground-scene', labels: ['gui.metaballs.count', 'gui.visible', 'gui.height'] },
    {
        detail_key: 'volcano', scene_name: 'volcano-scene',
        labels: ['gui.metaballs.speed', 'gui.metaballs.spawn_height', 'gui.metaballs.flow_slope', 'gui.visible'],
    },
    {
        detail_key: 'radial_flow', scene_name: 'radial-flow-scene',
        labels: ['gui.metaballs.speed', 'gui.metaballs.slow_down', 'gui.metaballs.sectors_enabled', 'gui.metaballs.sector_count', 'gui.visible'],
        absent_labels: ['gui.metaballs.flow_slope'], folders: ['gui.folder.flow_speed', 'gui.folder.distribution', 'gui.folder.ground'],
    },
    {
        detail_key: 'landscape_volcano', scene_name: 'landscape-volcano-scene',
        labels: ['gui.metaballs.speed', 'gui.volcano.surface_irregularities'], absent_labels: ['gui.visible'], folders: ['gui.folder.volcano'],
    },
];

for (const detail of DETAIL_SCENE_CASES) {
    test(`${detail.scene_name} opens with its own controls and its explanation`, async ({ page }) => {
        const console_errors = collectConsoleErrors(page);
        await openDetailScene(page, detail);

        for (const label of detail.labels) await expect(guiRow(page, label)).toHaveCount(1);
        for (const label of detail.absent_labels ?? []) await expect(guiRow(page, label)).toHaveCount(0);
        for (const folder of detail.folders ?? []) {
            await expect(page.locator('.dg li.title', { hasText: exactly(TEXT[folder]) })).toHaveCount(1);
        }
        const previous_key = DETAIL_ORDER[DETAIL_ORDER.indexOf(detail.detail_key) - 1];
        await expect(page.getByRole('link', { name: neighbourLink('previous', previous_key) })).toBeVisible();

        await page.getByRole('button', { name: detailText(detail.detail_key, 'scroll_hint') }).click();
        await expect(page.getByRole('heading', { name: numberedTitle(detail.detail_key), level: 2 })).toBeInViewport({ timeout: 60_000 });

        expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
    });
}

test('arrow buttons move between the numbered detail scenes directly, and the start page shows the last one on return', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: numberedTitle('metaballs'), level: 3 })).toBeAttached();
    await expect(page.getByRole('heading', { name: numberedTitle('landscape_volcano'), level: 3 })).toBeAttached();

    const metaballs_preview = page.getByRole('link', { name: detailText('metaballs', 'start_scene') });
    await metaballs_preview.scrollIntoViewIfNeeded();
    await metaballs_preview.click();
    await expect(page).toHaveURL(/\/metaballs-scene$/, { timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
    await expect(page.locator('.scene-button-disabled')).toHaveCount(1);

    await page.getByRole('link', { name: neighbourLink('next', 'noise') }).click();
    await expect(page).toHaveURL(/\/noise-scene$/, { timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0);
    await expect(page.locator('canvas')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole('heading', { name: numberedTitle('noise'), level: 2 })).toBeAttached();
    await expect(page.getByRole('link', { name: neighbourLink('previous', 'metaballs') })).toBeVisible();

    await page.getByRole('link', { name: TEXT['scene.home'] }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
    await expect(page.getByRole('link', { name: detailText('metaballs', 'start_scene') }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    await expect(page.getByRole('link', { name: detailText('noise', 'start_scene') }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    await expect(page.getByRole('link', { name: detailText('noise', 'start_scene') })).toBeInViewport();

    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
});
