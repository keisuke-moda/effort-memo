<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-black/40 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.08]">
    <div class="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5 no-underline group cursor-pointer">
        <div class="w-8 h-8 rounded-lg bg-[#e94560] flex items-center justify-center shadow-[0_0_16px_rgba(233,69,96,0.4)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
        </div>
        <span class="text-gray-900 dark:text-white text-[17px] font-semibold tracking-tight">effort-memo</span>
      </NuxtLink>
      <div class="flex items-center gap-2">
        <nav>
          <NuxtLink
            to="/"
            class="text-gray-500 dark:text-white/50 no-underline text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 hover:text-gray-800 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-white/30"
          >
            ダッシュボード
          </NuxtLink>
        </nav>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-white/50 transition-colors duration-150 hover:text-gray-800 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-white/30 cursor-pointer"
          :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
          @click="toggleTheme"
        >
          <!-- Sun icon (shown in dark mode to switch to light) -->
          <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon icon (shown in light mode to switch to dark) -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
