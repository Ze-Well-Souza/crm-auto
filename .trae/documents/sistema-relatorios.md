# 📊 Sistema de Relatórios Avançados - CRM Parceiro

**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Público-alvo:** Usuários finais, administradores e desenvolvedores

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tipos de Relatórios](#tipos-de-relatórios)
3. [Filtros Personalizáveis](#filtros-personalizáveis)
4. [Visualização de Dados](#visualização-de-dados)
5. [Exportação](#exportação)
6. [Relatórios Automáticos](#relatórios-automáticos)
7. [Dashboard Analytics](#dashboard-analytics)
8. [API de Relatórios](#api-de-relatórios)
9. [Configuração Técnica](#configuração-técnica)
10. [Casos de Uso](#casos-de-uso)

---

## 🎯 Visão Geral

O Sistema de Relatórios Avançados do CRM Parceiro oferece análises profundas e insights acionáveis para otimizar a gestão da oficina. Com filtros personalizáveis, visualizações interativas e múltiplos formatos de exportação.

### Principais Funcionalidades

- ✅ **Relatórios Dinâmicos** - Criação em tempo real
- ✅ **Filtros Avançados** - Múltiplos critérios combinados
- ✅ **Visualizações Interativas** - Gráficos e tabelas
- ✅ **Exportação Múltipla** - PDF, Excel, CSV, PNG
- ✅ **Agendamento** - Relatórios automáticos
- ✅ **Compartilhamento** - Links e emails
- ✅ **Histórico** - Versionamento de relatórios
- ✅ **Templates** - Modelos pré-configurados

### Benefícios

- 📈 **Tomada de Decisão** - Dados precisos e atualizados
- ⏱️ **Economia de Tempo** - Automação de relatórios
- 🎯 **Insights Acionáveis** - Análises profundas
- 📊 **Visualização Clara** - Gráficos intuitivos
- 🔄 **Integração Total** - Dados de todos os módulos

---

## 📈 Tipos de Relatórios

### 1. Relatórios Financeiros

#### Faturamento e Receitas
```
📊 Relatório de Faturamento
├── Receita por período
├── Comparativo mensal/anual
├── Receita por tipo de serviço
├── Receita por funcionário
├── Margem de lucro
└── Projeções futuras
```

**Métricas Incluídas:**
- Faturamento bruto/líquido
- Ticket médio
- Crescimento percentual
- Sazonalidade
- Meta vs. realizado

#### Fluxo de Caixa
```
💰 Análise de Fluxo de Caixa
├── Entradas por categoria
├── Saídas por categoria
├── Saldo acumulado
├── Projeção de caixa
├── Ponto de equilíbrio
└── Indicadores de liquidez
```

#### Inadimplência
```
⚠️ Relatório de Inadimplência
├── Clientes em atraso
├── Valores em aberto
├── Histórico de pagamentos
├── Taxa de recuperação
├── Provisão para perdas
└── Ações de cobrança
```

### 2. Relatórios Operacionais

#### Produtividade
```
⚙️ Análise de Produtividade
├── Serviços por funcionário
├── Tempo médio de execução
├── Eficiência da equipe
├── Capacidade ociosa
├── Horas trabalhadas
└── Performance individual
```

#### Agendamentos
```
📅 Relatório de Agendamentos
├── Taxa de ocupação
├── Horários de pico
├── Cancelamentos
├── Reagendamentos
├── Tempo de espera
└── Satisfação do cliente
```

#### Estoque
```
📦 Análise de Estoque
├── Giro de produtos
├── Itens em falta
├── Análise ABC
├── Sazonalidade
├── Fornecedores
└── Custos de estoque
```

### 3. Relatórios de Clientes

#### Análise de Clientes
```
👥 Perfil de Clientes
├── Segmentação demográfica
├── Comportamento de compra
├── Lifetime value (LTV)
├── Frequência de visitas
├── Preferências de serviço
└── Satisfação geral
```

#### Retenção e Churn
```
🔄 Análise de Retenção
├── Taxa de retenção
├── Taxa de churn
├── Clientes ativos/inativos
├── Motivos de cancelamento
├── Campanhas de reativação
└── Valor do cliente perdido
```

### 4. Relatórios de Marketing

#### Campanhas
```
📢 Performance de Campanhas
├── ROI por campanha
├── Taxa de conversão
├── Custo por aquisição
├── Engajamento
├── Canais mais efetivos
└── Segmentação de audiência
```

#### Comunicação
```
💬 Análise de Comunicação
├── WhatsApp: entregas/leituras
├── Email: abertura/cliques
├── SMS: taxa de entrega
├── Notificações push
├── Feedback dos clientes
└── Canais preferidos
```

---

## 🔍 Filtros Personalizáveis

### Interface de Filtros

```typescript
interface ReportFilters {
  // Filtros temporais
  dateRange: {
    start: Date;
    end: Date;
    preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  };
  
  // Filtros de entidades
  customers?: string[];
  employees?: string[];
  services?: string[];
  vehicles?: string[];
  
  // Filtros financeiros
  amountRange?: {
    min: number;
    max: number;
  };
  
  // Filtros de status
  status?: string[];
  paymentMethod?: string[];
  
  // Filtros geográficos
  location?: {
    city?: string;
    state?: string;
    zipCode?: string;
  };
  
  // Filtros customizados
  customFields?: Record<string, any>;
}
```

### Componente de Filtros

```typescript
// src/components/reports/ReportFilters.tsx
import React, { useState } from 'react';
import { DateRangePicker, MultiSelect, RangeSlider } from '../common';

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFilters) => void;
  availableFilters: string[];
  initialFilters?: Partial<ReportFilters>;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  onFiltersChange,
  availableFilters,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-semibold">Filtros</h3>
      
      {/* Período */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Período
        </label>
        <DateRangePicker
          value={filters.dateRange}
          onChange={(range) => handleFilterChange('dateRange', range)}
          presets={[
            { label: 'Hoje', value: 'today' },
            { label: 'Esta semana', value: 'week' },
            { label: 'Este mês', value: 'month' },
            { label: 'Este trimestre', value: 'quarter' },
            { label: 'Este ano', value: 'year' },
          ]}
        />
      </div>

      {/* Clientes */}
      {availableFilters.includes('customers') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Clientes
          </label>
          <MultiSelect
            options={customerOptions}
            value={filters.customers}
            onChange={(customers) => handleFilterChange('customers', customers)}
            placeholder="Selecione os clientes..."
          />
        </div>
      )}

      {/* Funcionários */}
      {availableFilters.includes('employees') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Funcionários
          </label>
          <MultiSelect
            options={employeeOptions}
            value={filters.employees}
            onChange={(employees) => handleFilterChange('employees', employees)}
            placeholder="Selecione os funcionários..."
          />
        </div>
      )}

      {/* Faixa de valores */}
      {availableFilters.includes('amount') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Faixa de Valores
          </label>
          <RangeSlider
            min={0}
            max={10000}
            value={[filters.amountRange?.min || 0, filters.amountRange?.max || 10000]}
            onChange={([min, max]) => handleFilterChange('amountRange', { min, max })}
            formatValue={(value) => `R$ ${value.toFixed(2)}`}
          />
        </div>
      )}

      {/* Status */}
      {availableFilters.includes('status') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>
          <MultiSelect
            options={statusOptions}
            value={filters.status}
            onChange={(status) => handleFilterChange('status', status)}
            placeholder="Selecione os status..."
          />
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setFilters({});
            onFiltersChange({});
          }}
        >
          Limpar Filtros
        </Button>
        
        <Button
          onClick={() => onFiltersChange(filters)}
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};
```

### Filtros Avançados

**Operadores Lógicos:**
- `AND` - Todos os critérios devem ser atendidos
- `OR` - Pelo menos um critério deve ser atendido
- `NOT` - Excluir registros que atendem ao critério

**Comparadores:**
- `=` Igual a
- `!=` Diferente de
- `>` Maior que
- `<` Menor que
- `>=` Maior ou igual
- `<=` Menor ou igual
- `LIKE` Contém texto
- `IN` Está na lista
- `BETWEEN` Entre valores

---

## 📊 Visualização de Dados

### Tipos de Gráficos

#### 1. Gráficos de Linha
```typescript
// Tendências temporais
const LineChart = {
  type: 'line',
  data: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [{
      label: 'Faturamento',
      data: [12000, 15000, 18000, 16000, 20000],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    }]
  },
  options: {
    responsive: true,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolução do Faturamento'
      }
    }
  }
};
```

#### 2. Gráficos de Barras
```typescript
// Comparações categóricas
const BarChart = {
  type: 'bar',
  data: {
    labels: ['Mecânica', 'Elétrica', 'Pintura', 'Funilaria'],
    datasets: [{
      label: 'Receita por Serviço',
      data: [45000, 32000, 28000, 15000],
      backgroundColor: [
        '#EF4444',
        '#10B981',
        '#F59E0B',
        '#8B5CF6'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Receita por Tipo de Serviço'
      }
    }
  }
};
```

#### 3. Gráficos de Pizza
```typescript
// Distribuições percentuais
const PieChart = {
  type: 'doughnut',
  data: {
    labels: ['Cartão', 'PIX', 'Dinheiro', 'Boleto'],
    datasets: [{
      data: [45, 30, 15, 10],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Formas de Pagamento'
      }
    }
  }
};
```

#### 4. Mapas de Calor
```typescript
// Densidade de dados
const HeatmapChart = {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Agendamentos por Hora',
      data: heatmapData,
      backgroundColor: function(context) {
        const value = context.parsed.v;
        const alpha = value / 100;
        return `rgba(59, 130, 246, ${alpha})`;
      }
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 23,
        title: {
          display: true,
          text: 'Hora do Dia'
        }
      },
      y: {
        type: 'linear',
        min: 0,
        max: 6,
        title: {
          display: true,
          text: 'Dia da Semana'
        }
      }
    }
  }
};
```

### Componente de Visualização

```typescript
// src/components/reports/ChartVisualization.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartVisualizationProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: any;
  options?: any;
  height?: number;
}

export const ChartVisualization: React.FC<ChartVisualizationProps> = ({
  type,
  data,
  options = {},
  height = 400,
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    ...options,
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={defaultOptions} />;
      case 'bar':
        return <Bar data={data} options={defaultOptions} />;
      case 'doughnut':
      case 'pie':
        return <Doughnut data={data} options={defaultOptions} />;
      default:
        return <div>Tipo de gráfico não suportado</div>;
    }
  };

  return (
    <div style={{ height }}>
      {renderChart()}
    </div>
  );
};
```

### Tabelas Interativas

```typescript
// src/components/reports/DataTable.tsx
import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';

interface DataTableProps {
  data: any[];
  columns: any[];
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  pageSize = 10,
  sortable = true,
  filterable = true,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(
                      sortable ? column.getSortByToggleProps() : {}
                    )}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.render('Header')}</span>
                      {sortable && (
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ' ↕️'}
                        </span>
                      )}
                    </div>
                    {filterable && column.canFilter && (
                      <div onClick={e => e.stopPropagation()}>
                        {column.render('Filter')}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Página {pageIndex + 1} de {pageOptions.length}
          </span>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            variant="outline"
            size="sm"
          >
            {'<<'}
          </Button>
          <Button
            onClick={previousPage}
            disabled={!canPreviousPage}
            variant="outline"
            size="sm"
          >
            Anterior
          </Button>
          <Button
            onClick={nextPage}
            disabled={!canNextPage}
            variant="outline"
            size="sm"
          >
            Próximo
          </Button>
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            variant="outline"
            size="sm"
          >
            {'>>'}
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

## 📤 Exportação

### Formatos Suportados

#### 1. PDF
```typescript
// src/services/export/pdf.service.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class PDFExportService {
  async exportReport(reportData: any, options: PDFExportOptions) {
    const doc = new jsPDF();
    
    // Cabeçalho
    this.addHeader(doc, options);
    
    // Dados
    this.addData(doc, reportData, options);
    
    // Gráficos (se houver)
    if (options.includeCharts) {
      await this.addCharts(doc, reportData.charts);
    }
    
    // Rodapé
    this.addFooter(doc, options);
    
    return doc.save(options.filename || 'relatorio.pdf');
  }

  private addHeader(doc: jsPDF, options: PDFExportOptions) {
    // Logo da empresa
    if (options.logo) {
      doc.addImage(options.logo, 'PNG', 20, 20, 30, 15);
    }
    
    // Título
    doc.setFontSize(20);
    doc.text(options.title || 'Relatório', 20, 50);
    
    // Período
    doc.setFontSize(12);
    doc.text(`Período: ${options.period}`, 20, 60);
    
    // Data de geração
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 70);
  }

  private addData(doc: jsPDF, data: any, options: PDFExportOptions) {
    if (data.table) {
      (doc as any).autoTable({
        head: data.table.headers,
        body: data.table.rows,
        startY: 80,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
        },
      });
    }
  }

  private async addCharts(doc: jsPDF, charts: any[]) {
    for (const chart of charts) {
      const canvas = await this.chartToCanvas(chart);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, doc.lastAutoTable.finalY + 20, 170, 100);
    }
  }

  private addFooter(doc: jsPDF, options: PDFExportOptions) {
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }
  }
}
```

#### 2. Excel
```typescript
// src/services/export/excel.service.ts
import * as XLSX from 'xlsx';

export class ExcelExportService {
  async exportReport(reportData: any, options: ExcelExportOptions) {
    const workbook = XLSX.utils.book_new();
    
    // Planilha principal com dados
    if (reportData.table) {
      const worksheet = XLSX.utils.aoa_to_sheet([
        reportData.table.headers,
        ...reportData.table.rows
      ]);
      
      // Aplicar formatação
      this.applyFormatting(worksheet, options);
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    }
    
    // Planilha de resumo
    if (reportData.summary) {
      const summarySheet = this.createSummarySheet(reportData.summary);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
    }
    
    // Planilha de gráficos (dados para gráficos)
    if (reportData.charts) {
      const chartsSheet = this.createChartsDataSheet(reportData.charts);
      XLSX.utils.book_append_sheet(workbook, chartsSheet, 'Gráficos');
    }
    
    // Salvar arquivo
    XLSX.writeFile(workbook, options.filename || 'relatorio.xlsx');
  }

  private applyFormatting(worksheet: any, options: ExcelExportOptions) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Formatação do cabeçalho
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '3B82F6' } },
        alignment: { horizontal: 'center' },
      };
    }
    
    // Auto-ajustar largura das colunas
    const colWidths = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 0;
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellAddress] && worksheet[cellAddress].v) {
          const cellValue = worksheet[cellAddress].v.toString();
          maxWidth = Math.max(maxWidth, cellValue.length);
        }
      }
      colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
    }
    worksheet['!cols'] = colWidths;
  }
}
```

#### 3. CSV
```typescript
// src/services/export/csv.service.ts
export class CSVExportService {
  async exportReport(reportData: any, options: CSVExportOptions) {
    let csvContent = '';
    
    // Cabeçalho
    if (reportData.table.headers) {
      csvContent += reportData.table.headers.join(',') + '\n';
    }
    
    // Dados
    reportData.table.rows.forEach((row: any[]) => {
      const escapedRow = row.map(cell => this.escapeCSVCell(cell));
      csvContent += escapedRow.join(',') + '\n';
    });
    
    // Download
    this.downloadCSV(csvContent, options.filename || 'relatorio.csv');
  }

  private escapeCSVCell(cell: any): string {
    if (cell === null || cell === undefined) return '';
    
    const cellString = cell.toString();
    
    // Escapar aspas duplas
    const escaped = cellString.replace(/"/g, '""');
    
    // Envolver em aspas se contém vírgula, quebra de linha ou aspas
    if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
      return `"${escaped}"`;
    }
    
    return escaped;
  }

  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
```

#### 4. Imagem (PNG/JPG)
```typescript
// src/services/export/image.service.ts
import html2canvas from 'html2canvas';

export class ImageExportService {
  async exportChart(chartElement: HTMLElement, options: ImageExportOptions) {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: options.backgroundColor || '#ffffff',
      scale: options.scale || 2,
      logging: false,
    });
    
    // Converter para blob
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, options.format || 'image/png', options.quality || 0.9);
    });
  }

  async downloadChart(chartElement: HTMLElement, filename: string, options: ImageExportOptions = {}) {
    const blob = await this.exportChart(chartElement, options);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}
```

### Componente de Exportação

```typescript
// src/components/reports/ExportOptions.tsx
import React, { useState } from 'react';
import { Button, Dropdown, Modal } from '../common';
import { 
  PDFExportService,
  ExcelExportService,
  CSVExportService,
  ImageExportService 
} from '../../services/export';

interface ExportOptionsProps {
  reportData: any;
  reportTitle: string;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: string) => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  reportData,
  reportTitle,
  onExportStart,
  onExportComplete,
  onExportError,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const exportServices = {
    pdf: new PDFExportService(),
    excel: new ExcelExportService(),
    csv: new CSVExportService(),
    image: new ImageExportService(),
  };

  const handleExport = async (format: string, options: any = {}) => {
    setIsExporting(true);
    onExportStart?.();

    try {
      const filename = `${reportTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      switch (format) {
        case 'pdf':
          await exportServices.pdf.exportReport(reportData, {
            ...options,
            filename: `${filename}.pdf`,
            title: reportTitle,
          });
          break;
          
        case 'excel':
          await exportServices.excel.exportReport(reportData, {
            ...options,
            filename: `${filename}.xlsx`,
          });
          break;
          
        case 'csv':
          await exportServices.csv.exportReport(reportData, {
            ...options,
            filename: `${filename}.csv`,
          });
          break;
          
        case 'image':
          const chartElement = document.querySelector('[data-chart]') as HTMLElement;
          if (chartElement) {
            await exportServices.image.downloadChart(
              chartElement,
              `${filename}.png`,
              options
            );
          }
          break;
      }
      
      onExportComplete?.();
    } catch (error: any) {
      onExportError?.(error.message);
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  const exportOptions = [
    {
      label: 'PDF',
      icon: '📄',
      description: 'Documento formatado para impressão',
      action: () => handleExport('pdf'),
    },
    {
      label: 'Excel',
      icon: '📊',
      description: 'Planilha editável com múltiplas abas',
      action: () => handleExport('excel'),
    },
    {
      label: 'CSV',
      icon: '📋',
      description: 'Dados tabulares simples',
      action: () => handleExport('csv'),
    },
    {
      label: 'Imagem',
      icon: '🖼️',
      description: 'Gráfico como imagem PNG',
      action: () => handleExport('image'),
    },
  ];

  return (
    <>
      <Button
        onClick={() => setShowOptions(true)}
        disabled={isExporting}
        className="flex items-center space-x-2"
      >
        <span>📤</span>
        <span>{isExporting ? 'Exportando...' : 'Exportar'}</span>
      </Button>

      <Modal
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        title="Opções de Exportação"
      >
        <div className="space-y-4">
          {exportOptions.map((option) => (
            <div
              key={option.label}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={option.action}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h4 className="font-medium">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Exportar
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
```

---

## ⏰ Relatórios Automáticos

### Agendamento de Relatórios

```typescript
// src/services/scheduler.service.ts
import cron from 'node-cron';
import { ReportService } from './report.service';
import { EmailService } from './email.service';

export class ReportSchedulerService {
  private reportService = new ReportService();
  private emailService = new EmailService();
  private scheduledJobs = new Map();

  async scheduleReport(config: ScheduleConfig) {
    const job = cron.schedule(config.cronExpression, async () => {
      try {
        // Gerar relatório
        const reportData = await this.reportService.generateReport({
          type: config.reportType,
          filters: config.filters,
          format: config.format,
        });

        // Enviar por email
        if (config.emailRecipients.length > 0) {
          await this.emailService.sendReportEmail({
            recipients: config.emailRecipients,
            subject: `Relatório Automático: ${config.name}`,
            reportData,
            attachments: config.includeAttachment ? [reportData.file] : [],
          });
        }

        // Salvar no sistema
        if (config.saveToSystem) {
          await this.reportService.saveReport({
            name: config.name,
            data: reportData,
            generatedAt: new Date(),
            type: 'scheduled',
          });
        }

        console.log(`Relatório automático gerado: ${config.name}`);
      } catch (error) {
        console.error(`Erro ao gerar relatório automático: ${config.name}`, error);
        
        // Notificar administradores sobre o erro
        await this.emailService.sendErrorNotification({
          error,
          reportName: config.name,
        });
      }
    }, {
      scheduled: false,
      timezone: config.timezone || 'America/Sao_Paulo',
    });

    this.scheduledJobs.set(config.id, job);
    job.start();

    return config.id;
  }

  async unscheduleReport(configId: string) {
    const job = this.scheduledJobs.get(configId);
    if (job) {
      job.destroy();
      this.scheduledJobs.delete(configId);
    }
  }

  async updateSchedule(configId: string, newConfig: ScheduleConfig) {
    await this.unscheduleReport(configId);
    return await this.scheduleReport({ ...newConfig, id: configId });
  }

  getActiveSchedules() {
    return Array.from(this.scheduledJobs.keys());
  }
}

interface ScheduleConfig {
  id: string;
  name: string;
  reportType: string;
  cronExpression: string;
  filters: any;
  format: 'pdf' | 'excel' | 'csv';
  emailRecipients: string[];
  includeAttachment: boolean;
  saveToSystem: boolean;
  timezone?: string;
}
```

### Interface de Agendamento

```typescript
// src/components/reports/ScheduleReport.tsx
import React, { useState } from 'react';
import { Button, Input, Select, Checkbox, Modal } from '../common';
import { CronBuilder } from './CronBuilder';

interface ScheduleReportProps {
  reportType: string;
  reportFilters: any;
  onSchedule: (config: ScheduleConfig) => void;
}

export const ScheduleReport: React.FC<ScheduleReportProps> = ({
  reportType,
  reportFilters,
  onSchedule,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Partial<ScheduleConfig>>({
    name: '',
    reportType,
    filters: reportFilters,
    format: 'pdf',
    emailRecipients: [],
    includeAttachment: true,
    saveToSystem: true,
    cronExpression: '0 9 * * 1', // Segunda-feira às 9h
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(config as ScheduleConfig);
    setIsOpen(false);
  };

  const frequencyOptions = [
    { value: '0 9 * * *', label: 'Diário às 9h' },
    { value: '0 9 * * 1', label: 'Semanal (Segunda às 9h)' },
    { value: '0 9 1 * *', label: 'Mensal (Dia 1 às 9h)' },
    { value: '0 9 1 1,4,7,10 *', label: 'Trimestral' },
    { value: 'custom', label: 'Personalizado' },
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <span>⏰</span>
        <span>Agendar Relatório</span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Agendar Relatório Automático"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do agendamento */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nome do Agendamento
            </label>
            <Input
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="Ex: Relatório Financeiro Mensal"
              required
            />
          </div>

          {/* Frequência */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Frequência
            </label>
            <Select
              value={config.cronExpression}
              onChange={(value) => setConfig({ ...config, cronExpression: value })}
              options={frequencyOptions}
            />
            
            {config.cronExpression === 'custom' && (
              <div className="mt-4">
                <CronBuilder
                  value={config.cronExpression}
                  onChange={(cron) => setConfig({ ...config, cronExpression: cron })}
                />
              </div>
            )}
          </div>

          {/* Formato */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Formato de Exportação
            </label>
            <Select
              value={config.format}
              onChange={(value) => setConfig({ ...config, format: value })}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'csv', label: 'CSV' },
              ]}
            />
          </div>

          {/* Destinatários */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Destinatários de Email
            </label>
            <EmailRecipientsInput
              value={config.emailRecipients}
              onChange={(recipients) => setConfig({ ...config, emailRecipients: recipients })}
            />
          </div>

          {/* Opções */}
          <div className="space-y-3">
            <Checkbox
              checked={config.includeAttachment}
              onChange={(checked) => setConfig({ ...config, includeAttachment: checked })}
              label="Incluir relatório como anexo no email"
            />
            
            <Checkbox
              checked={config.saveToSystem}
              onChange={(checked) => setConfig({ ...config, saveToSystem: checked })}
              label="Salvar relatório no sistema"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Agendar Relatório
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
```

---

## 📊 Dashboard Analytics

### Métricas em Tempo Real

```typescript
// src/components/reports/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { MetricCard, ChartVisualization, DataTable } from '../common';
import { analyticsService } from '../../services/analytics.service';

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 segundos

  const { data: metrics, isLoading } = useQuery(
    ['analytics', timeRange],
    () => analyticsService.getMetrics(timeRange),
    {
      refetchInterval: refreshInterval,
      staleTime: 10000,
    }
  );

  const { data: realtimeData } = useQuery(
    'realtime-analytics',
    analyticsService.getRealtimeData,
    {
      refetchInterval: 5000, // 5 segundos
    }
  );

  if (isLoading) {
    return <div>Carregando analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Analytics</h2>
        
        <div className="flex space-x-4">
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '7d', label: 'Últimos 7 dias' },
              { value: '30d', label: 'Últimos 30 dias' },
              { value: '90d', label: 'Últimos 90 dias' },
              { value: '1y', label: 'Último ano' },
            ]}
          />
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            🔄 Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Faturamento"
          value={metrics?.revenue?.total}
          format="currency"
          change={metrics?.revenue?.change}
          trend={metrics?.revenue?.trend}
          icon="💰"
        />
        
        <MetricCard
          title="Agendamentos"
          value={metrics?.appointments?.total}
          change={metrics?.appointments?.change}
          trend={metrics?.appointments?.trend}
          icon="📅"
        />
        
        <MetricCard
          title="Clientes Ativos"
          value={metrics?.customers?.active}
          change={metrics?.customers?.change}
          trend={metrics?.customers?.trend}
          icon="👥"
        />
        
        <MetricCard
          title="Ticket Médio"
          value={metrics?.averageTicket?.value}
          format="currency"
          change={metrics?.averageTicket?.change}
          trend={metrics?.averageTicket?.trend}
          icon="🎯"
        />
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Evolução da Receita</h3>
          <ChartVisualization
            type="line"
            data={metrics?.revenueChart}
            height={300}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Serviços por Categoria</h3>
          <ChartVisualization
            type="doughnut"
            data={metrics?.servicesChart}
            height={300}
          />
        </div>
      </div>

      {/* Dados em tempo real */}
      {realtimeData && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Atividade em Tempo Real</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {realtimeData.onlineUsers}
              </div>
              <div className="text-sm text-gray-600">Usuários Online</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {realtimeData.todayAppointments}
              </div>
              <div className="text-sm text-gray-600">Agendamentos Hoje</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {realtimeData.pendingOrders}
              </div>
              <div className="text-sm text-gray-600">OS Pendentes</div>
            </div>
          </div>
        </div>
      )}

      {/* Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Top Funcionários</h3>
          <DataTable
            data={metrics?.topEmployees || []}
            columns={[
              { Header: 'Nome', accessor: 'name' },
              { Header: 'Serviços', accessor: 'services' },
              { Header: 'Receita', accessor: 'revenue', Cell: ({ value }) => formatCurrency(value) },
            ]}
            pageSize={5}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Top Clientes</h3>
          <DataTable
            data={metrics?.topCustomers || []}
            columns={[
              { Header: 'Nome', accessor: 'name' },
              { Header: 'Visitas', accessor: 'visits' },
              { Header: 'Gasto Total', accessor: 'totalSpent', Cell: ({ value }) => formatCurrency(value) },
            ]}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
};
```

---

## 🔧 API de Relatórios

### Endpoints Principais

```typescript
// src/routes/reports.routes.ts
import { Router } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateReportRequest } from '../middleware/validation.middleware';

const router = Router();
const reportsController = new ReportsController();

// Aplicar middleware de autenticação
router.use(authMiddleware);

// Gerar relatório
router.post('/generate', validateReportRequest, reportsController.generateReport);

// Listar relatórios salvos
router.get('/saved', reportsController.getSavedReports);

// Obter relatório específico
router.get('/:reportId', reportsController.getReport);

// Exportar relatório
router.post('/:reportId/export', reportsController.exportReport);

// Agendar relatório
router.post('/schedule', reportsController.scheduleReport);

// Listar agendamentos
router.get('/schedule/list', reportsController.getScheduledReports);

// Atualizar agendamento
router.put('/schedule/:scheduleId', reportsController.updateSchedule);

// Cancelar agendamento
router.delete('/schedule/:scheduleId', reportsController.cancelSchedule);

// Métricas do dashboard
router.get('/analytics/metrics', reportsController.getAnalyticsMetrics);

// Dados em tempo real
router.get('/analytics/realtime', reportsController.getRealtimeData);

export { router as reportsRoutes };
```

### Controller de Relatórios

```typescript
// src/controllers/reports.controller.ts
import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { AnalyticsService } from '../services/analytics.service';
import { ExportService } from '../services/export.service';

export class ReportsController {
  private reportService = new ReportService();
  private analyticsService = new AnalyticsService();
  private exportService = new ExportService();

  async generateReport(req: Request, res: Response) {
    try {
      const { type, filters, options } = req.body;
      const userId = req.user.id;

      const report = await this.reportService.generateReport({
        type,
        filters,
        options,
        userId,
      });

      res.json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async exportReport(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const { format, options } = req.body;

      const report = await this.reportService.getReport(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Relatório não encontrado',
        });
      }

      const exportedFile = await this.exportService.exportReport(
        report,
        format,
        options
      );

      res.json({
        success: true,
        data: {
          downloadUrl: exportedFile.url,
          filename: exportedFile.filename,
        },
      });
    } catch (error: any) {
      console.error('Erro ao exportar relatório:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAnalyticsMetrics(req: Request, res: Response) {
    try {
      const { timeRange = '30d' } = req.query;

      const metrics = await this.analyticsService.getMetrics(timeRange as string);

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error: any) {
      console.error('Erro ao buscar métricas:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getRealtimeData(req: Request, res: Response) {
    try {
      const realtimeData = await this.analyticsService.getRealtimeData();

      res.json({
        success: true,
        data: realtimeData,
      });
    } catch (error: any) {
      console.error('Erro ao buscar dados em tempo real:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
```

---

## 💡 Casos de Uso

### 1. Relatório Financeiro Mensal

```typescript
const monthlyFinancialReport = {
  type: 'financial',
  filters: {
    dateRange: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31'),
    },
  },
  sections: [
    'revenue_summary',
    'expense_breakdown',
    'profit_analysis',
    'cash_flow',
    'payment_methods',
  ],
  visualizations: [
    'revenue_trend',
    'expense_categories',
    'payment_distribution',
  ],
  exportFormat: 'pdf',
  schedule: {
    frequency: 'monthly',
    dayOfMonth: 1,
    time: '09:00',
    recipients: ['gerencia@oficina.com', 'financeiro@oficina.com'],
  },
};
```

### 2. Análise de Produtividade da Equipe

```typescript
const productivityReport = {
  type: 'productivity',
  filters: {
    dateRange: {
      preset: 'week',
    },
    employees: ['all'],
  },
  metrics: [
    'services_completed',
    'average_time',
    'efficiency_rate',
    'customer_satisfaction',
  ],
  comparisons: [
    'previous_week',
    'team_average',
    'individual_goals',
  ],
  exportFormat: 'excel',
  includeCharts: true,
};
```

### 3. Dashboard Executivo

```typescript
const executiveDashboard = {
  type: 'executive',
  realtime: true,
  widgets: [
    {
      type: 'metric',
      title: 'Faturamento Hoje',
      query: 'daily_revenue',
      format: 'currency',
    },
    {
      type: 'chart',
      title: 'Tendência de Agendamentos',
      query: 'appointments_trend',
      chartType: 'line',
    },
    {
      type: 'table',
      title: 'Top 5 Serviços',
      query: 'top_services',
      limit: 5,
    },
  ],
  refreshInterval: 30000, // 30 segundos
  autoExport: {
    frequency: 'daily',
    format: 'pdf',
    recipients: ['diretoria@oficina.com'],
  },
};
```

---

## 🚀 Próximos Passos

### Funcionalidades Futuras

1. **IA e Machine Learning**
   - Previsões de demanda
   - Detecção de anomalias
   - Recomendações automáticas

2. **Integração com BI**
   - Power BI
   - Tableau
   - Google Data Studio

3. **Relatórios Móveis**
   - App nativo
   - Notificações push
   - Visualização offline

4. **Analytics Avançados**
   - Cohort analysis
   - Funnel analysis
   - A/B testing

### Melhorias Técnicas

1. **Performance**
   - Cache inteligente
   - Processamento assíncrono
   - Otimização de queries

2. **Escalabilidade**
   - Microserviços
   - Load balancing
   - Database sharding

3. **Segurança**
   - Criptografia de dados
   - Auditoria completa
   - Compliance LGPD

---

**© 2025 CRM Parceiro - Sistema de Relatórios Avançados**

*Versão 1.0.0 - Janeiro 2025*