export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_selected_assets: {
        Row: {
          id: string
          user_id: string
          asset_identifier: string
          asset_type: string | null
          asset_name: string | null
          notes: string | null
          selected_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset_identifier: string
          asset_type?: string | null
          asset_name?: string | null
          notes?: string | null
          selected_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_identifier?: string
          asset_type?: string | null
          asset_name?: string | null
          notes?: string | null
          selected_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price: number
          interval: string
          stripe_price_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          interval: string
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          interval?: string
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status: string
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
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