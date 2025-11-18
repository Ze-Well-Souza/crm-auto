@echo off
REM CRM Auto MVP Deployment Script for Windows
REM Este script prepara e faz deploy da versão MVP do CRM Auto

echo 🚀 Iniciando deploy do CRM Auto MVP...

REM Limpar diretório de build anterior
echo 🧹 Limpando build anterior...
if exist dist rmdir /s /q dist

REM Instalar dependências otimizadas para MVP
echo 📦 Instalando dependências MVP...
copy package-mvp.json package.json
npm install

REM Build otimizado para produção
echo 🔨 Construindo aplicação MVP...
npm run build

REM Verificar se o build foi bem sucedido
if not exist dist (
    echo ❌ Erro: Build falhou!
    exit /b 1
)

REM Copiar arquivos de configuração para deploy
echo 📋 Copiando arquivos de configuração...
copy .env.mvp dist\.env

REM Criar arquivo de versão
echo 🏷️  Criando arquivo de versão...
echo CRM Auto MVP v1.0.0 - %date% %time% > dist\VERSION

echo ✅ Build MVP concluído com sucesso!
echo 📁 Arquivos prontos em: .\dist
echo.
echo Próximos passos:
echo 1. Faça upload dos arquivos em .\dist para seu servidor
echo 2. Configure seu servidor web para servir o index.html
echo 3. Use o arquivo .env.mvp como referência para configurações
echo.
echo 🎉 CRM Auto MVP está pronto para deploy!

pause