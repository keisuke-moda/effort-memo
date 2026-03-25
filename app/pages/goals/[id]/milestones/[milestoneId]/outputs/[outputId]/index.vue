<script setup lang="ts">
const route = useRoute()
const { fetchGoalById, fetchMilestoneById, fetchOutputById } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string
const outputId = route.params.outputId as string

const { data: goal } = await useAsyncData(`goal-${goalId}`, () => fetchGoalById(goalId))
const { data: milestone } = await useAsyncData(`milestone-${milestoneId}`, () => fetchMilestoneById(milestoneId))
const { data: output } = await useAsyncData(`output-${outputId}`, () => fetchOutputById(outputId))

useHead({
  title: computed(() => output.value ? `${output.value.title} | Momentum` : 'Momentum'),
})

function getTypeDisplay(type: string): { icon: string; label: string; color: string } {
  switch (type) {
    case 'memo': return { icon: '📝', label: 'メモ', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' }
    case 'file': return { icon: '📎', label: 'ファイル', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400' }
    case 'url': return { icon: '🔗', label: 'リンク', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' }
    case 'audio': return { icon: '🎵', label: '音声', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400' }
    case 'video': return { icon: '🎬', label: '動画', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' }
    default: return { icon: '📄', label: type, color: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60' }
  }
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr))
}

function getMediaType(url: string): 'image' | 'video' | 'audio' | null {
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0] ?? ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return 'video'
  if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio'
  return null
}
</script>

<template>
  <div v-if="output && milestone && goal" class="flex flex-col gap-5 max-w-3xl mx-auto">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/35 flex-wrap">
      <NuxtLink to="/" class="no-underline text-gray-400 dark:text-white/35 hover:text-indigo-500 transition-colors">ダッシュボード</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/goals/${goalId}`" class="no-underline text-gray-400 dark:text-white/35 hover:text-indigo-500 transition-colors">{{ goal.title }}</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/goals/${goalId}/milestones/${milestoneId}`" class="no-underline text-gray-400 dark:text-white/35 hover:text-indigo-500 transition-colors">{{ milestone.title }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-600 dark:text-white/60">{{ output.title }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col gap-4 p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-2 py-1 rounded-lg" :class="getTypeDisplay(output.type).color">
            {{ getTypeDisplay(output.type).icon }} {{ getTypeDisplay(output.type).label }}
          </span>
          <span class="text-sm text-gray-400 dark:text-white/35">{{ formatDate(output.activity_date) }}</span>
        </div>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/${outputId}/edit`"
          class="px-3.5 py-1.5 text-[13px] border border-gray-200 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] rounded-lg no-underline text-gray-500 dark:text-white/50 transition-colors hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-white/10 dark:hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          編集
        </NuxtLink>
      </div>

      <h1 class="m-0 text-2xl max-md:text-xl font-extrabold text-gray-900 dark:text-white/90">{{ output.title }}</h1>

      <p v-if="output.description" class="m-0 text-[15px] text-gray-600 dark:text-white/50 leading-relaxed whitespace-pre-wrap">{{ output.description }}</p>
    </div>

    <!-- URL (memo/url type with link) -->
    <div v-if="output.url && (output.type === 'memo' || output.type === 'url')" class="p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl">
      <h3 class="m-0 mb-4 text-sm font-semibold text-gray-400 dark:text-white/35 uppercase tracking-wider">リンク</h3>
      <a
        :href="output.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 text-sm break-all hover:bg-blue-100 dark:hover:bg-blue-500/15 transition-colors"
      >
        🔗 {{ output.url }}
      </a>
    </div>

    <!-- File content (file/audio/video type) -->
    <div v-if="output.url && (output.type === 'file' || output.type === 'audio' || output.type === 'video')" class="p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl">
      <h3 class="m-0 mb-4 text-sm font-semibold text-gray-400 dark:text-white/35 uppercase tracking-wider">ファイル</h3>
      <div class="flex flex-col gap-3">
        <img
          v-if="getMediaType(output.url) === 'image'"
          :src="output.url"
          :alt="output.title"
          class="w-full max-h-[400px] object-contain rounded-xl bg-gray-50 dark:bg-white/[0.04]"
        />
        <video
          v-else-if="getMediaType(output.url) === 'video' || output.type === 'video'"
          controls
          :src="output.url"
          class="w-full max-h-[400px] rounded-xl bg-black"
        />
        <audio
          v-else-if="getMediaType(output.url) === 'audio' || output.type === 'audio'"
          controls
          :src="output.url"
          class="w-full"
        />

        <a
          :href="output.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl text-orange-700 dark:text-orange-400 text-sm hover:bg-orange-100 dark:hover:bg-orange-500/15 transition-colors"
        >
          📎 {{ output.file_name ?? 'ファイルを開く' }}
        </a>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16 text-gray-500 dark:text-white/40">
    <h2>アウトプットが見つかりません</h2>
    <NuxtLink to="/" class="text-indigo-500">ダッシュボードに戻る</NuxtLink>
  </div>
</template>
