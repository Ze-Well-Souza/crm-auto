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
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
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
      appointment_ratings_deprecated: {
        Row: {
          appointment_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_ratings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_ratings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_status_history_deprecated: {
        Row: {
          appointment_id: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          appointment_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          appointment_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_status_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_status_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments_deprecated: {
        Row: {
          created_at: string | null
          date: string
          establishment_id: string | null
          id: string
          notes: string | null
          parceiro_id: number | null
          preco_final: number | null
          service_id: string | null
          status: string | null
          time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          establishment_id?: string | null
          id?: string
          notes?: string | null
          parceiro_id?: number | null
          preco_final?: number | null
          service_id?: string | null
          status?: string | null
          time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          establishment_id?: string | null
          id?: string
          notes?: string | null
          parceiro_id?: number | null
          preco_final?: number | null
          service_id?: string | null
          status?: string | null
          time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_parceiro_id"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_parceiro_id"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_slots_deprecated: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string
          establishment_id: string | null
          id: string
          is_active: boolean | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          establishment_id?: string | null
          id?: string
          is_active?: boolean | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          establishment_id?: string | null
          id?: string
          is_active?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_slots_deprecated: {
        Row: {
          created_at: string | null
          date: string
          end_time: string | null
          establishment_id: string | null
          id: string
          reason: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time?: string | null
          establishment_id?: string | null
          id?: string
          reason?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string | null
          establishment_id?: string | null
          id?: string
          reason?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_slots_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages_deprecated: {
        Row: {
          created_at: string | null
          establishment_id: string | null
          id: string
          is_read: boolean | null
          message: string
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      clients_deprecated: {
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
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_services_deprecated: {
        Row: {
          active: boolean | null
          created_at: string | null
          duration: number | null
          establishment_id: string | null
          id: string
          price: number | null
          service_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          duration?: number | null
          establishment_id?: string | null
          id?: string
          price?: number | null
          service_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          duration?: number | null
          establishment_id?: string | null
          id?: string
          price?: number | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_services_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments_deprecated: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          photos: string[] | null
          services: string[] | null
          type: string | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          photos?: string[] | null
          services?: string[] | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          photos?: string[] | null
          services?: string[] | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites_deprecated: {
        Row: {
          created_at: string | null
          establishment_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
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
      financial_transactions_deprecated: {
        Row: {
          amount: number
          category: string | null
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
            foreignKeyName: "financial_transactions_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      mechanic_commissions_deprecated: {
        Row: {
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string
          id: string
          mechanic_id: string
          paid: boolean | null
          paid_at: string | null
          service_order_id: string
        }
        Insert: {
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          id?: string
          mechanic_id: string
          paid?: boolean | null
          paid_at?: string | null
          service_order_id: string
        }
        Update: {
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          id?: string
          mechanic_id?: string
          paid?: boolean | null
          paid_at?: string | null
          service_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mechanic_commissions_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue_deprecated: {
        Row: {
          attempts: number | null
          channel: string
          content: string
          created_at: string | null
          error_message: string | null
          id: string
          last_attempt: string | null
          metadata: Json | null
          priority: string | null
          recipient: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          channel: string
          content: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_attempt?: string | null
          metadata?: Json | null
          priority?: string | null
          recipient: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          channel?: string
          content?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_attempt?: string | null
          metadata?: Json | null
          priority?: string | null
          recipient?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_deprecated: {
        Row: {
          created_at: string | null
          data: Json | null
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
          data?: Json | null
          id: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
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
            referencedRelation: "parceiro_estatisticas"
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
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
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
      partner_applications_deprecated: {
        Row: {
          address: string | null
          business_name: string
          business_type: string | null
          cnpj: string | null
          created_at: string | null
          email: string
          id: string
          owner_name: string
          phone: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          services_offered: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type?: string | null
          cnpj?: string | null
          created_at?: string | null
          email: string
          id?: string
          owner_name: string
          phone: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          services_offered?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string
          id?: string
          owner_name?: string
          phone?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          services_offered?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
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
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_documents_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_services_deprecated: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: number
          parceiro_id: number
          preco_base: number
          service_id: string
          tempo_estimado_minutos: number
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: never
          parceiro_id: number
          preco_base: number
          service_id: string
          tempo_estimado_minutos?: number
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: never
          parceiro_id?: number
          preco_base?: number
          service_id?: string
          tempo_estimado_minutos?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_services_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiro_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_services_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      partners_deprecated: {
        Row: {
          address: string | null
          business_name: string
          cnpj: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          cnpj?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          cnpj?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      parts_deprecated: {
        Row: {
          active: boolean | null
          brand: string | null
          category: string | null
          code: string
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
          code: string
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
          code?: string
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
            foreignKeyName: "parts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers_deprecated"
            referencedColumns: ["id"]
          },
        ]
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
      payments_deprecated: {
        Row: {
          amount: number
          appointment_id: string | null
          confirmed_at: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          processed_at: string | null
          refund_amount: number | null
          refund_reason: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_payment_method_id: string | null
          updated_at: string | null
          user_id: string
          workshop_id: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          updated_at?: string | null
          user_id: string
          workshop_id?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          updated_at?: string | null
          user_id?: string
          workshop_id?: string | null
        }
        Relationships: []
      }
      review_metrics_deprecated: {
        Row: {
          average_rating: number | null
          establishment_id: string | null
          id: string
          last_updated: string | null
          rating_1_count: number | null
          rating_2_count: number | null
          rating_3_count: number | null
          rating_4_count: number | null
          rating_5_count: number | null
          total_reviews: number | null
        }
        Insert: {
          average_rating?: number | null
          establishment_id?: string | null
          id?: string
          last_updated?: string | null
          rating_1_count?: number | null
          rating_2_count?: number | null
          rating_3_count?: number | null
          rating_4_count?: number | null
          rating_5_count?: number | null
          total_reviews?: number | null
        }
        Update: {
          average_rating?: number | null
          establishment_id?: string | null
          id?: string
          last_updated?: string | null
          rating_1_count?: number | null
          rating_2_count?: number | null
          rating_3_count?: number | null
          rating_4_count?: number | null
          rating_5_count?: number | null
          total_reviews?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "review_metrics_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_deprecated: {
        Row: {
          appointment_id: string | null
          comment: string | null
          created_at: string | null
          establishment_id: string | null
          id: string
          photos: string[] | null
          rating: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          photos?: string[] | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          photos?: string[] | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories_deprecated: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_order_items_deprecated: {
        Row: {
          created_at: string
          description: string
          id: string
          part_id: string | null
          quantity: number | null
          service_order_id: string
          service_type_id: string | null
          total_price: number
          type: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          part_id?: string | null
          quantity?: number | null
          service_order_id: string
          service_type_id?: string | null
          total_price: number
          type: string
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          part_id?: string | null
          quantity?: number | null
          service_order_id?: string
          service_type_id?: string | null
          total_price?: number
          type?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_order_items_part_id"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_items_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_items_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders_deprecated: {
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
          promised_date: string | null
          started_at: string | null
          status: string | null
          total_amount: number | null
          total_labor: number | null
          total_parts: number | null
          type: string | null
          updated_at: string
          vehicle_id: string
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
          promised_date?: string | null
          started_at?: string | null
          status?: string | null
          total_amount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          type?: string | null
          updated_at?: string
          vehicle_id: string
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
          promised_date?: string | null
          started_at?: string | null
          status?: string | null
          total_amount?: number | null
          total_labor?: number | null
          total_parts?: number | null
          type?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reviews_deprecated: {
        Row: {
          comment: string | null
          created_at: string | null
          establishment_id: string | null
          id: string
          rating: number | null
          service_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          rating?: number | null
          service_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          establishment_id?: string | null
          id?: string
          rating?: number | null
          service_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_reviews_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types_deprecated: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          default_price: number | null
          description: string | null
          estimated_duration: number | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          default_price?: number | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          default_price?: number | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      services_deprecated: {
        Row: {
          ativo: boolean
          category_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          name: string
          partner_id: string | null
          price: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name: string
          partner_id?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          name?: string
          partner_id?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions_deprecated: {
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
      stock_movements_deprecated: {
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
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers_deprecated: {
        Row: {
          active: boolean | null
          address: string | null
          cnpj: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          cnpj?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles_deprecated: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          notification_settings: Json | null
          preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
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
      users_deprecated: {
        Row: {
          created_at: string | null
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          google_id: string | null
          id: string
          last_name: string | null
          password: string | null
          phone: string | null
          profile_image_url: string | null
          role: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          google_id?: string | null
          id?: string
          last_name?: string | null
          password?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          google_id?: string | null
          id?: string
          last_name?: string | null
          password?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_type?: string | null
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
      vehicles_deprecated: {
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
            foreignKeyName: "vehicles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_schedules_deprecated: {
        Row: {
          client_id: string
          created_at: string
          estimated_duration: number | null
          id: string
          mechanic_id: string | null
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          service_description: string | null
          service_order_id: string | null
          status: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          estimated_duration?: number | null
          id?: string
          mechanic_id?: string | null
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          service_description?: string | null
          service_order_id?: string | null
          status?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          estimated_duration?: number | null
          id?: string
          mechanic_id?: string | null
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          service_description?: string | null
          service_order_id?: string | null
          status?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_schedules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_schedules_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_schedules_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      bookings: {
        Row: {
          client_id: string | null
          created_at: string | null
          date: string | null
          establishment_id: string | null
          id: string | null
          notes: string | null
          service_id: string | null
          status: string | null
          time: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          establishment_id?: string | null
          id?: string | null
          notes?: string | null
          service_id?: string | null
          status?: string | null
          time?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date?: string | null
          establishment_id?: string | null
          id?: string | null
          notes?: string | null
          service_id?: string | null
          status?: string | null
          time?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_deprecated"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users_deprecated"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_fila_tarefas: {
        Row: {
          tarefas_concluidas: number | null
          tarefas_falhadas: number | null
          tarefas_pendentes: number | null
          tarefas_processando: number | null
          tarefas_ultima_hora: number | null
          tarefas_ultimo_dia: number | null
          tempo_medio_processamento_segundos: number | null
          total_tarefas: number | null
        }
        Relationships: []
      }
      metricas_por_tipo_tarefa: {
        Row: {
          concluidas: number | null
          falhadas: number | null
          max_tentativas: number | null
          media_tentativas: number | null
          pendentes: number | null
          processando: number | null
          tempo_medio_processamento: number | null
          tipo_tarefa: string | null
          total: number | null
        }
        Relationships: []
      }
      parceiro_estatisticas: {
        Row: {
          aprovado_em: string | null
          created_at: string | null
          documentos_aprovados: number | null
          id: number | null
          media_avaliacoes: number | null
          nome_empresa: string | null
          status: string | null
          total_avaliacoes: number | null
          total_documentos: number | null
          total_especialidades: number | null
        }
        Relationships: []
      }
      performance_por_hora: {
        Row: {
          concluidas: number | null
          falhadas: number | null
          hora: string | null
          taxa_sucesso_pct: number | null
          tempo_medio_processamento: number | null
          total_tarefas: number | null
        }
        Relationships: []
      }
      tarefas_problematicas: {
        Row: {
          created_at: string | null
          id: number | null
          payload: Json | null
          status: string | null
          tentativas: number | null
          tipo_tarefa: string | null
          ultima_falha: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number | null
          payload?: Json | null
          status?: string | null
          tentativas?: number | null
          tipo_tarefa?: string | null
          ultima_falha?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number | null
          payload?: Json | null
          status?: string | null
          tentativas?: number | null
          tipo_tarefa?: string | null
          ultima_falha?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      executar_testes_sistema: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      gerenciar_cron_job: {
        Args: { acao: string; job_name: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      reprocessar_notificacoes_agendamento: {
        Args: { agendamento_id: number }
        Returns: boolean
      }
      reprocessar_tarefas_falhadas: {
        Args: { limite?: number }
        Returns: Json
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
