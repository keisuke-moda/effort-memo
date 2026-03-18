<script setup lang="ts">
import type { Goal } from '~/types'

defineProps<{
  goal: Goal
}>()

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr))
}
</script>

<template>
  <NuxtLink
    :to="`/goals/${goal.id}`"
    class="flex flex-col gap-3.5 p-5 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-2xl no-underline text-inherit transition-all duration-200 cursor-pointer hover:border-[#e94560]/40 hover:shadow-[0_0_28px_rgba(233,69,96,0.08)] dark:hover:bg-white/[0.07] dark:hover:border-[#e94560]/30 dark:hover:shadow-[0_0_28px_rgba(233,69,96,0.1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b12]"
  >
    <div class="flex items-center justify-between">
      <StatusBadge :status="goal.status" />
      <span v-if="goal.deadline" class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-white/35">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {{ formatDate(goal.deadline) }}
      </span>
    </div>
    <h3 class="m-0 text-[15px] font-semibold text-gray-900 dark:text-white/90 leading-snug">{{ goal.title }}</h3>
    <p v-if="goal.description" class="m-0 text-[13px] text-gray-500 dark:text-white/40 leading-relaxed line-clamp-2">{{ goal.description }}</p>
    <GoalProgress :goal-id="goal.id" />
    <div v-if="goal.reward" class="mt-0.5">
      <RewardBadge :reward="goal.reward" />
    </div>
  </NuxtLink>
</template>
