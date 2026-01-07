export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      _archived_loyalty_points: {
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
      _archived_mug_club_members: {
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
      _archived_photo_booth_posts: {
        Row: {
          admin_notes: string | null
          approved: boolean
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
          approved?: boolean
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
          approved?: boolean
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
      _archived_photo_booth_uploads: {
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
      _archived_referrals: {
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
      _archived_reservations: {
        Row: {
          created_at: string
          email: string
          event_id: string | null
          full_name: string
          id: string
          notes: string | null
          party_size: number
          phone_number: string | null
          requires_confirmation: boolean | null
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
          requires_confirmation?: boolean | null
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
          requires_confirmation?: boolean | null
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
      _archived_social_posts: {
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
      _archived_user_profiles: {
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
      _archived_vip_applications: {
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
      _archived_whiskey_room_members: {
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
          location: string | null
          parent_event_id: string | null
          recurring_pattern: string | null
          rsvp_link: string | null
          status: string | null
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
          location?: string | null
          parent_event_id?: string | null
          recurring_pattern?: string | null
          rsvp_link?: string | null
          status?: string | null
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
          location?: string | null
          parent_event_id?: string | null
          recurring_pattern?: string | null
          rsvp_link?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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
      header_media: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          alt_text: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          section_name: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          section_name: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          section_name?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          description: string | null
          id: string
          is_visible: boolean
          name: string
          section_id: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          id?: string
          is_visible?: boolean
          name: string
          section_id: string
          sort_order: number
        }
        Update: {
          description?: string | null
          id?: string
          is_visible?: boolean
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
      site_settings: {
        Row: {
          id: number
          monthly_specials_label: string | null
          monthly_specials_url: string | null
          specials_end_date: string | null
          specials_start_date: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          monthly_specials_label?: string | null
          monthly_specials_url?: string | null
          specials_end_date?: string | null
          specials_start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          monthly_specials_label?: string | null
          monthly_specials_url?: string | null
          specials_end_date?: string | null
          specials_start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_scheduled_menu_items: { Args: never; Returns: undefined }
      get_admin_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      is_admin: { Args: { user_uuid: string }; Returns: boolean }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
      event_type:
        | "Live Music"
        | "Game Night"
        | "Specials"
        | "NCAA FB"
        | "Soccer"
        | "NBA"
        | "MLS"
        | "NWSL"
        | "Olympics"
        | "World Cup"
      reservation_type: "Event" | "Table"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "moderator"],
      event_type: [
        "Live Music",
        "Game Night",
        "Specials",
        "NCAA FB",
        "Soccer",
        "NBA",
        "MLS",
        "NWSL",
        "Olympics",
        "World Cup",
      ],
      reservation_type: ["Event", "Table"],
    },
  },
} as const
