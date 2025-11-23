/**
 * Script para atualizar todas as referências de tabelas do CRM
 * De: partner_clients, vehicles, appointments, etc.
 * Para: crm_clients, crm_vehicles, crm_appointments, etc.
 */

const fs = require('fs');
const path = require('path');

// Mapeamento de nomes antigos para novos
const TABLE_MAPPINGS = {
  'partner_clients': 'crm_clients',
  'vehicles': 'crm_vehicles',
  'partner_fleet': 'crm_fleet',
  'appointments': 'crm_appointments',
  'service_orders': 'crm_service_orders',
  'service_order_items': 'crm_service_order_items',
  'parts': 'crm_parts',
  'stock_movements': 'crm_stock_movements',
  'financial_transactions': 'crm_financial_transactions',
  'email_log': 'crm_email_log',
  'whatsapp_log': 'crm_whatsapp_log',
  'chat_messages': 'crm_chat_messages',
};

// Diretórios para processar
const DIRECTORIES = [
  'src/hooks',
  'src/pages',
  'src/components',
  'src/contexts',
  'src/types',
  'src/integrations/supabase',
];

// Função para processar um arquivo
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Substituir cada tabela
  Object.entries(TABLE_MAPPINGS).forEach(([oldName, newName]) => {
    // Padrões de substituição
    const patterns = [
      // .from('table_name')
      { regex: new RegExp(`\\.from\\(['"\`]${oldName}['"\`]\\)`, 'g'), replacement: `.from('${newName}')` },
      // .from("table_name")
      { regex: new RegExp(`\\.from\\(["']${oldName}["']\\)`, 'g'), replacement: `.from('${newName}')` },
      // Tables: { table_name: {
      { regex: new RegExp(`(Tables:\\s*{[^}]*\\b)${oldName}(\\s*:)`, 'g'), replacement: `$1${newName}$2` },
    ];

    patterns.forEach(({ regex, replacement }) => {
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        modified = true;
      }
    });
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Atualizado: ${filePath}`);
    return true;
  }

  return false;
}

// Função para processar um diretório recursivamente
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let filesModified = 0;

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      filesModified += processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      if (processFile(fullPath)) {
        filesModified++;
      }
    }
  });

  return filesModified;
}

// Executar o script
console.log('🔄 Iniciando atualização de nomes de tabelas...\n');

let totalFilesModified = 0;

DIRECTORIES.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`📁 Processando: ${dir}`);
    const modified = processDirectory(fullPath);
    totalFilesModified += modified;
    console.log(`   ${modified} arquivo(s) modificado(s)\n`);
  } else {
    console.log(`⚠️  Diretório não encontrado: ${dir}\n`);
  }
});

console.log(`\n✅ Concluído! Total de arquivos modificados: ${totalFilesModified}`);
console.log('\n📝 Próximos passos:');
console.log('1. Execute a migration: npm run supabase:migrate');
console.log('2. Verifique se há erros de compilação: npm run build');
console.log('3. Teste o sistema: npm run dev');

