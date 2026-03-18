<script setup lang="ts">
useHead({ title: 'ダッシュボード | effort-memo' })

const { fetchGoals } = useGoals()
const { data: goals } = await useAsyncData('goals', () => fetchGoals())
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <p class="mb-1 text-[11px] font-medium tracking-widest text-gray-400 dark:text-white/30 uppercase">Dashboard</p>
        <h1 class="m-0 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">あなたの目標</h1>
        <p class="mt-1.5 mb-0 text-[13px] text-gray-500 dark:text-white/40">日々の努力を可視化して、目標達成を加速させよう</p>
      </div>
      <NuxtLink
        to="/goals/new"
        class="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-[#e94560] text-white text-sm font-semibold rounded-xl no-underline transition-all duration-150 cursor-pointer hover:bg-[#d63851] hover:shadow-[0_0_20px_rgba(233,69,96,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-[#0b0b12]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        目標を追加
      </NuxtLink>
    </div>

    <!-- Goal grid -->
    <div v-if="goals && goals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <GoalCard v-for="goal in goals" :key="goal.id" :goal="goal" />
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 dark:text-white/30">
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        </svg>
      </div>
      <p class="text-[15px] font-medium text-gray-500 dark:text-white/50 m-0">まだ目標がありません</p>
      <p class="text-[13px] text-gray-400 dark:text-white/25 mt-1.5 m-0">「目標を追加」から最初の目標を作ってみよう</p>
    </div>
  </div>
</template>
