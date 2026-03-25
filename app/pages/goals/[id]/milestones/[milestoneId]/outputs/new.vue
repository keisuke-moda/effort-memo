<script setup lang="ts">
import type { OutputType } from '~/types'

const route = useRoute()
const router = useRouter()
const { fetchMilestoneById, addOutput } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string
const { data: milestone } = await useAsyncData(`milestone-out-new-${milestoneId}`, () => fetchMilestoneById(milestoneId))

if (!milestone.value) router.push(`/goals/${goalId}`)

useHead({ title: 'アウトプットを追加 | Momentum' })

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  type: 'memo' as OutputType,
  title: '',
  url: '',
  description: '',
  activityDate: today,
})

const selectedFile = ref<File | null>(null)
const filePreviewUrl = ref<string | null>(null)

const typeOptions: { value: OutputType; label: string; icon: string }[] = [
  { value: 'memo', label: 'メモ', icon: '📝' },
  { value: 'file', label: 'ファイル', icon: '📎' },
]

const canSubmit = computed(() => {
  if (!form.title.trim()) return false
  if (form.type === 'file') return !!selectedFile.value
  return true
})

function onTypeChange(type: OutputType) {
  form.type = type
  clearFile()
  form.url = ''
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  selectedFile.value = file

  if (filePreviewUrl.value) URL.revokeObjectURL(filePreviewUrl.value)
  filePreviewUrl.value = URL.createObjectURL(file)

  if (!form.title.trim()) {
    form.title = file.name.replace(/\.[^.]+$/, '')
  }
}

function clearFile() {
  selectedFile.value = null
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
    filePreviewUrl.value = null
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️'
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return '🎬'
  if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) return '🎵'
  if (['pdf'].includes(ext)) return '📄'
  return '📎'
}

const submitting = ref(false)

async function submit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true

  try {
    await addOutput({
      milestone_id: milestoneId,
      type: form.type,
      title: form.title,
      activity_date: form.activityDate,
      url: form.type === 'memo' && form.url.trim() ? form.url : undefined,
      description: form.description,
      file: form.type === 'file' ? selectedFile.value! : undefined,
    })
    router.push(`/goals/${goalId}/milestones/${milestoneId}`)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5 max-w-2xl mx-auto">
    <NuxtLink
      :to="`/goals/${goalId}/milestones/${milestoneId}`"
      class="text-gray-500 dark:text-white/40 no-underline text-sm transition-colors hover:text-indigo-500"
    >
      ← {{ milestone?.title ?? 'マイルストーン' }}に戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-gray-900 dark:text-white/90 text-balance">アウトプットを追加</h1>

    <form class="flex flex-col gap-5 p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl" @submit.prevent="submit">
      <!-- Type Select -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700 dark:text-white/70">種類 <span class="text-indigo-500">*</span></label>
        <div class="flex gap-2">
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            type="button"
            class="flex-1 py-2.5 px-3 text-sm border rounded-xl cursor-pointer transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            :class="form.type === opt.value
              ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-400 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'bg-white dark:bg-white/[0.06] border-gray-300 dark:border-white/[0.12] text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/10'"
            @click="onTypeChange(opt.value)"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="title" class="text-sm font-semibold text-gray-700 dark:text-white/70">タイトル <span class="text-indigo-500">*</span></label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          name="title"
          :placeholder="form.type === 'memo' ? '例：Vue.jsのリアクティビティを理解した' : '例：完成したデザインファイル'"
          class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 dark:placeholder:text-white/25"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="activity-date" class="text-sm font-semibold text-gray-700 dark:text-white/70">日付</label>
        <input
          id="activity-date"
          v-model="form.activityDate"
          type="date"
          name="activity-date"
          class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <!-- メモタイプ -->
      <template v-if="form.type === 'memo'">
        <div class="flex flex-col gap-1.5">
          <label for="description" class="text-sm font-semibold text-gray-700 dark:text-white/70">学んだこと・頑張ったこと</label>
          <textarea
            id="description"
            v-model="form.description"
            name="description"
            rows="6"
            placeholder="何を学んだか、どれだけ頑張ったかを書こう…"
            class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 resize-y placeholder:text-gray-400 dark:placeholder:text-white/25"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="url" class="text-sm font-semibold text-gray-700 dark:text-white/70">URL（任意）</label>
          <input
            id="url"
            v-model="form.url"
            type="url"
            name="url"
            placeholder="https://example.com/…"
            class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 dark:placeholder:text-white/25"
          />
        </div>
      </template>

      <!-- ファイルタイプ -->
      <template v-if="form.type === 'file'">
        <div class="flex flex-col gap-1.5">
          <label for="file" class="text-sm font-semibold text-gray-700 dark:text-white/70">ファイル <span class="text-indigo-500">*</span></label>

          <label
            v-if="!selectedFile"
            class="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-gray-300 dark:border-white/[0.15] rounded-2xl cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5"
          >
            <span class="text-4xl">📎</span>
            <span class="text-sm text-gray-500 dark:text-white/40">クリックしてファイルを選択</span>
            <span class="text-xs text-gray-400 dark:text-white/25">画像・動画・音声・PDFなど</span>
            <input
              id="file"
              type="file"
              class="hidden"
              @change="onFileSelect"
            />
          </label>

          <div v-else class="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-2xl">{{ getFileIcon(selectedFile.name) }}</span>
                <div class="min-w-0">
                  <p class="m-0 text-sm font-medium text-gray-900 dark:text-white/90 truncate">{{ selectedFile.name }}</p>
                  <p class="m-0 text-xs text-gray-400 dark:text-white/35">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </div>
              <button
                type="button"
                class="shrink-0 px-3 py-1 text-xs text-gray-500 dark:text-white/50 border border-gray-300 dark:border-white/[0.12] rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
                @click="clearFile"
              >
                変更
              </button>
            </div>

            <!-- プレビュー -->
            <img
              v-if="selectedFile.type.startsWith('image/') && filePreviewUrl"
              :src="filePreviewUrl"
              class="w-full max-h-[240px] object-contain rounded-lg"
            />
            <audio
              v-else-if="selectedFile.type.startsWith('audio/') && filePreviewUrl"
              controls
              :src="filePreviewUrl"
              class="w-full"
            />
            <video
              v-else-if="selectedFile.type.startsWith('video/') && filePreviewUrl"
              controls
              :src="filePreviewUrl"
              class="w-full max-h-[240px] rounded-lg"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="file-description" class="text-sm font-semibold text-gray-700 dark:text-white/70">メモ</label>
          <textarea
            id="file-description"
            v-model="form.description"
            name="file-description"
            rows="3"
            placeholder="補足メモなど…"
            class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 resize-y placeholder:text-gray-400 dark:placeholder:text-white/25"
          />
        </div>
      </template>

      <button
        type="submit"
        :disabled="!canSubmit || submitting"
        class="mt-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0b12]"
      >
        {{ submitting ? 'アップロード中…' : 'アウトプットを追加する' }}
      </button>
    </form>
  </div>
</template>
