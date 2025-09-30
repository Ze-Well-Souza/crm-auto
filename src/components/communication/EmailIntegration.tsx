import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCommunication } from "@/contexts/CommunicationContext";
import { 
  Mail, 
  Send, 
  Paperclip, 
  Users, 
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Image,
  Calendar
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: 'marketing' | 'transactional' | 'notification';
}

interface EmailIntegrationProps {
  className?: string;
}

export const EmailIntegration: React.FC<EmailIntegrationProps> = ({ 
  className = "" 
}) => {
  const { sendEmail, loading } = useCommunication();
  
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templateVariables, setTemplateVariables] = useState<{ [key: string]: string }>({});
  const [isHtml, setIsHtml] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Templates pré-definidos
  const templates: EmailTemplate[] = [
    {
      id: 'appointment_confirmation',
      name: 'Confirmação de Agendamento',
      subject: 'Confirmação de Agendamento - {{data}}',
      content: `Olá {{nome}},

Confirmamos seu agendamento para o dia {{data}} às {{hora}}.

Detalhes do serviço:
- Serviço: {{servico}}
- Profissional: {{profissional}}
- Valor: {{valor}}

Em caso de dúvidas, entre em contato conosco.

Atenciosamente,
Equipe CRM Parceiro`,
      variables: ['nome', 'data', 'hora', 'servico', 'profissional', 'valor'],
      category: 'transactional'
    },
    {
      id: 'payment_receipt',
      name: 'Comprovante de Pagamento',
      subject: 'Comprovante de Pagamento - Pedido #{{numero}}',
      content: `Olá {{nome}},

Recebemos seu pagamento com sucesso!

Detalhes da transação:
- Número do pedido: {{numero}}
- Valor pago: {{valor}}
- Método de pagamento: {{metodo}}
- Data: {{data}}

Obrigado pela preferência!

Atenciosamente,
Equipe CRM Parceiro`,
      variables: ['nome', 'numero', 'valor', 'metodo', 'data'],
      category: 'transactional'
    },
    {
      id: 'newsletter',
      name: 'Newsletter Mensal',
      subject: 'Newsletter {{mes}} - Novidades e Promoções',
      content: `Olá {{nome}},

Confira as novidades deste mês:

{{conteudo}}

Não perca nossas promoções especiais!

Para cancelar o recebimento deste e-mail, clique aqui.

Atenciosamente,
Equipe CRM Parceiro`,
      variables: ['nome', 'mes', 'conteudo'],
      category: 'marketing'
    },
    {
      id: 'service_reminder',
      name: 'Lembrete de Serviço',
      subject: 'Lembrete: Serviço agendado para {{data}}',
      content: `Olá {{nome}},

Este é um lembrete sobre seu serviço agendado:

Data: {{data}}
Horário: {{hora}}
Serviço: {{servico}}

Aguardamos você!

Atenciosamente,
Equipe CRM Parceiro`,
      variables: ['nome', 'data', 'hora', 'servico'],
      category: 'notification'
    }
  ];

  const handleSendEmail = async () => {
    if (!recipients || !subject || !message) return;
    
    const recipientList = recipients.split(',').map(email => email.trim());
    
    await sendEmail({
      to: recipientList,
      subject,
      content: message,
      isHtml,
      attachments
    });
    
    // Limpar formulário
    setRecipients("");
    setSubject("");
    setMessage("");
    setAttachments([]);
  };

  const handleSendTemplate = async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template || !recipients) return;

    let processedSubject = template.subject;
    let processedContent = template.content;
    
    // Substituir variáveis
    template.variables.forEach(variable => {
      const value = templateVariables[variable] || `{{${variable}}}`;
      processedSubject = processedSubject.replace(`{{${variable}}}`, value);
      processedContent = processedContent.replace(`{{${variable}}}`, value);
    });

    const recipientList = recipients.split(',').map(email => email.trim());

    await sendEmail({
      to: recipientList,
      subject: processedSubject,
      content: processedContent,
      isHtml: false,
      attachments
    });

    // Limpar formulário
    setTemplateVariables({});
    setSelectedTemplate("");
    setRecipients("");
    setAttachments([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Integração de Email
          </CardTitle>
          <CardDescription>
            Envie emails personalizados e templates para seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compose">Compor Email</TabsTrigger>
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            {/* Compor Email */}
            <TabsContent value="compose" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipients">Destinatários</Label>
                    <Input
                      id="recipients"
                      placeholder="email1@exemplo.com, email2@exemplo.com"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Separe múltiplos emails com vírgula
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      placeholder="Assunto do email"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="html-mode"
                      checked={isHtml}
                      onCheckedChange={setIsHtml}
                    />
                    <Label htmlFor="html-mode">Modo HTML</Label>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder={isHtml ? "Digite o HTML do email..." : "Digite sua mensagem..."}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label htmlFor="attachments">Anexos</Label>
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                    
                    {attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-4 h-4" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({formatFileSize(file.size)})
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleSendEmail}
                    disabled={!recipients || !subject || !message || loading}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Enviando...' : 'Enviar Email'}
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Preview do Email</h4>
                  <div className="bg-white p-4 rounded-lg border space-y-3">
                    <div className="border-b pb-2">
                      <div className="text-sm text-gray-600">Para: {recipients || "destinatarios@exemplo.com"}</div>
                      <div className="text-sm text-gray-600">Assunto: {subject || "Assunto do email"}</div>
                    </div>
                    <div className="text-sm">
                      {isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: message || "Conteúdo do email aparecerá aqui..." }} />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans">
                          {message || "Conteúdo do email aparecerá aqui..."}
                        </pre>
                      )}
                    </div>
                    {attachments.length > 0 && (
                      <div className="border-t pt-2">
                        <div className="text-xs text-gray-600 mb-1">Anexos:</div>
                        {attachments.map((file, index) => (
                          <div key={index} className="text-xs text-blue-600">
                            📎 {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Templates */}
            <TabsContent value="template" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-recipients">Destinatários</Label>
                    <Input
                      id="template-recipients"
                      placeholder="email1@exemplo.com, email2@exemplo.com"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
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
                    disabled={!recipients || !selectedTemplate || loading}
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
                      <div className="bg-white p-4 rounded-lg border space-y-3">
                        <div className="border-b pb-2">
                          <div className="text-sm text-gray-600">
                            Assunto: {selectedTemplateData.variables.reduce((subject, variable) => {
                              const value = templateVariables[variable] || `{{${variable}}}`;
                              return subject.replace(`{{${variable}}}`, value);
                            }, selectedTemplateData.subject)}
                          </div>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {selectedTemplateData.variables.reduce((content, variable) => {
                            const value = templateVariables[variable] || `{{${variable}}}`;
                            return content.replace(`{{${variable}}}`, value);
                          }, selectedTemplateData.content)}
                        </div>
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
                              ? 'border-blue-500 bg-blue-50' 
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
                            {template.subject}
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
                    <CardTitle className="text-lg">Status do Servidor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Servidor SMTP</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conectado
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Autenticação</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Válida
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL/TLS</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativo
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
                      <span className="text-sm">Emails Enviados (Hoje)</span>
                      <span className="font-semibold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taxa de Entrega</span>
                      <span className="font-semibold text-green-600">96.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taxa de Abertura</span>
                      <span className="font-semibold text-blue-600">73.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taxa de Cliques</span>
                      <span className="font-semibold text-purple-600">28.5%</span>
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