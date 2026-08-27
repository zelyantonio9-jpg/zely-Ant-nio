export interface ProvinceData {
  id: string;
  name: string;
  capital: string;
  region: 'Norte' | 'Centro' | 'Sul' | 'Leste';
  specialties: string[];
  municipalities: string[];
}

export const ANGOLA_PROVINCES: ProvinceData[] = [
  {
    id: 'luanda',
    name: 'Luanda',
    capital: 'Luanda',
    region: 'Norte',
    specialties: ['Comércio Geral', 'Indústria Transformadora', 'Consumo B2B', 'Materiais de Construção'],
    municipalities: ['Luanda', 'Belas', 'Cazenga', 'Cacuaco', 'Viana', 'Talatona', 'Kilamba Kiaxi', 'Icolo e Bengo', 'Quiçama']
  },
  {
    id: 'huambo',
    name: 'Huambo',
    capital: 'Huambo',
    region: 'Centro',
    specialties: ['Milho', 'Feijão', 'Batata Rena', 'Hortícolas', 'Avicultura'],
    municipalities: ['Huambo', 'Caála', 'Bailundo', 'Ekunha', 'Longonjo', 'Ucuma', 'Chinjenje', 'Cachiungo', 'Tchicala Tcholohanga', 'Mungo']
  },
  {
    id: 'benguela',
    name: 'Benguela',
    capital: 'Benguela',
    region: 'Centro',
    specialties: ['Pesca & Sal', 'Banana', 'Manga', 'Tomate', 'Logística Ferroviária'],
    municipalities: ['Benguela', 'Lobito', 'Catumbela', 'Baía Farta', 'Cubal', 'Ganda', 'Balombo', 'Bocoio', 'Chongoroi', 'Caimbambo']
  },
  {
    id: 'huila',
    name: 'Huíla',
    capital: 'Lubango',
    region: 'Sul',
    specialties: ['Carne Bovina', 'Hortícolas da Humpata', 'Frutas de Clima Temperado', 'Laticínios'],
    municipalities: ['Lubango', 'Humpata', 'Chibia', 'Matala', 'Quipungo', 'Caluquembe', 'Caconda', 'Chicomba', 'Jamba', 'Kuvango', 'Chipindo', 'Quilengues']
  },
  {
    id: 'cuanza_sul',
    name: 'Cuanza Sul',
    capital: 'Sumbe',
    region: 'Centro',
    specialties: ['Café Arábica e Robusta', 'Palma e Azeite', 'Milho', 'Cimento de Porto Amboim', 'Frutas'],
    municipalities: ['Sumbe', 'Porto Amboim', 'Amboim (Gabela)', 'Cela (Waku Kungo)', 'Libolo', 'Quibala', 'Mussende', 'Seles', 'Conda', 'Ebo', 'Cassongue', 'Kilenda']
  },
  {
    id: 'malanje',
    name: 'Malanje',
    capital: 'Malanje',
    region: 'Norte',
    specialties: ['Mandioca', 'Arroz', 'Açúcar de Cacuso', 'Gergelim', 'Soja', 'Pecuária'],
    municipalities: ['Malanje', 'Cacuso', 'Calandula', 'Cangandala', 'Cahombo', 'Kiuaba Nzoji', 'Massango', 'Marimba', 'Mucari', 'Quela', 'Quirima']
  },
  {
    id: 'bengo',
    name: 'Bengo',
    capital: 'Caxito',
    region: 'Norte',
    specialties: ['Banana Pão', 'Mandioca', 'Mamão', 'Citadinos', 'Peixe de Água Doce'],
    municipalities: ['Dande (Caxito)', 'Ambriz', 'Bula Atumba', 'Dembos', 'Nambuangongo', 'Pango Aluquém']
  },
  {
    id: 'cabinda',
    name: 'Cabinda',
    capital: 'Cabinda',
    region: 'Norte',
    specialties: ['Madeira Nobre', 'Cacau', 'Café', 'Peixe & Marisco', 'Banana'],
    municipalities: ['Cabinda', 'Cacongo', 'Buco-Zau', 'Belize']
  },
  {
    id: 'uige',
    name: 'Uíge',
    capital: 'Uíge',
    region: 'Norte',
    specialties: ['Café', 'Mandioca', 'Amendoim (Ginguba)', 'Frutas Tropicais'],
    municipalities: ['Uíge', 'Negage', 'Songo', 'Quitexe', 'Pombo', 'Maquela do Zombo', 'Damba', 'Mucaba', 'Bungo', 'Ambuíla']
  },
  {
    id: 'bie',
    name: 'Bié',
    capital: 'Cuito',
    region: 'Centro',
    specialties: ['Trigo', 'Arroz', 'Feijão', 'Batata Doce', 'Mel Silvestre'],
    municipalities: ['Cuito', 'Andulo', 'Camacupa', 'Catabola', 'Chinguar', 'Chitembo', 'Cunhinga', 'Cuemba', 'Nharêa']
  },
  {
    id: 'namibe',
    name: 'Namibe',
    capital: 'Moçâmedes',
    region: 'Sul',
    specialties: ['Pesca Industrial e Artesanal', 'Peixe Seco', 'Uvas e Vinho do Namibe', 'Tomate'],
    municipalities: ['Moçâmedes', 'Tômbwa', 'Virei', 'Bibala', 'Camucuio']
  },
  {
    id: 'zaire',
    name: 'Zaire',
    capital: 'Mbanza Kongo',
    region: 'Norte',
    specialties: ['Comércio Transfronteiriço', 'Pesca no Rio Zaire', 'Mandioca', 'Dendém'],
    municipalities: ['Mbanza Kongo', 'Soyo', 'Nóqui', 'Nzeto', 'Tomboco', 'Cuimba']
  },
  {
    id: 'lunda_norte',
    name: 'Lunda Norte',
    capital: 'Dundo',
    region: 'Leste',
    specialties: ['Agricultura de Subsistência', 'Mel', 'Comércio de Fronteira'],
    municipalities: ['Chitato (Dundo)', 'Cambulo', 'Caungula', 'Cuilo', 'Capenda-Camulemba', 'Lubalo', 'Lucapa']
  },
  {
    id: 'lunda_sul',
    name: 'Lunda Sul',
    capital: 'Saurimo',
    region: 'Leste',
    specialties: ['Artesanato Chokwe', 'Mandioca', 'Peixe Seco'],
    municipalities: ['Saurimo', 'Cacolo', 'Dala', 'Muconda']
  },
  {
    id: 'moxico',
    name: 'Moxico',
    capital: 'Luena',
    region: 'Leste',
    specialties: ['Mel do Moxico', 'Arroz de Sequeiro', 'Peixe do Rio Zambeze', 'Castanha de Caju'],
    municipalities: ['Luena (Moxico)', 'Camanongue', 'Léua', 'Cameia', 'Luacano', 'Luchazes', 'Alto Zambeze', 'Bundas']
  },
  {
    id: 'cunene',
    name: 'Cunene',
    capital: 'Ondjiva',
    region: 'Sul',
    specialties: ['Gado Bovino e Caprino', 'Massango e Massambala', 'Comércio Transfronteiriço'],
    municipalities: ['Cuanhama (Ondjiva)', 'Ombadja', 'Namacunde', 'Curoca', 'Cahama', 'Cuvelai']
  },
  {
    id: 'cuanza_norte',
    name: 'Cuanza Norte',
    capital: 'Ndalatando',
    region: 'Norte',
    specialties: ['Palma & Dendém', 'Banana', 'Citadinos', 'Água Mineral'],
    municipalities: ['Cazengo (Ndalatando)', 'Cambambe (Dondo)', 'Golungo Alto', 'Lucala', 'Samba Cajú', 'Ambaca']
  },
  {
    id: 'cuando_cubango',
    name: 'Cuando Cubango',
    capital: 'Menongue',
    region: 'Sul',
    specialties: ['Pecuária extensiva', 'Madeira sustentável', 'Pesca fluvial', 'Mel'],
    municipalities: ['Menongue', 'Cuchi', 'Cuangar', 'Dirico', 'Mavinga', 'Rivungo', 'Calai']
  }
];

export function calculateFreightEstimate(
  originProvinceId: string,
  destProvinceId: string,
  weightKg: number,
  requiresColdChain: boolean = false
): { distanceKm: number; estimatedCostAOA: number; suggestedVehicle: string; transitDays: number } {
  const isSameProvince = originProvinceId.toLowerCase() === destProvinceId.toLowerCase();
  
  // Approximate standard road matrix for Angola
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
      (originProvinceId === 'luanda' && destProvinceId === 'bengo')
    ) {
      baseDistanceKm = 70;
      baseCostAOA = 9500;
      transitDays = 1;
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
