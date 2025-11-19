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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          estimated_price: number | null
          id: string
          notes: string | null
          partner_id: string
          reminder_sent: boolean | null
          scheduled_date: string
          scheduled_time: string
          service_type: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          estimated_price?: number | null
          id?: string
          notes?: string | null
          partner_id: string
          reminder_sent?: boolean | null
          scheduled_date: string
          scheduled_time: string
          service_type?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          estimated_price?: number | null
          id?: string
          notes?: string | null
          partner_id?: string
          reminder_sent?: boolean | null
          scheduled_date?: string
          scheduled_time?: string
          service_type?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          partner_id: string
          phone: string | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          partner_id: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          partner_id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      email_log: {
        Row: {
          error_message: string | null
          id: string
          partner_id: string
          recipient: string
          sent_at: string
          status: string
          subject: string
          template: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          partner_id: string
          recipient: string
          sent_at?: string
          status: string
          subject: string
          template?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          partner_id?: string
          recipient?: string
          sent_at?: string
          status?: string
          subject?: string
          template?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          due_date: string | null
          id: string
          notes: string | null
          partner_id: string
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference_id: string | null
          reference_type: Database["public"]["Enums"]["reference_type"] | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          notes?: string | null
          partner_id: string
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference_id?: string | null
          reference_type?: Database["public"]["Enums"]["reference_type"] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          partner_id?: string
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          reference_id?: string | null
          reference_type?: Database["public"]["Enums"]["reference_type"] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      partner_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string
          current_period_start: string
          current_usage: Json | null
          id: string
          partner_id: string
          plan_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          current_usage?: Json | null
          id?: string
          partner_id: string
          plan_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          current_usage?: Json | null
          id?: string
          partner_id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          brand: string | null
          category: string | null
          code: string
          cost_price: number | null
          created_at: string
          current_stock: number | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          max_stock: number | null
          min_stock: number | null
          name: string
          partner_id: string
          sale_price: number | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          code: string
          cost_price?: number | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          partner_id: string
          sale_price?: number | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          code?: string
          cost_price?: number | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          partner_id?: string
          sale_price?: number | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_order_items: {
        Row: {
          created_at: string
          description: string
          discount: number | null
          id: string
          part_id: string | null
          quantity: number
          service_order_id: string
          subtotal: number
          type: Database["public"]["Enums"]["service_order_item_type"]
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          discount?: number | null
          id?: string
          part_id?: string | null
          quantity?: number
          service_order_id: string
          subtotal: number
          type: Database["public"]["Enums"]["service_order_item_type"]
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          discount?: number | null
          id?: string
          part_id?: string | null
          quantity?: number
          service_order_id?: string
          subtotal?: number
          type?: Database["public"]["Enums"]["service_order_item_type"]
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_items_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          appointment_id: string | null
          client_id: string
          completion_date: string | null
          created_at: string
          diagnosis: string | null
          id: string
          order_number: string
          partner_id: string
          service_description: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["service_order_status"]
          total_amount: number | null
          total_discount: number | null
          total_labor: number | null
          total_parts: number | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          appointment_id?: string | null
          client_id: string
          completion_date?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          order_number: string
          partner_id: string
          service_description?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["service_order_status"]
          total_amount?: number | null
          total_discount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          appointment_id?: string | null
          client_id?: string
          completion_date?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          order_number?: string
          partner_id?: string
          service_description?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["service_order_status"]
          total_amount?: number | null
          total_discount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          cost_price: number | null
          created_at: string
          id: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes: string | null
          part_id: string
          quantity: number
          reference_id: string | null
          reference_type: Database["public"]["Enums"]["reference_type"]
        }
        Insert: {
          cost_price?: number | null
          created_at?: string
          id?: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          part_id: string
          quantity: number
          reference_id?: string | null
          reference_type: Database["public"]["Enums"]["reference_type"]
        }
        Update: {
          cost_price?: number | null
          created_at?: string
          id?: string
          movement_type?: Database["public"]["Enums"]["movement_type"]
          notes?: string | null
          part_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: Database["public"]["Enums"]["reference_type"]
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          attempts: number | null
          created_at: string | null
          error_message: string | null
          event_data: Json
          event_id: string
          event_type: string
          id: string
          next_retry_at: string | null
          processed_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          event_data: Json
          event_id: string
          event_type: string
          id?: string
          next_retry_at?: string | null
          processed_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          error_message?: string | null
          event_data?: Json
          event_id?: string
          event_type?: string
          id?: string
          next_retry_at?: string | null
          processed_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_audit_log: {
        Row: {
          action: Database["public"]["Enums"]["subscription_action"]
          created_at: string
          id: string
          metadata: Json | null
          new_plan_id: string | null
          old_plan_id: string | null
          partner_id: string
          reason: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["subscription_action"]
          created_at?: string
          id?: string
          metadata?: Json | null
          new_plan_id?: string | null
          old_plan_id?: string | null
          partner_id: string
          reason?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["subscription_action"]
          created_at?: string
          id?: string
          metadata?: Json | null
          new_plan_id?: string | null
          old_plan_id?: string | null
          partner_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_audit_log_new_plan_id_fkey"
            columns: ["new_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_audit_log_old_plan_id_fkey"
            columns: ["old_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          features: Json | null
          id: string
          is_active: boolean
          max_appointments: number
          max_clients: number
          max_service_orders: number
          max_users: number
          name: string
          price_monthly: number
          price_yearly: number
          sort_order: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_appointments?: number
          max_clients?: number
          max_service_orders?: number
          max_users?: number
          name: string
          price_monthly?: number
          price_yearly?: number
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_appointments?: number
          max_clients?: number
          max_service_orders?: number
          max_users?: number
          name?: string
          price_monthly?: number
          price_yearly?: number
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          chassis: string | null
          client_id: string
          color: string | null
          created_at: string
          id: string
          model: string
          notes: string | null
          partner_id: string
          plate: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          brand: string
          chassis?: string | null
          client_id: string
          color?: string | null
          created_at?: string
          id?: string
          model: string
          notes?: string | null
          partner_id: string
          plate?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          brand?: string
          chassis?: string | null
          client_id?: string
          color?: string | null
          created_at?: string
          id?: string
          model?: string
          notes?: string | null
          partner_id?: string
          plate?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_log: {
        Row: {
          error_message: string | null
          id: string
          message: string
          partner_id: string
          phone: string
          sent_at: string
          status: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          message: string
          partner_id: string
          phone: string
          sent_at?: string
          status: string
        }
        Update: {
          error_message?: string | null
          id?: string
          message?: string
          partner_id?: string
          phone?: string
          sent_at?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "user" | "admin" | "super_admin"
      appointment_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      movement_type: "entry" | "exit" | "adjustment"
      payment_method:
        | "cash"
        | "credit_card"
        | "debit_card"
        | "pix"
        | "bank_transfer"
        | "other"
      reference_type:
        | "purchase"
        | "sale"
        | "service_order"
        | "adjustment"
        | "other"
      service_order_item_type: "service" | "part"
      service_order_status:
        | "draft"
        | "in_progress"
        | "waiting_parts"
        | "waiting_approval"
        | "completed"
        | "cancelled"
      subscription_action:
        | "created"
        | "upgraded"
        | "downgraded"
        | "cancelled"
        | "expired"
        | "renewed"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "cancelled"
        | "expired"
      transaction_status: "pending" | "completed" | "cancelled"
      transaction_type: "income" | "expense"
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
      app_role: ["user", "admin", "super_admin"],
      appointment_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      movement_type: ["entry", "exit", "adjustment"],
      payment_method: [
        "cash",
        "credit_card",
        "debit_card",
        "pix",
        "bank_transfer",
        "other",
      ],
      reference_type: [
        "purchase",
        "sale",
        "service_order",
        "adjustment",
        "other",
      ],
      service_order_item_type: ["service", "part"],
      service_order_status: [
        "draft",
        "in_progress",
        "waiting_parts",
        "waiting_approval",
        "completed",
        "cancelled",
      ],
      subscription_action: [
        "created",
        "upgraded",
        "downgraded",
        "cancelled",
        "expired",
        "renewed",
      ],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "cancelled",
        "expired",
      ],
      transaction_status: ["pending", "completed", "cancelled"],
      transaction_type: ["income", "expense"],
    },
  },
} as const
