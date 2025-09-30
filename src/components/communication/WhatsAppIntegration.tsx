import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCommunication } from "@/contexts/CommunicationContext";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Users, 
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: 'marketing' | 'utility' | 'authentication';
}

interface WhatsAppIntegrationProps {
  className?: string;
}

export const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({ 
  className = "" 
}) => {
  const { sendWhatsAppMessage, loading } = useCommunication();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateVariables, setTemplateVariables] = useState<{ [key: string]: string }>({});

  // Templates pré-definidos
  const templates: WhatsAppTemplate[] = [
    {
      id: 'appointment_reminder',
      name: 'Lembrete de Agendamento',
      content: 'Olá {{nome}}! Lembramos que você tem um agendamento marcado para {{data}} às {{hora}}. Confirme sua presença respondendo esta mensagem.',
      variables: ['nome', 'data', 'hora'],
      category: 'utility'
    },
    {
      id: 'service_completed',
      name: 'Serviço Concluído',
      content: 'Olá {{nome}}! Seu serviço foi concluído com sucesso. Total: {{valor}}. Obrigado pela preferência!',
      variables: ['nome', 'valor'],
      category: 'utility'
    },
    {
      id: 'payment_reminder',
      name: 'Lembrete de Pagamento',
      content: 'Olá {{nome}}! Identificamos que há uma pendência de pagamento no valor de {{valor}} com vencimento em {{data}}. Entre em contato conosco para regularizar.',
      variables: ['nome', 'valor', 'data'],
      category: 'utility'
    },
    {
      id: 'promotion',
      name: 'Promoção Especial',
      content: 'Olá {{nome}}! Temos uma promoção especial para você: {{descricao}}. Válida até {{data}}. Agende já!',
      variables: ['nome', 'descricao', 'data'],
      category: 'marketing'
    }
  ];

  const handleSendMessage = async () => {
    if (!phoneNumber || !message) return;
    
    await sendWhatsAppMessage(phoneNumber, message);
    setMessage("");
    setPhoneNumber("");
  };

  const handleSendTemplate = async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template || !phoneNumber) return;

    let processedMessage = template.content;
    
    // Substituir variáveis
    template.variables.forEach(variable => {
      const value = templateVariables[variable] || `{{${variable}}}`;
      processedMessage = processedMessage.replace(`{{${variable}}}`, value);
    });

    await sendWhatsAppMessage(phoneNumber, processedMessage);
    setTemplateVariables({});
    setSelectedTemplate("");
    setPhoneNumber("");
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Integração WhatsApp
          </CardTitle>
          <CardDescription>
            Envie mensagens e templates via WhatsApp para seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="message" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="message">Mensagem Livre</TabsTrigger>
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            {/* Mensagem Livre */}
            <TabsContent value="message" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Número do WhatsApp</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {message.length}/1000 caracteres
                    </div>
                  </div>

                  <Button 
                    onClick={handleSendMessage}
                    disabled={!phoneNumber || !message || loading}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Preview da Mensagem</h4>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">Sua Empresa</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {message || "Sua mensagem aparecerá aqui..."}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Templates */}
            <TabsContent value="template" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-phone">Número do WhatsApp</Label>
                    <Input
                      id="template-phone"
                      placeholder="(11) 99999-9999"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label htmlFor="template-select">Selecionar Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {template.name}
                              <Badge variant="outline" className="ml-2">
                                {template.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTemplateData && (
                    <div className="space-y-3">
                      <Label>Variáveis do Template</Label>
                      {selectedTemplateData.variables.map((variable) => (
                        <div key={variable}>
                          <Label htmlFor={`var-${variable}`} className="text-sm">
                            {variable.charAt(0).toUpperCase() + variable.slice(1)}
                          </Label>
                          <Input
                            id={`var-${variable}`}
                            placeholder={`Digite o valor para ${variable}`}
                            value={templateVariables[variable] || ""}
                            onChange={(e) => setTemplateVariables(prev => ({
                              ...prev,
                              [variable]: e.target.value
                            }))}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    onClick={handleSendTemplate}
                    disabled={!phoneNumber || !selectedTemplate || loading}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Enviando...' : 'Enviar Template'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {selectedTemplateData && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Preview do Template</h4>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-sm">Sua Empresa</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedTemplateData.variables.reduce((content, variable) => {
                            const value = templateVariables[variable] || `{{${variable}}}`;
                            return content.replace(`{{${variable}}}`, value);
                          }, selectedTemplateData.content)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-3">Templates Disponíveis</h4>
                    <div className="space-y-2">
                      {templates.map((template) => (
                        <div 
                          key={template.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedTemplate === template.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{template.name}</span>
                            <Badge variant="outline">
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {template.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Configurações */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status da Integração</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">WhatsApp Business API</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conectado
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Webhook</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Templates Aprovados</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        4 de 4
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mensagens Enviadas (Hoje)</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taxa de Entrega</span>
                      <span className="font-semibold text-green-600">98.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taxa de Leitura</span>
                      <span className="font-semibold text-blue-600">87.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tempo Médio de Resposta</span>
                      <span className="font-semibold">2h 15min</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};