<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="flex-1 w-full max-w-[1200px] mx-auto px-5 py-6">
      <slot />
    </main>
    <footer class="border-t border-gray-200 bg-gray-100 py-4 text-center text-xs text-gray-400">
      &copy; 2026 effort-memo
    </footer>
  </div>
</template>
