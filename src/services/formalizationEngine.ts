import { 
  FormalizationDossier, 
  FormalizationStageStatus, 
  InformalActivityType, 
  DocumentTypeEnum 
} from '../types';

export interface DiagnosisInput {
  hasNif: boolean;
  nifNumber?: string;
  hasBi: boolean;
  biNumber?: string;
  hasInss: boolean;
  inssNumber?: string;
  activityType: InformalActivityType;
  activityDescription?: string;
  marketLocation?: string;
  province: string;
  municipality: string;
  commune?: string;
  worksAlone: boolean;
  helpersCount: number;
}

export interface DiagnosisResult {
  recommendedPath: 'PREI_SIMPLIFICADO' | 'CONTA_PROPRIA' | 'COOPERATIVA_AGRICOLA' | 'MICROEMPRESA';
  initialStatus: FormalizationStageStatus;
  initialProgressPercentage: number;
  requiredDocuments: DocumentTypeEnum[];
  estimatedStagesCount: number;
  nextImmediateAction: string;
  identifiedMissingItems: string[];
  institutionalDestinations: ('AO_MARKET' | 'AGT' | 'INSS' | 'ADMINISTRACAO_MUNICIPAL' | 'GUICHE_UNICO')[];
  estimatedDaysToCompletion: number;
  formalizationBenefits: string[];
}

export class FormalizationEngine {
  /**
   * Avalia os dados de diagnóstico do operador informal e gera a rota personalizada
   */
  public static evaluateDiagnosis(input: DiagnosisInput): DiagnosisResult {
    const missing: string[] = [];
    const requiredDocs: DocumentTypeEnum[] = [];
    const institutions: ('AO_MARKET' | 'AGT' | 'INSS' | 'ADMINISTRACAO_MUNICIPAL' | 'GUICHE_UNICO')[] = ['AO_MARKET'];

    // 1. Verificação de BI
    if (!input.hasBi || !input.biNumber) {
      missing.push('Cópia legível do Bilhete de Identidade (BI) ou Cartão de Munícipe');
      requiredDocs.push('BI_PASSAPORTE');
    } else {
      requiredDocs.push('BI_PASSAPORTE');
    }

    // 2. Verificação de NIF
    if (!input.hasNif || !input.nifNumber) {
      missing.push('Registo e Atribuição do Número de Identificação Fiscal (NIF) junto da AGT');
      institutions.push('AGT');
      if (!requiredDocs.includes('NIF_EMPRESA')) {
        requiredDocs.push('NIF_EMPRESA');
      }
    }

    // 3. Verificação de Segurança Social (INSS)
    if (!input.hasInss || !input.inssNumber) {
      missing.push('Inscrição no Regime de Proteção Social Obrigatória (INSS)');
      institutions.push('INSS');
    }

    // 4. Determinação do Roteiro Recomendado
    let recommendedPath: DiagnosisResult['recommendedPath'] = 'CONTA_PROPRIA';
    let benefits: string[] = [
      'Acesso ao Selo Oficial de Empreendedor Verificado no AO MARKET',
      'Proteção Social e Acesso à Reforma / Subsídios do INSS',
      'Capacidade de emitir faturas certificadas para empresas e Estado',
      'Acesso prioritário a linhas de Microcrédito e Apoio Agrícola'
    ];

    if (input.activityType === 'AGRICULTOR_FAMILIAR' || input.activityType === 'PESCADOR_ARTESANAL') {
      recommendedPath = input.worksAlone ? 'CONTA_PROPRIA' : 'COOPERATIVA_AGRICOLA';
      benefits.push('Acesso a compradores grossistas B2B no AO MARKET para escoamento agrícola direto');
    } else if (input.activityType === 'VENDEDOR_PRACA_MERCADO' || input.activityType === 'COMERCIANTE_AMBULANTE') {
      recommendedPath = 'PREI_SIMPLIFICADO';
      institutions.push('GUICHE_UNICO');
      benefits.push('Enquadramento no regime transitório com isenções de taxas e simplificação fiscal');
    } else if (!input.worksAlone && input.helpersCount > 3) {
      recommendedPath = 'MICROEMPRESA';
      institutions.push('GUICHE_UNICO');
      benefits.push('Inscrição dos seus trabalhadores e ajudantes na Segurança Social');
    }

    // 5. Cálculo do Progresso Inicial e Status
    let initialProgress = 15; // Adesão ao AO MARKET
    let initialStatus: FormalizationStageStatus = 'DIAGNOSTICO_CONCLUIDO';

    if (input.hasBi) initialProgress += 20;
    if (input.hasNif) initialProgress += 30;
    if (input.hasInss) initialProgress += 35;

    if (initialProgress >= 90) {
      initialStatus = 'FORMALIZACAO_CONCLUIDA';
    } else if (input.hasNif && !input.hasInss) {
      initialStatus = 'ENCAMINHADO_INSS';
    } else if (input.hasBi && !input.hasNif) {
      initialStatus = 'DOCUMENTOS_PENDENTES';
    }

    let nextAction = 'Submeter fotografia/cópia do Bilhete de Identidade (BI) para validação';
    if (input.hasBi && !input.hasNif) {
      nextAction = 'Gerar Guia de Encaminhamento do AO MARKET para emissão de NIF na AGT / Balcão Único';
    } else if (input.hasNif && !input.hasInss) {
      nextAction = 'Vincular ou Iniciar Inscrição de Trabalhador por Conta Própria junto do INSS';
    }

    return {
      recommendedPath,
      initialStatus,
      initialProgressPercentage: Math.min(initialProgress, 100),
      requiredDocuments: requiredDocs,
      estimatedStagesCount: institutions.length + 1,
      nextImmediateAction: nextAction,
      identifiedMissingItems: missing,
      institutionalDestinations: Array.from(new Set(institutions)),
      estimatedDaysToCompletion: input.hasNif ? 7 : 18,
      formalizationBenefits: benefits
    };
  }

  /**
   * Constrói as etapas detalhadas para o dossiê
   */
  public static generateInitialStages(dossierId: string, result: DiagnosisResult): {
    stageCode: FormalizationStageStatus;
    stageName: string;
    institution: 'AO_MARKET' | 'AGT' | 'INSS' | 'ADMINISTRACAO_MUNICIPAL' | 'GUICHE_UNICO';
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';
    requiredDocs: string[];
  }[] {
    return [
      {
        stageCode: 'INFORMAL_REGISTADO',
        stageName: 'Adesão ao AO MARKET & Diagnóstico Inicial',
        institution: 'AO_MARKET',
        status: 'CONCLUIDO',
        requiredDocs: []
      },
      {
        stageCode: 'DOCUMENTOS_SUBMETIDOS',
        stageName: 'Identificação Civil & Comprovativo de Atividade',
        institution: 'AO_MARKET',
        status: 'EM_ANDAMENTO',
        requiredDocs: ['BI_PASSAPORTE', 'DECLARACAO_ATIVIDADE']
      },
      {
        stageCode: 'NIF_EM_PROCESSAMENTO',
        stageName: 'Encaminhamento AGT / Registo de NIF',
        institution: 'AGT',
        status: 'PENDENTE',
        requiredDocs: ['NIF_EMPRESA']
      },
      {
        stageCode: 'INSS_EM_PROCESSAMENTO',
        stageName: 'Inscrição & Regularização na Segurança Social (INSS)',
        institution: 'INSS',
        status: 'PENDENTE',
        requiredDocs: ['GUIA_INSS']
      },
      {
        stageCode: 'FORMALIZACAO_CONCLUIDA',
        stageName: 'Certificação de Negócio Formalizado & Selo Ouro',
        institution: 'AO_MARKET',
        status: 'PENDENTE',
        requiredDocs: []
      }
    ];
  }
}
