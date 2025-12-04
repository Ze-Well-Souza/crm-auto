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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          label: string | null
          latitude: number | null
          longitude: number | null
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at: string | null
          user_id: string
          zip_code: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at?: string | null
          user_id: string
          zip_code: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          updated_at?: string | null
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          department: string | null
          id: string
          last_activity: string | null
          permissions: Json | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          last_activity?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          last_activity?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string | null
          customer_id: string
          estimated_duration: number | null
          estimated_price: number | null
          final_price: number | null
          id: string
          notes: string | null
          partner_profile_id: string
          partner_service_id: string
          service_address: Json | null
          service_description: string | null
          service_type: string
          status: string | null
          updated_at: string | null
          vehicle_info: Json | null
        }
        Insert: {
          appointment_date: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          customer_id: string
          estimated_duration?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          notes?: string | null
          partner_profile_id: string
          partner_service_id: string
          service_address?: Json | null
          service_description?: string | null
          service_type: string
          status?: string | null
          updated_at?: string | null
          vehicle_info?: Json | null
        }
        Update: {
          appointment_date?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          customer_id?: string
          estimated_duration?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          notes?: string | null
          partner_profile_id?: string
          partner_service_id?: string
          service_address?: Json | null
          service_description?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string | null
          vehicle_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_partner_service_id_fkey"
            columns: ["partner_service_id"]
            isOneToOne: false
            referencedRelation: "partner_services"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_slots: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          establishment_id: string
          id: string
          is_active: boolean | null
          slot_duration: number | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          establishment_id: string
          id?: string
          is_active?: boolean | null
          slot_duration?: number | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          establishment_id?: string
          id?: string
          is_active?: boolean | null
          slot_duration?: number | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_availability_establishment"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_slots: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          establishment_id: string
          id: string
          reason: string | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          establishment_id: string
          id?: string
          reason?: string | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          establishment_id?: string
          id?: string
          reason?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_blocked_establishment"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          post_count: number
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          post_count?: number
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          post_count?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string
          author_id: string | null
          author_name: string
          content: string
          created_at: string
          id: string
          ip_address: string | null
          parent_id: string | null
          post_id: string
          status: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          author_email: string
          author_id?: string | null
          author_name: string
          content: string
          created_at?: string
          id?: string
          ip_address?: string | null
          parent_id?: string | null
          post_id: string
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          author_email?: string
          author_id?: string | null
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          parent_id?: string | null
          post_id?: string
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_size: number
          filename: string
          height: number | null
          id: string
          mime_type: string
          original_name: string
          thumbnail_url: string | null
          updated_at: string
          uploaded_by: string
          url: string
          used_in_posts: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_size: number
          filename: string
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by: string
          url: string
          used_in_posts?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_size?: number
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by?: string
          url?: string
          used_in_posts?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean
          author_id: string
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          external_links: string | null
          featured: boolean
          featured_image: string | null
          html_content: string | null
          id: string
          like_count: number
          published_at: string | null
          read_time: number | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          allow_comments?: boolean
          author_id: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          external_links?: string | null
          featured?: boolean
          featured_image?: string | null
          html_content?: string | null
          id?: string
          like_count?: number
          published_at?: string | null
          read_time?: number | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          allow_comments?: boolean
          author_id?: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          external_links?: string | null
          featured?: boolean
          featured_image?: string | null
          html_content?: string | null
          id?: string
          like_count?: number
          published_at?: string | null
          read_time?: number | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          customer_vehicle_info: Json | null
          id: string
          notes: string | null
          partner_id: string | null
          scheduled_at: string
          service_id: string
          status: string
          total_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_vehicle_info?: Json | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          scheduled_at: string
          service_id: string
          status?: string
          total_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_vehicle_info?: Json | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          scheduled_at?: string
          service_id?: string
          status?: string
          total_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_appointments: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client_id: string
          created_at: string
          estimated_duration: number | null
          estimated_value: number | null
          final_value: number | null
          id: string
          notes: string | null
          payment_intent_id: string | null
          payment_status: string | null
          scheduled_date: string
          scheduled_time: string
          service_description: string | null
          service_type: string
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
          vehicle_id: string | null
          vehicle_info: Json | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id: string
          created_at?: string
          estimated_duration?: number | null
          estimated_value?: number | null
          final_value?: number | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          scheduled_date: string
          scheduled_time: string
          service_description?: string | null
          service_type: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
          vehicle_info?: Json | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id?: string
          created_at?: string
          estimated_duration?: number | null
          estimated_value?: number | null
          final_value?: number | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          scheduled_date?: string
          scheduled_time?: string
          service_description?: string | null
          service_type?: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
          vehicle_info?: Json | null
        }
        Relationships: []
      }
      crm_chat_messages: {
        Row: {
          appointment_id: string | null
          content: string
          created_at: string
          establishment_id: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          receiver_id: string | null
          sender_id: string | null
          sender_name: string | null
          sender_type: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          content: string
          created_at?: string
          establishment_id?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          content?: string
          created_at?: string
          establishment_id?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          address: string | null
          city: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          partner_id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          partner_id: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          partner_id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_clients_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_email_log: {
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
      crm_financial_transactions: {
        Row: {
          amount: number
          category: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          description: string
          due_date: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          service_order_id: string | null
          status: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          service_order_id?: string | null
          status?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          service_order_id?: string | null
          status?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_fleet: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          last_service_date: string | null
          last_service_os: string | null
          last_service_type: string | null
          maintenance_status: string | null
          partner_id: string
          total_services: number | null
          total_spent: number | null
          updated_at: string | null
          vehicle_id: string
          vehicle_snapshot: Json | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          last_service_date?: string | null
          last_service_os?: string | null
          last_service_type?: string | null
          maintenance_status?: string | null
          partner_id: string
          total_services?: number | null
          total_spent?: number | null
          updated_at?: string | null
          vehicle_id: string
          vehicle_snapshot?: Json | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          last_service_date?: string | null
          last_service_os?: string | null
          last_service_type?: string | null
          maintenance_status?: string | null
          partner_id?: string
          total_services?: number | null
          total_spent?: number | null
          updated_at?: string | null
          vehicle_id?: string
          vehicle_snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_fleet_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_fleet_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_fleet_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "crm_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_parts: {
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
      crm_service_order_items: {
        Row: {
          created_at: string
          description: string
          discount: number | null
          id: string
          item_type: string
          notes: string | null
          part_id: string | null
          quantity: number
          service_order_id: string
          total: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          discount?: number | null
          id?: string
          item_type: string
          notes?: string | null
          part_id?: string | null
          quantity?: number
          service_order_id: string
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          discount?: number | null
          id?: string
          item_type?: string
          notes?: string | null
          part_id?: string | null
          quantity?: number
          service_order_id?: string
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_service_order_items_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "crm_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_service_order_items_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "crm_service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_service_orders: {
        Row: {
          appointment_id: string | null
          client_id: string
          completion_date: string | null
          created_at: string
          diagnosis: string | null
          id: string
          notes: string | null
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
          notes?: string | null
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
          notes?: string | null
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
            foreignKeyName: "crm_service_orders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "crm_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_service_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_service_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "crm_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movement_type: string
          notes: string | null
          part_id: string
          partner_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          total_cost: number | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          part_id: string
          partner_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          part_id?: string
          partner_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_stock_movements_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "crm_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_vehicles: {
        Row: {
          brand: string
          client_id: string | null
          color: string | null
          created_at: string | null
          engine: string | null
          fuel_type: string | null
          id: string
          mileage: number | null
          model: string
          notes: string | null
          partner_id: string
          photo_url: string | null
          plate: string
          updated_at: string | null
          vin: string | null
          year: number
        }
        Insert: {
          brand: string
          client_id?: string | null
          color?: string | null
          created_at?: string | null
          engine?: string | null
          fuel_type?: string | null
          id?: string
          mileage?: number | null
          model: string
          notes?: string | null
          partner_id: string
          photo_url?: string | null
          plate: string
          updated_at?: string | null
          vin?: string | null
          year: number
        }
        Update: {
          brand?: string
          client_id?: string | null
          color?: string | null
          created_at?: string | null
          engine?: string | null
          fuel_type?: string | null
          id?: string
          mileage?: number | null
          model?: string
          notes?: string | null
          partner_id?: string
          photo_url?: string | null
          plate?: string
          updated_at?: string | null
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_whatsapp_log: {
        Row: {
          error_message: string | null
          id: string
          message: string
          message_id: string | null
          partner_id: string
          recipient: string
          sent_at: string
          status: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          message: string
          message_id?: string | null
          partner_id: string
          recipient: string
          sent_at?: string
          status: string
        }
        Update: {
          error_message?: string | null
          id?: string
          message?: string
          message_id?: string | null
          partner_id?: string
          recipient?: string
          sent_at?: string
          status?: string
        }
        Relationships: []
      }
      establishments: {
        Row: {
          address: string | null
          application_id: string | null
          cnpj: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_approved: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          photos: Json | null
          search_vector: unknown
          services: Json | null
          type: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          application_id?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          photos?: Json | null
          search_vector?: unknown
          services?: Json | null
          type?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          application_id?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          photos?: Json | null
          search_vector?: unknown
          services?: Json | null
          type?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          establishment_id: string
          establishment_name: string
          id: string
          is_active: boolean
          notes: string | null
          service_id: string | null
          service_name: string | null
          tags: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          establishment_id: string
          establishment_name: string
          id?: string
          is_active?: boolean
          notes?: string | null
          service_id?: string | null
          service_name?: string | null
          tags?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          establishment_id?: string
          establishment_name?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          service_id?: string | null
          service_name?: string | null
          tags?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fila_de_tarefas: {
        Row: {
          created_at: string | null
          id: number
          payload: Json
          status: string | null
          tentativas: number | null
          tipo_tarefa: string
          ultima_falha: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          payload: Json
          status?: string | null
          tentativas?: number | null
          tipo_tarefa: string
          ultima_falha?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          payload?: Json
          status?: string | null
          tentativas?: number | null
          tipo_tarefa?: string
          ultima_falha?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          recipient_type: string | null
          target_value: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          recipient_type?: string | null
          target_value?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          recipient_type?: string | null
          target_value?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bairro: string
          categoria: string | null
          cep: string
          cidade: string
          cnpj: string
          complemento: string | null
          created_at: string | null
          descricao: string | null
          descricao_servicos: string | null
          email: string
          endereco: string
          estado: string
          id: string
          nome_fantasia: string
          numero: string
          onboarding_code: string | null
          razao_social: string
          rejection_reason: string | null
          responsavel_cargo: string | null
          responsavel_cpf: string | null
          responsavel_nome: string
          servicos_oferecidos: string | null
          status: string
          telefone: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bairro: string
          categoria?: string | null
          cep: string
          cidade: string
          cnpj: string
          complemento?: string | null
          created_at?: string | null
          descricao?: string | null
          descricao_servicos?: string | null
          email: string
          endereco: string
          estado: string
          id?: string
          nome_fantasia: string
          numero: string
          onboarding_code?: string | null
          razao_social: string
          rejection_reason?: string | null
          responsavel_cargo?: string | null
          responsavel_cpf?: string | null
          responsavel_nome: string
          servicos_oferecidos?: string | null
          status?: string
          telefone: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bairro?: string
          categoria?: string | null
          cep?: string
          cidade?: string
          cnpj?: string
          complemento?: string | null
          created_at?: string | null
          descricao?: string | null
          descricao_servicos?: string | null
          email?: string
          endereco?: string
          estado?: string
          id?: string
          nome_fantasia?: string
          numero?: string
          onboarding_code?: string | null
          razao_social?: string
          rejection_reason?: string | null
          responsavel_cargo?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string
          servicos_oferecidos?: string | null
          status?: string
          telefone?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      partner_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          partner_id: number
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          partner_id: number
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          partner_id?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_profiles: {
        Row: {
          application_id: string | null
          approved_at: string | null
          approved_by: string | null
          bank_info: Json | null
          business_address: string | null
          business_city: string | null
          business_complement: string | null
          business_email: string | null
          business_name: string
          business_neighborhood: string | null
          business_number: string | null
          business_phone: string | null
          business_state: string | null
          business_type: string | null
          business_zip_code: string | null
          category: string | null
          cnpj: string | null
          coordinates: Json | null
          created_at: string
          description: string | null
          documents: Json | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          is_verified: boolean | null
          latitude: number | null
          location: unknown
          longitude: number | null
          operating_hours: Json | null
          photos: Json | null
          rating: number | null
          razao_social: string | null
          responsavel_cargo: string | null
          responsavel_cpf: string | null
          responsavel_nome: string | null
          search_vector: unknown
          settings: Json | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          application_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_info?: Json | null
          business_address?: string | null
          business_city?: string | null
          business_complement?: string | null
          business_email?: string | null
          business_name: string
          business_neighborhood?: string | null
          business_number?: string | null
          business_phone?: string | null
          business_state?: string | null
          business_type?: string | null
          business_zip_code?: string | null
          category?: string | null
          cnpj?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          operating_hours?: Json | null
          photos?: Json | null
          rating?: number | null
          razao_social?: string | null
          responsavel_cargo?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          search_vector?: unknown
          settings?: Json | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          application_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_info?: Json | null
          business_address?: string | null
          business_city?: string | null
          business_complement?: string | null
          business_email?: string | null
          business_name?: string
          business_neighborhood?: string | null
          business_number?: string | null
          business_phone?: string | null
          business_state?: string | null
          business_type?: string | null
          business_zip_code?: string | null
          category?: string | null
          cnpj?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          operating_hours?: Json | null
          photos?: Json | null
          rating?: number | null
          razao_social?: string | null
          responsavel_cargo?: string | null
          responsavel_cpf?: string | null
          responsavel_nome?: string | null
          search_vector?: unknown
          settings?: Json | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_services: {
        Row: {
          category_id: string | null
          created_at: string
          custom_description: string | null
          description: string | null
          duration_min: number | null
          estimated_duration: number | null
          id: string
          is_available: boolean | null
          name: string | null
          partner_id: string
          partner_profile_id: string
          price: number
          service_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          custom_description?: string | null
          description?: string | null
          duration_min?: number | null
          estimated_duration?: number | null
          id?: string
          is_available?: boolean | null
          name?: string | null
          partner_id: string
          partner_profile_id: string
          price: number
          service_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          custom_description?: string | null
          description?: string | null
          duration_min?: number | null
          estimated_duration?: number | null
          id?: string
          is_available?: boolean | null
          name?: string | null
          partner_id?: string
          partner_profile_id?: string
          price?: number
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_services_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_services_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_subscriptions: {
        Row: {
          billing_cycle: string | null
          cancelled_at: string | null
          created_at: string
          current_appointments_count: number | null
          current_clients_count: number | null
          current_reports_count: number | null
          expires_at: string | null
          id: string
          next_billing_date: string | null
          notes: string | null
          partner_id: string
          plan_id: string
          started_at: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          usage_reset_at: string
        }
        Insert: {
          billing_cycle?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_appointments_count?: number | null
          current_clients_count?: number | null
          current_reports_count?: number | null
          expires_at?: string | null
          id?: string
          next_billing_date?: string | null
          notes?: string | null
          partner_id: string
          plan_id: string
          started_at?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          usage_reset_at?: string
        }
        Update: {
          billing_cycle?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_appointments_count?: number | null
          current_clients_count?: number | null
          current_reports_count?: number | null
          expires_at?: string | null
          id?: string
          next_billing_date?: string | null
          notes?: string | null
          partner_id?: string
          plan_id?: string
          started_at?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          usage_reset_at?: string
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
      payment_methods: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
          type: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
          type?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string | null
          currency: string
          description: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          method: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          method: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          method?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "crm_appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh_key: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh_key: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh_key?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: string | null
          comment: string | null
          created_at: string
          establishment_id: string
          helpful_votes: number | null
          id: string
          is_verified: boolean | null
          photos: Json | null
          rating: number
          report_count: number | null
          response_date: string | null
          response_from_establishment: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string
          establishment_id: string
          helpful_votes?: number | null
          id?: string
          is_verified?: boolean | null
          photos?: Json | null
          rating: number
          report_count?: number | null
          response_date?: string | null
          response_from_establishment?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string
          establishment_id?: string
          helpful_votes?: number | null
          id?: string
          is_verified?: boolean | null
          photos?: Json | null
          rating?: number
          report_count?: number | null
          response_date?: string | null
          response_from_establishment?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          level: number
          metadata: string | null
          name: string
          order_index: number
          parent_id: string | null
          search_vector: unknown
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: number
          metadata?: string | null
          name: string
          order_index?: number
          parent_id?: string | null
          search_vector?: unknown
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: number
          metadata?: string | null
          name?: string
          order_index?: number
          parent_id?: string | null
          search_vector?: unknown
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          max_uses: number | null
          metadata: Json | null
          name: string
          original_price: number
          package_price: number
          partner_id: string
          slug: string
          tags: string | null
          terms_and_conditions: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          name: string
          original_price: number
          package_price: number
          partner_id: string
          slug: string
          tags?: string | null
          terms_and_conditions?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          name?: string
          original_price?: number
          package_price?: number
          partner_id?: string
          slug?: string
          tags?: string | null
          terms_and_conditions?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          expire: string
          sess: Json
          sid: string
        }
        Insert: {
          expire: string
          sess: Json
          sid: string
        }
        Update: {
          expire?: string
          sess?: Json
          sid?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
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
      subscription_addon_purchases: {
        Row: {
          addon_id: string | null
          canceled_at: string | null
          created_at: string | null
          id: string
          started_at: string | null
          status: string | null
          stripe_subscription_item_id: string | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          addon_id?: string | null
          canceled_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          stripe_subscription_item_id?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          addon_id?: string | null
          canceled_at?: string | null
          created_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          stripe_subscription_item_id?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_addon_purchases_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "subscription_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_addon_purchases_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_addons: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          limit_value: number | null
          plan_name: string | null
          resource_count: number | null
          resource_type: string
          success: boolean | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          limit_value?: number | null
          plan_name?: string | null
          resource_count?: number | null
          resource_type: string
          success?: boolean | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          limit_value?: number | null
          plan_name?: string | null
          resource_count?: number | null
          resource_type?: string
          success?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_type: string | null
          discount_value: number
          duration: string | null
          duration_in_months: number | null
          id: string
          is_active: boolean | null
          max_redemptions: number | null
          stripe_coupon_id: string | null
          times_redeemed: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value: number
          duration?: string | null
          duration_in_months?: number | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          stripe_coupon_id?: string | null
          times_redeemed?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          duration?: string | null
          duration_in_months?: number | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          stripe_coupon_id?: string | null
          times_redeemed?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          event_type: string
          from_plan_id: string | null
          id: string
          metadata: Json | null
          reason: string | null
          subscription_id: string | null
          to_plan_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          event_type: string
          from_plan_id?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          subscription_id?: string | null
          to_plan_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          event_type?: string
          from_plan_id?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          subscription_id?: string | null
          to_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_from_plan_id_fkey"
            columns: ["from_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_history_to_plan_id_fkey"
            columns: ["to_plan_id"]
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
          features: Json
          id: string
          is_active: boolean | null
          max_active_clients: number | null
          max_appointments_per_month: number | null
          max_reports_per_month: number | null
          max_team_members: number | null
          name: string
          price_monthly: number
          price_yearly: number | null
          sort_order: number | null
          stripe_price_id_annual: string | null
          stripe_price_id_monthly: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          features?: Json
          id?: string
          is_active?: boolean | null
          max_active_clients?: number | null
          max_appointments_per_month?: number | null
          max_reports_per_month?: number | null
          max_team_members?: number | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          sort_order?: number | null
          stripe_price_id_annual?: string | null
          stripe_price_id_monthly?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          features?: Json
          id?: string
          is_active?: boolean | null
          max_active_clients?: number | null
          max_appointments_per_month?: number | null
          max_reports_per_month?: number | null
          max_team_members?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          sort_order?: number | null
          stripe_price_id_annual?: string | null
          stripe_price_id_monthly?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_usage_logs: {
        Row: {
          action_type: string
          id: string
          metadata: Json | null
          resource_id: string | null
          subscription_id: string
          timestamp: string
        }
        Insert: {
          action_type: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          subscription_id: string
          timestamp?: string
        }
        Update: {
          action_type?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          subscription_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_usage_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "partner_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          manual_override: boolean | null
          manual_override_at: string | null
          manual_override_by: string | null
          manual_override_reason: string | null
          metadata: Json | null
          partner_id: string
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          manual_override?: boolean | null
          manual_override_at?: string | null
          manual_override_by?: string | null
          manual_override_reason?: string | null
          metadata?: Json | null
          partner_id: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          manual_override?: boolean | null
          manual_override_at?: string | null
          manual_override_by?: string | null
          manual_override_reason?: string | null
          metadata?: Json | null
          partner_id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          appointment_reminders: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          promotions: boolean | null
          push_notifications: boolean | null
          reviews: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          updates: boolean | null
          user_id: string
          whatsapp_notifications: boolean | null
        }
        Insert: {
          appointment_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          promotions?: boolean | null
          push_notifications?: boolean | null
          reviews?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          updates?: boolean | null
          user_id: string
          whatsapp_notifications?: boolean | null
        }
        Update: {
          appointment_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          promotions?: boolean | null
          push_notifications?: boolean | null
          reviews?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          updates?: boolean | null
          user_id?: string
          whatsapp_notifications?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          complement: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          notification_preferences: Json | null
          number: string | null
          phone: string | null
          state: string | null
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          complement?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          notification_preferences?: Json | null
          number?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          complement?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notification_preferences?: Json | null
          number?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      user_vehicles: {
        Row: {
          brand: string
          color: string | null
          created_at: string | null
          engine: string | null
          fuel_type: string | null
          id: string
          mileage: number | null
          model: string
          notes: string | null
          photo_url: string | null
          plate: string
          updated_at: string | null
          user_id: string
          vin: string | null
          year: number
        }
        Insert: {
          brand: string
          color?: string | null
          created_at?: string | null
          engine?: string | null
          fuel_type?: string | null
          id?: string
          mileage?: number | null
          model: string
          notes?: string | null
          photo_url?: string | null
          plate: string
          updated_at?: string | null
          user_id: string
          vin?: string | null
          year: number
        }
        Update: {
          brand?: string
          color?: string | null
          created_at?: string | null
          engine?: string | null
          fuel_type?: string | null
          id?: string
          mileage?: number | null
          model?: string
          notes?: string | null
          photo_url?: string | null
          plate?: string
          updated_at?: string | null
          user_id?: string
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean | null
          first_name: string | null
          google_id: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          must_change_password: boolean | null
          password: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          google_id?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          must_change_password?: boolean | null
          password?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_type?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          google_id?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          must_change_password?: boolean | null
          password?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      vehicle_maintenance: {
        Row: {
          cost: number | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          mileage: number | null
          notes: string | null
          type: string
          updated_at: string | null
          user_id: string
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          mileage?: number | null
          notes?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          mileage?: number | null
          notes?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "user_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      approve_partner_application: {
        Args: { application_id: string; approver_id: string }
        Returns: string
      }
      autocomplete_services: {
        Args: { limit_count?: number; prefix: string }
        Returns: {
          id: string
          suggestion: string
          type: string
        }[]
      }
      check_subscription_limit: {
        Args: {
          p_current_count: number
          p_limit_type: string
          p_user_id: string
        }
        Returns: boolean
      }
      clean_expired_carts: { Args: never; Returns: number }
      create_default_partner_availability: {
        Args: { p_partner_id: number }
        Returns: undefined
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      executar_testes_sistema: { Args: never; Returns: Json }
      generate_onboarding_code: { Args: never; Returns: string }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      gerenciar_cron_job: {
        Args: { acao: string; job_name: string }
        Returns: boolean
      }
      get_active_packages: {
        Args: { limit_count?: number; p_partner_id?: string }
        Returns: {
          description: string
          discount_percentage: number
          name: string
          original_price: number
          package_id: string
          package_price: number
          services_count: number
          slug: string
        }[]
      }
      get_city_coordinates: {
        Args: { city_name: string; state_code: string }
        Returns: unknown
      }
      get_current_user_role: { Args: never; Returns: string }
      get_hourly_performance: {
        Args: never
        Returns: {
          concluidas: number
          falhadas: number
          hora: string
          taxa_sucesso_pct: number
          tempo_medio_processamento: number
          total_tarefas: number
        }[]
      }
      get_metrics_by_task_type: {
        Args: never
        Returns: {
          concluidas: number
          falhadas: number
          max_tentativas: number
          media_tentativas: number
          pendentes: number
          processando: number
          tempo_medio_processamento: number
          tipo_tarefa: string
          total: number
        }[]
      }
      get_partner_contact_info: {
        Args: { partner_id_param: number }
        Returns: {
          address: Json
          business_name: string
          email: string
          id: number
          phone: string
          services: string[]
          working_hours: Json
        }[]
      }
      get_partner_directory: {
        Args: never
        Returns: {
          average_rating: number
          business_name: string
          id: number
          is_available: boolean
          total_reviews: number
        }[]
      }
      get_partner_statistics: {
        Args: never
        Returns: {
          aprovado_em: string
          created_at: string
          documentos_aprovados: number
          id: number
          media_avaliacoes: number
          nome_empresa: string
          status: string
          total_avaliacoes: number
          total_documentos: number
          total_especialidades: number
        }[]
      }
      get_personalized_recommendations: {
        Args: { limit_count?: number; p_user_id: string }
        Returns: {
          base_price: number
          name: string
          reason: string
          recommendation_score: number
          service_id: string
          slug: string
        }[]
      }
      get_popular_services: {
        Args: { limit_count?: number }
        Returns: {
          base_price: number
          name: string
          popularity_score: number
          service_id: string
          slug: string
        }[]
      }
      get_problematic_tasks: {
        Args: never
        Returns: {
          created_at: string
          id: number
          payload: Json
          status: string
          tentativas: number
          tipo_tarefa: string
          ultima_falha: string
          updated_at: string
        }[]
      }
      get_public_partner_directory: {
        Args: never
        Returns: {
          average_rating: number
          business_name: string
          id: number
          is_available: boolean
          total_reviews: number
        }[]
      }
      get_task_queue_metrics: {
        Args: never
        Returns: {
          tarefas_concluidas: number
          tarefas_falhadas: number
          tarefas_pendentes: number
          tarefas_processando: number
          tarefas_ultima_hora: number
          tarefas_ultimo_dia: number
          tempo_medio_processamento_segundos: number
          total_tarefas: number
        }[]
      }
      get_user_role:
        | { Args: { user_id_param: string }; Returns: string }
        | { Args: never; Returns: Database["public"]["Enums"]["user_role"] }
      get_user_stats_by_type: { Args: never; Returns: Json }
      gettransactionid: { Args: never; Returns: unknown }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_image_usage: {
        Args: { image_uuid: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_partner_approved: { Args: { partner_id: number }; Returns: boolean }
      is_partner_available_at: {
        Args: { p_datetime: string; p_partner_id: number }
        Returns: boolean
      }
      is_partner_owner: { Args: { partner_id: number }; Returns: boolean }
      limpar_dados_antigos: { Args: { dias_retencao?: number }; Returns: Json }
      limpar_dados_teste: { Args: never; Returns: Json }
      longtransactionsenabled: { Args: never; Returns: boolean }
      obter_estatisticas_sistema: { Args: never; Returns: Json }
      populate_geometry_columns:
        | { Args: { use_typmod?: boolean }; Returns: string }
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      processar_fila_manual: { Args: never; Returns: Json }
      reject_partner_application: {
        Args: { application_id: string; reason: string; rejector_id: string }
        Returns: boolean
      }
      reprocessar_notificacoes_agendamento: {
        Args: { agendamento_id: number }
        Returns: boolean
      }
      reprocessar_tarefas_falhadas: { Args: { limite?: number }; Returns: Json }
      reset_subscription_usage: { Args: never; Returns: undefined }
      search_nearby_partners: {
        Args: {
          filter_category?: string
          lat: number
          lon: number
          radius_meters: number
        }
        Returns: {
          business_city: string
          business_email: string
          business_name: string
          business_state: string
          category: string
          dist_meters: number
          id: string
          location: unknown
          rating: number
        }[]
      }
      search_services: {
        Args: {
          limit_count?: number
          offset_count?: number
          search_query: string
        }
        Returns: {
          base_price: number
          description: string
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          rank: number
          slug: string
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_askml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geom: unknown }; Returns: number }
        | { Args: { geog: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      temp_disable_rls: { Args: never; Returns: undefined }
      temp_enable_rls: { Args: never; Returns: undefined }
      track_service_interaction: {
        Args: {
          p_interaction_type: string
          p_service_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      verificar_status_cron_jobs: {
        Args: never
        Returns: {
          active: boolean
          job_name: string
          last_run: string
          next_run: string
          schedule: string
        }[]
      }
    }
    Enums: {
      document_status: "pending" | "approved" | "rejected"
      document_type:
        | "cnpj"
        | "alvara"
        | "contrato_social"
        | "certificado_tecnico"
        | "seguro_responsabilidade"
        | "comprovante_endereco"
        | "foto_fachada"
        | "foto_interior"
        | "outros"
      service_order_status:
        | "draft"
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_role: "admin" | "partner" | "client"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
      document_status: ["pending", "approved", "rejected"],
      document_type: [
        "cnpj",
        "alvara",
        "contrato_social",
        "certificado_tecnico",
        "seguro_responsabilidade",
        "comprovante_endereco",
        "foto_fachada",
        "foto_interior",
        "outros",
      ],
      service_order_status: [
        "draft",
        "pending",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_role: ["admin", "partner", "client"],
    },
  },
} as const
