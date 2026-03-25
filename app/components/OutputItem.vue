<script setup lang="ts">
import type { Output } from '~/types'

defineProps<{
  output: Output
  goalId: string
  milestoneId: string
}>()

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr))
}

function getTypeDisplay(type: string): { icon: string; label: string; color: string } {
  switch (type) {
    case 'memo': return { icon: '📝', label: 'メモ', color: 'bg-emerald-100 text-emerald-700' }
    case 'file': return { icon: '📎', label: 'ファイル', color: 'bg-orange-100 text-orange-700' }
    case 'url': return { icon: '🔗', label: 'リンク', color: 'bg-blue-100 text-blue-700' }
    case 'audio': return { icon: '🎵', label: '音声', color: 'bg-purple-100 text-purple-700' }
    case 'video': return { icon: '🎬', label: '動画', color: 'bg-amber-100 text-amber-700' }
    default: return { icon: '📄', label: type, color: 'bg-gray-100 text-gray-700' }
  }
}
</script>

<template>
  <NuxtLink
    :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/${output.id}`"
    class="flex items-center gap-4 p-4 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-xl no-underline text-inherit transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0b12]"
  >
    <div class="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl" :class="getTypeDisplay(output.type).color">
      {{ getTypeDisplay(output.type).icon }}
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="m-0 text-[15px] font-semibold text-gray-900 dark:text-white/90 group-hover:text-indigo-500 transition-colors truncate">{{ output.title }}</h4>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-xs font-medium px-1.5 py-0.5 rounded" :class="getTypeDisplay(output.type).color">
          {{ getTypeDisplay(output.type).label }}
        </span>
        <span class="text-xs text-gray-400 dark:text-white/35">{{ formatDate(output.activity_date) }}</span>
      </div>
    </div>

    <span class="shrink-0 text-gray-300 dark:text-white/20 group-hover:text-indigo-500 transition-colors text-lg">→</span>
  </NuxtLink>
</template>
