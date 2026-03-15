export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      goals: {
        Row: {
          created_at: string
          deadline: string
          description: string
          id: string
          reward: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          deadline: string
          description?: string
          id?: string
          reward?: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          deadline?: string
          description?: string
          id?: string
          reward?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string
          deadline: string
          description: string
          goal_id: string
          id: string
          reward: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          deadline: string
          description?: string
          goal_id: string
          id?: string
          reward?: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          deadline?: string
          description?: string
          goal_id?: string
          id?: string
          reward?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      outputs: {
        Row: {
          created_at: string
          description: string
          file_name: string | null
          id: string
          milestone_id: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          file_name?: string | null
          id?: string
          milestone_id: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          file_name?: string | null
          id?: string
          milestone_id?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outputs_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
