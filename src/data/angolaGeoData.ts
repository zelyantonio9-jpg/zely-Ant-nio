export interface ProvinceData {
  id: string;
  name: string;
  capital: string;
  region: 'Norte' | 'Centro' | 'Sul' | 'Leste';
  specialties: string[];
  municipalities: string[];
  totalMunicipalitiesCount?: number;
}

export const ANGOLA_TERRITORIAL_STATS = {
  provincesCount: 21,
  municipalitiesCount: 326,
  lawReference: 'Lei da Divisão Político-Administrativa (DPA)'
};

export const ANGOLA_PROVINCES: ProvinceData[] = [
  {
    id: 'luanda',
    name: 'Luanda',
    capital: 'Luanda',
    region: 'Norte',
    specialties: ['Comércio Geral', 'Indústria Transformadora', 'Consumo B2B', 'Materiais de Construção', 'Tecnologia'],
    municipalities: [
      'Luanda', 'Belas', 'Cazenga', 'Cacuaco', 'Viana', 'Talatona', 'Kilamba Kiaxi', 'Mulenvos de Baixo',
      'Sambizanga', 'Rangel', 'Maianga', 'Ingombota', 'Samba', 'Neves Bendinha', 'Hoji-ya-Henda', 'Camama'
    ],
    totalMunicipalitiesCount: 16
  },
  {
    id: 'bengo',
    name: 'Bengo',
    capital: 'Caxito',
    region: 'Norte',
    specialties: ['Banana Pão', 'Mandioca', 'Mamão', 'Citadinos', 'Peixe de Água Doce'],
    municipalities: [
      'Dande (Caxito)', 'Ambriz', 'Bula Atumba', 'Dembos (Quibaxe)', 'Nambuangongo', 'Pango Aluquém',
      'Barra do Dande', 'Úcua', 'Muxaluando', 'Canacassala', 'Gombe', 'Cage Mazumbo'
    ],
    totalMunicipalitiesCount: 12
  },
  {
    id: 'icolo_bengo',
    name: 'Icolo e Bengo',
    capital: 'Catete',
    region: 'Norte',
    specialties: ['Agroindústria', 'Horticultura', 'Pecuária', 'Pesca Fluvial', 'Caju'],
    municipalities: [
      'Catete', 'Calumbo', 'Cassoneca', 'Cabiri', 'Bom Jesus', 'Quiçama (Muxima)', 'Cabo Ledo', 'Demba Chio', 'Mumbondo'
    ],
    totalMunicipalitiesCount: 9
  },
  {
    id: 'huambo',
    name: 'Huambo',
    capital: 'Huambo',
    region: 'Centro',
    specialties: ['Milho', 'Feijão', 'Batata Rena', 'Hortícolas', 'Avicultura', 'Grãos'],
    municipalities: [
      'Huambo', 'Caála', 'Bailundo', 'Ekunha', 'Longonjo', 'Ucuma', 'Chinjenje', 'Cachiungo',
      'Tchicala Tcholohanga', 'Mungo', 'Londuimbali', 'Cuima', 'Calenga', 'Chiumbo', 'Hengue', 'Sambo'
    ],
    totalMunicipalitiesCount: 16
  },
  {
    id: 'benguela',
    name: 'Benguela',
    capital: 'Benguela',
    region: 'Centro',
    specialties: ['Pesca & Sal', 'Banana', 'Manga', 'Tomate', 'Logística Ferroviária (Corredor do Lobito)'],
    municipalities: [
      'Benguela', 'Lobito', 'Catumbela', 'Baía Farta', 'Cubal', 'Ganda', 'Balombo', 'Bocoio',
      'Chongoroi', 'Caimbambo', 'Canjala', 'Dombe Grande', 'Hanha', 'Egito Praia', 'Babaera', 'Chicuma'
    ],
    totalMunicipalitiesCount: 16
  },
  {
    id: 'huila',
    name: 'Huíla',
    capital: 'Lubango',
    region: 'Sul',
    specialties: ['Carne Bovina', 'Hortícolas da Humpata', 'Frutas de Clima Temperado', 'Laticínios'],
    municipalities: [
      'Lubango', 'Humpata', 'Chibia', 'Matala', 'Quipungo', 'Caluquembe', 'Caconda', 'Chicomba',
      'Jamba', 'Kuvango', 'Chipindo', 'Quilengues', 'Gambos (Chiantla)', 'Capenda', 'Hoque', 'Dongo', 'Palanca'
    ],
    totalMunicipalitiesCount: 17
  },
  {
    id: 'cuanza_sul',
    name: 'Cuanza Sul',
    capital: 'Sumbe',
    region: 'Centro',
    specialties: ['Café Arábica e Robusta', 'Palma e Azeite', 'Milho', 'Cimento de Porto Amboim', 'Frutas Tropicais'],
    municipalities: [
      'Sumbe', 'Porto Amboim', 'Amboim (Gabela)', 'Cela (Waku Kungo)', 'Libolo (Calulo)', 'Quibala',
      'Mussende', 'Seles', 'Conda', 'Ebo', 'Cassongue', 'Kilenda', 'Quissongo', 'Gangula', 'Assango', 'Gungo'
    ],
    totalMunicipalitiesCount: 16
  },
  {
    id: 'cuanza_norte',
    name: 'Cuanza Norte',
    capital: 'Ndalatando',
    region: 'Norte',
    specialties: ['Palma & Dendém', 'Banana', 'Citadinos', 'Água Mineral', 'Café'],
    municipalities: [
      'Cazengo (Ndalatando)', 'Cambambe (Dondo)', 'Golungo Alto', 'Lucala', 'Samba Cajú',
      'Ambaca (Camabatela)', 'Banga', 'Bolongongo', 'Quiculungo', 'Ngonguembo', 'Massangano', 'Tango', 'Dange'
    ],
    totalMunicipalitiesCount: 13
  },
  {
    id: 'malanje',
    name: 'Malanje',
    capital: 'Malanje',
    region: 'Norte',
    specialties: ['Mandioca', 'Arroz', 'Açúcar de Cacuso', 'Gergelim', 'Soja', 'Pecuária'],
    municipalities: [
      'Malanje', 'Cacuso', 'Calandula', 'Cangandala', 'Cahombo', 'Kiuaba Nzoji', 'Massango',
      'Marimba', 'Mucari', 'Quela', 'Quirima', 'Luquembo', 'Cambundi-Catembo', 'Cunda-dia-Baze', 'Pungo Andongo', 'Lombe'
    ],
    totalMunicipalitiesCount: 16
  },
  {
    id: 'uige',
    name: 'Uíge',
    capital: 'Uíge',
    region: 'Norte',
    specialties: ['Café Bago Vermelho', 'Mandioca', 'Amendoim (Ginguba)', 'Frutas Tropicais', 'Mel'],
    municipalities: [
      'Uíge', 'Negage', 'Songo', 'Quitexe', 'Pombo (Sanza Pombo)', 'Maquela do Zombo', 'Damba',
      'Mucaba', 'Bungo', 'Ambuíla', 'Bembe', 'Buengas', 'Cangola', 'Milunga', 'Puri', 'Quimbele', 'Sacandica', 'Cuilo Pombo'
    ],
    totalMunicipalitiesCount: 18
  },
  {
    id: 'bie',
    name: 'Bié',
    capital: 'Cuito',
    region: 'Centro',
    specialties: ['Trigo', 'Arroz', 'Feijão', 'Batata Doce', 'Mel Silvestre', 'Soja'],
    municipalities: [
      'Cuito', 'Andulo', 'Camacupa', 'Catabola', 'Chinguar', 'Chitembo', 'Cunhinga',
      'Cuemba', 'Nharêa', 'Calucinga', 'Kassumbe', 'Umpulo', 'Belo Horizonte', 'Ringoma'
    ],
    totalMunicipalitiesCount: 14
  },
  {
    id: 'namibe',
    name: 'Namibe',
    capital: 'Moçâmedes',
    region: 'Sul',
    specialties: ['Pesca Industrial e Artesanal', 'Peixe Seco', 'Uvas e Vinho do Namibe', 'Tomate', 'Olivares'],
    municipalities: [
      'Moçâmedes', 'Tômbwa', 'Virei', 'Bibala', 'Camucuio', 'Bentiaba', 'Lucira', 'Iona', 'Cacimbas', 'Lola'
    ],
    totalMunicipalitiesCount: 10
  },
  {
    id: 'zaire',
    name: 'Zaire',
    capital: 'Mbanza Kongo',
    region: 'Norte',
    specialties: ['Comércio Transfronteiriço', 'Pesca no Rio Zaire', 'Mandioca', 'Dendém', 'Petróleo'],
    municipalities: [
      'Mbanza Kongo', 'Soyo', 'Nóqui', 'Nzeto', 'Tomboco', 'Cuimba', 'Pedra do Feitiço', 'Musserra', 'Kindeje', 'Lufico'
    ],
    totalMunicipalitiesCount: 10
  },
  {
    id: 'cabinda',
    name: 'Cabinda',
    capital: 'Cabinda',
    region: 'Norte',
    specialties: ['Madeira Nobre', 'Cacau', 'Café', 'Peixe & Marisco', 'Banana'],
    municipalities: [
      'Cabinda', 'Cacongo (Lândana)', 'Buco-Zau', 'Belize', 'Massabi', 'Tando Zinze', 'Necuto', 'Miconje'
    ],
    totalMunicipalitiesCount: 8
  },
  {
    id: 'cunene',
    name: 'Cunene',
    capital: 'Ondjiva',
    region: 'Sul',
    specialties: ['Gado Bovino e Caprino', 'Massango e Massambala', 'Comércio Transfronteiriço Santa Clara'],
    municipalities: [
      'Cuanhama (Ondjiva)', 'Ombadja (Xangongo)', 'Namacunde (Santa Clara)', 'Curoca', 'Cahama', 'Cuvelai', 'Humbe', 'Môngua', 'Nehone', 'Evale'
    ],
    totalMunicipalitiesCount: 10
  },
  {
    id: 'lunda_norte',
    name: 'Lunda Norte',
    capital: 'Dundo',
    region: 'Leste',
    specialties: ['Agricultura de Subsistência', 'Mel da Floresta', 'Comércio de Fronteira', 'Mandioca'],
    municipalities: [
      'Chitato (Dundo)', 'Cambulo', 'Caungula', 'Cuilo', 'Capenda-Camulemba', 'Lubalo',
      'Lucapa', 'Cuango', 'Lóvua', 'Xá-Muteba', 'Caluango', 'Camaxilo', 'Luangue'
    ],
    totalMunicipalitiesCount: 13
  },
  {
    id: 'lunda_sul',
    name: 'Lunda Sul',
    capital: 'Saurimo',
    region: 'Leste',
    specialties: ['Artesanato Chokwe', 'Mandioca', 'Peixe Seco de Água Doce', 'Milho'],
    municipalities: [
      'Saurimo', 'Cacolo', 'Dala', 'Muconda', 'Mona Quimbundo', 'Muriege', 'Cazage', 'Alto Chicapa', 'Sombo'
    ],
    totalMunicipalitiesCount: 9
  },
  {
    id: 'moxico',
    name: 'Moxico',
    capital: 'Luena',
    region: 'Leste',
    specialties: ['Mel do Moxico', 'Arroz de Sequeiro', 'Peixe de Água Doce', 'Mandioca'],
    municipalities: [
      'Luena (Moxico)', 'Camanongue', 'Léua', 'Cameia (Lumege)', 'Lucusse', 'Cassamba', 'Cangamba', 'Muangai'
    ],
    totalMunicipalitiesCount: 8
  },
  {
    id: 'moxico_leste',
    name: 'Moxico Leste',
    capital: 'Cazombo',
    region: 'Leste',
    specialties: ['Arroz do Luau', 'Castanha de Caju', 'Peixe do Rio Zambeze', 'Comércio Transfronteiriço'],
    municipalities: [
      'Cazombo (Alto Zambeze)', 'Luau', 'Luacano', 'Macondo', 'Lumbala Nguimbo (Bundas)', 'Lóvua do Leste', 'Lago Dilolo', 'Nana Candundo'
    ],
    totalMunicipalitiesCount: 8
  },
  {
    id: 'cuando',
    name: 'Cuando',
    capital: 'Mavinga',
    region: 'Sul',
    specialties: ['Madeira Sustentável', 'Pesca Fluvial', 'Ecoturismo Okavango', 'Mel Selvagem'],
    municipalities: [
      'Mavinga', 'Rivungo', 'Dirico', 'Luengue', 'Mucusso', 'Licua', 'Jamba Cueio', 'Luiana'
    ],
    totalMunicipalitiesCount: 8
  },
  {
    id: 'cubango',
    name: 'Cubango',
    capital: 'Menongue',
    region: 'Sul',
    specialties: ['Pecuária Extensiva', 'Milho', 'Massambala', 'Frutas Nativas', 'Mel'],
    municipalities: [
      'Menongue', 'Cuchi', 'Cuito Cuanavale', 'Cuangar', 'Calai', 'Savate', 'Caiundo', 'Missombo', 'Longa', 'Mavengue'
    ],
    totalMunicipalitiesCount: 10
  }
];

export function calculateFreightEstimate(
  originProvinceId: string,
  destProvinceId: string,
  weightKg: number,
  requiresColdChain: boolean = false
): { distanceKm: number; estimatedCostAOA: number; suggestedVehicle: string; transitDays: number } {
  const isSameProvince = originProvinceId.toLowerCase() === destProvinceId.toLowerCase();
  
  // Approximate standard road matrix for Angola (21 Provinces)
  let baseDistanceKm = 45;
  let baseCostAOA = 4500;
  let transitDays = 1;

  if (!isSameProvince) {
    if (
      (originProvinceId === 'huambo' && destProvinceId === 'luanda') ||
      (originProvinceId === 'luanda' && destProvinceId === 'huambo')
    ) {
      baseDistanceKm = 590;
      baseCostAOA = 48000;
      transitDays = 2;
    } else if (
      (originProvinceId === 'cuanza_sul' && destProvinceId === 'luanda') ||
      (originProvinceId === 'luanda' && destProvinceId === 'cuanza_sul')
    ) {
      baseDistanceKm = 360;
      baseCostAOA = 28000;
      transitDays = 1;
    } else if (
      (originProvinceId === 'benguela' && destProvinceId === 'luanda') ||
      (originProvinceId === 'luanda' && destProvinceId === 'benguela')
    ) {
      baseDistanceKm = 540;
      baseCostAOA = 42000;
      transitDays = 2;
    } else if (
      (originProvinceId === 'huila' && destProvinceId === 'luanda') ||
      (originProvinceId === 'luanda' && destProvinceId === 'huila')
    ) {
      baseDistanceKm = 910;
      baseCostAOA = 75000;
      transitDays = 3;
    } else if (
      (originProvinceId === 'bengo' && destProvinceId === 'luanda') ||
      (originProvinceId === 'luanda' && destProvinceId === 'bengo') ||
      (originProvinceId === 'icolo_bengo' && destProvinceId === 'luanda') ||
      (originProvinceId === 'luanda' && destProvinceId === 'icolo_bengo')
    ) {
      baseDistanceKm = 60;
      baseCostAOA = 8500;
      transitDays = 1;
    } else if (
      originProvinceId === 'moxico_leste' || destProvinceId === 'moxico_leste' ||
      originProvinceId === 'cuando' || destProvinceId === 'cuando'
    ) {
      baseDistanceKm = 1250;
      baseCostAOA = 95000;
      transitDays = 4;
    } else {
      baseDistanceKm = 650;
      baseCostAOA = 55000;
      transitDays = 2;
    }
  }

  // Calculate by weight tier
  let weightMultiplier = 1;
  let vehicle = 'Carrinha Canter (Até 3.5T)';

  if (weightKg <= 30 && isSameProvince) {
    vehicle = 'Mototáxi Kupapata Express';
    weightMultiplier = 0.45;
  } else if (weightKg <= 150) {
    vehicle = 'Carrinha Ligeira Canter';
    weightMultiplier = 0.8;
  } else if (weightKg <= 1500) {
    vehicle = 'Camião Ligeiro 3.5 Toneladas';
    weightMultiplier = 1.3;
  } else if (weightKg <= 8000) {
    vehicle = 'Camião Pesado 10T';
    weightMultiplier = 2.4;
  } else {
    vehicle = 'Carreta Rodoviária 25 Toneladas';
    weightMultiplier = 4.2;
  }

  if (requiresColdChain) {
    weightMultiplier *= 1.35;
    vehicle += ' [Câmara Frigorífica]';
  }

  const finalCost = Math.round(baseCostAOA * weightMultiplier);

  return {
    distanceKm: baseDistanceKm,
    estimatedCostAOA: finalCost,
    suggestedVehicle: vehicle,
    transitDays
  };
}

export const PROVINCES_ANGOLA = ANGOLA_PROVINCES;
