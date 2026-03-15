<script setup lang="ts">
import type { OutputType } from '~/types'

const route = useRoute()
const router = useRouter()
const { fetchMilestoneById, addOutput } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string
const { data: milestone } = await useAsyncData(`milestone-out-new-${milestoneId}`, () => fetchMilestoneById(milestoneId))

if (!milestone.value) router.push(`/goals/${goalId}`)

useHead({ title: 'アウトプットを追加 | effort-memo' })

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
      class="text-gray-500 no-underline text-sm transition-colors hover:text-[#e94560]"
    >
      ← {{ milestone?.title ?? 'マイルストーン' }}に戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-[#1a1a2e]">アウトプットを追加</h1>

    <form class="flex flex-col gap-5 p-6 bg-white border border-gray-200 rounded-xl" @submit.prevent="submit">
      <!-- Type Select -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">種類 <span class="text-[#e94560]">*</span></label>
        <div class="flex gap-2">
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            type="button"
            class="flex-1 py-2.5 px-3 text-sm border rounded-lg cursor-pointer transition-all text-center"
            :class="form.type === opt.value
              ? 'bg-[#e94560]/10 border-[#e94560] text-[#e94560] font-semibold'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
            @click="onTypeChange(opt.value)"
          >
            {{ opt.icon }} {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">タイトル <span class="text-[#e94560]">*</span></label>
        <input
          v-model="form.title"
          type="text"
          :placeholder="form.type === 'memo' ? '例：Vue.jsのリアクティビティを理解した' : '例：完成したデザインファイル'"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">日付</label>
        <input
          v-model="form.activityDate"
          type="date"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
        />
      </div>

      <!-- メモタイプ -->
      <template v-if="form.type === 'memo'">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">学んだこと・頑張ったこと</label>
          <textarea
            v-model="form.description"
            rows="6"
            placeholder="何を学んだか、どれだけ頑張ったかを書こう..."
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20 resize-y"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">URL（任意）</label>
          <input
            v-model="form.url"
            type="url"
            placeholder="https://example.com/..."
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
          />
        </div>
      </template>

      <!-- ファイルタイプ -->
      <template v-if="form.type === 'file'">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">ファイル <span class="text-[#e94560]">*</span></label>

          <label
            v-if="!selectedFile"
            class="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all hover:border-[#e94560] hover:bg-[#e94560]/5"
          >
            <span class="text-4xl">📎</span>
            <span class="text-sm text-gray-500">クリックしてファイルを選択</span>
            <span class="text-xs text-gray-400">画像・動画・音声・PDFなど</span>
            <input
              type="file"
              class="hidden"
              @change="onFileSelect"
            />
          </label>

          <div v-else class="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-2xl">{{ getFileIcon(selectedFile.name) }}</span>
                <div class="min-w-0">
                  <p class="m-0 text-sm font-medium truncate">{{ selectedFile.name }}</p>
                  <p class="m-0 text-xs text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </div>
              <button
                type="button"
                class="shrink-0 px-3 py-1 text-xs text-gray-500 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
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
          <label class="text-sm font-semibold text-gray-700">メモ</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="補足メモなど..."
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20 resize-y"
          />
        </div>
      </template>

      <button
        type="submit"
        :disabled="!canSubmit || submitting"
        class="mt-2 px-6 py-3 bg-[#e94560] text-white font-semibold rounded-lg cursor-pointer transition-all hover:bg-[#d63851] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ submitting ? 'アップロード中...' : 'アウトプットを追加する' }}
      </button>
    </form>
  </div>
</template>
