export interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  capital?: string[];
  population: number;
  region: string;
  subregion?: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  area?: number;
  borders?: string[];
  timezones?: string[];
  continents?: string[];
}

export interface CountryWithFavorite extends Country {
  isFavorite: boolean;
  randomOrder?: number;
}