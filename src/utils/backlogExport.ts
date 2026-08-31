import * as XLSX from 'xlsx';
import { PRODUCT_BACKLOG_DATA, BacklogItem } from '../data/productBacklogData';

export function downloadBacklogAsExcel() {
  // Format data for Excel worksheet
  const rows = PRODUCT_BACKLOG_DATA.map(item => ({
    'ID': item.id,
    'Épico / Módulo': item.epic,
    'Item do Backlog': item.title,
    'Descrição': item.description,
    'Prioridade': item.priority,
    'Estado': item.status,
    'Story Points': item.storyPoints,
    'Critérios de Aceitação': item.acceptanceCriteria,
    'Notas Técnicas': item.technicalNotes
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths for comfortable reading
  worksheet['!cols'] = [
    { wch: 10 }, // ID
    { wch: 25 }, // Epico
    { wch: 35 }, // Item do Backlog
    { wch: 50 }, // Descrição
    { wch: 12 }, // Prioridade
    { wch: 15 }, // Estado
    { wch: 12 }, // Story Points
    { wch: 45 }, // Critérios de Aceitação
    { wch: 45 }  // Notas Técnicas
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Backlog AO MARKET');

  // Summary sheet
  const completedCount = PRODUCT_BACKLOG_DATA.filter(i => i.status === 'Concluído').length;
  const pendingCount = PRODUCT_BACKLOG_DATA.filter(i => i.status === 'Não Concluído').length;
  const completedSP = PRODUCT_BACKLOG_DATA.filter(i => i.status === 'Concluído').reduce((acc, i) => acc + i.storyPoints, 0);
  const pendingSP = PRODUCT_BACKLOG_DATA.filter(i => i.status === 'Não Concluído').reduce((acc, i) => acc + i.storyPoints, 0);

  const summaryData = [
    { 'Métrica': 'Total de Itens no Backlog', 'Valor': PRODUCT_BACKLOG_DATA.length },
    { 'Métrica': 'Itens Concluídos', 'Valor': completedCount },
    { 'Métrica': 'Itens Não Concluídos / Pendentes', 'Valor': pendingCount },
    { 'Métrica': 'Taxa de Conclusão (%)', 'Valor': `${Math.round((completedCount / PRODUCT_BACKLOG_DATA.length) * 100)}%` },
    { 'Métrica': 'Story Points Concluídos', 'Valor': completedSP },
    { 'Métrica': 'Story Points Pendentes', 'Valor': pendingSP },
    { 'Métrica': 'Total Story Points', 'Valor': completedSP + pendingSP },
    { 'Métrica': 'Data de Exportação', 'Valor': new Date().toLocaleDateString('pt-AO') }
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 35 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo do Projeto');

  XLSX.writeFile(workbook, 'AO_MARKET_Product_Backlog.xlsx');
}

export function downloadBacklogAsCSV() {
  const headers = ['ID', 'Épico / Módulo', 'Item do Backlog', 'Descrição', 'Prioridade', 'Estado', 'Story Points', 'Critérios de Aceitação', 'Notas Técnicas'];
  
  const escapeCsv = (str: string | number) => {
    const val = String(str).replace(/"/g, '""');
    return `"${val}"`;
  };

  const csvRows = [
    headers.map(escapeCsv).join(';'),
    ...PRODUCT_BACKLOG_DATA.map(item => [
      escapeCsv(item.id),
      escapeCsv(item.epic),
      escapeCsv(item.title),
      escapeCsv(item.description),
      escapeCsv(item.priority),
      escapeCsv(item.status),
      escapeCsv(item.storyPoints),
      escapeCsv(item.acceptanceCriteria),
      escapeCsv(item.technicalNotes)
    ].join(';'))
  ];

  // UTF-8 BOM (\uFEFF) ensures Excel opens accents correctly
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'AO_MARKET_Product_Backlog.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
