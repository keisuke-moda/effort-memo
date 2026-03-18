<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchMilestoneById, updateMilestone, deleteMilestone } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string
const { data: milestone } = await useAsyncData(`milestone-edit-${milestoneId}`, () => fetchMilestoneById(milestoneId))

if (!milestone.value) router.push(`/goals/${goalId}`)

useHead({ title: 'マイルストーンを編集 | effort-memo' })

const form = reactive({
  title: milestone.value?.title ?? '',
  description: milestone.value?.description ?? '',
  deadline: milestone.value?.deadline ?? '',
  reward: milestone.value?.reward ?? '',
})

const showDeleteConfirm = ref(false)

watch(showDeleteConfirm, (val) => {
  if (val) document.addEventListener('keydown', handleEsc)
  else document.removeEventListener('keydown', handleEsc)
})

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') showDeleteConfirm.value = false
}

async function submit() {
  if (!form.title.trim()) return
  await updateMilestone(milestoneId, { ...form })
  router.push(`/goals/${goalId}/milestones/${milestoneId}`)
}

async function confirmDelete() {
  await deleteMilestone(milestoneId)
  router.push(`/goals/${goalId}`)
}
</script>

<template>
  <div class="flex flex-col gap-5 max-w-2xl mx-auto">
    <NuxtLink
      :to="`/goals/${goalId}/milestones/${milestoneId}`"
      class="text-gray-500 no-underline text-sm transition-colors hover:text-[#e94560]"
    >
      ← マイルストーンに戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-[#1a1a2e] text-balance">マイルストーンを編集</h1>

    <form class="flex flex-col gap-5 p-6 bg-white border border-gray-200 rounded-xl" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label for="title" class="text-sm font-semibold text-gray-700">タイトル <span class="text-[#e94560]">*</span></label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          name="title"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="description" class="text-sm font-semibold text-gray-700">説明</label>
        <textarea
          id="description"
          v-model="form.description"
          name="description"
          rows="3"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20 resize-y"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="deadline" class="text-sm font-semibold text-gray-700">期限</label>
          <input
            id="deadline"
            v-model="form.deadline"
            type="date"
            name="deadline"
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="reward" class="text-sm font-semibold text-gray-700">達成ご褒美</label>
          <input
            id="reward"
            v-model="form.reward"
            type="text"
            name="reward"
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-2">
        <button
          type="submit"
          :disabled="!form.title.trim()"
          class="px-6 py-3 bg-[#e94560] text-white font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#d63851] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560] focus-visible:ring-offset-2"
        >
          保存する
        </button>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}`"
          class="px-6 py-3 border border-gray-300 text-gray-500 font-semibold rounded-lg no-underline transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          キャンセル
        </NuxtLink>
      </div>
    </form>

    <!-- 削除セクション -->
    <div class="p-6 bg-white border border-gray-200 rounded-xl">
      <p class="m-0 mb-4 text-sm text-gray-500">このマイルストーンを削除すると、紐づくアウトプットもすべて削除されます。</p>
      <button
        type="button"
        class="px-5 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-semibold rounded-lg cursor-pointer transition-colors hover:bg-red-50 hover:border-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        @click="showDeleteConfirm = true"
      >
        このマイルストーンを削除する
      </button>
    </div>

    <!-- 削除確認モーダル -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showDeleteConfirm = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl overscroll-contain">
          <h3 class="m-0 mb-2 text-lg font-bold text-gray-800">本当に削除しますか？</h3>
          <p class="m-0 mb-6 text-sm text-gray-500">
            「{{ milestone?.title }}」と、紐づくアウトプットがすべて削除されます。
          </p>
          <div class="flex gap-3 justify-end">
            <button
              class="px-5 py-2.5 border border-gray-300 text-gray-500 text-sm font-semibold rounded-lg cursor-pointer transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              @click="showDeleteConfirm = false"
            >
              キャンセル
            </button>
            <button
              class="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
