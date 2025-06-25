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
      admin_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          allow_rsvp: boolean
          created_at: string
          description: string | null
          event_date: string
          event_title: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          image_url: string | null
          is_featured: boolean
          rsvp_link: string | null
        }
        Insert: {
          allow_rsvp?: boolean
          created_at?: string
          description?: string | null
          event_date: string
          event_title: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          is_featured?: boolean
          rsvp_link?: string | null
        }
        Update: {
          allow_rsvp?: boolean
          created_at?: string
          description?: string | null
          event_date?: string
          event_title?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          is_featured?: boolean
          rsvp_link?: string | null
        }
        Relationships: []
      }
      guest_feedback: {
        Row: {
          ai_response: string | null
          consent_to_share: boolean
          created_at: string
          email: string | null
          feedback: string
          id: string
          name: string | null
          rating: number
          status: string
          visit_date: string
        }
        Insert: {
          ai_response?: string | null
          consent_to_share?: boolean
          created_at?: string
          email?: string | null
          feedback: string
          id?: string
          name?: string | null
          rating: number
          status?: string
          visit_date: string
        }
        Update: {
          ai_response?: string | null
          consent_to_share?: boolean
          created_at?: string
          email?: string | null
          feedback?: string
          id?: string
          name?: string | null
          rating?: number
          status?: string
          visit_date?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string | null
          id: string
          points: number
          reason: string | null
          source_referral_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          points: number
          reason?: string | null
          source_referral_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          points?: number
          reason?: string | null
          source_referral_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          is_special: boolean | null
          name: string
          price: number | null
          sort_order: number
          special_end_date: string | null
          special_start_date: string | null
          tags: string[] | null
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_special?: boolean | null
          name: string
          price?: number | null
          sort_order: number
          special_end_date?: string | null
          special_start_date?: string | null
          tags?: string[] | null
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_special?: boolean | null
          name?: string
          price?: number | null
          sort_order?: number
          special_end_date?: string | null
          special_start_date?: string | null
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
      mug_club_members: {
        Row: {
          active: boolean | null
          created_at: string | null
          engraved_name: string
          id: string
          joined_date: string
          renewal_date: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          engraved_name: string
          id?: string
          joined_date?: string
          renewal_date?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          engraved_name?: string
          id?: string
          joined_date?: string
          renewal_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      photo_booth_posts: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          caption: string
          created_at: string
          event_id: string | null
          id: string
          image_url: string
          status: string | null
          tags: string[] | null
          uploaded_by: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          caption: string
          created_at?: string
          event_id?: string | null
          id?: string
          image_url: string
          status?: string | null
          tags?: string[] | null
          uploaded_by: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          caption?: string
          created_at?: string
          event_id?: string | null
          id?: string
          image_url?: string
          status?: string | null
          tags?: string[] | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_booth_posts_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_booth_posts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_booth_uploads: {
        Row: {
          ai_caption_requested: boolean
          approved: boolean
          caption: string | null
          consent_to_share: boolean
          email: string
          first_name: string
          id: string
          image_url: string
          last_name: string
          uploaded_at: string
          user_name: string | null
        }
        Insert: {
          ai_caption_requested?: boolean
          approved?: boolean
          caption?: string | null
          consent_to_share?: boolean
          email?: string
          first_name?: string
          id?: string
          image_url: string
          last_name?: string
          uploaded_at?: string
          user_name?: string | null
        }
        Update: {
          ai_caption_requested?: boolean
          approved?: boolean
          caption?: string | null
          consent_to_share?: boolean
          email?: string
          first_name?: string
          id?: string
          image_url?: string
          last_name?: string
          uploaded_at?: string
          user_name?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          joined: boolean | null
          points_awarded: number | null
          referral_code: string | null
          referred_email: string
          referrer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          joined?: boolean | null
          points_awarded?: number | null
          referral_code?: string | null
          referred_email: string
          referrer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          joined?: boolean | null
          points_awarded?: number | null
          referral_code?: string | null
          referred_email?: string
          referrer_id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          email: string
          event_id: string | null
          full_name: string
          id: string
          notes: string | null
          party_size: number
          phone_number: string | null
          reservation_date: string
          reservation_type: Database["public"]["Enums"]["reservation_type"]
        }
        Insert: {
          created_at?: string
          email: string
          event_id?: string | null
          full_name: string
          id?: string
          notes?: string | null
          party_size: number
          phone_number?: string | null
          reservation_date: string
          reservation_type: Database["public"]["Enums"]["reservation_type"]
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          party_size?: number
          phone_number?: string | null
          reservation_date?: string
          reservation_type?: Database["public"]["Enums"]["reservation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "reservations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string | null
          user_email: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          referral_code?: string | null
          user_email?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string | null
          user_email?: string | null
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
      whiskey_room_members: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          joined_date: string
          personalized_locker: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          joined_date?: string
          personalized_locker?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          joined_date?: string
          personalized_locker?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
      event_type: "Live Music" | "Game Night" | "Specials"
      reservation_type: "Event" | "Table"
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
    Enums: {
      admin_role: ["super_admin", "admin", "moderator"],
      event_type: ["Live Music", "Game Night", "Specials"],
      reservation_type: ["Event", "Table"],
    },
  },
} as const
