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
      menu_categories: {
        Row: {
          description: string | null
          id: string
          name: string
          section_id: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          section_id: string
          sort_order: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          section_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "menu_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_addons: {
        Row: {
          id: string
          menu_item_id: string | null
          name: string
          price: number
          sort_order: number | null
        }
        Insert: {
          id?: string
          menu_item_id?: string | null
          name: string
          price: number
          sort_order?: number | null
        }
        Update: {
          id?: string
          menu_item_id?: string | null
          name?: string
          price?: number
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_addons_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_options: {
        Row: {
          additional_cost: number | null
          id: string
          is_default: boolean | null
          item_id: string
          option_label: string
        }
        Insert: {
          additional_cost?: number | null
          id?: string
          is_default?: boolean | null
          item_id: string
          option_label: string
        }
        Update: {
          additional_cost?: number | null
          id?: string
          is_default?: boolean | null
          item_id?: string
          option_label?: string
        }
        Relationships: []
      }
      menu_item_variants: {
        Row: {
          id: string
          menu_item_id: string | null
          name: string
          price: number
        }
        Insert: {
          id?: string
          menu_item_id?: string | null
          name: string
          price: number
        }
        Update: {
          id?: string
          menu_item_id?: string | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_variants_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category_id: string
          description: string | null
          id: string
          name: string
          price: number | null
          sort_order: number
          tags: string[] | null
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          name: string
          price?: number | null
          sort_order: number
          tags?: string[] | null
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          sort_order?: number
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_sections: {
        Row: {
          description: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      photo_booth_uploads: {
        Row: {
          approved: boolean
          caption: string | null
          consent_to_share: boolean
          id: string
          image_url: string
          uploaded_at: string
          user_name: string
        }
        Insert: {
          approved?: boolean
          caption?: string | null
          consent_to_share?: boolean
          id?: string
          image_url: string
          uploaded_at?: string
          user_name: string
        }
        Update: {
          approved?: boolean
          caption?: string | null
          consent_to_share?: boolean
          id?: string
          image_url?: string
          uploaded_at?: string
          user_name?: string
        }
        Relationships: []
      }
      sauces: {
        Row: {
          description: string | null
          id: string
          name: string
          price: number | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          price?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          caption: string | null
          created_at: string | null
          hashtag: string | null
          id: string
          image_url: string | null
          posted_at: string | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          hashtag?: string | null
          id?: string
          image_url?: string | null
          posted_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          hashtag?: string | null
          id?: string
          image_url?: string | null
          posted_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      vip_applications: {
        Row: {
          approved: boolean
          audience_size: number
          created_at: string
          email: string
          id: string
          name: string
          referral_code: string | null
          social_handle: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          audience_size: number
          created_at?: string
          email: string
          id?: string
          name: string
          referral_code?: string | null
          social_handle: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          audience_size?: number
          created_at?: string
          email?: string
          id?: string
          name?: string
          referral_code?: string | null
          social_handle?: string
          updated_at?: string
        }
        Relationships: []
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
