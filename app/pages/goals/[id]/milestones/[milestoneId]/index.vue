<script setup lang="ts">
const route = useRoute()
const { fetchGoalById, fetchMilestoneById, fetchOutputsByMilestoneId, toggleMilestoneStatus } = useGoals()

const goalId = route.params.id as string
const milestoneId = route.params.milestoneId as string

const { data: goal } = await useAsyncData(`goal-${goalId}`, () => fetchGoalById(goalId))
const { data: milestone, refresh: refreshMilestone } = await useAsyncData(`milestone-${milestoneId}`, () => fetchMilestoneById(milestoneId))
const { data: outputs } = await useAsyncData(`outputs-${milestoneId}`, () => fetchOutputsByMilestoneId(milestoneId))

useHead({
  title: computed(() => milestone.value ? `${milestone.value.title} | effort-memo` : 'effort-memo'),
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
    <div class="flex items-center gap-1.5 text-sm text-gray-400">
      <NuxtLink to="/" class="no-underline text-gray-400 hover:text-[#e94560]">ダッシュボード</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/goals/${goalId}`" class="no-underline text-gray-400 hover:text-[#e94560]">{{ goal.title }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-600">{{ milestone.title }}</span>
    </div>

    <!-- Milestone Header -->
    <div class="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-xl">
      <div class="flex items-center justify-between">
        <StatusBadge :status="milestone.status" />
        <div class="flex items-center gap-2">
          <NuxtLink
            :to="`/goals/${goalId}/milestones/${milestoneId}/edit`"
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

      <h1 class="m-0 text-2xl max-md:text-xl font-extrabold text-[#1a1a2e] text-balance">{{ milestone.title }}</h1>
      <p class="m-0 text-[15px] text-gray-600 leading-relaxed">{{ milestone.description }}</p>

      <div class="flex gap-6 flex-wrap">
        <div class="flex flex-col gap-0.5">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">期限</span>
          <span class="text-sm text-gray-700">📅 {{ formatDate(milestone.deadline) }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">作成日</span>
          <span class="text-sm text-gray-700">{{ formatDate(milestone.created_at) }}</span>
        </div>
      </div>

      <div v-if="milestone.reward" class="flex flex-col gap-1">
        <span class="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">達成ご褒美</span>
        <RewardBadge :reward="milestone.reward" />
      </div>
    </div>

    <!-- Outputs -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="m-0 text-lg font-bold text-[#1a1a2e]">アウトプット ({{ outputs?.length ?? 0 }})</h3>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/new`"
          class="px-3.5 py-1.5 text-[13px] bg-[#e94560] text-white font-semibold rounded-md no-underline transition-colors hover:bg-[#d63851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560] focus-visible:ring-offset-2"
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
      <div v-else class="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
        <p class="text-4xl mb-2">📝</p>
        <p class="text-sm">まだアウトプットがありません</p>
        <NuxtLink
          :to="`/goals/${goalId}/milestones/${milestoneId}/outputs/new`"
          class="inline-block mt-3 px-4 py-2 bg-[#e94560] text-white text-sm font-semibold rounded-lg no-underline transition-colors hover:bg-[#d63851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e94560] focus-visible:ring-offset-2"
        >
          最初のアウトプットを追加する
        </NuxtLink>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16 text-gray-500">
    <h2>マイルストーンが見つかりません</h2>
    <NuxtLink to="/" class="text-[#e94560]">ダッシュボードに戻る</NuxtLink>
  </div>
</template>
