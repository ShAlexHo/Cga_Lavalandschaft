<template>
    <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
            <component :is="Component" />
        </Transition>
    </RouterView>
</template>

<style>
:root {
    color-scheme: dark;
    --color-background: #0c0505;
    --color-surface: rgba(18, 7, 5, 0.6);
    --color-text: #f2e6dc;
    --color-text-muted: #b59d90;
    --color-accent: #ff5b00;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: var(--color-background);
    color: var(--color-text);
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 250ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
