import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportData {
  [key: string]: any;
}

export interface ExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  includeDate?: boolean;
  includeFilters?: boolean;
  filters?: string[];
}

// PDF Export
export const exportToPDF = async (
  data: ExportData[],
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = 'relatorio',
    title = 'Relatório',
    subtitle = '',
    includeDate = true,
    includeFilters = false,
    filters = []
  } = options;

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  if (subtitle) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(subtitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
  }

  if (includeDate) {
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
  }

  // Filters
  if (includeFilters && filters.length > 0) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Filtros Aplicados:', 20, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    filters.forEach(filter => {
      pdf.text(`• ${filter}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }

  // Data Table
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const cellWidth = (pageWidth - 40) / headers.length;
    
    // Table headers
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      pdf.text(header, 20 + (index * cellWidth), yPosition);
    });
    yPosition += 8;

    // Table data
    pdf.setFont('helvetica', 'normal');
    data.forEach((row, rowIndex) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      headers.forEach((header, colIndex) => {
        const value = row[header]?.toString() || '';
        pdf.text(value.substring(0, 20), 20 + (colIndex * cellWidth), yPosition);
      });
      yPosition += 6;
    });
  }

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  pdf.save(`${filename}.pdf`);
};

// Excel Export
export const exportToExcel = (
  data: ExportData[],
  options: ExportOptions = {}
): void => {
  const {
    filename = 'relatorio',
    title = 'Relatório',
    includeDate = true,
    includeFilters = false,
    filters = []
  } = options;

  const workbook = XLSX.utils.book_new();
  
  // Create main data sheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add metadata
  const metadata: any[] = [];
  metadata.push({ A: title });
  
  if (includeDate) {
    metadata.push({ A: `Gerado em: ${new Date().toLocaleString('pt-BR')}` });
  }
  
  if (includeFilters && filters.length > 0) {
    metadata.push({ A: 'Filtros Aplicados:' });
    filters.forEach(filter => {
      metadata.push({ A: `• ${filter}` });
    });
  }
  
  metadata.push({ A: '' }); // Empty row
  
  // Insert metadata at the beginning
  XLSX.utils.sheet_add_json(worksheet, metadata, { origin: 'A1', skipHeader: true });
  
  // Adjust data starting position
  const dataStartRow = metadata.length + 1;
  XLSX.utils.sheet_add_json(worksheet, data, { origin: `A${dataStartRow}` });
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
  
  // Create summary sheet if data has numeric values
  const numericColumns = data.length > 0 ? 
    Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    ) : [];
  
  if (numericColumns.length > 0) {
    const summary = numericColumns.map(col => {
      const values = data.map(row => row[col]).filter(val => typeof val === 'number');
      return {
        Campo: col,
        Total: values.reduce((sum, val) => sum + val, 0),
        Média: values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0,
        Máximo: Math.max(...values),
        Mínimo: Math.min(...values),
        Contagem: values.length
      };
    });
    
    const summarySheet = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
  }
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// CSV Export
export const exportToCSV = (
  data: ExportData[],
  options: ExportOptions = {}
): void => {
  const {
    filename = 'relatorio',
    includeDate = true,
    includeFilters = false,
    filters = []
  } = options;

  let csvContent = '';
  
  // Add metadata
  if (includeDate) {
    csvContent += `Gerado em,${new Date().toLocaleString('pt-BR')}\n`;
  }
  
  if (includeFilters && filters.length > 0) {
    csvContent += 'Filtros Aplicados:\n';
    filters.forEach(filter => {
      csvContent += `${filter}\n`;
    });
  }
  
  csvContent += '\n'; // Empty line
  
  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    csvContent += headers.join(',') + '\n';
    
    // Add data
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value?.toString() || '';
      });
      csvContent += values.join(',') + '\n';
    });
  }
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

// Chart Export (PNG)
export const exportChartToPNG = async (
  elementId: string,
  filename: string = 'grafico'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemento não encontrado');
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.png`);
      }
    });
  } catch (error) {
    console.error('Erro ao exportar gráfico:', error);
    throw error;
  }
};

// Multi-format export
export const exportMultiFormat = async (
  data: ExportData[],
  formats: ('pdf' | 'excel' | 'csv')[],
  options: ExportOptions = {}
): Promise<void> => {
  const promises = formats.map(format => {
    switch (format) {
      case 'pdf':
        return exportToPDF(data, options);
      case 'excel':
        return Promise.resolve(exportToExcel(data, options));
      case 'csv':
        return Promise.resolve(exportToCSV(data, options));
      default:
        return Promise.resolve();
    }
  });

  await Promise.all(promises);
};

// Format data for export
export const formatDataForExport = (
  data: any[],
  formatters: { [key: string]: (value: any) => string } = {}
): ExportData[] => {
  return data.map(item => {
    const formatted: ExportData = {};
    
    Object.keys(item).forEach(key => {
      const value = item[key];
      
      if (formatters[key]) {
        formatted[key] = formatters[key](value);
      } else if (typeof value === 'number') {
        // Format numbers
        if (key.toLowerCase().includes('valor') || 
            key.toLowerCase().includes('preco') || 
            key.toLowerCase().includes('receita') || 
            key.toLowerCase().includes('despesa')) {
          formatted[key] = `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        } else if (key.toLowerCase().includes('percentual') || 
                   key.toLowerCase().includes('taxa')) {
          formatted[key] = `${value.toFixed(1)}%`;
        } else {
          formatted[key] = value.toLocaleString('pt-BR');
        }
      } else if (value instanceof Date) {
        formatted[key] = value.toLocaleDateString('pt-BR');
      } else {
        formatted[key] = value?.toString() || '';
      }
    });
    
    return formatted;
  });
};

// Generate report summary
export const generateReportSummary = (data: ExportData[]): any => {
  if (data.length === 0) return {};

  const summary: any = {
    totalRecords: data.length,
    generatedAt: new Date().toISOString(),
    fields: {}
  };

  const firstRecord = data[0];
  Object.keys(firstRecord).forEach(key => {
    const values = data.map(record => record[key]).filter(val => val !== null && val !== undefined);
    
    summary.fields[key] = {
      type: typeof firstRecord[key],
      totalValues: values.length,
      uniqueValues: new Set(values).size
    };

    if (typeof firstRecord[key] === 'number') {
      const numericValues = values.filter(val => typeof val === 'number');
      if (numericValues.length > 0) {
        summary.fields[key].sum = numericValues.reduce((sum, val) => sum + val, 0);
        summary.fields[key].average = summary.fields[key].sum / numericValues.length;
        summary.fields[key].min = Math.min(...numericValues);
        summary.fields[key].max = Math.max(...numericValues);
      }
    }
  });

  return summary;
};