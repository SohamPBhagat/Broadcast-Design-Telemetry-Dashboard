export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  category: 'POLITICS' | 'TECH' | 'FINANCE' | 'ENERGY' | 'DEFENSE' | 'MARKETS';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface StockItem {
  ticker: string;
  name: string;
  price: string;
  change: string;
  changePercent: number; // positive for gainers, negative for losers
}

export interface CountryNewsAndStocks {
  news: NewsItem[];
  gainers: StockItem[]; // Top 5 growing stocks
  losers: StockItem[];  // Bottom 5 declining stocks
}

// Country-specific stock indices & news database
const COUNTRY_DATA_MAP: Record<string, CountryNewsAndStocks> = {
  USA: {
    news: [
      { id: 'u1', headline: 'Fed Signals Rate Adjustment amid Quantum Tech Growth', source: 'REUTERS', timeAgo: '4m ago', category: 'FINANCE', impact: 'HIGH' },
      { id: 'u2', headline: 'Semiconductor Alliance Expands New Fab Infrastructure', source: 'BLOOMBERG', timeAgo: '12m ago', category: 'TECH', impact: 'HIGH' },
      { id: 'u3', headline: 'Energy Grid Upgrades Complete Across Eastern Seaboard', source: 'WSJ', timeAgo: '28m ago', category: 'ENERGY', impact: 'MEDIUM' },
      { id: 'u4', headline: 'Satellite Defense Network Achieves Initial IOC Operational Status', source: 'DEFENSE NEWS', timeAgo: '45m ago', category: 'DEFENSE', impact: 'HIGH' },
      { id: 'u5', headline: 'S&P 500 Rallies as AI Infrastructure Orders Surge', source: 'CNBC', timeAgo: '1h ago', category: 'MARKETS', impact: 'MEDIUM' }
    ],
    gainers: [
      { ticker: 'NVDA', name: 'NVIDIA Corp', price: '$138.25', change: '+$11.40', changePercent: +8.98 },
      { ticker: 'PLTR', name: 'Palantir Tech', price: '$44.10', change: '+$3.15', changePercent: +7.69 },
      { ticker: 'TSLA', name: 'Tesla Inc', price: '$252.80', change: '+$15.20', changePercent: +6.40 },
      { ticker: 'AMZN', name: 'Amazon.com', price: '$189.50', change: '+$8.30', changePercent: +4.58 },
      { ticker: 'MSFT', name: 'Microsoft', price: '$451.20', change: '+$14.80', changePercent: +3.39 }
    ],
    losers: [
      { ticker: 'INTC', name: 'Intel Corp', price: '$19.80', change: '-$1.85', changePercent: -8.55 },
      { ticker: 'BA', name: 'Boeing Co', price: '$152.10', change: '-$9.40', changePercent: -5.82 },
      { ticker: 'DIS', name: 'Walt Disney', price: '$89.40', change: '-$4.10', changePercent: -4.38 },
      { ticker: 'PFE', name: 'Pfizer Inc', price: '$27.50', change: '-$1.15', changePercent: -4.01 },
      { ticker: 'NKE', name: 'Nike Inc', price: '$78.30', change: '-$2.90', changePercent: -3.57 }
    ]
  },
  CAN: {
    news: [
      { id: 'c1', headline: 'Bank of Canada Maintains Key Policy Rate', source: 'FINANCIAL POST', timeAgo: '10m ago', category: 'FINANCE', impact: 'MEDIUM' },
      { id: 'c2', headline: 'Clean Energy Energy Corridor Approved in Alberta', source: 'CBC NEWS', timeAgo: '22m ago', category: 'ENERGY', impact: 'HIGH' },
      { id: 'c3', headline: 'Shopify Unveils Global Commerce AI Tools', source: 'GLOBE AND MAIL', timeAgo: '50m ago', category: 'TECH', impact: 'HIGH' },
      { id: 'c4', headline: 'Arctic Border Radar Infrastructure Upgrades', source: 'OTTAWA CITIZEN', timeAgo: '1h ago', category: 'DEFENSE', impact: 'MEDIUM' },
      { id: 'c5', headline: 'TSX Index Gains on Mining and Tech Rally', source: 'BNN BLOOMBERG', timeAgo: '2h ago', category: 'MARKETS', impact: 'LOW' }
    ],
    gainers: [
      { ticker: 'SHOP', name: 'Shopify Inc', price: 'C$112.40', change: '+C$8.20', changePercent: +7.87 },
      { ticker: 'SU', name: 'Suncor Energy', price: 'C$54.80', change: '+C$3.10', changePercent: +6.00 },
      { ticker: 'CNQ', name: 'Canadian Nat Res', price: 'C$48.90', change: '+C$2.40', changePercent: +5.16 },
      { ticker: 'TD', name: 'TD Bank Group', price: 'C$82.10', change: '+C$2.90', changePercent: +3.66 },
      { ticker: 'RY', name: 'Royal Bank Can', price: 'C$158.30', change: '+C$4.80', changePercent: +3.13 }
    ],
    losers: [
      { ticker: 'BBD.B', name: 'Bombardier Inc', price: 'C$88.20', change: '-C$6.40', changePercent: -6.77 },
      { ticker: 'AC', name: 'Air Canada', price: 'C$15.40', change: '-C$0.95', changePercent: -5.81 },
      { ticker: 'LUN', name: 'Lundin Mining', price: 'C$13.10', change: '-C$0.65', changePercent: -4.73 },
      { ticker: 'NTR', name: 'Nutrien Ltd', price: 'C$66.20', change: '-C$2.80', changePercent: -4.06 },
      { ticker: 'BCE', name: 'BCE Inc', price: 'C$44.50', change: '-C$1.60', changePercent: -3.47 }
    ]
  },
  GBR: {
    news: [
      { id: 'g1', headline: 'FTSE 100 Reaches New Multi-Month High', source: 'FINANCIAL TIMES', timeAgo: '8m ago', category: 'MARKETS', impact: 'HIGH' },
      { id: 'g2', headline: 'UK Tech Sector Inflow Surges Following AI Policy Summit', source: 'BBC BUSINESS', timeAgo: '19m ago', category: 'TECH', impact: 'HIGH' },
      { id: 'g3', headline: 'North Sea Wind Project Reaches Grid Interconnect', source: 'GUARDIAN', timeAgo: '35m ago', category: 'ENERGY', impact: 'MEDIUM' },
      { id: 'g4', headline: 'Bank of England Outlines Digital Currency Pilot Roadmap', source: 'TELEGRAPH', timeAgo: '1h ago', category: 'FINANCE', impact: 'HIGH' },
      { id: 'g5', headline: 'Royal Navy Cyber Node Defense System Deployed', source: 'DEFENSE JOURNAL', timeAgo: '2h ago', category: 'DEFENSE', impact: 'MEDIUM' }
    ],
    gainers: [
      { ticker: 'AZN', name: 'AstraZeneca', price: '£124.50', change: '+£8.20', changePercent: +7.05 },
      { ticker: 'SHEL', name: 'Shell PLC', price: '£28.90', change: '+£1.55', changePercent: +5.67 },
      { ticker: 'ARM', name: 'Arm Holdings', price: '$142.80', change: '+$7.10', changePercent: +5.23 },
      { ticker: 'HSBA', name: 'HSBC Holdings', price: '£6.85', change: '+£0.28', changePercent: +4.26 },
      { ticker: 'BP', name: 'BP PLC', price: '£4.42', change: '+£0.15', changePercent: +3.51 }
    ],
    losers: [
      { ticker: 'RR', name: 'Rolls-Royce', price: '£4.82', change: '-£0.38', changePercent: -7.31 },
      { ticker: 'VOD', name: 'Vodafone Group', price: '£0.72', change: '-£0.04', changePercent: -5.26 },
      { ticker: 'BARC', name: 'Barclays PLC', price: '£2.18', change: '-£0.11', changePercent: -4.80 },
      { ticker: 'BT.A', name: 'BT Group', price: '£1.38', change: '-£0.06', changePercent: -4.17 },
      { ticker: 'TSCO', name: 'Tesco PLC', price: '£3.45', change: '-£0.12', changePercent: -3.36 }
    ]
  },
  DEU: {
    news: [
      { id: 'd1', headline: 'DAX Soars as Industrial Automation Demand Accelerates', source: 'HANDELSBLATT', timeAgo: '5m ago', category: 'MARKETS', impact: 'HIGH' },
      { id: 'd2', headline: 'SAP Enterprise Cloud Revenue Tops Forecasts', source: 'DEUTSCHE WELLE', timeAgo: '15m ago', category: 'TECH', impact: 'HIGH' },
      { id: 'd3', headline: 'Germany Unveils Green Hydrogen Supergrid Network', source: 'ZEIT ONLINE', timeAgo: '42m ago', category: 'ENERGY', impact: 'MEDIUM' },
      { id: 'd4', headline: 'European Defense Telemetry Node Operational in Bavaria', source: 'DER SPIEGEL', timeAgo: '1h ago', category: 'DEFENSE', impact: 'HIGH' },
      { id: 'd5', headline: 'ECB Comments Support Euro Strength in Global FX', source: 'FAZ', timeAgo: '2h ago', category: 'FINANCE', impact: 'LOW' }
    ],
    gainers: [
      { ticker: 'SAP', name: 'SAP SE', price: '€202.40', change: '+€14.80', changePercent: +7.89 },
      { ticker: 'RHM', name: 'Rheinmetall AG', price: '€528.00', change: '+€34.00', changePercent: +6.88 },
      { ticker: 'SIE', name: 'Siemens AG', price: '€178.50', change: '+€8.90', changePercent: +5.25 },
      { ticker: 'BMW', name: 'BMW AG', price: '€88.40', change: '+€3.60', changePercent: +4.25 },
      { ticker: 'ALV', name: 'Allianz SE', price: '€285.20', change: '+€8.40', changePercent: +3.03 }
    ],
    losers: [
      { ticker: 'VOW3', name: 'Volkswagen AG', price: '€92.50', change: '-€6.80', changePercent: -6.85 },
      { ticker: 'DBK', name: 'Deutsche Bank', price: '€14.10', change: '-€0.85', changePercent: -5.69 },
      { ticker: 'BAS', name: 'BASF SE', price: '€43.20', change: '-€2.10', changePercent: -4.64 },
      { ticker: 'BAYN', name: 'Bayer AG', price: '€26.80', change: '-€1.10', changePercent: -3.94 },
      { ticker: 'LHA', name: 'Lufthansa AG', price: '€5.80', change: '-€0.22', changePercent: -3.65 }
    ]
  },
  JPN: {
    news: [
      { id: 'j1', headline: 'Nikkei 225 Gains as Semiconductor Capital Inflow Rises', source: 'NIKKEI SHIMBUN', timeAgo: '6m ago', category: 'MARKETS', impact: 'HIGH' },
      { id: 'j2', headline: 'Sony Next-Gen Robotics Sensing Chip Announced', source: 'ASAHI SHIMBUN', timeAgo: '18m ago', category: 'TECH', impact: 'HIGH' },
      { id: 'j3', headline: 'JAXA Establishes Deep Space Telemetry Hub in Kyushu', source: 'MAINICHI', timeAgo: '33m ago', category: 'DEFENSE', impact: 'MEDIUM' },
      { id: 'j4', headline: 'Tokyo Metro Smart Grid Sensor Rollout Complete', source: 'JAPAN TIMES', timeAgo: '55m ago', category: 'ENERGY', impact: 'LOW' },
      { id: 'j5', headline: 'Bank of Japan Monetary Policy Update Focuses on FX', source: 'YOMIURI', timeAgo: '1h ago', category: 'FINANCE', impact: 'HIGH' }
    ],
    gainers: [
      { ticker: '6758.T', name: 'Sony Group', price: '¥13,850', change: '+¥980', changePercent: +7.61 },
      { ticker: '6861.T', name: 'Keyence Corp', price: '¥68,400', change: '+¥4,200', changePercent: +6.54 },
      { ticker: '7203.T', name: 'Toyota Motor', price: '¥3,120', change: '+¥165', changePercent: +5.58 },
      { ticker: '9984.T', name: 'SoftBank Group', price: '¥8,940', change: '+¥410', changePercent: +4.81 },
      { ticker: '8306.T', name: 'Mitsubishi UFJ', price: '¥1,640', change: '+¥58', changePercent: +3.67 }
    ],
    losers: [
      { ticker: '7267.T', name: 'Honda Motor', price: '¥1,480', change: '-¥105', changePercent: -6.62 },
      { ticker: '6752.T', name: 'Panasonic Corp', price: '¥1,210', change: '-¥72', changePercent: -5.62 },
      { ticker: '9983.T', name: 'Fast Retailing', price: '¥42,100', change: '-¥2,100', changePercent: -4.75 },
      { ticker: '4502.T', name: 'Takeda Pharm', price: '¥4,150', change: '-¥180', changePercent: -4.16 },
      { ticker: '7751.T', name: 'Canon Inc', price: '¥4,320', change: '-¥150', changePercent: -3.36 }
    ]
  },
  CHN: {
    news: [
      { id: 'ch1', headline: 'BeiDou Telemetry Grid Expands Autonomous Network', source: 'XINHUA', timeAgo: '3m ago', category: 'DEFENSE', impact: 'HIGH' },
      { id: 'ch2', headline: 'Alibaba Cloud & Tencent Launch Joint Open AI Engine', source: 'CAIXIN', timeAgo: '14m ago', category: 'TECH', impact: 'HIGH' },
      { id: 'ch3', headline: 'State Grid Completes Ultra-High Voltage Solar Corridor', source: 'PEOPLE DAILY', timeAgo: '29m ago', category: 'ENERGY', impact: 'MEDIUM' },
      { id: 'ch4', headline: 'PBOC Injects Liquidity into Regional Tech Infrastructure', source: 'SOUTH CHINA MORNING POST', timeAgo: '48m ago', category: 'FINANCE', impact: 'HIGH' },
      { id: 'ch5', headline: 'Hang Seng Tech Index Rallies on Digital Trade Agreements', source: 'GLOBAL TIMES', timeAgo: '1h ago', category: 'MARKETS', impact: 'MEDIUM' }
    ],
    gainers: [
      { ticker: '9988.HK', name: 'Alibaba Group', price: 'HK$84.50', change: '+HK$6.80', changePercent: +8.75 },
      { ticker: '0700.HK', name: 'Tencent Holdings', price: 'HK$382.00', change: '+HK$25.40', changePercent: +7.12 },
      { ticker: '1810.HK', name: 'Xiaomi Corp', price: 'HK$18.90', change: '+HK$1.15', changePercent: +6.48 },
      { ticker: '3690.HK', name: 'Meituan', price: 'HK$124.10', change: '+HK$6.30', changePercent: +5.35 },
      { ticker: '1211.HK', name: 'BYD Company', price: 'HK$245.00', change: '+HK$9.20', changePercent: +3.90 }
    ],
    losers: [
      { ticker: '0981.HK', name: 'SMIC Semiconductor', price: 'HK$16.40', change: '-HK$1.35', changePercent: -7.61 },
      { ticker: '2318.HK', name: 'Ping An Insurance', price: 'HK$36.20', change: '-HK$2.20', changePercent: -5.73 },
      { ticker: '0941.HK', name: 'China Mobile', price: 'HK$72.80', change: '-HK$3.40', changePercent: -4.46 },
      { ticker: '0857.HK', name: 'PetroChina', price: 'HK$6.45', change: '-HK$0.28', changePercent: -4.16 },
      { ticker: '1398.HK', name: 'ICBC Bank', price: 'HK$4.35', change: '-HK$0.15', changePercent: -3.33 }
    ]
  }
};

// Generic Fallback Data Generator for any selected country
export const getCountryNewsAndStocks = (countryId: string, countryName: string): CountryNewsAndStocks => {
  const code = countryId.toUpperCase();
  if (COUNTRY_DATA_MAP[code]) {
    return COUNTRY_DATA_MAP[code];
  }

  // Generate dynamic, realistic data for any country
  return {
    news: [
      { id: `${code}-n1`, headline: `${countryName} Activates High-Speed Telecom Uplink Node`, source: 'GLOBAL TELEMETRY', timeAgo: '5m ago', category: 'TECH', impact: 'HIGH' },
      { id: `${code}-n2`, headline: `Central Bank of ${countryName} Outlines Modern Economic Framework`, source: 'WORLD FINANCIAL', timeAgo: '16m ago', category: 'FINANCE', impact: 'HIGH' },
      { id: `${code}-n3`, headline: `${countryName} Grid Sector Upgrades Renewable Power Array`, source: 'ENERGY PULSE', timeAgo: '32m ago', category: 'ENERGY', impact: 'MEDIUM' },
      { id: `${code}-n4`, headline: `Regional Defense & Satellite Radar Array Reaches Full Operational Sync`, source: 'NORAD RADAR', timeAgo: '50m ago', category: 'DEFENSE', impact: 'MEDIUM' },
      { id: `${code}-n5`, headline: `${countryName} Stock Index Gains on Digital Commerce Inflow`, source: 'REUTERS GLOBAL', timeAgo: '1h ago', category: 'MARKETS', impact: 'LOW' }
    ],
    gainers: [
      { ticker: `${code}T1`, name: `${countryName} Tech Corp`, price: '$84.20', change: '+$6.80', changePercent: +8.77 },
      { ticker: `${code}E2`, name: `${countryName} Energy Ltd`, price: '$52.10', change: '+$3.60', changePercent: +7.42 },
      { ticker: `${code}B3`, name: `${countryName} Nat Bank`, price: '$112.50', change: '+$6.30', changePercent: +5.93 },
      { ticker: `${code}M4`, name: `${countryName} Mining Co`, price: '$34.80', change: '+$1.50', changePercent: +4.50 },
      { ticker: `${code}S5`, name: `${countryName} Telecom`, price: '$22.40', change: '+$0.85', changePercent: +3.94 }
    ],
    losers: [
      { ticker: `${code}A1`, name: `${countryName} Airways`, price: '$14.20', change: '-$1.10', changePercent: -7.19 },
      { ticker: `${code}C2`, name: `${countryName} Chemical`, price: '$45.80', change: '-$2.90', changePercent: -5.95 },
      { ticker: `${code}R3`, name: `${countryName} Real Estate`, price: '$28.10', change: '-$1.40', changePercent: -4.75 },
      { ticker: `${code}I4`, name: `${countryName} Infra`, price: '$61.30', change: '-$2.60', changePercent: -4.07 },
      { ticker: `${code}P5`, name: `${countryName} Pharma`, price: '$39.20', change: '-$1.30', changePercent: -3.21 }
    ]
  };
};
