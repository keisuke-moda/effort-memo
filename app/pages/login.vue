<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const loading = ref(false)
const error = ref('')

const signInWithGoogle = async () => {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/confirm`,
    },
  })
  if (err) {
    error.value = err.message
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-[#0b0b12] px-4" style="font-family: 'Inter', sans-serif;">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex flex-col items-center mb-10">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Momentum</h1>
        <p class="mt-1.5 text-sm text-gray-500 dark:text-white/40">日々の努力を可視化して、目標達成を加速させる</p>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/30">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-1">ログイン</h2>
        <p class="text-sm text-gray-500 dark:text-white/40 mb-6">アカウントにサインインして始めましょう</p>

        <button
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] text-gray-700 dark:text-white/80 text-sm font-medium transition-all duration-150 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          @click="signInWithGoogle"
        >
          <svg v-if="!loading" width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <svg v-else class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span>{{ loading ? '処理中...' : 'Google でログイン' }}</span>
        </button>

        <p v-if="error" class="mt-4 text-xs text-red-500 dark:text-red-400 text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
