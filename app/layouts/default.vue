<template>
  <div class="flex flex-col min-h-dvh bg-gray-50 dark:bg-[#0b0b12]" style="font-family: 'Inter', sans-serif;">
    <AppHeader />
    <main class="flex-1 w-full max-w-[1200px] mx-auto px-5 py-8">
      <slot />
    </main>
    <footer class="border-t border-gray-200/60 dark:border-white/[0.06] py-4 text-center text-xs text-gray-400 dark:text-white/25">
      &copy; 2026 Momentum
    </footer>
  </div>
</template>
