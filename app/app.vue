<script setup lang="ts">
const { isDark, initTheme } = useTheme()
onMounted(() => initTheme())

useHead({
  htmlAttrs: {
    class: computed(() => isDark.value ? 'dark' : ''),
  },
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
body {
  @apply bg-gray-50 text-gray-800 antialiased;
}

a {
  color: inherit;
}
</style>
