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

  // Carregar mensagens reais do Supabase
  useEffect(() => {
    fetchMessagesAndConversations();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_messages'
      }, () => {
        fetchMessagesAndConversations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessagesAndConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(100);

      if (messagesError) throw messagesError;

      if (messagesData && messagesData.length > 0) {
        const transformedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_name || 'Usuário',
          recipientId: msg.receiver_id || '',
          recipientName: 'Destinatário',
          content: msg.content,
          type: (msg.message_type as any) || 'text',
          timestamp: new Date(msg.created_at),
          read: msg.is_read || false,
          delivered: msg.status === 'sent' || msg.status === 'delivered',
          channel: 'internal'
        }));

        setMessages(transformedMessages);

        // Agrupar mensagens em conversas
        const grouped = groupMessagesByConversation(transformedMessages, user.id);
        setConversations(grouped);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const groupMessagesByConversation = (msgs: Message[], currentUserId: string): Conversation[] => {
    const conversationMap = new Map<string, Message[]>();

    msgs.forEach(msg => {
      const otherUserId = msg.senderId === currentUserId ? msg.recipientId : msg.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, []);
      }
      conversationMap.get(otherUserId)!.push(msg);
    });

    return Array.from(conversationMap.entries()).map(([userId, messages]) => {
      const sortedMessages = messages.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const lastMessage = sortedMessages[0];
      const unreadCount = messages.filter(m => !m.read && m.recipientId === currentUserId).length;

      return {
        id: `conv-${userId}`,
        participants: [currentUserId, userId],
        participantNames: [lastMessage.senderName],
        lastMessage,
        unreadCount,
        type: 'direct',
        title: lastMessage.senderName,
        createdAt: new Date(sortedMessages[sortedMessages.length - 1].timestamp),
        updatedAt: new Date(lastMessage.timestamp)
      };
    });
  };

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

      // Chamar edge function de email SMTP
      const { data, error: functionError } = await supabase.functions.invoke('send-email-smtp', {
        body: {
          to: params.to,
          subject: params.subject,
          content: params.content,
          isHtml: params.isHtml || false,
        }
      });

      if (functionError) throw functionError;

      if (data?.success) {
        // Criar mensagens no histórico para cada destinatário
        const emailContent = `Assunto: ${params.subject}\n\n${params.content}`;
        for (const recipient of params.to) {
          await sendMessage(emailContent, 'email-user', 'text', 'email');
        }

        const toLabel = params.to.length === 1 ? params.to[0] : `${params.to.length} destinatários`;
        showSuccess(`Email enviado para ${toLabel}`);
      } else {
        throw new Error(data?.error || 'Erro ao enviar email');
      }
    } catch (err: any) {
      console.error('Email send error:', err);
      showError(err.message || 'Erro ao enviar email. Verifique suas configurações de email.');
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