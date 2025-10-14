import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from './NotificationContext';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: Date;
  read: boolean;
  delivered: boolean;
  channel: 'internal' | 'whatsapp' | 'email' | 'sms';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    emailSubject?: string;
    whatsappNumber?: string;
  };
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: Message;
  unreadCount: number;
  type: 'direct' | 'group' | 'support';
  title?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationContextType {
  // Messages
  messages: Message[];
  conversations: Conversation[];
  activeConversation: string | null;
  
  // Actions
  sendMessage: (content: string, recipientId: string, type?: Message['type'], channel?: Message['channel']) => Promise<void>;
  markAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  
  // WhatsApp Integration
  sendWhatsAppMessage: (phoneNumber: string, message: string) => Promise<void>;
  
  // Email Integration - wrapper para compatibilidade
  sendEmail: (params: { to: string[]; subject: string; content: string; isHtml?: boolean; attachments?: File[] }) => Promise<void>;
  
  // SMS Integration
  sendSMS: (phoneNumber: string, message: string) => Promise<void>;
  
  // Notifications
  enablePushNotifications: () => Promise<boolean>;
  disablePushNotifications: () => void;
  
  // Status
  loading: boolean;
  error: string | null;
  onlineUsers: string[];
  typingUsers: { [conversationId: string]: string[] };
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

interface CommunicationProviderProps {
  children: ReactNode;
}

export const CommunicationProvider: React.FC<CommunicationProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: string[] }>({});
  
  const { showSuccess, showError, showInfo } = useNotifications();

  // Simular dados iniciais
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        participants: ['user-1', 'user-2'],
        participantNames: ['João Silva', 'Maria Santos'],
        unreadCount: 2,
        type: 'direct',
        title: 'João Silva',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: 'conv-2',
        participants: ['user-1', 'user-3'],
        participantNames: ['Pedro Costa', 'Ana Lima'],
        unreadCount: 0,
        type: 'direct',
        title: 'Pedro Costa',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        id: 'conv-3',
        participants: ['user-1', 'user-2', 'user-3', 'user-4'],
        participantNames: ['Equipe Técnica'],
        unreadCount: 5,
        type: 'group',
        title: 'Equipe Técnica',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-21'),
      }
    ];

    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        senderId: 'user-2',
        senderName: 'João Silva',
        recipientId: 'user-1',
        recipientName: 'Você',
        content: 'Olá! Gostaria de agendar um serviço para amanhã.',
        type: 'text',
        timestamp: new Date('2024-01-20T10:30:00'),
        read: false,
        delivered: true,
        channel: 'internal'
      },
      {
        id: 'msg-2',
        senderId: 'user-1',
        senderName: 'Você',
        recipientId: 'user-2',
        recipientName: 'João Silva',
        content: 'Claro! Que tipo de serviço você precisa?',
        type: 'text',
        timestamp: new Date('2024-01-20T10:35:00'),
        read: true,
        delivered: true,
        channel: 'internal'
      },
      {
        id: 'msg-3',
        senderId: 'user-2',
        senderName: 'João Silva',
        recipientId: 'user-1',
        recipientName: 'Você',
        content: 'Preciso de uma revisão completa no meu carro.',
        type: 'text',
        timestamp: new Date('2024-01-20T10:40:00'),
        read: false,
        delivered: true,
        channel: 'internal'
      }
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
  }, []);

  const sendMessage = async (
    content: string, 
    recipientId: string, 
    type: Message['type'] = 'text',
    channel: Message['channel'] = 'internal'
  ) => {
    try {
      setLoading(true);
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'user-1', // ID do usuário atual
        senderName: 'Você',
        recipientId,
        recipientName: 'Destinatário',
        content,
        type,
        timestamp: new Date(),
        read: false,
        delivered: false,
        channel
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Marcar como entregue
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, delivered: true }
            : msg
        )
      );

      showSuccess(`Mensagem enviada via ${channel}`);
    } catch (err) {
      showError('Erro ao enviar mensagem');
      setError('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    try {
      setLoading(true);
      
      // Call WhatsApp edge function
      const { data, error: functionError } = await supabase.functions.invoke('send-whatsapp', {
        body: { to: phoneNumber, message }
      });
      
      if (functionError) throw functionError;
      
      if (data?.success) {
        // Criar mensagem no histórico
        await sendMessage(message, 'whatsapp-user', 'text', 'whatsapp');
        showSuccess(`Mensagem enviada via WhatsApp Business para ${phoneNumber}`);
      } else {
        throw new Error(data?.error || 'Erro ao enviar mensagem');
      }
    } catch (err: any) {
      console.error('WhatsApp send error:', err);
      showError(err.message || 'Erro ao enviar mensagem via WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (params: { to: string[]; subject: string; content: string; isHtml?: boolean; attachments?: File[] }) => {
    try {
      setLoading(true);

      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar mensagens no histórico para cada destinatário
      const emailContent = `Assunto: ${params.subject}\n\n${params.content}`;
      for (const recipient of params.to) {
        await sendMessage(emailContent, 'email-user', 'text', 'email');
      }

      const toLabel = params.to.length === 1 ? params.to[0] : `${params.to.length} destinatários`;
      showSuccess(`Email enviado para ${toLabel}`);
    } catch (err) {
      showError('Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async (phoneNumber: string, message: string) => {
    try {
      setLoading(true);
      
      // Simular envio de SMS
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar mensagem no histórico
      await sendMessage(message, 'sms-user', 'text', 'sms');
      
      showSuccess(`SMS enviado para ${phoneNumber}`);
    } catch (err) {
      showError('Erro ao enviar SMS');
    } finally {
      setLoading(false);
    }
  };

  const enablePushNotifications = async (): Promise<boolean> => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          showSuccess('Notificações push ativadas');
          return true;
        }
      }
      showError('Notificações push não suportadas ou negadas');
      return false;
    } catch (err) {
      showError('Erro ao ativar notificações push');
      return false;
    }
  };

  const disablePushNotifications = () => {
    showInfo('Notificações push desativadas');
  };


  const value: CommunicationContextType = {
    messages,
    conversations,
    activeConversation,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    setActiveConversation,
    sendWhatsAppMessage,
    sendEmail,
    sendSMS,
    enablePushNotifications,
    disablePushNotifications,
    loading,
    error,
    onlineUsers,
    typingUsers,
  };

  return (
    <CommunicationContext.Provider value={value}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = (): CommunicationContextType => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
}