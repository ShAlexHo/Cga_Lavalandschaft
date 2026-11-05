import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import { MESSAGES } from '../src/ui/messages.js';

const SAMPLED_PIXEL_STRIDE = 37;
const BRIGHT_LUMINANCE_THRESHOLD = 40;

const TEXT = MESSAGES.en;
const GERMAN_TEXT = MESSAGES.de;
const DETAIL_ORDER = ['metaballs', 'noise', 'surface', 'ground', 'volcano', 'lava_flow', 'volcano_irregularities', 'smoke_ash', 'lava_landscape', 'sun_god_rays'];

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
    await expect(page.getByRole('heading', { name: TEXT['landing.details_title'] })).toBeAttached();
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

function collectConsoleErrors(page) {
    const console_errors = [];
    page.on('console', message => {
        if (message.type() === 'error') console_errors.push(message.text());
    });
    page.on('pageerror', error => console_errors.push(error.message));
    return console_errors;
}

function expectNoConsoleErrors(console_errors) {
    expect(console_errors, `unexpected console/page errors: ${console_errors.join('; ')}`).toEqual([]);
}

test('scene renders a non-blank image', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/main-scene');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(1000);

    expectNoConsoleErrors(console_errors);

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
    await expect(page.getByRole('heading', { name: TEXT['app.title'] })).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);

    const preview = page.getByRole('link', { name: TEXT['landing.start_scene'], exact: true });
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

    await page.getByRole('link', { name: TEXT['scene.home'] }).click();
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(1);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('canvas')).toHaveCount(0, { timeout: 60_000 });
    await expect(page.locator('.scene-transition-overlay')).toHaveCount(0, { timeout: 60_000 });
    await expect(preview).toBeVisible();
    await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);

    expectNoConsoleErrors(console_errors);
});

test('language switch translates the landing page and the scene GUI, and is remembered', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'DE' }).click();
    await expect(page.getByRole('heading', { name: GERMAN_TEXT['app.title'] })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page).toHaveTitle(GERMAN_TEXT['app.title']);

    await page.reload();
    await expect(page.getByRole('heading', { name: GERMAN_TEXT['app.title'] })).toBeVisible();

    await page.getByRole('link', { name: GERMAN_TEXT['landing.start_scene'], exact: true }).click();
    await expect(page).toHaveURL(/\/main-scene$/, { timeout: 60_000 });
    await expect(page.locator('.dg .property-name', { hasText: GERMAN_TEXT['gui.interaction_mode'] })).toHaveCount(1, { timeout: 60_000 });
    await expect(page.locator('.dg .close-button')).toHaveText(GERMAN_TEXT['gui.open_controls']);
});

test('metaballs detail opens its own scene with an explanation below it', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await openDetailScene(page, { detail_key: 'metaballs', scene_name: 'metaballs-scene' });

    await page.getByRole('button', { name: detailText('metaballs', 'scroll_hint') }).click();
    await expect(page.getByRole('heading', { name: numberedTitle('metaballs'), level: 2 })).toBeInViewport({ timeout: 60_000 });
    for (const heading of ['field_heading', 'isosurface_heading', 'example_heading', 'try_heading', 'usage_heading']) {
        await expect(page.getByRole('heading', { name: TEXT[`details.metaballs.description.${heading}`], level: 3 })).toBeVisible();
    }
    await expect(page.locator('.scene-description math')).toHaveCount(24);
    await expect(page.locator('.scene-controls dt').filter({ hasText: TEXT['gui.metaballs.isolation'] })).toBeVisible();
    await expect(page.getByRole('img', { name: TEXT['details.metaballs.description.single_ball_figure_alt'] })).toBeVisible();
    await expect(page.getByRole('img', { name: TEXT['details.metaballs.description.two_balls_figure_alt'] })).toBeVisible();
    await expect(page.getByText(TEXT['scene.description_in_work'])).toHaveCount(0);

    await page.getByRole('link', { name: TEXT['scene.home'] }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: detailText('metaballs', 'start_scene') }).locator('img')).toHaveAttribute('src', /^data:image\/jpeg;base64,/);

    expectNoConsoleErrors(console_errors);
});

const DETAIL_SCENE_CASES = [
    {
        detail_key: 'noise', scene_name: 'noise-scene', labels: ['gui.noise.colour_1', 'gui.noise.colour_2'],
        description_headings: ['why_heading', 'layers_heading', 'flow_heading', 'colour_heading', 'try_heading', 'usage_heading'],
    },
    {
        detail_key: 'surface', scene_name: 'surface-scene',
        labels: ['gui.surface.noise', 'gui.surface.bump_mapping', 'gui.surface.displacement_mapping', 'gui.surface.displacement_strength'],
        description_headings: ['why_heading', 'bump_heading', 'displacement_heading', 'try_heading', 'usage_heading'],
    },
    {
        detail_key: 'ground', scene_name: 'ground-scene', labels: ['gui.metaballs.count', 'gui.visible', 'gui.height'],
        description_headings: ['why_heading', 'bloom_heading', 'try_heading', 'usage_heading'],
    },
    {
        detail_key: 'volcano', scene_name: 'volcano-scene',
        labels: ['gui.speed', 'gui.metaballs.spawn_height', 'gui.metaballs.flow_slope', 'gui.visible'],
    },
    {
        detail_key: 'lava_flow', scene_name: 'lava-flow-scene',
        labels: ['gui.speed', 'gui.metaballs.slow_down', 'gui.metaballs.sectors_enabled', 'gui.metaballs.sector_count', 'gui.visible'],
        absent_labels: ['gui.metaballs.flow_slope'], folders: ['gui.folder.flow_speed', 'gui.folder.distribution', 'gui.folder.ground'],
    },
    {
        detail_key: 'volcano_irregularities', scene_name: 'volcano-irregularities-scene',
        labels: ['gui.speed', 'gui.volcano.surface_irregularities'], absent_labels: ['gui.visible'], folders: ['gui.folder.volcano'],
    },
    {
        detail_key: 'smoke_ash', scene_name: 'smoke-ash-scene',
        labels: ['gui.speed', 'gui.smoke.count', 'gui.smoke.rise_speed', 'gui.smoke.ember_cooling_time'],
        absent_labels: ['gui.volcano.surface_irregularities'], folders: ['gui.folder.smoke'],
    },
    {
        detail_key: 'lava_landscape', scene_name: 'lava-landscape-scene',
        labels: ['gui.speed', 'gui.fog', 'gui.ground.rock_colour_1', 'gui.ground.crack_colour_2', 'gui.ground.crack_softness'],
        absent_labels: ['gui.volcano.surface_irregularities'], folders: ['gui.folder.ground', 'gui.folder.cracks'],
    },
    {
        detail_key: 'sun_god_rays', scene_name: 'sun-god-rays-scene',
        labels: ['gui.speed', 'gui.god_rays.decay', 'gui.god_rays.density'],
        absent_labels: ['gui.fog', 'gui.volcano.surface_irregularities', 'gui.sun.strength', 'gui.sun.focus'], folders: ['gui.folder.metaballs', 'gui.folder.god_rays'],
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
        for (const heading of detail.description_headings ?? []) {
            await expect(page.getByRole('heading', { name: TEXT[`details.${detail.detail_key}.description.${heading}`], level: 3, exact: true })).toBeVisible();
        }

        expectNoConsoleErrors(console_errors);
    });
}

test('arrow buttons move between the numbered detail scenes directly, and the start page shows the last one on return', async ({ page }) => {
    const console_errors = collectConsoleErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: numberedTitle('metaballs'), level: 3 })).toBeAttached();
    await expect(page.getByRole('heading', { name: numberedTitle('sun_god_rays'), level: 3 })).toBeAttached();

    await openDetailScene(page, { detail_key: 'metaballs', scene_name: 'metaballs-scene' });
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

    expectNoConsoleErrors(console_errors);
});
