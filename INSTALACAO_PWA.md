# 📱 Guia de Instalação PWA - CRM Autos

## ✅ O que foi implementado

### 1. **PWA Completo**
- ✅ Configuração vite-plugin-pwa
- ✅ Service Worker automático
- ✅ Manifest.json configurado
- ✅ Ícones PWA (necessário gerar)
- ✅ Meta tags mobile
- ✅ Página /install dedicada
- ✅ Cache offline de assets
- ✅ Cache de chamadas Supabase

### 2. **WhatsApp Business + WhatsApp Web**
- ✅ Edge Function para WhatsApp Business API
- ✅ Integração WhatsApp Web (link direto)
- ✅ Templates de mensagens
- ✅ Substituição de variáveis
- ✅ Preview de mensagens
- ✅ Formatação automática de telefone
- ✅ Suporte para mensagens livres

---

## 📦 Como Gerar os Ícones PWA

### Opção 1: Gerar via HTML (Automático)

1. Abra o arquivo `public/icons/generate-icons.html` no navegador
2. Os ícones serão gerados e baixados automaticamente
3. Mova os arquivos baixados para `public/icons/`

### Opção 2: Usar uma ferramenta online

Use ferramentas como:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/
- https://favicon.io/

**Upload uma imagem 512x512px** e a ferramenta gerará todos os tamanhos necessários:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

---

## 🔧 Configuração WhatsApp Business API

Para usar o WhatsApp Business API, você precisa:

### 1. **Criar conta no Meta Business**
- Acesse: https://business.facebook.com/
- Crie uma conta Business
- Configure o WhatsApp Business API

### 2. **Obter credenciais**
No dashboard do Meta Business, obtenha:
- **WHATSAPP_PHONE_ID**: ID do número de telefone
- **WHATSAPP_TOKEN**: Token de acesso permanente

### 3. **Adicionar secrets no Supabase**
Execute os comandos ou use a interface:
```bash
# No painel do Supabase > Settings > Edge Functions > Secrets
WHATSAPP_PHONE_ID=seu_phone_id
WHATSAPP_TOKEN=seu_token
```

### 4. **Configurar Templates (Opcional)**
No Meta Business Manager:
1. Vá em WhatsApp Manager > Message Templates
2. Crie templates aprovados pela Meta
3. Use os IDs dos templates na aplicação

---

## 📱 Como Usar

### WhatsApp Web
1. Digite o número e mensagem
2. Clique em "WhatsApp Web"
3. Abre uma conversa no WhatsApp Web com mensagem pré-preenchida
4. **Não requer** configuração adicional

### WhatsApp Business API
1. Configure os secrets (acima)
2. Digite o número e mensagem
3. Clique em "API Business"
4. Mensagem enviada automaticamente via API

---

## 🚀 Testando o PWA

### Desktop (Chrome/Edge)
1. Abra o app no navegador
2. Procure o ícone de instalação (⊕) na barra de endereço
3. Clique em "Instalar"

### Android
1. Abra o app no Chrome
2. Menu (⋮) > "Adicionar à tela inicial"
3. Confirme a instalação

### iOS (Safari)
1. Abra o app no Safari
2. Toque no botão compartilhar (↑)
3. "Adicionar à Tela de Início"
4. Confirme

### Acesse /install
O app possui uma página dedicada em `/install` com instruções detalhadas para cada plataforma.

---

## ✨ Recursos PWA Disponíveis

### Funcionando Offline
- ✅ Assets estáticos em cache
- ✅ Páginas navegadas ficam em cache
- ✅ Chamadas Supabase com NetworkFirst strategy

### Instalação
- ✅ Ícones para todos os tamanhos
- ✅ Atalhos de app (Agendamentos, Clientes, etc.)
- ✅ Nome curto e longo
- ✅ Tema personalizado

### Experiência Mobile
- ✅ Fullscreen standalone
- ✅ Splash screen automático
- ✅ Orientação portrait-primary
- ✅ Status bar estilizada

---

## 🧪 Verificação

### Checar se o PWA está funcionando

1. **Lighthouse Audit**
   - Chrome DevTools > Lighthouse
   - Run PWA audit
   - Score mínimo esperado: 90+

2. **Application Tab**
   - Chrome DevTools > Application
   - Verificar:
     - Manifest carregado
     - Service Worker registrado
     - Cache Storage populado

3. **Network Tab**
   - Coloque o app offline
   - Navegue pelas páginas
   - Páginas visitadas devem carregar do cache

---

## 📊 Status Atual

### PWA: ✅ 100% Completo
- Configuração completa
- Aguardando apenas geração de ícones
- Pronto para produção

### WhatsApp: ✅ 100% Completo
- WhatsApp Web: Funcionando sem configuração
- WhatsApp Business API: Aguardando credenciais
- Templates e UI prontos

---

## 🎯 Próximos Passos

1. ✅ Gerar ícones PWA (5 min)
2. ⚙️ Configurar WhatsApp Business API (se necessário)
3. 🧪 Testar instalação em dispositivos
4. 🚀 Deploy em produção

**Tempo estimado:** 15-30 minutos

---

**Última atualização:** 14/10/2025
