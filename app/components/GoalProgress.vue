<script setup lang="ts">
const props = defineProps<{
  goalId: string
}>()

const { fetchGoalProgress } = useGoals()
const { data: progress } = await useAsyncData(`progress-${props.goalId}`, () => fetchGoalProgress(props.goalId))

const barColor = computed(() => {
  const p = progress.value ?? 0
  if (p < 33) return 'bg-[#e94560] shadow-[0_0_6px_rgba(233,69,96,0.6)]'
  if (p < 66) return 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]'
  return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
})
</script>

<template>
  <div class="flex items-center gap-2.5">
    <div class="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-[width] duration-500"
        :class="barColor"
        :style="{ width: `${progress ?? 0}%` }"
      />
    </div>
    <span class="text-[11px] font-medium text-gray-400 dark:text-white/35 min-w-8 text-right tabular-nums">{{ progress ?? 0 }}%</span>
  </div>
</template>
