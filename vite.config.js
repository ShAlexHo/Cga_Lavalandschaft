import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command, mode }) => {
    const rbg_account = loadEnv(mode, process.cwd(), '').RBG_ACCOUNT;

    return {
        plugins: [vue()],
        base: command === 'build' && rbg_account ? `/~${rbg_account}/` : '/',
    };
});
