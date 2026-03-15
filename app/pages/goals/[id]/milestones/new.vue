<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchGoalById, addMilestone } = useGoals()

const goalId = route.params.id as string
const { data: goal } = await useAsyncData(`goal-ms-new-${goalId}`, () => fetchGoalById(goalId))

if (!goal.value) router.push('/')

useHead({ title: 'マイルストーンを追加 | effort-memo' })

const form = reactive({
  title: '',
  description: '',
  deadline: '',
  reward: '',
})

const submitting = ref(false)

async function submit() {
  if (!form.title.trim() || submitting.value) return
  submitting.value = true
  try {
    const milestone = await addMilestone({ goal_id: goalId, ...form })
    router.push(`/goals/${goalId}/milestones/${milestone.id}`)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5 max-w-2xl mx-auto">
    <NuxtLink :to="`/goals/${goalId}`" class="text-gray-500 no-underline text-sm transition-colors hover:text-[#e94560]">
      ← {{ goal?.title ?? '目標' }}に戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-[#1a1a2e]">マイルストーンを追加</h1>

    <form class="flex flex-col gap-5 p-6 bg-white border border-gray-200 rounded-xl" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">タイトル <span class="text-[#e94560]">*</span></label>
        <input
          v-model="form.title"
          type="text"
          placeholder="例：Vue.js / Nuxtの基礎を習得"
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-gray-700">説明</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="マイルストーンの詳細を記入..."
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
            placeholder="例：新しいキーボードを買う"
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="!form.title.trim()"
        class="mt-2 px-6 py-3 bg-[#e94560] text-white font-semibold rounded-lg cursor-pointer transition-all hover:bg-[#d63851] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        マイルストーンを追加する
      </button>
    </form>
  </div>
</template>
