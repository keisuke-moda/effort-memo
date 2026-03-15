<script setup lang="ts">
defineProps<{
  reward: string
}>()
</script>

<template>
  <span
    v-if="reward"
    class="inline-block px-3 py-1 bg-gradient-to-br from-orange-50 to-orange-200 border border-orange-300 rounded-full text-[13px] text-orange-800 font-medium"
  >
    🎁 {{ reward }}
  </span>
</template>
