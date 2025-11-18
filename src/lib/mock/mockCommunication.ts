// Serviço Mock de Comunicação - CRM Auto MVP
// Substitui integrações de email/WhatsApp pagas para deploy gratuito

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  created_at: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  sent_at?: string;
  created_at: string;
}

export interface WhatsAppMessage {
  id: string;
  to: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  sent_at?: string;
  created_at: string;
}

export interface SMTPConfig {
  id: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'custom';
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  use_tls: boolean;
  is_active: boolean;
  created_at: string;
}

class MockCommunicationService {
  private emailLogs: EmailLog[] = [];
  private whatsappLogs: WhatsAppMessage[] = [];
  private emailTemplates: EmailTemplate[] = [];
  private smtpConfigs: SMTPConfig[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Templates de email mock
    this.emailTemplates = [
      {
        id: 'template_appointment_confirmation',
        name: 'Confirmação de Agendamento',
        subject: 'Confirmação de Agendamento - {{client_name}}',
        body: `Olá {{client_name}},

Seu agendamento foi confirmado para o dia {{appointment_date}} às {{appointment_time}}.

Serviço: {{service_type}}
Veículo: {{vehicle_info}}

Atenciosamente,
Equipe CRM Auto`,
        variables: ['client_name', 'appointment_date', 'appointment_time', 'service_type', 'vehicle_info'],
        created_at: new Date().toISOString()
      },
      {
        id: 'template_service_complete',
        name: 'Serviço Concluído',
        subject: 'Seu veículo está pronto - {{client_name}}',
        body: `Olá {{client_name}},

Seu veículo {{vehicle_info}} está pronto para retirada.

Serviços realizados: {{services_performed}}
Valor total: {{total_value}}

Horário de funcionamento:
Segunda a Sexta: 8h às 18h
Sábado: 8h às 12h

Aguardamos sua visita!
Equipe CRM Auto`,
        variables: ['client_name', 'vehicle_info', 'services_performed', 'total_value'],
        created_at: new Date().toISOString()
      },
      {
        id: 'template_appointment_reminder',
        name: 'Lembrete de Agendamento',
        subject: 'Lembrete: Agendamento amanhã - {{client_name}}',
        body: `Olá {{client_name}},

Este é um lembrete do seu agendamento de amanhã.

Data: {{appointment_date}}
Horário: {{appointment_time}}
Serviço: {{service_type}}

Se precisar reagendar, entre em contato conosco.

Atenciosamente,
Equipe CRM Auto`,
        variables: ['client_name', 'appointment_date', 'appointment_time', 'service_type'],
        created_at: new Date().toISOString()
      }
    ];

    // Config SMTP mock (simulando configuração)
    this.smtpConfigs = [
      {
        id: 'config_default',
        provider: 'custom',
        smtp_host: 'smtp.mock.com',
        smtp_port: 587,
        smtp_username: 'mock_user',
        smtp_password: 'mock_password',
        from_email: 'noreply@crmauto.mock',
        from_name: 'CRM Auto',
        use_tls: true,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  // Métodos de Email
  async sendEmail(to: string, subject: string, body: string, options?: {
    templateId?: string;
    variables?: Record<string, string>;
    fromEmail?: string;
    fromName?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      let finalSubject = subject;
      let finalBody = body;

      // Se usar template, aplicar variáveis
      if (options?.templateId) {
        const template = this.emailTemplates.find(t => t.id === options.templateId);
        if (template) {
          finalSubject = this.applyTemplateVariables(template.subject, options.variables || {});
          finalBody = this.applyTemplateVariables(template.body, options.variables || {});
        }
      } else {
        // Aplicar variáveis no corpo e assunto
        finalSubject = this.applyTemplateVariables(subject, options?.variables || {});
        finalBody = this.applyTemplateVariables(body, options?.variables || {});
      }

      // Simular envio de email
      const messageId = `email_${Date.now()}`;
      
      // Adicionar ao log
      const emailLog: EmailLog = {
        id: messageId,
        to,
        subject: finalSubject,
        body: finalBody,
        status: 'sent',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      this.emailLogs.push(emailLog);

      // Simular delay de envio
      await this.delay(500);

      console.log(`[MOCK EMAIL] Enviado para: ${to}`);
      console.log(`[MOCK EMAIL] Assunto: ${finalSubject}`);
      console.log(`[MOCK EMAIL] Corpo: ${finalBody.substring(0, 100)}...`);

      return {
        success: true,
        messageId,
        error: undefined
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Adicionar falha ao log
      const emailLog: EmailLog = {
        id: `email_fail_${Date.now()}`,
        to,
        subject,
        body,
        status: 'failed',
        error: errorMessage,
        created_at: new Date().toISOString()
      };

      this.emailLogs.push(emailLog);

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async sendWhatsAppMessage(to: string, message: string, options?: {
    template?: string;
    variables?: Record<string, string>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      let finalMessage = message;

      // Aplicar template se fornecido
      if (options?.template) {
        finalMessage = this.applyTemplateVariables(options.template, options.variables || {});
      }

      // Simular envio WhatsApp
      const messageId = `whatsapp_${Date.now()}`;
      
      // Adicionar ao log
      const whatsappLog: WhatsAppMessage = {
        id: messageId,
        to,
        message: finalMessage,
        status: 'sent',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      this.whatsappLogs.push(whatsappLog);

      // Simular delay de envio
      await this.delay(300);

      console.log(`[MOCK WHATSAPP] Enviado para: ${to}`);
      console.log(`[MOCK WHATSAPP] Mensagem: ${finalMessage.substring(0, 100)}...`);

      return {
        success: true,
        messageId,
        error: undefined
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Adicionar falha ao log
      const whatsappLog: WhatsAppMessage = {
        id: `whatsapp_fail_${Date.now()}`,
        to,
        message,
        status: 'failed',
        error: errorMessage,
        created_at: new Date().toISOString()
      };

      this.whatsappLogs.push(whatsappLog);

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Métodos de Template
  getEmailTemplates(): EmailTemplate[] {
    return [...this.emailTemplates];
  }

  getEmailTemplate(id: string): EmailTemplate | undefined {
    return this.emailTemplates.find(template => template.id === id);
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at'>): Promise<EmailTemplate> {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    this.emailTemplates.push(newTemplate);
    return newTemplate;
  }

  // Métodos de Configuração SMTP
  getSMTPConfigs(): SMTPConfig[] {
    return [...this.smtpConfigs];
  }

  getActiveSMTPConfig(): SMTPConfig | undefined {
    return this.smtpConfigs.find(config => config.is_active);
  }

  async saveSMTPConfig(config: Omit<SMTPConfig, 'id' | 'created_at'>): Promise<SMTPConfig> {
    const newConfig: SMTPConfig = {
      ...config,
      id: `smtp_${Date.now()}`,
      created_at: new Date().toISOString()
    };

    // Desativar outras configs se esta for ativa
    if (config.is_active) {
      this.smtpConfigs.forEach(c => c.is_active = false);
    }

    this.smtpConfigs.push(newConfig);
    return newConfig;
  }

  // Métodos de Log
  getEmailLogs(limit: number = 50): EmailLog[] {
    return [...this.emailLogs]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  getWhatsAppLogs(limit: number = 50): WhatsAppMessage[] {
    return [...this.whatsappLogs]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  // Métodos utilitários
  private applyTemplateVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos de teste/debug
  async simulateFailedEmail(to: string): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Simulação de falha de envio'
    };
  }

  async simulateFailedWhatsApp(to: string): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Simulação de falha de envio WhatsApp'
    };
  }

  clearLogs(): void {
    this.emailLogs = [];
    this.whatsappLogs = [];
  }

  getStats() {
    return {
      totalEmails: this.emailLogs.length,
      totalWhatsApp: this.whatsappLogs.length,
      emailsSent: this.emailLogs.filter(log => log.status === 'sent').length,
      emailsFailed: this.emailLogs.filter(log => log.status === 'failed').length,
      whatsappSent: this.whatsappLogs.filter(log => log.status === 'sent').length,
      whatsappFailed: this.whatsappLogs.filter(log => log.status === 'failed').length
    };
  }
}

// Criar instância singleton
const mockCommunicationService = new MockCommunicationService();

// Exportar tipos e serviço
export type {
  EmailTemplate,
  EmailLog,
  WhatsAppMessage,
  SMTPConfig
};

export { mockCommunicationService };

// Exportar funções úteis para componentes
export const mockCommunication = {
  // Email
  sendEmail: (to: string, subject: string, body: string, options?: any) => 
    mockCommunicationService.sendEmail(to, subject, body, options),
  
  getEmailTemplates: () => mockCommunicationService.getEmailTemplates(),
  getEmailTemplate: (id: string) => mockCommunicationService.getEmailTemplate(id),
  getEmailLogs: (limit?: number) => mockCommunicationService.getEmailLogs(limit),
  
  // WhatsApp
  sendWhatsAppMessage: (to: string, message: string, options?: any) =>
    mockCommunicationService.sendWhatsAppMessage(to, message, options),
  
  getWhatsAppLogs: (limit?: number) => mockCommunicationService.getWhatsAppLogs(limit),
  
  // Configurações
  getSMTPConfigs: () => mockCommunicationService.getSMTPConfigs(),
  saveSMTPConfig: (config: Omit<SMTPConfig, 'id' | 'created_at'>) => 
    mockCommunicationService.saveSMTPConfig(config),
  
  // Estatísticas
  getStats: () => mockCommunicationService.getStats(),
  clearLogs: () => mockCommunicationService.clearLogs()
};