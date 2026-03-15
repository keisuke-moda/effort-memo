<script setup lang="ts">
import type { Milestone, Status } from '~/types'

const props = defineProps<{
  milestone: Milestone
  goalId: string
}>()

const emit = defineEmits<{
  statusChanged: []
}>()

const { toggleMilestoneStatus, fetchOutputsByMilestoneId } = useGoals()
const { data: outputs } = await useAsyncData(`outputs-count-${props.milestone.id}`, () => fetchOutputsByMilestoneId(props.milestone.id))
const outputCount = computed(() => outputs.value?.length ?? 0)

const statusConfig: Record<Status, { icon: string; next: string; bg: string; border: string; text: string; hoverBg: string }> = {
  not_started: {
    icon: '',
    next: '開始する',
    bg: 'bg-white',
    border: 'border-gray-300',
    text: 'text-gray-300',
    hoverBg: 'hover:bg-blue-50 hover:border-blue-400',
  },
  in_progress: {
    icon: '●',
    next: '完了にする',
    bg: 'bg-white',
    border: 'border-blue-500',
    text: 'text-blue-500',
    hoverBg: 'hover:bg-emerald-50 hover:border-emerald-400',
  },
  completed: {
    icon: '✓',
    next: 'リセットする',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    text: 'text-white',
    hoverBg: 'hover:bg-emerald-600',
  },
}

const config = computed(() => statusConfig[props.milestone.status])

async function handleToggle() {
  await toggleMilestoneStatus(props.milestone.id)
  emit('statusChanged')
}
</script>

<template>
  <div class="border border-gray-200 rounded-xl transition-all" :class="{ 'opacity-70 bg-gray-50': milestone.status === 'completed' }">
    <div class="flex items-center gap-3 p-4">
      <!-- ステータスボタン -->
      <div class="relative group shrink-0">
        <button
          class="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm cursor-pointer transition-all hover:scale-110 hover:shadow-md"
          :class="[config.bg, config.border, config.text, config.hoverBg]"
          @click="handleToggle"
        >
          {{ config.icon }}
        </button>
        <!-- ツールチップ -->
        <div class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
          クリックで「{{ config.next }}」
          <div class="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-800" />
        </div>
      </div>

      <NuxtLink
        :to="`/goals/${goalId}/milestones/${milestone.id}`"
        class="flex-1 min-w-0 no-underline text-inherit"
      >
        <h4 class="m-0 mb-1 text-[15px] font-semibold hover:text-[#e94560] transition-colors">{{ milestone.title }}</h4>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-gray-400">📅 {{ milestone.deadline }}</span>
          <span v-if="outputCount > 0" class="text-xs text-gray-400">📝 {{ outputCount }}件</span>
          <RewardBadge v-if="milestone.reward" :reward="milestone.reward" />
        </div>
      </NuxtLink>

      <NuxtLink
        :to="`/goals/${goalId}/milestones/${milestone.id}`"
        class="shrink-0 text-gray-300 no-underline hover:text-[#e94560] transition-colors text-lg"
      >
        →
      </NuxtLink>
    </div>
  </div>
</template>
