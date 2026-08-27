import { jsPDF } from 'jspdf';

export const generateOfficialPdf = (): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  const checkPageBreak = (spaceNeeded: number) => {
    if (y + spaceNeeded > pageHeight - margin) {
      doc.addPage();
      y = margin;
      addPageHeaderFooter();
    }
  };

  const addPageHeaderFooter = () => {
    const pageCount = doc.getNumberOfPages();
    
    // Header (skip on page 1)
    if (pageCount > 1) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('AO MARKET • Documentação Oficial do Ecossistema', margin, 12);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, 14, pageWidth - margin, 14);
    }

    // Footer on all pages
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text('República de Angola • Ecossistema Económico Digital', margin, pageHeight - 10);
    doc.text(`Página ${pageCount}`, pageWidth - margin - 15, pageHeight - 10);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
  };

  // --- COVER / TITLE SECTION ---
  doc.setFillColor(24, 24, 27); // Dark zinc header banner
  doc.rect(margin, y, contentWidth, 36, 'F');

  // National colors accent stripe
  doc.setFillColor(207, 16, 45); // Angola Red
  doc.rect(margin, y, contentWidth / 2, 2.5, 'F');
  doc.setFillColor(245, 158, 11); // Gold/Yellow
  doc.rect(margin + (contentWidth / 2), y, contentWidth / 2, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('AO MARKET • DOCUMENTAÇÃO OFICIAL', margin + 6, y + 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(212, 212, 216);
  doc.text('Ecossistema Digital de Produção Nacional, Logística Rodoviária & Proteção Social', margin + 6, y + 24);
  doc.text('República de Angola • Especificação Arquitetural e Operacional', margin + 6, y + 30);

  y += 44;

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 18, 'FD');
  
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text('Data de Emissão:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' }), margin + 35, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Classificação:', margin + 100, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento Público / Especificação Técnica', margin + 125, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Âmbito Geográfico:', margin + 4, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text('18 Províncias e 164 Municípios de Angola', margin + 35, y + 13);

  y += 26;

  // --- 1. VISÃO GERAL ---
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Visão Geral & Missão Estratégica', margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const introText = 'O AO MARKET é uma plataforma tecnológica de soberania económica nacional concebida para integrar o comércio de produção agrícola e industrial, o escoamento logístico por rotas rodoviárias estratégicas, a garantia financeira sob custódia (AO Protect) e a formalização automática na Segurança Social (INSS Angola).';
  const splitIntro = doc.splitTextToSize(introText, contentWidth);
  doc.text(splitIntro, margin, y);
  y += splitIntro.length * 4.5 + 4;

  // --- 2. PILARES DE UTILIZADORES (RBAC) ---
  checkPageBreak(50);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Pilares de Utilizadores e Controlo de Acesso (RBAC)', margin, y);
  y += 6;

  const roles = [
    { title: 'Produtor / Cooperativa (producer)', desc: 'Registo e venda de lotes agrícolas, certificação "Feito em Angola", emissão de notas de saída e cotações RFQ.' },
    { title: 'Comerciante / Grossista (merchant)', desc: 'Emissão de pedidos de cotação em escala (RFQ), aquisição de colheitas em grande volume e distribuição.' },
    { title: 'Transportador / Camionista (driver)', desc: 'Bolsa de frete rodoviário, rotas interprovinciais, aceitação de cargas e validação de entrega via PIN OTP.' },
    { title: 'Comprador Geral (buyer)', desc: 'Compra direta com garantia de pagamento sob custódia e confirmação de descarga física.' },
    { title: 'Segurança Social (social_protection)', desc: 'Gestão de produtores formalizados, emissão de guias de liquidação INSS e microcrédito bonificado.' },
    { title: 'Administrador Soberano (admin)', desc: 'Supervisão de corredores rodoviários, conciliação do cofre escrow e tribunal arbitral de litígios.' }
  ];

  roles.forEach(r => {
    checkPageBreak(12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // Amber
    doc.text(`• ${r.title}:`, margin + 2, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(r.desc, contentWidth - 6);
    doc.text(splitDesc, margin + 6, y);
    y += splitDesc.length * 4.2 + 2;
  });

  y += 4;

  // --- 3. MÁQUINA DE ESTADOS & VALIDAÇÃO POR PIN OTP ---
  checkPageBreak(65);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Ciclo de Vida da Ordem e Validação Criptográfica (PIN OTP)', margin, y);
  y += 6;

  const states = [
    '1. ESCROW_LOCKED: Comprador deposita o valor no cofre fiduciário seguro.',
    '2. DISPATCHED: Produtor prepara o lote e publica a carga na Bolsa de Frete.',
    '3. DRIVER_ASSIGNED: Motorista credenciado aceita a rota e vincula o seguro de carga.',
    '4. PICKED_UP: Recolha na origem com validação de peso e selagem do lote.',
    '5. IN_TRANSIT: Transporte monitorizado com geração de código PIN OTP ao comprador.',
    '6. DELIVERED / PIN_VERIFIED: Motorista insere o PIN fornecido pelo comprador no descarregamento.',
    '7. SETTLED: Desbloqueio imediato dos fundos ao produtor/motorista com retenção automática INSS.'
  ];

  states.forEach(s => {
    checkPageBreak(8);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(s, margin + 2, y);
    y += 5;
  });

  y += 4;

  // --- 4. MECANISMOS DE SEGURANÇA ---
  checkPageBreak(50);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. Mecanismos de Proteção & Formalização Social', margin, y);
  y += 6;

  const securityPoints = [
    { name: 'AO Protect (Cofre Escrow)', text: 'Elimina o risco de inadimplência e burla comercial tanto para o agricultor como para o comprador.' },
    { name: 'PIN OTP Descentralizado', text: 'Garante que a liquidação monetária só ocorre após verificação visual e física do produto na entrega.' },
    { name: 'Retenção Automática INSS', text: 'Permite que camponeses informais e camionistas acumulem direitos a reforma, invalidez e microcrédito bancário.' },
    { name: 'Tribunal Arbitral de Disputas', text: 'Mediação rápida para divergências de qualidade, peso ou atrasos com devolução assistida.' }
  ];

  securityPoints.forEach(sp => {
    checkPageBreak(12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`✓ ${sp.name}:`, margin + 2, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitText = doc.splitTextToSize(sp.text, contentWidth - 6);
    doc.text(splitText, margin + 6, y);
    y += splitText.length * 4.2 + 2;
  });

  y += 6;

  // --- 5. INFRAESTRUTURA RODOVIÁRIA ---
  checkPageBreak(40);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('5. Corredores Rodoviários Estruturantes de Angola', margin, y);
  y += 6;

  const corridors = [
    '• Corredor Norte / EN230: Ligação Luanda – Malanje – Saurimo – Luena.',
    '• Corredor Litoral / EN100: Eixo Luanda – Porto Amboim – Sumbe – Benguela – Namibe.',
    '• Corredor Central / EN120: Ligação Huambo – Uíge – Cuanza Sul – Huíla.',
    '• Corredor do Lobito: Eixo multimodal estratégico Benguela – Huambo – Bié – Moxico (RDC/Zâmbia).'
  ];

  corridors.forEach(c => {
    checkPageBreak(7);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(c, margin + 2, y);
    y += 5;
  });

  // Footer on current page
  addPageHeaderFooter();

  // Trigger download
  doc.save('AO_MARKET_Documentacao_Oficial.pdf');
};
