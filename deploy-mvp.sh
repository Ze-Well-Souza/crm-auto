#!/bin/bash

# CRM Auto MVP Deployment Script
# Este script prepara e faz deploy da versão MVP do CRM Auto

set -e

echo "🚀 Iniciando deploy do CRM Auto MVP..."

# Limpar diretório de build anterior
echo "🧹 Limpando build anterior..."
rm -rf dist

# Instalar dependências otimizadas para MVP
echo "📦 Instalando dependências MVP..."
cp package-mvp.json package.json
npm install

# Build otimizado para produção
echo "🔨 Construindo aplicação MVP..."
npm run build

# Verificar se o build foi bem sucedido
if [ ! -d "dist" ]; then
    echo "❌ Erro: Build falhou!"
    exit 1
fi

# Copiar arquivos de configuração para deploy
echo "📋 Copiando arquivos de configuração..."
cp .env.mvp dist/.env

# Criar arquivo de versão
echo "🏷️  Criando arquivo de versão..."
echo "CRM Auto MVP v1.0.0 - $(date)" > dist/VERSION

# Tamanho do build
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "📊 Tamanho do build: $BUILD_SIZE"

echo "✅ Build MVP concluído com sucesso!"
echo "📁 Arquivos prontos em: ./dist"
echo ""
echo "Próximos passos:"
echo "1. Faça upload dos arquivos em ./dist para seu servidor"
echo "2. Configure seu servidor web para servir o index.html"
echo "3. Use o arquivo .env.mvp como referência para configurações"
echo ""
echo "🎉 CRM Auto MVP está pronto para deploy!"