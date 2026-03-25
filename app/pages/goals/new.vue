<script setup lang="ts">
useHead({ title: '目標を追加 | Momentum' })

const { addGoal } = useGoals()
const router = useRouter()

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
    const goal = await addGoal({ ...form })
    router.push(`/goals/${goal.id}`)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5 max-w-2xl mx-auto">
    <NuxtLink to="/" class="text-gray-500 dark:text-white/40 no-underline text-sm transition-colors hover:text-indigo-500">
      ← ダッシュボードに戻る
    </NuxtLink>

    <h1 class="m-0 text-2xl font-extrabold text-gray-900 dark:text-white/90 text-balance">目標を追加</h1>

    <form class="flex flex-col gap-5 p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label for="title" class="text-sm font-semibold text-gray-700 dark:text-white/70">タイトル <span class="text-indigo-500">*</span></label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          name="title"
          placeholder="例：フルスタックエンジニアになる"
          class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 dark:placeholder:text-white/25"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="description" class="text-sm font-semibold text-gray-700 dark:text-white/70">説明</label>
        <textarea
          id="description"
          v-model="form.description"
          name="description"
          rows="3"
          placeholder="目標の詳細を記入…"
          class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 resize-y placeholder:text-gray-400 dark:placeholder:text-white/25"
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
            placeholder="例：新しいMacBook Proを買う！"
            class="px-4 py-2.5 border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white/90 rounded-xl text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 dark:placeholder:text-white/25"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="!form.title.trim()"
        class="mt-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0b12]"
      >
        目標を追加する
      </button>
    </form>
  </div>
</template>
