<script setup lang="ts">
import type { Status } from '~/types'

defineProps<{
  status: Status
}>()

const config: Record<Status, { label: string; classes: string }> = {
  not_started: { label: '未着手', classes: 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/[0.06] dark:text-white/40 dark:border-white/[0.08]' },
  in_progress:  { label: '進行中', classes: 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20' },
  completed:    { label: '完了',   classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20' },
}
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide"
    :class="config[status].classes"
  >
    {{ config[status].label }}
  </span>
</template>
