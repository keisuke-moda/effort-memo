<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchGoalById, updateGoal, deleteGoal } = useGoals()

const goalId = route.params.id as string
const { data: goal } = await useAsyncData(`goal-edit-${goalId}`, () => fetchGoalById(goalId))

if (!goal.value) {
  router.push('/')
}

useHead({ title: `目標を編集 | effort-memo` })

const form = reactive({
  title: goal.value?.title ?? '',
  description: goal.value?.description ?? '',
  deadline: goal.value?.deadline ?? '',
  reward: goal.value?.reward ?? '',
})

const showDeleteConfirm = ref(false)

async function submit() {
  if (!form.title.trim()) return
  await updateGoal(goalId, { ...form })
  router.push(`/goals/${goalId}`)
}

async function confirmDelete() {
  await deleteGoal(goalId)
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col gap-5 max-w-2xl mx-auto">
    <NuxtLink :to="`/goals/${goalId}`" class="text-gray-500 no-underline text-sm transition-colors hover:text-[#e94560]">
      ← 目標に戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-[#1a1a2e]">目標を編集</h1>

    <form class="flex flex-col gap-5 p-6 bg-white border border-gray-200 rounded-xl" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">タイトル <span class="text-[#e94560]">*</span></label>
        <input
          v-model="form.title"
          type="text"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">説明</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20 resize-y"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">期限</label>
          <input
            v-model="form.deadline"
            type="date"
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-700">達成ご褒美</label>
          <input
            v-model="form.reward"
            type="text"
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-2">
        <button
          type="submit"
          :disabled="!form.title.trim()"
          class="px-6 py-3 bg-[#e94560] text-white font-semibold rounded-lg cursor-pointer transition-all hover:bg-[#d63851] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          保存する
        </button>
        <NuxtLink
          :to="`/goals/${goalId}`"
          class="px-6 py-3 border border-gray-300 text-gray-500 font-semibold rounded-lg no-underline transition-all hover:bg-gray-100"
        >
          キャンセル
        </NuxtLink>
      </div>
    </form>

    <!-- 削除セクション -->
    <div class="p-6 bg-white border border-gray-200 rounded-xl">
      <p class="m-0 mb-4 text-sm text-gray-500">この目標を削除すると、紐づくマイルストーン・アウトプットもすべて削除されます。</p>
      <button
        type="button"
        class="px-5 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-semibold rounded-lg cursor-pointer transition-all hover:bg-red-50 hover:border-red-400"
        @click="showDeleteConfirm = true"
      >
        この目標を削除する
      </button>
    </div>

    <!-- 削除確認モーダル -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showDeleteConfirm = false" />
        <div class="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 class="m-0 mb-2 text-lg font-bold text-gray-800">本当に削除しますか？</h3>
          <p class="m-0 mb-6 text-sm text-gray-500">
            「{{ goal?.title }}」と、紐づくマイルストーン・アウトプットがすべて削除されます。
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
