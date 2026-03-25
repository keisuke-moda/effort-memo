<script setup lang="ts">
const route = useRoute()
const { fetchGoalById, fetchMilestoneById, fetchOutputsByMilestoneId, toggleMilestoneStatus } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string

const { data: goal } = await useAsyncData(`goal-${goalId}`, () => fetchGoalById(goalId))
const { data: milestone, refresh: refreshMilestone } = await useAsyncData(`milestone-${milestoneId}`, () => fetchMilestoneById(milestoneId))
const { data: outputs } = await useAsyncData(`outputs-${milestoneId}`, () => fetchOutputsByMilestoneId(milestoneId))

useHead({
  title: computed(() => milestone.value ? `${milestone.value.title} | Momentum` : 'Momentum'),
})

async function handleToggleStatus() {
  if (!milestone.value) return
  await toggleMilestoneStatus(milestone.value.id)
  await refreshMilestone()
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr))
}
</script>

<template>
  <div v-if="milestone && goal" class="flex flex-col gap-5">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-400 dark:text-white/35 min-w-0">
      <!-- Mobile: ← Parent title -->
      <NuxtLink
        :to="`/goals/${goalId}`"
        class="sm:hidden inline-flex items-center gap-1.5 no-underline text-gray-400 dark:text-white/35 hover:text-indigo-500 transition-colors min-w-0 max-w-full"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><polyline points="15 18 9 12 15 6"/></svg>
        <span class="truncate font-medium text-gray-500 dark:text-white/45">{{ goal.title }}</span>
      </NuxtLink>
      <!-- Desktop: full breadcrumb -->
      <div class="hidden sm:flex items-center gap-1.5 flex-wrap">
        <NuxtLink to="/" class="no-underline text-gray-400 dark:text-white/35 hover:text-indigo-500 transition-colors shrink-0">ダッシュボード</NuxtLink>
        <span class="shrink-0">/</span>
        <NuxtLink :to="`/goals/${goalId}`" class="no-underline text-gray-400 dark:text-white/35 hover:text-indigo-500 transition-colors">{{ goal.title }}</NuxtLink>
        <span class="shrink-0">/</span>
        <span class="text-gray-600 dark:text-white/60">{{ milestone.title }}</span>
      </div>
    </nav>

    <!-- Milestone Header -->
    <div class="flex flex-col gap-4 p-6 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl">
      <div class="flex items-center justify-between">
        <StatusBadge :status="milestone.status" />
        <div class="flex items-center gap-2">
          <NuxtLink
            :to="`/goals/${goalId}/milestones/${milestoneId}/edit`"
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

      <h1 class="m-0 text-2xl max-md:text-xl font-extrabold text-gray-900 dark:text-white/90 text-balance">{{ milestone.title }}</h1>
      <p class="m-0 text-[15px] text-gray-600 dark:text-white/50 leading-relaxed">{{ milestone.description }}</p>

      <div class="flex gap-6 flex-wrap">
        <div class="flex flex-col gap-0.5">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/35 font-semibold">期限</span>
          <span class="text-sm text-gray-700 dark:text-white/70">{{ formatDate(milestone.deadline) }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/35 font-semibold">作成日</span>
          <span class="text-sm text-gray-700 dark:text-white/70">{{ formatDate(milestone.created_at) }}</span>
        </div>
      </div>

      <div v-if="milestone.reward" class="flex flex-col gap-1">
        <span class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/35 font-semibold">達成ご褒美</span>
        <RewardBadge :reward="milestone.reward" />
      </div>
    </div>

    <!-- Outputs -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-white/90">アウトプット ({{ outputs?.length ?? 0 }})</h3>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/new`"
          class="px-3.5 py-1.5 text-[13px] bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-lg no-underline transition-all hover:shadow-md hover:shadow-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0b12]"
        >
          + 追加
        </NuxtLink>
      </div>

      <div v-if="outputs?.length" class="flex flex-col gap-3">
        <OutputItem
          v-for="output in outputs"
          :key="output.id"
          :output="output"
          :goal-id="goalId"
          :milestone-id="milestoneId"
        />
      </div>
      <div v-else class="text-center py-12 text-gray-400 dark:text-white/30 border-2 border-dashed border-gray-200 dark:border-white/[0.08] rounded-2xl">
        <p class="text-4xl mb-2">📝</p>
        <p class="text-sm">まだアウトプットがありません</p>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/new`"
          class="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold rounded-lg no-underline transition-all hover:shadow-md hover:shadow-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0b12]"
        >
          最初のアウトプットを追加する
        </NuxtLink>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16 text-gray-500 dark:text-white/40">
    <h2>マイルストーンが見つかりません</h2>
    <NuxtLink to="/" class="text-indigo-500">ダッシュボードに戻る</NuxtLink>
  </div>
</template>
