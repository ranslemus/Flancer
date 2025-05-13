export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          user_type: string
          avatar_url: string | null
          title: string | null
          bio: string | null
          location: string | null
          hourly_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          user_type: string
          avatar_url?: string | null
          title?: string | null
          bio?: string | null
          location?: string | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_type?: string
          avatar_url?: string | null
          title?: string | null
          bio?: string | null
          location?: string | null
          hourly_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
        }
        Insert: {
          id?: string
          name: string
          category: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
        }
        Relationships: []
      }
      freelancer_skills: {
        Row: {
          id: string
          freelancer_id: string
          skill_id: string
          years_experience: number | null
        }
        Insert: {
          id?: string
          freelancer_id: string
          skill_id: string
          years_experience?: number | null
        }
        Update: {
          id?: string
          freelancer_id?: string
          skill_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_skills_freelancer_id_fkey"
            columns: ["freelancer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelancer_skills_skill_id_fkey"
            columns: ["skill_id"]
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          id: string
          title: string
          description: string
          client_id: string
          budget_min: number | null
          budget_max: number | null
          status: string
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          client_id: string
          budget_min?: number | null
          budget_max?: number | null
          status?: string
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          client_id?: string
          budget_min?: number | null
          budget_max?: number | null
          status?: string
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          id: string
          job_id: string
          skill_id: string
        }
        Insert: {
          id?: string
          job_id: string
          skill_id: string
        }
        Update: {
          id?: string
          job_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          freelancer_id: string
          proposal: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          freelancer_id: string
          proposal: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          freelancer_id?: string
          proposal?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_freelancer_id_fkey"
            columns: ["freelancer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          job_id: string
          freelancer_id: string
          client_id: string
          status: string
          progress: number | null
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          freelancer_id: string
          client_id: string
          status?: string
          progress?: number | null
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          freelancer_id?: string
          client_id?: string
          status?: string
          progress?: number | null
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_freelancer_id_fkey"
            columns: ["freelancer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          due_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
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
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Job = Database["public"]["Tables"]["jobs"]["Row"]
export type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"]
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type Milestone = Database["public"]["Tables"]["milestones"]["Row"]
export type Skill = Database["public"]["Tables"]["skills"]["Row"]
export type FreelancerSkill = Database["public"]["Tables"]["freelancer_skills"]["Row"]
