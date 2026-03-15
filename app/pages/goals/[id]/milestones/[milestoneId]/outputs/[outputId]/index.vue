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
  title: computed(() => output.value ? `${output.value.title} | effort-memo` : 'effort-memo'),
})

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
    <div class="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
      <NuxtLink to="/" class="no-underline text-gray-400 hover:text-[#e94560]">ダッシュボード</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/goals/${goalId}`" class="no-underline text-gray-400 hover:text-[#e94560]">{{ goal.title }}</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/goals/${goalId}/milestones/${milestoneId}`" class="no-underline text-gray-400 hover:text-[#e94560]">{{ milestone.title }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-600">{{ output.title }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-2 py-1 rounded-md" :class="getTypeDisplay(output.type).color">
            {{ getTypeDisplay(output.type).icon }} {{ getTypeDisplay(output.type).label }}
          </span>
          <span class="text-sm text-gray-400">{{ output.activity_date }}</span>
        </div>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/${outputId}/edit`"
          class="px-3.5 py-1.5 text-[13px] border border-gray-300 bg-white rounded-md no-underline text-gray-500 transition-all hover:bg-gray-100 hover:border-gray-400"
        >
          ✏️ 編集
        </NuxtLink>
      </div>

      <h1 class="m-0 text-2xl max-md:text-xl font-extrabold text-[#1a1a2e]">{{ output.title }}</h1>

      <p v-if="output.description" class="m-0 text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap">{{ output.description }}</p>
    </div>

    <!-- URL (memo/url type with link) -->
    <div v-if="output.url && (output.type === 'memo' || output.type === 'url')" class="p-6 bg-white border border-gray-200 rounded-xl">
      <h3 class="m-0 mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">リンク</h3>
      <a
        :href="output.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm break-all hover:bg-blue-100 transition-colors"
      >
        🔗 {{ output.url }}
      </a>
    </div>

    <!-- File content (file/audio/video type) -->
    <div v-if="output.url && (output.type === 'file' || output.type === 'audio' || output.type === 'video')" class="p-6 bg-white border border-gray-200 rounded-xl">
      <h3 class="m-0 mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">ファイル</h3>
      <div class="flex flex-col gap-3">
        <img
          v-if="getMediaType(output.url) === 'image'"
          :src="output.url"
          :alt="output.title"
          class="w-full max-h-[400px] object-contain rounded-lg bg-gray-50"
        />
        <video
          v-else-if="getMediaType(output.url) === 'video' || output.type === 'video'"
          controls
          :src="output.url"
          class="w-full max-h-[400px] rounded-lg bg-black"
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
          class="inline-flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm hover:bg-orange-100 transition-colors"
        >
          📎 {{ output.file_name ?? 'ファイルを開く' }}
        </a>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16 text-gray-500">
    <h2>アウトプットが見つかりません</h2>
    <NuxtLink to="/" class="text-[#e94560]">ダッシュボードに戻る</NuxtLink>
  </div>
</template>
