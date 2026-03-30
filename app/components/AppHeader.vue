<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const signOut = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

const avatarUrl = computed(() => user.value?.user_metadata?.avatar_url ?? null)
const displayName = computed(() => user.value?.user_metadata?.full_name ?? user.value?.email ?? '')
const initials = computed(() => {
  const name = displayName.value
  if (!name) return '?'
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0c18]/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-white/[0.06]">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-5 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5 no-underline group cursor-pointer">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-110">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span class="text-gray-900 dark:text-white text-[17px] font-bold tracking-tight">Momentum</span>
      </NuxtLink>
      <div class="flex items-center gap-1">
        <nav>
          <NuxtLink
            to="/"
            class="text-gray-500 dark:text-white/50 no-underline text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 hover:text-gray-800 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            ダッシュボード
          </NuxtLink>
        </nav>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-white/40 transition-colors duration-150 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 cursor-pointer"
          :aria-label="isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <!-- ユーザーメニュー -->
        <div v-if="user" class="flex items-center gap-1 ml-1">
          <div class="flex items-center gap-2 px-2 py-1 rounded-lg">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              class="w-6 h-6 rounded-full object-cover"
            />
            <div
              v-else
              class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold"
            >
              {{ initials }}
            </div>
          </div>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-white/40 transition-colors duration-150 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 cursor-pointer"
            aria-label="ログアウト"
            title="ログアウト"
            @click="signOut"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
