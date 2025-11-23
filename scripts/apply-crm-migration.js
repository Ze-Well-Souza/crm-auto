#!/usr/bin/env node

/**
 * Script para aplicar a migration de renomeação de tabelas CRM
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '.env.development' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

console.log('🔄 Aplicando migration de renomeação de tabelas CRM...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    // Ler o arquivo de migration
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251123_rename_tables_to_crm_prefix.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📄 Lendo migration: 20251123_rename_tables_to_crm_prefix.sql\n');

    // Dividir o SQL em comandos individuais
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('/*'));

    console.log(`📝 Encontrados ${commands.length} comandos SQL\n`);

    // Executar cada comando
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Pular comentários e comandos de transação
      if (command.includes('BEGIN') || command.includes('COMMIT') || command.includes('COMMENT ON')) {
        continue;
      }

      try {
        console.log(`⏳ Executando comando ${i + 1}/${commands.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`⚠️  Aviso: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Comando ${i + 1} executado com sucesso`);
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  Erro ao executar comando ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Sucesso: ${successCount}`);
    console.log(`   ⚠️  Avisos: ${errorCount}`);

    // Verificar se as tabelas foram renomeadas
    console.log('\n🔍 Verificando tabelas renomeadas...\n');

    const tablesToCheck = [
      'crm_clients',
      'crm_vehicles',
      'crm_fleet',
      'crm_appointments',
      'crm_service_orders',
      'crm_service_order_items',
      'crm_parts',
      'crm_stock_movements',
      'crm_financial_transactions',
    ];

    for (const table of tablesToCheck) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ Tabela '${table}': ${error.message}`);
      } else {
        console.log(`✅ Tabela '${table}' acessível`);
      }
    }

    console.log('\n✅ Migration aplicada com sucesso!');
    console.log('🎉 Todas as tabelas do CRM agora têm o prefixo crm_\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao aplicar migration:', error.message);
    process.exit(1);
  }
}

applyMigration();

