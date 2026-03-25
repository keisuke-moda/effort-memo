<script setup lang="ts">
const route = useRoute()
const { fetchGoalById, fetchMilestonesByGoalId, toggleGoalStatus } = useGoals()

const goalId = route.params.id as string
const { data: goal, refresh: refreshGoal } = await useAsyncData(`goal-${goalId}`, () => fetchGoalById(goalId))
const { data: milestones, refresh: refreshMilestones } = await useAsyncData(`milestones-${goalId}`, () => fetchMilestonesByGoalId(goalId))

const progressKey = ref(0)

useHead({
  title: computed(() => goal.value ? `${goal.value.title} | Momentum` : 'Momentum'),
})

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr))
}

async function handleToggleStatus() {
  if (!goal.value) return
  await toggleGoalStatus(goal.value.id)
  await refreshGoal()
}

async function handleMilestoneStatusChanged() {
  await refreshMilestones()
  progressKey.value++
}
</script>

<template>
  <div v-if="goal" class="flex flex-col gap-5">
    <NuxtLink to="/" class="text-gray-500 dark:text-white/40 no-underline text-sm transition-colors hover:text-indigo-500">
      ← ダッシュボードに戻る
    </NuxtLink>

    <div class="flex-1 min-w-0 flex flex-col gap-8">
      <!-- Goal Header -->
      <div class="flex flex-col gap-4 p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl">
        <div class="flex flex-row flex-wrap items-center justify-between gap-3">
          <StatusBadge :status="goal.status" />
          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/goals/${goal.id}/edit`"
              class="px-3.5 py-1.5 text-[13px] border border-gray-200 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] rounded-lg no-underline text-gray-500 dark:text-white/50 transition-colors hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-white/10 dark:hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              編集
            </NuxtLink>
            <button
              class="px-3.5 py-1.5 text-[13px] border border-gray-200 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] rounded-lg cursor-pointer text-gray-500 dark:text-white/50 transition-colors hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-white/10 dark:hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              @click="handleToggleStatus"
            >
              ステータスを変更
            </button>
          </div>
        </div>

        <h1 class="m-0 text-2xl max-md:text-xl font-extrabold text-gray-900 dark:text-white/90 text-balance">{{ goal.title }}</h1>
        <p class="m-0 text-[15px] text-gray-600 dark:text-white/50 leading-relaxed">{{ goal.description }}</p>

        <div class="flex gap-6 flex-wrap">
          <div class="flex flex-col gap-0.5">
            <span class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/35 font-semibold">期限</span>
            <span class="text-sm text-gray-700 dark:text-white/70">{{ formatDate(goal.deadline) }}</span>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/35 font-semibold">作成日</span>
            <span class="text-sm text-gray-700 dark:text-white/70">{{ formatDate(goal.created_at) }}</span>
          </div>
        </div>

        <div v-if="goal.reward" class="flex flex-col gap-1">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/35 font-semibold">達成ご褒美</span>
          <RewardBadge :reward="goal.reward" />
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/35 font-semibold">進捗</span>
          <GoalProgress :key="progressKey" :goal-id="goal.id" />
        </div>
      </div>

      <!-- Milestones -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-white/90">マイルストーン ({{ milestones?.length ?? 0 }})</h3>
          <NuxtLink
            :to="`/goals/${goal.id}/milestones/new`"
            class="px-3.5 py-1.5 text-[13px] bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-lg no-underline transition-all hover:shadow-md hover:shadow-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0b12]"
          >
            + 追加
          </NuxtLink>
        </div>
        <div v-if="milestones?.length" class="flex flex-col gap-3">
          <MilestoneItem
            v-for="milestone in milestones"
            :key="milestone.id"
            :milestone="milestone"
            :goal-id="goal.id"
            @status-changed="handleMilestoneStatusChanged"
          />
        </div>
        <p v-else class="text-gray-400 dark:text-white/30 text-sm text-center py-8">マイルストーンはまだありません。</p>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16 text-gray-500 dark:text-white/40">
    <h2>目標が見つかりません</h2>
    <NuxtLink to="/" class="text-indigo-500">ダッシュボードに戻る</NuxtLink>
  </div>
</template>
