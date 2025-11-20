import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCommunication } from "@/contexts/CommunicationContext";
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Users,
  MessageCircle,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = "" }) => {
  const {
    messages,
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    loading
  } = useCommunication();

  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const conversation = conversations.find(c => c.id === activeConversation);
    if (!conversation) return;

    const recipientId = conversation.participants.find(p => p !== 'user-1') || conversation.participants[0];
    
    await sendMessage(newMessage, recipientId);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
    markConversationAsRead(conversationId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participantNames.some(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const activeConversationData = conversations.find(c => c.id === activeConversation);
  const conversationMessages = messages.filter(msg => {
    if (!activeConversationData) return false;
    return activeConversationData.participants.includes(msg.senderId) ||
           activeConversationData.participants.includes(msg.recipientId);
  });

  const getMessageStatus = (message: any) => {
    if (message.senderId === 'user-1') {
      if (message.read) {
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      } else if (message.delivered) {
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      } else {
        return <Check className="w-4 h-4 text-gray-400" />;
      }
    }
    return null;
  };

  const getChannelBadge = (channel: string) => {
    const channelConfig = {
      internal: { label: 'Interno', color: 'bg-blue-100 text-blue-800' },
      whatsapp: { label: 'WhatsApp', color: 'bg-green-100 text-green-800' },
      email: { label: 'Email', color: 'bg-purple-100 text-purple-800' },
      sms: { label: 'SMS', color: 'bg-orange-100 text-orange-800' }
    };

    const config = channelConfig[channel as keyof typeof channelConfig] || channelConfig.internal;
    
    return (
      <Badge className={`text-xs ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className={`flex h-[600px] border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-xl ${className}`}>
      {/* Lista de Conversas */}
      <div className="w-1/3 border-r border-white/10 bg-white/5">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Conversas</h3>
            <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10">
              <Users className="w-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  activeConversation === conversation.id
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400">
                      {conversation.title?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-white truncate">
                        {conversation.title}
                      </h4>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-red-500/20 text-red-300 border-0 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>

                    {conversation.lastMessage && (
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {conversation.lastMessage.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(conversation.updatedAt, {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </span>
                      <div className="flex items-center space-x-1">
                        {conversation.type === 'group' && (
                          <Users className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {activeConversationData ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activeConversationData.avatar} />
                    <AvatarFallback>
                      {activeConversationData.title?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activeConversationData.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeConversationData.type === 'group' 
                        ? `${activeConversationData.participants.length} participantes`
                        : 'Online'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === 'user-1' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'user-1'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium">
                          {message.senderName}
                        </span>
                        {getChannelBadge(message.channel)}
                      </div>
                      
                      <p className="text-sm">{message.content}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {formatDistanceToNow(message.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                        {getMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de Mensagem */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                  />
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || loading}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  // Implementar upload de arquivos
                  console.log('Arquivos selecionados:', e.target.files);
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-600">
                Escolha uma conversa da lista para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};