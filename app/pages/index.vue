<script setup lang="ts">
useHead({ title: 'ダッシュボード | effort-memo' })

const { fetchGoals } = useGoals()
const { data: goals } = await useAsyncData('goals', () => fetchGoals())
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
      <div>
        <h1 class="m-0 text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] text-balance">あなたの目標</h1>
        <p class="mt-2 mb-0 text-gray-400 text-[15px]">日々の努力を可視化して、目標達成を加速させよう</p>
      </div>
      <NuxtLink
        to="/goals/new"
        class="self-start sm:self-auto shrink-0 px-4 py-2.5 bg-[#e94560] text-white text-sm font-semibold rounded-lg no-underline transition-colors transition-shadow hover:bg-[#d63851] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560] focus-visible:ring-offset-2"
      >
        + 目標を追加
      </NuxtLink>
    </div>

    <div v-if="goals && goals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GoalCard v-for="goal in goals" :key="goal.id" :goal="goal" />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-16 text-gray-400">
      <p class="text-lg font-medium">まだ目標がありません</p>
      <p class="text-sm mt-1">「+ 目標を追加」から最初の目標を作ってみよう</p>
    </div>
  </div>
</template>
