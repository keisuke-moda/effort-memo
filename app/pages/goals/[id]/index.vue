<script setup lang="ts">
const route = useRoute()
const { fetchGoalById, fetchMilestonesByGoalId, toggleGoalStatus } = useGoals()

const goalId = route.params.id as string
const { data: goal, refresh: refreshGoal } = await useAsyncData(`goal-${goalId}`, () => fetchGoalById(goalId))
const { data: milestones, refresh: refreshMilestones } = await useAsyncData(`milestones-${goalId}`, () => fetchMilestonesByGoalId(goalId))

const progressKey = ref(0)

useHead({
  title: computed(() => goal.value ? `${goal.value.title} | effort-memo` : 'effort-memo'),
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
    <NuxtLink to="/" class="text-gray-500 no-underline text-sm transition-colors hover:text-[#e94560]">
      ← ダッシュボードに戻る
    </NuxtLink>

    <div class="flex-1 min-w-0 flex flex-col gap-8">
      <!-- Goal Header -->
      <div class="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-xl">
        <div class="flex items-center justify-between">
          <StatusBadge :status="goal.status" />
          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/goals/${goal.id}/edit`"
              class="px-3.5 py-1.5 text-[13px] border border-gray-300 bg-white rounded-md no-underline text-gray-500 transition-colors hover:bg-gray-100 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]"
            >
              ✏️ 編集
            </NuxtLink>
            <button
              class="px-3.5 py-1.5 text-[13px] border border-gray-300 bg-white rounded-md cursor-pointer text-gray-500 transition-colors hover:bg-gray-100 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560]"
              @click="handleToggleStatus"
            >
              ステータスを変更
            </button>
          </div>
        </div>

        <h1 class="m-0 text-2xl max-md:text-xl font-extrabold text-[#1a1a2e] text-balance">{{ goal.title }}</h1>
        <p class="m-0 text-[15px] text-gray-600 leading-relaxed">{{ goal.description }}</p>

        <div class="flex gap-6 flex-wrap">
          <div class="flex flex-col gap-0.5">
            <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">期限</span>
            <span class="text-sm text-gray-700">📅 {{ formatDate(goal.deadline) }}</span>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">作成日</span>
            <span class="text-sm text-gray-700">{{ formatDate(goal.created_at) }}</span>
          </div>
        </div>

        <div v-if="goal.reward" class="flex flex-col gap-1">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">達成ご褒美</span>
          <RewardBadge :reward="goal.reward" />
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">進捗</span>
          <GoalProgress :key="progressKey" :goal-id="goal.id" />
        </div>
      </div>

      <!-- Milestones -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="m-0 text-lg font-bold text-[#1a1a2e]">マイルストーン ({{ milestones?.length ?? 0 }})</h3>
          <NuxtLink
            :to="`/goals/${goal.id}/milestones/new`"
            class="px-3.5 py-1.5 text-[13px] bg-[#e94560] text-white font-semibold rounded-md no-underline transition-colors hover:bg-[#d63851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560] focus-visible:ring-offset-2"
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
        <p v-else class="text-gray-400 text-sm text-center py-8">マイルストーンはまだありません。</p>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16 text-gray-500">
    <h2>目標が見つかりません</h2>
    <NuxtLink to="/" class="text-[#e94560]">ダッシュボードに戻る</NuxtLink>
  </div>
</template>
