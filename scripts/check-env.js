#!/usr/bin/env node

/**
 * Script para validar variáveis de ambiente obrigatórias
 * Executa antes do build para garantir que todas as configs estão presentes
 */

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const optionalEnvVars = [
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_SENTRY_DSN',
  'VITE_VAPID_PUBLIC_KEY',
];

console.log('🔍 Verificando variáveis de ambiente...\n');

let hasError = false;

// Check required vars
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.error(`❌ ERRO: ${varName} não está definida`);
    hasError = true;
  } else {
    console.log(`✅ ${varName} está definida`);
  }
});

// Check optional vars
console.log('\n📋 Variáveis opcionais:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`⚠️  AVISO: ${varName} não está definida (opcional)`);
  } else {
    console.log(`✅ ${varName} está definida`);
  }
});

if (hasError) {
  console.error('\n❌ Algumas variáveis obrigatórias estão faltando!');
  console.error('📝 Copie .env.example para .env e preencha os valores necessários.');
  process.exit(1);
}

console.log('\n✅ Todas as variáveis obrigatórias estão configuradas!');
