export interface CountryMeta {
  id: string; // ISO 3-letter code e.g. USA
  name: string;
  code: string; // ISO 2-letter code e.g. US
  capital: string;
  continent: string;
  lat: number;
  lng: number;
}

export const ISO_NUMERIC_MAP: Record<string, CountryMeta> = {
  "840": { id: "USA", name: "United States", code: "US", capital: "Washington, D.C.", continent: "North America", lat: 37.09, lng: -95.71 },
  "124": { id: "CAN", name: "Canada", code: "CA", capital: "Ottawa", continent: "North America", lat: 56.13, lng: -106.35 },
  "484": { id: "MEX", name: "Mexico", code: "MX", capital: "Mexico City", continent: "North America", lat: 23.63, lng: -102.55 },
  "076": { id: "BRA", name: "Brazil", code: "BR", capital: "Brasília", continent: "South America", lat: -14.23, lng: -51.92 },
  "032": { id: "ARG", name: "Argentina", code: "AR", capital: "Buenos Aires", continent: "South America", lat: -38.41, lng: -63.61 },
  "170": { id: "COL", name: "Colombia", code: "CO", capital: "Bogotá", continent: "South America", lat: 4.57, lng: -74.29 },
  "604": { id: "PER", name: "Peru", code: "PE", capital: "Lima", continent: "South America", lat: -9.19, lng: -75.01 },
  "152": { id: "CHL", name: "Chile", code: "CL", capital: "Santiago", continent: "South America", lat: -35.67, lng: -71.54 },
  "826": { id: "GBR", name: "United Kingdom", code: "GB", capital: "London", continent: "Europe", lat: 55.37, lng: -3.43 },
  "250": { id: "FRA", name: "France", code: "FR", capital: "Paris", continent: "Europe", lat: 46.22, lng: 2.21 },
  "276": { id: "DEU", name: "Germany", code: "DE", capital: "Berlin", continent: "Europe", lat: 51.16, lng: 10.45 },
  "380": { id: "ITA", name: "Italy", code: "IT", capital: "Rome", continent: "Europe", lat: 41.87, lng: 12.56 },
  "724": { id: "ESP", name: "Spain", code: "ES", capital: "Madrid", continent: "Europe", lat: 40.46, lng: -3.74 },
  "752": { id: "SWE", name: "Sweden", code: "SE", capital: "Stockholm", continent: "Europe", lat: 60.12, lng: 18.64 },
  "578": { id: "NOR", name: "Norway", code: "NO", capital: "Oslo", continent: "Europe", lat: 60.47, lng: 8.46 },
  "616": { id: "POL", name: "Poland", code: "PL", capital: "Warsaw", continent: "Europe", lat: 51.91, lng: 19.14 },
  "804": { id: "UKR", name: "Ukraine", code: "UA", capital: "Kyiv", continent: "Europe", lat: 48.37, lng: 31.16 },
  "792": { id: "TUR", name: "Turkey", code: "TR", capital: "Ankara", continent: "Asia/Europe", lat: 38.96, lng: 35.24 },
  "818": { id: "EGY", name: "Egypt", code: "EG", capital: "Cairo", continent: "Africa", lat: 26.82, lng: 30.80 },
  "566": { id: "NGA", name: "Nigeria", code: "NG", capital: "Abuja", continent: "Africa", lat: 9.08, lng: 8.67 },
  "710": { id: "ZAF", name: "South Africa", code: "ZA", capital: "Pretoria", continent: "Africa", lat: -30.55, lng: 22.93 },
  "404": { id: "KEN", name: "Kenya", code: "KE", capital: "Nairobi", continent: "Africa", lat: -1.28, lng: 36.81 },
  "504": { id: "MAR", name: "Morocco", code: "MA", capital: "Rabat", continent: "Africa", lat: 31.79, lng: -7.09 },
  "231": { id: "ETH", name: "Ethiopia", code: "ET", capital: "Addis Ababa", continent: "Africa", lat: 9.14, lng: 40.48 },
  "682": { id: "SAU", name: "Saudi Arabia", code: "SA", capital: "Riyadh", continent: "Asia", lat: 23.88, lng: 45.07 },
  "364": { id: "IRN", name: "Iran", code: "IR", capital: "Tehran", continent: "Asia", lat: 32.42, lng: 53.68 },
  "586": { id: "PAK", name: "Pakistan", code: "PK", capital: "Islamabad", continent: "Asia", lat: 30.37, lng: 69.34 },
  "356": { id: "IND", name: "India", code: "IN", capital: "New Delhi", continent: "Asia", lat: 20.59, lng: 78.96 },
  "156": { id: "CHN", name: "China", code: "CN", capital: "Beijing", continent: "Asia", lat: 35.86, lng: 104.19 },
  "392": { id: "JPN", name: "Japan", code: "JP", capital: "Tokyo", continent: "Asia", lat: 36.20, lng: 138.25 },
  "410": { id: "KOR", name: "South Korea", code: "KR", capital: "Seoul", continent: "Asia", lat: 35.90, lng: 127.76 },
  "360": { id: "IDN", name: "Indonesia", code: "ID", capital: "Jakarta", continent: "Asia", lat: -0.78, lng: 113.92 },
  "702": { id: "SGP", name: "Singapore", code: "SG", capital: "Singapore", continent: "Asia", lat: 1.3521, lng: 103.8198 },
  "036": { id: "AUS", name: "Australia", code: "AU", capital: "Canberra", continent: "Oceania", lat: -25.27, lng: 133.77 },
  "554": { id: "NZL", name: "New Zealand", code: "NZ", capital: "Wellington", continent: "Oceania", lat: -40.90, lng: 174.88 },
  "643": { id: "RUS", name: "Russia", code: "RU", capital: "Moscow", continent: "Europe/Asia", lat: 61.52, lng: 105.31 }
};
