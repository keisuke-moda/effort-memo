<script setup lang="ts">
const props = defineProps<{
  goalId: string
}>()

const { fetchGoalProgress } = useGoals()
const { data: progress } = await useAsyncData(`progress-${props.goalId}`, () => fetchGoalProgress(props.goalId))

const barColor = computed(() => {
  const p = progress.value ?? 0
  if (p < 33) return 'bg-[#e94560]'
  if (p < 66) return 'bg-amber-400'
  return 'bg-emerald-500'
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-[width] duration-300"
        :class="barColor"
        :style="{ width: `${progress ?? 0}%` }"
      />
    </div>
    <span class="text-[13px] font-semibold text-gray-500 min-w-9 text-right">{{ progress ?? 0 }}%</span>
  </div>
</template>
