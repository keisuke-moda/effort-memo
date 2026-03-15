<script setup lang="ts">
import type { Status } from '~/types'

defineProps<{
  status: Status
}>()

const config: Record<Status, { label: string; classes: string }> = {
  not_started: { label: '未着手', classes: 'bg-gray-100 text-gray-500' },
  in_progress: { label: '進行中', classes: 'bg-blue-100 text-blue-600' },
  completed: { label: '完了', classes: 'bg-green-100 text-green-600' },
}
</script>

<template>
  <span class="inline-block px-2.5 py-0.5 rounded-xl text-xs font-semibold" :class="config[status].classes">
    {{ config[status].label }}
  </span>
</template>
