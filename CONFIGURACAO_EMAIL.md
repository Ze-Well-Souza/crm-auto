# 📧 Configuração de Email Próprio

Este sistema permite que você configure seu próprio email (Gmail, Hotmail, Yahoo, etc.) para enviar emails através do sistema usando SMTP.

## 🚀 Como Configurar

### 1. Acesse a Página de Configurações

Vá para **Configurações do Sistema** no menu lateral

### 2. Encontre a Seção "Configuração de Email Próprio"

### 3. Escolha Seu Provedor de Email

#### **Gmail**
- **Servidor SMTP**: `smtp.gmail.com`
- **Porta**: `587`
- **Usuário**: Seu email completo (exemplo@gmail.com)
- **Senha**: **Senha de App** (não sua senha normal)

**Como criar senha de app no Gmail:**
1. Acesse https://myaccount.google.com/security
2. Ative a "Verificação em duas etapas"
3. Acesse https://myaccount.google.com/apppasswords
4. Crie uma senha de app para "Mail"
5. Use essa senha de 16 caracteres no sistema

#### **Outlook/Hotmail**
- **Servidor SMTP**: `smtp-mail.outlook.com`
- **Porta**: `587`
- **Usuário**: Seu email completo
- **Senha**: Sua senha normal do Outlook

#### **Yahoo**
- **Servidor SMTP**: `smtp.mail.yahoo.com`
- **Porta**: `587`
- **Usuário**: Seu email completo
- **Senha**: **Senha de App**

**Como criar senha de app no Yahoo:**
1. Acesse https://login.yahoo.com/account/security
2. Ative a verificação em duas etapas
3. Clique em "Gerar senha do app"
4. Use essa senha no sistema

#### **Email Personalizado**
Se você tem um email corporativo ou outro provedor:
- Selecione "Personalizado"
- Peça ao seu provedor os dados SMTP:
  - Servidor SMTP
  - Porta (geralmente 587 ou 465)
  - Se usa TLS/SSL

## 🔒 Segurança

- ✅ As senhas são criptografadas antes de serem salvas
- ✅ Conexões usam TLS para segurança
- ✅ Apenas você tem acesso às suas configurações
- ✅ Recomendamos usar senhas de app ao invés de senhas normais

## ✅ Testar Configuração

Após preencher os dados, clique em **"Testar Email"**:
- Um email de teste será enviado para seu próprio email
- Se você receber o email, está tudo configurado!
- Se houver erro, revise suas credenciais

## 📨 Usar o Sistema de Email

Depois de configurado, você pode:
- Enviar emails para clientes através do módulo de Comunicação
- Receber notificações por email
- Enviar confirmações de agendamento
- Enviar lembretes automáticos

## ⚠️ Problemas Comuns

### "Autenticação falhou"
- **Gmail**: Certifique-se de usar senha de app, não sua senha normal
- **Outlook**: Verifique se a senha está correta
- **Yahoo**: Use senha de app

### "Conexão recusada"
- Verifique se o servidor SMTP está correto
- Confira se a porta está correta (587 ou 465)

### "Email não chegou"
- Verifique a pasta de spam
- Aguarde alguns minutos (pode demorar)
- Teste com outro destinatário

## 🔧 Configurações Avançadas

### Porta 587 vs 465
- **587**: STARTTLS (recomendado, mais compatível)
- **465**: SSL/TLS direto (mais antigo)

### Conexão Segura (TLS)
- Sempre mantenha ativado
- Garante que suas credenciais não sejam interceptadas

## 📞 Suporte

Se tiver problemas:
1. Teste com o email de teste
2. Verifique os logs de erro
3. Consulte a documentação do seu provedor de email
4. Entre em contato com o suporte técnico

---

**Última atualização**: 2025-01-10
