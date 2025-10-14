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
      agendamentos: {
        Row: {
          cancelado_em: string | null
          cancelado_por: string | null
          created_at: string | null
          data_agendamento: string
          duracao_estimada: number | null
          endereco_atendimento: Json | null
          id: string
          motivo_cancelamento: string | null
          observacoes: string | null
          parceiro_id: number | null
          servico_descricao: string | null
          servico_tipo: string
          status: string | null
          updated_at: string | null
          usuario_id: string | null
          valor_estimado: number | null
          valor_final: number | null
          veiculo_info: Json | null
        }
        Insert: {
          cancelado_em?: string | null
          cancelado_por?: string | null
          created_at?: string | null
          data_agendamento: string
          duracao_estimada?: number | null
          endereco_atendimento?: Json | null
          id?: string
          motivo_cancelamento?: string | null
          observacoes?: string | null
          parceiro_id?: number | null
          servico_descricao?: string | null
          servico_tipo: string
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          valor_estimado?: number | null
          valor_final?: number | null
          veiculo_info?: Json | null
        }
        Update: {
          cancelado_em?: string | null
          cancelado_por?: string | null
          created_at?: string | null
          data_agendamento?: string
          duracao_estimada?: number | null
          endereco_atendimento?: Json | null
          id?: string
          motivo_cancelamento?: string | null
          observacoes?: string | null
          parceiro_id?: number | null
          servico_descricao?: string | null
          servico_tipo?: string
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          valor_estimado?: number | null
          valor_final?: number | null
          veiculo_info?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
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
          scheduled_date: string
          scheduled_time: string
          service_description: string | null
          service_type: string
          status: string | null
          updated_at: string
          vehicle_id: string | null
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
          scheduled_date: string
          scheduled_time: string
          service_description?: string | null
          service_type: string
          status?: string | null
          updated_at?: string
          vehicle_id?: string | null
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
          scheduled_date?: string
          scheduled_time?: string
          service_description?: string | null
          service_type?: string
          status?: string | null
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
      chat_messages: {
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
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
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
          scheduled_date: string
          scheduled_time: string
          service_description: string | null
          service_type: string
          status: string | null
          updated_at: string
          vehicle_id: string | null
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
          scheduled_date: string
          scheduled_time: string
          service_description?: string | null
          service_type: string
          status?: string | null
          updated_at?: string
          vehicle_id?: string | null
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
          scheduled_date?: string
          scheduled_time?: string
          service_description?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "crm_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          address: string | null
          city: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
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
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
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
        }
        Relationships: [
          {
            foreignKeyName: "crm_financial_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_financial_transactions_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "crm_service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_parts: {
        Row: {
          active: boolean | null
          brand: string | null
          category: string | null
          code: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          max_stock: number | null
          min_stock: number | null
          name: string
          sale_price: number | null
          stock_quantity: number | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          brand?: string | null
          category?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          sale_price?: number | null
          stock_quantity?: number | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          brand?: string | null
          category?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          sale_price?: number | null
          stock_quantity?: number | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_parts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "crm_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_payment_methods: {
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
      crm_service_orders: {
        Row: {
          client_id: string
          created_at: string
          delivered_at: string | null
          description: string | null
          discount: number | null
          finished_at: string | null
          id: string
          mechanic_id: string | null
          notes: string | null
          order_number: string
          started_at: string | null
          status: string | null
          total_amount: number | null
          total_labor: number | null
          total_parts: number | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          delivered_at?: string | null
          description?: string | null
          discount?: number | null
          finished_at?: string | null
          id?: string
          mechanic_id?: string | null
          notes?: string | null
          order_number: string
          started_at?: string | null
          status?: string | null
          total_amount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          delivered_at?: string | null
          description?: string | null
          discount?: number | null
          finished_at?: string | null
          id?: string
          mechanic_id?: string | null
          notes?: string | null
          order_number?: string
          started_at?: string | null
          status?: string | null
          total_amount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
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
      crm_suppliers: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          cnpj: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      crm_vehicles: {
        Row: {
          brand: string
          client_id: string
          color: string | null
          created_at: string
          engine: string | null
          fuel_type: string | null
          id: string
          license_plate: string | null
          mileage: number | null
          model: string
          notes: string | null
          updated_at: string
          vin: string | null
          year: number | null
        }
        Insert: {
          brand: string
          client_id: string
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string | null
          mileage?: number | null
          model: string
          notes?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          client_id?: string
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string | null
          mileage?: number | null
          model?: string
          notes?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_vehicles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          address: string | null
          city: string | null
          cpf: string | null
          created_at: string
          date_of_birth: string | null
          id: string
          loyalty_points: number | null
          preferred_services: Json | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          loyalty_points?: number | null
          preferred_services?: Json | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          loyalty_points?: number | null
          preferred_services?: Json | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_configurations: {
        Row: {
          created_at: string
          email: string
          from_name: string | null
          id: string
          is_active: boolean | null
          provider: string
          smtp_host: string
          smtp_password_encrypted: string
          smtp_port: number
          smtp_secure: boolean | null
          smtp_username: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          smtp_host: string
          smtp_password_encrypted: string
          smtp_port: number
          smtp_secure?: boolean | null
          smtp_username: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          smtp_host?: string
          smtp_password_encrypted?: string
          smtp_port?: number
          smtp_secure?: boolean | null
          smtp_username?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          body: string
          created_at: string | null
          email_type: string | null
          error_message: string | null
          id: string
          partner_id: number | null
          sent_at: string | null
          status: string
          subject: string
          to_email: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          email_type?: string | null
          error_message?: string | null
          id?: string
          partner_id?: number | null
          sent_at?: string | null
          status?: string
          subject: string
          to_email: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          email_type?: string | null
          error_message?: string | null
          id?: string
          partner_id?: number | null
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
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
          services?: Json | null
          type?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "partner_applications_old"
            referencedColumns: ["id"]
          },
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
      financial_transactions: {
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
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      image_collections: {
        Row: {
          cover_image_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_count: number | null
          is_public: boolean | null
          name: string
          total_size: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_image_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_count?: number | null
          is_public?: boolean | null
          name: string
          total_size?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_image_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_count?: number | null
          is_public?: boolean | null
          name?: string
          total_size?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      image_library: {
        Row: {
          alt_text: string | null
          category: string | null
          collection_id: string | null
          created_at: string | null
          description: string | null
          dominant_colors: Json | null
          external_url: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          height: number | null
          id: string
          is_favorite: boolean | null
          is_public: boolean | null
          last_used_at: string | null
          storage_type: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          category?: string | null
          collection_id?: string | null
          created_at?: string | null
          description?: string | null
          dominant_colors?: Json | null
          external_url?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          height?: number | null
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          last_used_at?: string | null
          storage_type: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          category?: string | null
          collection_id?: string | null
          created_at?: string | null
          description?: string | null
          dominant_colors?: Json | null
          external_url?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          height?: number | null
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          last_used_at?: string | null
          storage_type?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "image_library_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "image_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      image_templates: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          name: string
          preview_image: string | null
          template_data: Json
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          name: string
          preview_image?: string | null
          template_data: Json
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string
          preview_image?: string | null
          template_data?: Json
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      image_usage_log: {
        Row: {
          id: string
          image_id: string
          reference_id: string | null
          usage_context: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          image_id: string
          reference_id?: string | null
          usage_context: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          image_id?: string
          reference_id?: string | null
          usage_context?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_usage_log_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_library"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_comparisons: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_shared: boolean
          item_ids: Json
          name: string | null
          notes: string | null
          share_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_shared?: boolean
          item_ids: Json
          name?: string | null
          notes?: string | null
          share_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_shared?: boolean
          item_ids?: Json
          name?: string | null
          notes?: string | null
          share_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
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
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          agendamento_id: string | null
          created_at: string | null
          descricao: string | null
          erro_detalhes: string | null
          id: string
          metadata: Json | null
          metodo_pagamento: string | null
          moeda: string | null
          parceiro_id: number | null
          processado_em: string | null
          status: string | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          taxa_plataforma: number | null
          updated_at: string | null
          usuario_id: string | null
          valor: number
          valor_parceiro: number | null
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string | null
          descricao?: string | null
          erro_detalhes?: string | null
          id?: string
          metadata?: Json | null
          metodo_pagamento?: string | null
          moeda?: string | null
          parceiro_id?: number | null
          processado_em?: string | null
          status?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          taxa_plataforma?: number | null
          updated_at?: string | null
          usuario_id?: string | null
          valor: number
          valor_parceiro?: number | null
        }
        Update: {
          agendamento_id?: string | null
          created_at?: string | null
          descricao?: string | null
          erro_detalhes?: string | null
          id?: string
          metadata?: Json | null
          metodo_pagamento?: string | null
          moeda?: string | null
          parceiro_id?: number | null
          processado_em?: string | null
          status?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          taxa_plataforma?: number | null
          updated_at?: string | null
          usuario_id?: string | null
          valor?: number
          valor_parceiro?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiro_audit_log: {
        Row: {
          acao: string
          created_at: string | null
          id: number
          observacoes: string | null
          parceiro_id: number
          status_anterior: string | null
          status_novo: string | null
          usuario_responsavel: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          id?: number
          observacoes?: string | null
          parceiro_id: number
          status_anterior?: string | null
          status_novo?: string | null
          usuario_responsavel?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          id?: number
          observacoes?: string | null
          parceiro_id?: number
          status_anterior?: string | null
          status_novo?: string | null
          usuario_responsavel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parceiro_audit_log_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiro_avaliacoes: {
        Row: {
          agendamento_id: string | null
          cliente_id: string
          comentario: string | null
          created_at: string | null
          id: number
          nota_atendimento: number | null
          nota_geral: number | null
          nota_pontualidade: number | null
          nota_qualidade: number | null
          parceiro_id: number
        }
        Insert: {
          agendamento_id?: string | null
          cliente_id: string
          comentario?: string | null
          created_at?: string | null
          id?: number
          nota_atendimento?: number | null
          nota_geral?: number | null
          nota_pontualidade?: number | null
          nota_qualidade?: number | null
          parceiro_id: number
        }
        Update: {
          agendamento_id?: string | null
          cliente_id?: string
          comentario?: string | null
          created_at?: string | null
          id?: number
          nota_atendimento?: number | null
          nota_geral?: number | null
          nota_pontualidade?: number | null
          nota_qualidade?: number | null
          parceiro_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parceiro_avaliacoes_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiro_documentos: {
        Row: {
          id: number
          nome_arquivo: string
          observacoes: string | null
          parceiro_id: number
          status: string | null
          tipo_documento: string
          uploaded_at: string | null
          url_arquivo: string
          verified_at: string | null
        }
        Insert: {
          id?: number
          nome_arquivo: string
          observacoes?: string | null
          parceiro_id: number
          status?: string | null
          tipo_documento: string
          uploaded_at?: string | null
          url_arquivo: string
          verified_at?: string | null
        }
        Update: {
          id?: number
          nome_arquivo?: string
          observacoes?: string | null
          parceiro_id?: number
          status?: string | null
          tipo_documento?: string
          uploaded_at?: string | null
          url_arquivo?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parceiro_documentos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiro_especialidades: {
        Row: {
          anos_experiencia: number | null
          certificacao_url: string | null
          created_at: string | null
          especialidade: string
          id: number
          parceiro_id: number
        }
        Insert: {
          anos_experiencia?: number | null
          certificacao_url?: string | null
          created_at?: string | null
          especialidade: string
          id?: number
          parceiro_id: number
        }
        Update: {
          anos_experiencia?: number | null
          certificacao_url?: string | null
          created_at?: string | null
          especialidade?: string
          id?: number
          parceiro_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "parceiro_especialidades_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiros: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          ativo: boolean | null
          auth_id: string | null
          cnpj: string | null
          coordenadas: unknown | null
          created_at: string | null
          documentos: Json | null
          email: string | null
          endereco: Json
          foto_perfil_url: string | null
          horario_funcionamento: Json | null
          id: number
          nome: string | null
          nome_empresa: string
          nota_media_avaliacoes: number | null
          servicos_oferecidos: string[] | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          ativo?: boolean | null
          auth_id?: string | null
          cnpj?: string | null
          coordenadas?: unknown | null
          created_at?: string | null
          documentos?: Json | null
          email?: string | null
          endereco: Json
          foto_perfil_url?: string | null
          horario_funcionamento?: Json | null
          id?: never
          nome?: string | null
          nome_empresa: string
          nota_media_avaliacoes?: number | null
          servicos_oferecidos?: string[] | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          ativo?: boolean | null
          auth_id?: string | null
          cnpj?: string | null
          coordenadas?: unknown | null
          created_at?: string | null
          documentos?: Json | null
          email?: string | null
          endereco?: Json
          foto_perfil_url?: string | null
          horario_funcionamento?: Json | null
          id?: never
          nome?: string | null
          nome_empresa?: string
          nota_media_avaliacoes?: number | null
          servicos_oferecidos?: string[] | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cnpj: string
          created_at: string | null
          email: string
          id: string
          nome_fantasia: string
          onboarding_code: string | null
          razao_social: string
          rejection_reason: string | null
          responsavel_nome: string
          status: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cnpj: string
          created_at?: string | null
          email: string
          id?: string
          nome_fantasia: string
          onboarding_code?: string | null
          razao_social: string
          rejection_reason?: string | null
          responsavel_nome: string
          status?: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cnpj?: string
          created_at?: string | null
          email?: string
          id?: string
          nome_fantasia?: string
          onboarding_code?: string | null
          razao_social?: string
          rejection_reason?: string | null
          responsavel_nome?: string
          status?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_applications_old: {
        Row: {
          address: string
          category: string
          city: string
          cnpj: string
          created_at: string
          establishment_name: string
          id: string
          owner_email: string
          owner_name: string
          owner_phone: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          state: string
          status: string | null
          updated_at: string
          zip_code: string
        }
        Insert: {
          address: string
          category: string
          city: string
          cnpj: string
          created_at?: string
          establishment_name: string
          id?: string
          owner_email: string
          owner_name: string
          owner_phone: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state: string
          status?: string | null
          updated_at?: string
          zip_code: string
        }
        Update: {
          address?: string
          category?: string
          city?: string
          cnpj?: string
          created_at?: string
          establishment_name?: string
          id?: string
          owner_email?: string
          owner_name?: string
          owner_phone?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string
          status?: string | null
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_documents: {
        Row: {
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
          partner_id: number
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
          upload_date: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          partner_id: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          upload_date?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          partner_id?: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          upload_date?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_documents_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_profiles: {
        Row: {
          bank_info: Json | null
          business_address: string | null
          business_city: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          business_state: string | null
          business_type: string | null
          business_zip_code: string | null
          cnpj: string | null
          coordinates: Json | null
          created_at: string
          documents: Json | null
          id: string
          is_approved: boolean | null
          is_verified: boolean | null
          operating_hours: Json | null
          rating: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_info?: Json | null
          business_address?: string | null
          business_city?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          business_state?: string | null
          business_type?: string | null
          business_zip_code?: string | null
          cnpj?: string | null
          coordinates?: Json | null
          created_at?: string
          documents?: Json | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          operating_hours?: Json | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_info?: Json | null
          business_address?: string | null
          business_city?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          business_state?: string | null
          business_type?: string | null
          business_zip_code?: string | null
          cnpj?: string | null
          coordinates?: Json | null
          created_at?: string
          documents?: Json | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          operating_hours?: Json | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
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
          created_at: string
          custom_description: string | null
          estimated_duration: number | null
          id: string
          is_available: boolean | null
          partner_id: string
          price: number
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_description?: string | null
          estimated_duration?: number | null
          id?: string
          is_available?: boolean | null
          partner_id: string
          price: number
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_description?: string | null
          estimated_duration?: number | null
          id?: string
          is_available?: boolean | null
          partner_id?: string
          price?: number
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_services_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
      parts: {
        Row: {
          active: boolean | null
          brand: string | null
          category: string | null
          code: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          max_stock: number | null
          min_stock: number | null
          name: string
          sale_price: number | null
          stock_quantity: number | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          brand?: string | null
          category?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          sale_price?: number | null
          stock_quantity?: number | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          brand?: string | null
          category?: string | null
          code?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          sale_price?: number | null
          stock_quantity?: number | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parts_supplier_id_fkey1"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
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
            referencedRelation: "agendamentos"
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
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_orders: {
        Row: {
          client_id: string
          created_at: string
          delivered_at: string | null
          description: string | null
          discount: number | null
          finished_at: string | null
          id: string
          mechanic_id: string | null
          notes: string | null
          order_number: string | null
          started_at: string | null
          status: string | null
          total_amount: number | null
          total_labor: number | null
          total_parts: number | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          delivered_at?: string | null
          description?: string | null
          discount?: number | null
          finished_at?: string | null
          id?: string
          mechanic_id?: string | null
          notes?: string | null
          order_number?: string | null
          started_at?: string | null
          status?: string | null
          total_amount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          delivered_at?: string | null
          description?: string | null
          discount?: number | null
          finished_at?: string | null
          id?: string
          mechanic_id?: string | null
          notes?: string | null
          order_number?: string | null
          started_at?: string | null
          status?: string | null
          total_amount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_client_id_fkey1"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vehicle_id_fkey1"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number | null
          category_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
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
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movement_type: string
          notes: string | null
          part_id: string
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
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          total_cost?: number | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_part_id_fkey1"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
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
      suppliers: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          cnpj: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
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
          password?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string
          email_verificado: boolean | null
          endereco: Json | null
          foto_perfil: string | null
          id: string
          metadata: Json | null
          nome: string
          preferencias: Json | null
          telefone: string | null
          telefone_verificado: boolean | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email: string
          email_verificado?: boolean | null
          endereco?: Json | null
          foto_perfil?: string | null
          id: string
          metadata?: Json | null
          nome: string
          preferencias?: Json | null
          telefone?: string | null
          telefone_verificado?: boolean | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string
          email_verificado?: boolean | null
          endereco?: Json | null
          foto_perfil?: string | null
          id?: string
          metadata?: Json | null
          nome?: string
          preferencias?: Json | null
          telefone?: string | null
          telefone_verificado?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          client_id: string
          color: string | null
          created_at: string
          engine: string | null
          fuel_type: string | null
          id: string
          license_plate: string | null
          mileage: number | null
          model: string
          notes: string | null
          updated_at: string
          vin: string | null
          year: number | null
        }
        Insert: {
          brand: string
          client_id: string
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string | null
          mileage?: number | null
          model: string
          notes?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          client_id?: string
          color?: string | null
          created_at?: string
          engine?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string | null
          mileage?: number | null
          model?: string
          notes?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_client_id_fkey1"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          appointment_id: string
          created_at: string | null
          establishment_data: Json
          establishment_id: string
          expires_at: string | null
          id: string
          payment_id: string
          status: string | null
          updated_at: string | null
          user_id: string
          voucher_code: string
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          establishment_data: Json
          establishment_id: string
          expires_at?: string | null
          id?: string
          payment_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          voucher_code: string
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          establishment_data?: Json
          establishment_id?: string
          expires_at?: string | null
          id?: string
          payment_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          voucher_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vouchers_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_partner_application: {
        Args: { application_id: string; approver_id: string }
        Returns: string
      }
      check_subscription_limit: {
        Args: {
          p_current_count: number
          p_limit_type: string
          p_partner_id: string
        }
        Returns: boolean
      }
      executar_testes_sistema: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_onboarding_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gerenciar_cron_job: {
        Args: { acao: string; job_name: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_hourly_performance: {
        Args: Record<PropertyKey, never>
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
        Args: Record<PropertyKey, never>
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
        Args: Record<PropertyKey, never>
        Returns: {
          average_rating: number
          business_name: string
          id: number
          is_available: boolean
          total_reviews: number
        }[]
      }
      get_partner_statistics: {
        Args: Record<PropertyKey, never>
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
      get_problematic_tasks: {
        Args: Record<PropertyKey, never>
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
        Args: Record<PropertyKey, never>
        Returns: {
          average_rating: number
          business_name: string
          id: number
          is_available: boolean
          total_reviews: number
        }[]
      }
      get_task_queue_metrics: {
        Args: Record<PropertyKey, never>
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
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id_param: string }
        Returns: string
      }
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_partner_approved: {
        Args: { partner_id: number }
        Returns: boolean
      }
      is_partner_owner: {
        Args: { partner_id: number }
        Returns: boolean
      }
      limpar_dados_antigos: {
        Args: { dias_retencao?: number }
        Returns: Json
      }
      limpar_dados_teste: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      obter_estatisticas_sistema: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      processar_fila_manual: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      reject_partner_application: {
        Args: { application_id: string; reason: string; rejector_id: string }
        Returns: boolean
      }
      reprocessar_notificacoes_agendamento: {
        Args: { agendamento_id: number }
        Returns: boolean
      }
      reprocessar_tarefas_falhadas: {
        Args: { limite?: number }
        Returns: Json
      }
      reset_subscription_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      temp_disable_rls: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      temp_enable_rls: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verificar_status_cron_jobs: {
        Args: Record<PropertyKey, never>
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
      user_role: "admin" | "partner" | "client"
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
      user_role: ["admin", "partner", "client"],
    },
  },
} as const
