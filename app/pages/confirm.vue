<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const router = useRouter()

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    router.replace('/')
  } else {
    router.replace('/login')
  }
})
</script>

<template>
  <div class="min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-[#0b0b12]" style="font-family: 'Inter', sans-serif;">
    <div class="flex flex-col items-center gap-3">
      <svg class="animate-spin text-indigo-500" width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-sm text-gray-500 dark:text-white/40">認証中...</p>
    </div>
  </div>
</template>
