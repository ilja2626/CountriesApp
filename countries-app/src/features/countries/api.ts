import axios from 'axios';
import { Country } from './types';

const BASE_URL = 'https://restcountries.com/v3.1';

export const getAllCountries = async (): Promise<Country[]> => {
  const response = await axios.get(`${BASE_URL}/all?fields=name,flags,capital,population,region,subregion,languages,currencies,area,borders`);
  return response.data;
};

export const searchCountriesByName = async (name: string): Promise<Country[]> => {
  if (!name.trim()) return getAllCountries();
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}?fields=name,flags,capital,population,region,subregion,languages,currencies,area,borders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const searchCountriesByCapital = async (capital: string): Promise<Country[]> => {
  if (!capital.trim()) return getAllCountries();
  try {
    const response = await axios.get(`${BASE_URL}/capital/${capital}?fields=name,flags,capital,population,region,subregion,languages,currencies,area,borders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};