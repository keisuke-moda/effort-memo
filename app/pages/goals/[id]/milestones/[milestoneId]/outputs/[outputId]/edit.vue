<script setup lang="ts">
import type { OutputType } from '~/types'

const route = useRoute()
const router = useRouter()
const { fetchOutputById, updateOutput, uploadFile, deleteOutput } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string
const outputId = route.params.outputId as string
const { data: output } = await useAsyncData(`output-edit-${outputId}`, () => fetchOutputById(outputId))

if (!output.value) router.push(`/goals/${goalId}/milestones/${milestoneId}`)

useHead({ title: 'アウトプットを編集 | effort-memo' })

const resolvedType = (['memo', 'url'].includes(output.value?.type ?? '') ? 'memo' : 'file') as OutputType

const originalDate = output.value?.activity_date ?? output.value?.created_at.slice(0, 10) ?? ''

const form = reactive({
  title: output.value?.title ?? '',
  url: output.value?.url ?? '',
  description: output.value?.description ?? '',
  type: resolvedType,
  activityDate: originalDate,
})

const typeOptions: { value: OutputType; label: string; icon: string }[] = [
  { value: 'memo', label: 'メモ', icon: '📝' },
  { value: 'file', label: 'ファイル', icon: '📎' },
]

const showDeleteConfirm = ref(false)

// --- File handling ---
const selectedFile = ref<File | null>(null)
const filePreviewUrl = ref<string | null>(null)

const hasExistingFile = computed(() => form.type === 'file' && output.value?.url && !selectedFile.value && resolvedType === 'file')
const needsFileUpload = computed(() => form.type === 'file' && !hasExistingFile.value && !selectedFile.value)

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

function onTypeChange(type: OutputType) {
  form.type = type
  clearFile()
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

const canSubmit = computed(() => {
  if (!form.title.trim()) return false
  if (form.type === 'file' && !hasExistingFile.value && !selectedFile.value) return false
  return true
})

const submitting = ref(false)

async function submit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true

  try {
    let fileUrl = form.type === 'memo' ? (form.url.trim() || null) : output.value?.url ?? null

    if (form.type === 'file' && selectedFile.value) {
      fileUrl = await uploadFile(selectedFile.value, outputId)
    }

    await updateOutput(outputId, {
      title: form.title,
      description: form.description,
      type: form.type,
      url: fileUrl,
      file_name: selectedFile.value?.name ?? output.value?.file_name ?? null,
      activity_date: form.activityDate,
    })
    router.push(`/goals/${goalId}/milestones/${milestoneId}/outputs/${outputId}`)
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  await deleteOutput(outputId)
  router.push(`/goals/${goalId}/milestones/${milestoneId}`)
}
</script>

<template>
  <div class="flex flex-col gap-5 max-w-2xl mx-auto">
    <NuxtLink
      :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/${outputId}`"
      class="text-gray-500 no-underline text-sm transition-colors hover:text-[#e94560]"
    >
      ← アウトプットに戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-[#1a1a2e]">アウトプットを編集</h1>

    <form class="flex flex-col gap-5 p-6 bg-white border border-gray-200 rounded-xl" @submit.prevent="submit">
      <!-- Type Select -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">種類</label>
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
            type="text"
            placeholder="https://example.com/..."
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
          />
        </div>
      </template>

      <!-- ファイルタイプ -->
      <template v-if="form.type === 'file'">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">ファイル <span class="text-[#e94560]">*</span></label>

          <!-- 既存ファイルあり & 新規未選択 -->
          <div v-if="hasExistingFile" class="flex flex-col gap-2">
            <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                <span>📎</span>
                <span class="truncate">{{ output?.file_name ?? 'アップロード済みファイル' }}</span>
              </div>
              <label class="shrink-0 px-3 py-1 text-xs text-gray-500 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                差し替え
                <input type="file" class="hidden" @change="onFileSelect" />
              </label>
            </div>
          </div>

          <!-- ファイル未選択（新規アップロード必要） -->
          <label
            v-else-if="needsFileUpload"
            class="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all hover:border-[#e94560] hover:bg-[#e94560]/5"
          >
            <span class="text-4xl">📎</span>
            <span class="text-sm text-gray-500">クリックしてファイルを選択</span>
            <span class="text-xs text-gray-400">画像・動画・音声・PDFなど</span>
            <input type="file" class="hidden" @change="onFileSelect" />
          </label>

          <!-- 新規ファイル選択済み -->
          <div v-else-if="selectedFile" class="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
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

      <div class="flex gap-3 mt-2">
        <button
          type="submit"
          :disabled="!canSubmit || submitting"
          class="px-6 py-3 bg-[#e94560] text-white font-semibold rounded-lg cursor-pointer transition-all hover:bg-[#d63851] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {{ submitting ? 'アップロード中...' : '保存する' }}
        </button>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/${outputId}`"
          class="px-6 py-3 border border-gray-300 text-gray-500 font-semibold rounded-lg no-underline transition-all hover:bg-gray-100"
        >
          キャンセル
        </NuxtLink>
      </div>
    </form>

    <!-- 削除セクション -->
    <div class="p-6 bg-white border border-gray-200 rounded-xl">
      <p class="m-0 mb-4 text-sm text-gray-500">このアウトプットを削除します。</p>
      <button
        type="button"
        class="px-5 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-semibold rounded-lg cursor-pointer transition-all hover:bg-red-50 hover:border-red-400"
        @click="showDeleteConfirm = true"
      >
        このアウトプットを削除する
      </button>
    </div>

    <!-- 削除確認モーダル -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showDeleteConfirm = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 class="m-0 mb-2 text-lg font-bold text-gray-800">本当に削除しますか？</h3>
          <p class="m-0 mb-6 text-sm text-gray-500">
            「{{ output?.title }}」を削除します。
          </p>
          <div class="flex gap-3 justify-end">
            <button
              class="px-5 py-2.5 border border-gray-300 text-gray-500 text-sm font-semibold rounded-lg cursor-pointer transition-all hover:bg-gray-100"
              @click="showDeleteConfirm = false"
            >
              キャンセル
            </button>
            <button
              class="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg cursor-pointer transition-all hover:bg-red-700"
              @click="confirmDelete"
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
