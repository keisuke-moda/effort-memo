<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchMilestoneById, updateMilestone, deleteMilestone } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string
const { data: milestone } = await useAsyncData(`milestone-edit-${milestoneId}`, () => fetchMilestoneById(milestoneId))

if (!milestone.value) router.push(`/goals/${goalId}`)

useHead({ title: 'マイルストーンを編集 | Momentum' })

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
      class="text-gray-500 dark:text-white/40 no-underline text-sm transition-colors hover:text-indigo-500"
    >
      ← マイルストーンに戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-gray-900 dark:text-white/90 text-balance">マイルストーンを編集</h1>

    <form class="flex flex-col gap-5 p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label for="title" class="text-sm font-semibold text-gray-700 dark:text-white/70">タイトル <span class="text-indigo-500">*</span></label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          name="title"
          class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="description" class="text-sm font-semibold text-gray-700 dark:text-white/70">説明</label>
        <textarea
          id="description"
          v-model="form.description"
          name="description"
          rows="3"
          class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 resize-y"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="deadline" class="text-sm font-semibold text-gray-700 dark:text-white/70">期限</label>
          <input
            id="deadline"
            v-model="form.deadline"
            type="date"
            name="deadline"
            class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="reward" class="text-sm font-semibold text-gray-700 dark:text-white/70">達成ご褒美</label>
          <input
            id="reward"
            v-model="form.reward"
            type="text"
            name="reward"
            class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-2">
        <button
          type="submit"
          :disabled="!form.title.trim()"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0b12]"
        >
          保存する
        </button>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}`"
          class="px-6 py-3 border border-gray-200 dark:border-white/[0.12] text-gray-500 dark:text-white/50 font-semibold rounded-xl no-underline transition-colors hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          キャンセル
        </NuxtLink>
      </div>
    </form>

    <!-- 削除セクション -->
    <div class="p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl">
      <p class="m-0 mb-4 text-sm text-gray-500 dark:text-white/40">このマイルストーンを削除すると、紐づくアウトプットもすべて削除されます。</p>
      <button
        type="button"
        class="px-5 py-2.5 bg-white dark:bg-white/[0.06] border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl cursor-pointer transition-colors hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-500/10 dark:hover:border-red-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        @click="showDeleteConfirm = true"
      >
        このマイルストーンを削除する
      </button>
    </div>

    <!-- 削除確認モーダル -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteConfirm = false" />
        <div class="relative bg-white dark:bg-[#161625] rounded-2xl p-6 max-w-md w-full shadow-2xl overscroll-contain border border-gray-200/50 dark:border-white/[0.08]">
          <h3 class="m-0 mb-2 text-lg font-bold text-gray-800 dark:text-white/90">本当に削除しますか？</h3>
          <p class="m-0 mb-6 text-sm text-gray-500 dark:text-white/40">
            「{{ milestone?.title }}」と、紐づくアウトプットがすべて削除されます。
          </p>
          <div class="flex gap-3 justify-end">
            <button
              class="px-5 py-2.5 border border-gray-200 dark:border-white/[0.12] text-gray-500 dark:text-white/50 text-sm font-semibold rounded-xl cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              @click="showDeleteConfirm = false"
            >
              キャンセル
            </button>
            <button
              class="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl cursor-pointer transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161625]"
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
