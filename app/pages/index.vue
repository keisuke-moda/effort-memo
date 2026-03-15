<script setup lang="ts">
useHead({ title: 'ダッシュボード | effort-memo' })

const { fetchGoals } = useGoals()
const { data: goals } = await useAsyncData('goals', () => fetchGoals())
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between py-4">
      <div>
        <h1 class="m-0 text-2xl sm:text-3xl font-extrabold text-[#1a1a2e]">あなたの目標</h1>
        <p class="mt-2 mb-0 text-gray-400 text-[15px]">日々の努力を可視化して、目標達成を加速させよう</p>
      </div>
      <NuxtLink
        to="/goals/new"
        class="shrink-0 px-4 py-2.5 bg-[#e94560] text-white text-sm font-semibold rounded-lg no-underline transition-all hover:bg-[#d63851] hover:shadow-lg"
      >
        + 目標を追加
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GoalCard v-for="goal in goals" :key="goal.id" :goal="goal" />
    </div>
  </div>
</template>
