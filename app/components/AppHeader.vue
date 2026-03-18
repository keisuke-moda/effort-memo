<template>
  <header class="bg-[#1a1a2e] border-b-3 border-[#e94560] sticky top-0 z-50">
    <div class="max-w-[1200px] mx-auto px-5 h-15 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 no-underline text-white text-xl font-bold">
        <span class="text-2xl">📊</span>
        <span>effort-memo</span>
      </NuxtLink>
      <nav>
        <NuxtLink
          to="/"
          class="text-gray-400 no-underline text-sm px-3 py-1.5 rounded-md transition-colors hover:text-white hover:bg-[#e94560]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          ダッシュボード
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
