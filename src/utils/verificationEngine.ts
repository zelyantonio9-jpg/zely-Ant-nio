import { UserProfile, DocumentTypeEnum, VerificationLevel } from '../types';

/**
 * Calculates the exact and strictly deserved Verification Level (1 to 5)
 * based on verified/approved documents, identity, location and formal compliance.
 *
 * Matrix of Requirements:
 * Level 1: Account Created (Unverified, default visitor/basic)
 * Level 2: Basic Contact & Geographic Location Confirmed (+244 phone and province/municipality)
 * Level 3: Identity & Basic Activity Audited:
 *   - Producer: Approved BI + Approved (Titulo de Exploracao / Declaracao Soba / Administracao)
 *   - Transporter: Approved BI + Approved Carta de Conducao + Approved Livrete
 *   - Merchant / Empresa / Outro: Approved BI / NIF + Approved Certidao Comercial / Alvará
 * Level 4: Fully Verified & Certified Activity (Level 3 conditions MET + Approved NIF + Registered/Audited Operations)
 * Level 5: Sovereign Institutional Compliance (Level 4 MET + INSS Validated/Audited with Regular Status)
 */
export function calculateStrictVerificationLevel(user: Partial<UserProfile>): {
  level: VerificationLevel;
  badgeTitle: string;
  verifiedPoints: string[];
  missingPoints: string[];
} {
  const verifiedPoints: string[] = [];
  const missingPoints: string[] = [];

  // Base checks
  if (user.phone && user.phone.length >= 9) {
    verifiedPoints.push('Telemóvel Nacional (+244) Confirmado');
  } else {
    missingPoints.push('Confirmação de Telemóvel (+244)');
  }

  if (user.province && user.municipality) {
    verifiedPoints.push(`Localização Geográfica (${user.province}, ${user.municipality}) Registada`);
  } else {
    missingPoints.push('Localização Geográfica Completa');
  }

  const docs = user.documents || [];
  const approvedTypes = new Set<DocumentTypeEnum>(
    docs.filter(d => d.status === 'APROVADO').map(d => d.documentType)
  );

  const role = user.role || 'buyer';
  let hasLevel3Identity = false;
  let hasLevel3Activity = false;

  // Level 3 Identity Requirement: Approved BI or NIF
  if (approvedTypes.has('BI') || (user.biNumber && approvedTypes.has('BI'))) {
    verifiedPoints.push('Bilhete de Identidade (BI) Auditado e Aprovado');
    hasLevel3Identity = true;
  } else {
    missingPoints.push('Aprovação de Bilhete de Identidade (BI) legível');
  }

  // Level 3 Specific Activity Requirements per Role
  if (role === 'producer') {
    if (approvedTypes.has('TITULO_EXPLORACAO_TERRA') || approvedTypes.has('DECLARACAO_SOBA_ADMINISTRACAO') || approvedTypes.has('CERTIFICADO_COOPERATIVA')) {
      verifiedPoints.push('Comprovativo de Exploração Agrícola / Declaração Comunitária Aprovada');
      hasLevel3Activity = true;
    } else {
      missingPoints.push('Comprovativo de Posse/Exploração Agrícola ou Declaração da Administração');
    }
  } else if (role === 'driver' || role === 'logistics_company') {
    if (approvedTypes.has('CARTA_CONDUCAO') && approvedTypes.has('LIVRETE_VEICULO')) {
      verifiedPoints.push('Carta de Condução e Livrete do Veículo Aprovados');
      hasLevel3Activity = true;
    } else {
      if (!approvedTypes.has('CARTA_CONDUCAO')) missingPoints.push('Carta de Condução Profissional Aprovada');
      if (!approvedTypes.has('LIVRETE_VEICULO')) missingPoints.push('Livrete / Registo do Veículo Aprovado');
    }
  } else if (role === 'merchant' || role === 'company_admin' || role === 'company_user' || user.entityType === 'EMPRESA') {
    if (approvedTypes.has('CERTIDAO_REGISTO_COMERCIAL') || approvedTypes.has('ALVARA_COMERCIAL') || approvedTypes.has('NIF')) {
      verifiedPoints.push('Certidão Comercial / Alvará / NIF Aprovado');
      hasLevel3Activity = true;
    } else {
      missingPoints.push('Certidão Comercial, Alvará ou Registo AGT Aprovado');
    }
  } else {
    // Standard buyer or default role
    hasLevel3Activity = true;
  }

  // Level 4: Formalized Fiscal Status (Approved NIF + Level 3)
  const hasLevel4Fiscal = approvedTypes.has('NIF') || (user.isFormalized && (user.nif || approvedTypes.has('CERTIDAO_REGISTO_COMERCIAL')));
  if (hasLevel4Fiscal) {
    verifiedPoints.push('Identificação Fiscal (NIF) Certificada');
  } else {
    missingPoints.push('Certificação de Identificação Fiscal (NIF)');
  }

  // Level 5: Sovereign INSS Validation
  const hasLevel5INSS = user.inssVerified === true && user.inssComplianceStatus === 'REGULAR';
  if (hasLevel5INSS) {
    verifiedPoints.push('Certificado de Não Devedor do INSS Verificado Soberanamente');
  } else {
    missingPoints.push('Validação Oficial de Conformidade INSS');
  }

  // Determine Level
  let calculatedLevel: VerificationLevel = 1;

  if (user.phone && user.province) {
    calculatedLevel = 2; // Level 2: Contact confirmed
  }

  if (calculatedLevel === 2 && hasLevel3Identity && hasLevel3Activity) {
    calculatedLevel = 3; // Level 3: Identity & Activity documents approved
  }

  if (calculatedLevel === 3 && hasLevel4Fiscal) {
    calculatedLevel = 4; // Level 4: Fully certified fiscal entity
  }

  if (calculatedLevel === 4 && hasLevel5INSS) {
    calculatedLevel = 5; // Level 5: Sovereign compliance
  }

  let badgeTitle = 'Conta Criada';
  if (calculatedLevel === 2) badgeTitle = 'Contacto Confirmado';
  if (calculatedLevel === 3) badgeTitle = 'Identidade & Documentos Auditados';
  if (calculatedLevel === 4) badgeTitle = 'Entidade Certificada & Fiscalizada';
  if (calculatedLevel === 5) badgeTitle = 'Conformidade Soberana INSS';

  return {
    level: calculatedLevel,
    badgeTitle,
    verifiedPoints,
    missingPoints
  };
}
