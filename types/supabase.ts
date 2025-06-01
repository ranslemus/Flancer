export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client: {
        Row: {
          birthdate: string
          created_at: string
          full_name: string
          role: string
          user_id: string
        }
        Insert: {
          birthdate: string
          created_at?: string
          full_name: string
          role?: string
          user_id: string
        }
        Update: {
          birthdate?: string
          created_at?: string
          full_name?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      freelancer: {
        Row: {
          earnings: number | null
          jobs_finished: number | null
          ongoing_jobs: number | null
          services_id: string[] | null
          skills: string[] | null
          user_id: string
          rating: number
        }
        Insert: {
          earnings?: number | null
          jobs_finished?: number | null
          ongoing_jobs?: number | null
          services_id?: string[] | null
          skills?: string[] | null
          user_id: string
          rating: number
        }
        Update: {
          earnings?: number | null
          jobs_finished?: number | null
          ongoing_jobs?: number | null
          services_id?: string[] | null
          skills?: string[] | null
          user_id?: string
          rating: number
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "client"
            referencedColumns: ["user_id"]
          },
        ]
      }
      job: {
        Row: {
          client_id: string | null
          created_at: string
          deadline: string | null
          freelancer_id: string | null
          job_id: string
          payment: number
          service_id: string | null
          status: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          freelancer_id?: string | null
          job_id?: string
          payment?: number
          service_id?: string | null
          status?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          freelancer_id?: string | null
          job_id?: string
          payment?: number
          service_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "job_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "job_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "serviceList"
            referencedColumns: ["service_id"]
          },
        ]
      }
      serviceList: {
        Row: {
          category: string[] | null
          created_at: string
          freelancer_id: string
          price_range: number[] | null
          service_description: string | null
          service_id: string
          service_name: string | null
          service_pictures: string[] | null
        }
        Insert: {
          category?: string[] | null
          created_at?: string
          freelancer_id: string
          price_range?: number[] | null
          service_description?: string | null
          service_id?: string
          service_name?: string | null
          service_pictures?: string[] | null
        }
        Update: {
          category?: string[] | null
          created_at?: string
          freelancer_id?: string
          price_range?: number[] | null
          service_description?: string | null
          service_id?: string
          service_name?: string | null
          service_pictures?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "serviceList_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer"
            referencedColumns: ["user_id"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
