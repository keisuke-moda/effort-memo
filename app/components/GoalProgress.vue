<script setup lang="ts">
const props = defineProps<{
  goalId: string
}>()

const { fetchGoalProgress } = useGoals()
const { data: progress } = await useAsyncData(`progress-${props.goalId}`, () => fetchGoalProgress(props.goalId))

const completed = computed(() => progress.value?.completed ?? 0)
const inProgress = computed(() => progress.value?.inProgress ?? 0)

const completedColor = computed(() => {
  const p = completed.value
  if (p < 33) return 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]'
  if (p < 66) return 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]'
  return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
})
</script>

<template>
  <div class="flex items-center gap-2.5">
    <div class="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden flex">
      <div
        class="h-full rounded-l-full transition-[width] duration-500"
        :class="[completedColor, { 'rounded-r-full': inProgress === 0 }]"
        :style="{ width: `${completed}%` }"
      />
      <div
        v-if="inProgress > 0"
        class="h-full rounded-r-full transition-[width] duration-500 bg-indigo-400/50 dark:bg-indigo-400/40"
        :class="{ 'rounded-l-full': completed === 0, 'animate-pulse': true }"
        :style="{ width: `${inProgress}%` }"
      />
    </div>
    <span class="text-[11px] font-medium text-gray-400 dark:text-white/35 min-w-8 text-right tabular-nums">{{ completed }}%</span>
  </div>
</template>
