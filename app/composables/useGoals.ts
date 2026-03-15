import type { Database } from '~/types/database.types'
import type { Goal, Milestone, Output, OutputType, Status } from '~/types'

const nextStatus: Record<Status, Status> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
}

export function useGoals() {
  const client = useSupabaseClient<Database>()

  // --- Read ---
  const fetchGoals = async (): Promise<Goal[]> => {
    const { data, error } = await client
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Goal[]
  }

  const fetchGoalById = async (id: string): Promise<Goal | null> => {
    const { data, error } = await client
      .from('goals')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data as Goal
  }

  const fetchMilestoneById = async (id: string): Promise<Milestone | null> => {
    const { data, error } = await client
      .from('milestones')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data as Milestone
  }

  const fetchMilestonesByGoalId = async (goalId: string): Promise<Milestone[]> => {
    const { data, error } = await client
      .from('milestones')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data as Milestone[]
  }

  const fetchOutputsByMilestoneId = async (milestoneId: string): Promise<Output[]> => {
    const { data, error } = await client
      .from('outputs')
      .select('*')
      .eq('milestone_id', milestoneId)
      .order('activity_date', { ascending: false })
    if (error) throw error
    return data as Output[]
  }

  const fetchOutputById = async (id: string): Promise<Output | null> => {
    const { data, error } = await client
      .from('outputs')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data as Output
  }

  const fetchGoalProgress = async (goalId: string): Promise<number> => {
    const milestones = await fetchMilestonesByGoalId(goalId)
    if (milestones.length === 0) return 0
    const completed = milestones.filter((m) => m.status === 'completed').length
    return Math.round((completed / milestones.length) * 100)
  }

  // --- Create ---
  const addGoal = async (data: { title: string; description: string; deadline: string; reward: string }): Promise<Goal> => {
    const { data: goal, error } = await client
      .from('goals')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return goal as Goal
  }

  const addMilestone = async (data: { goal_id: string; title: string; description: string; deadline: string; reward: string }): Promise<Milestone> => {
    const { data: milestone, error } = await client
      .from('milestones')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return milestone as Milestone
  }

  const uploadFile = async (file: File, outputId: string): Promise<string> => {
    const ext = file.name.split('.').pop()
    const path = `${outputId}.${ext}`
    const { error } = await client.storage
      .from('outputs')
      .upload(path, file, { upsert: true })
    if (error) throw error
    const { data: urlData } = client.storage.from('outputs').getPublicUrl(path)
    return urlData.publicUrl
  }

  const addOutput = async (data: {
    milestone_id: string
    type: OutputType
    title: string
    description: string
    activity_date: string
    url?: string
    file?: File
  }): Promise<Output> => {
    const { file, ...insertData } = data
    const { data: output, error } = await client
      .from('outputs')
      .insert({
        ...insertData,
        file_name: file?.name ?? null,
      })
      .select()
      .single()
    if (error) throw error

    if (file) {
      const publicUrl = await uploadFile(file, output.id)
      await client.from('outputs').update({ url: publicUrl }).eq('id', output.id)
      output.url = publicUrl
    }

    return output as Output
  }

  // --- Update ---
  const updateGoal = async (id: string, data: Partial<Pick<Goal, 'title' | 'description' | 'deadline' | 'reward'>>) => {
    const { error } = await client
      .from('goals')
      .update(data)
      .eq('id', id)
    if (error) throw error
  }

  const updateMilestone = async (id: string, data: Partial<Pick<Milestone, 'title' | 'description' | 'deadline' | 'reward'>>) => {
    const { error } = await client
      .from('milestones')
      .update(data)
      .eq('id', id)
    if (error) throw error
  }

  const updateOutput = async (id: string, data: Partial<Pick<Output, 'title' | 'url' | 'description' | 'type' | 'file_name' | 'activity_date'>>) => {
    const { error } = await client
      .from('outputs')
      .update(data)
      .eq('id', id)
    if (error) throw error
  }

  // --- Delete (cascade handled by DB) ---
  const deleteGoal = async (id: string) => {
    const { error } = await client.from('goals').delete().eq('id', id)
    if (error) throw error
  }

  const deleteMilestone = async (id: string) => {
    const { error } = await client.from('milestones').delete().eq('id', id)
    if (error) throw error
  }

  const deleteOutput = async (id: string) => {
    const { error } = await client.from('outputs').delete().eq('id', id)
    if (error) throw error
  }

  // --- Status ---
  const toggleGoalStatus = async (id: string) => {
    const goal = await fetchGoalById(id)
    if (!goal) return
    const { error } = await client
      .from('goals')
      .update({ status: nextStatus[goal.status] })
      .eq('id', id)
    if (error) throw error
  }

  const toggleMilestoneStatus = async (id: string) => {
    const milestone = await fetchMilestoneById(id)
    if (!milestone) return
    const { error } = await client
      .from('milestones')
      .update({ status: nextStatus[milestone.status] })
      .eq('id', id)
    if (error) throw error
  }

  return {
    fetchGoals,
    fetchGoalById,
    fetchMilestoneById,
    fetchMilestonesByGoalId,
    fetchOutputsByMilestoneId,
    fetchOutputById,
    fetchGoalProgress,
    addGoal,
    addMilestone,
    addOutput,
    uploadFile,
    updateGoal,
    updateMilestone,
    updateOutput,
    deleteGoal,
    deleteMilestone,
    deleteOutput,
    toggleGoalStatus,
    toggleMilestoneStatus,
  }
}
