export type OutputType = 'memo' | 'file'
export type Status = 'not_started' | 'in_progress' | 'completed'

export interface Goal {
  id: string
  title: string
  description: string
  deadline: string
  reward: string
  status: Status
  created_at: string
}

export interface Milestone {
  id: string
  goal_id: string
  title: string
  description: string
  deadline: string
  reward: string
  status: Status
  created_at: string
}

export interface Output {
  id: string
  milestone_id: string
  type: OutputType
  url: string | null
  file_name: string | null
  title: string
  description: string
  activity_date: string
  created_at: string
}
