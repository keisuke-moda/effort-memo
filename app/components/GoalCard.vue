<script setup lang="ts">
import type { Goal } from '~/types'

defineProps<{
  goal: Goal
}>()
</script>

<template>
  <NuxtLink
    :to="`/goals/${goal.id}`"
    class="flex flex-col gap-3 p-5 bg-white border border-gray-200 rounded-xl no-underline text-inherit transition-all hover:border-[#e94560] hover:shadow-lg hover:shadow-[#e94560]/10 hover:-translate-y-0.5"
  >
    <div class="flex items-center justify-between">
      <StatusBadge :status="goal.status" />
      <span class="text-[13px] text-gray-400">📅 {{ goal.deadline }}</span>
    </div>
    <h3 class="m-0 text-lg font-bold text-[#1a1a2e]">{{ goal.title }}</h3>
    <p class="m-0 text-sm text-gray-500 leading-relaxed line-clamp-2">{{ goal.description }}</p>
    <GoalProgress :goal-id="goal.id" />
    <div v-if="goal.reward" class="mt-1">
      <RewardBadge :reward="goal.reward" />
    </div>
  </NuxtLink>
</template>
