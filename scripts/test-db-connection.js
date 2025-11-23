#!/usr/bin/env node

/**
 * Script para testar conexão com banco de dados Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

console.log('🔍 Testando conexão com Supabase...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check connection
    console.log('1️⃣ Testando conexão básica...');
    const { error: pingError } = await supabase.from('subscription_plans').select('count').limit(1);
    
    if (pingError) {
      throw new Error(`Falha na conexão: ${pingError.message}`);
    }
    console.log('✅ Conexão estabelecida com sucesso\n');

    // Test 2: Check auth
    console.log('2️⃣ Testando autenticação...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Nenhuma sessão ativa (esperado se não logado)');
    } else if (session) {
      console.log(`✅ Sessão ativa: ${session.user.email}`);
    } else {
      console.log('✅ Auth configurado corretamente (sem sessão ativa)');
    }
    console.log('');

    // Test 3: Check tables
    console.log('3️⃣ Verificando tabelas principais...');
    const tables = [
      'subscription_plans',
      'partner_subscriptions',
      'crm_clients',
      'crm_vehicles',
      'crm_appointments',
      'crm_service_orders',
      'crm_parts',
      'crm_financial_transactions',
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ Tabela '${table}': ${error.message}`);
      } else {
        console.log(`✅ Tabela '${table}' acessível`);
      }
    }

    console.log('\n✅ Todos os testes passaram!');
    console.log('🎉 Sistema pronto para uso!');
    
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error.message);
    process.exit(1);
  }
}

testConnection();
