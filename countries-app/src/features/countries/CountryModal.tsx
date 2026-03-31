import React from 'react';
import { CountryWithFavorite } from './types';

interface CountryModalProps {
  country: CountryWithFavorite | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const CountryModal: React.FC<CountryModalProps> = ({ country, isOpen, onClose, isDarkMode }) => {
  if (!isOpen || !country) return null;

  const formatLanguages = (languages?: { [key: string]: string }) => {
    if (!languages) return 'No data';
    return Object.values(languages).join(', ');
  };

  const formatCurrencies = (currencies?: { [key: string]: { name: string; symbol: string } }) => {
    if (!currencies) return 'No data';
    return Object.values(currencies).map(curr => `${curr.name} (${curr.symbol})`).join(', ');
  };

  const formatBorders = (borders?: string[]) => {
    if (!borders || borders.length === 0) return 'No bordering countries';
    return borders.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-1 ${isDarkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'}`}>
        <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold">{country.name.common}</h2>
            <div className="flex gap-6">
              <button
                onClick={() => {
                  const searchQuery = country.capital?.[0] || country.name.common;
                  window.open(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, '_blank');
                }}
                className={`px-3 py-1 rounded-lg transition-opacity hover:opacity-70 ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
              >
                Map
              </button>
              <button
                onClick={onClose}
                className={`text-2xl hover:opacity-70 transition-opacity ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                className="w-full max-w-xs rounded-lg shadow-md"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Official Name:</span> {country.name.official}</p>
                  <p><span className="font-medium">Capital:</span> {country.capital?.[0] || 'No data'}</p>
                  <p><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
                  <p><span className="font-medium">Area:</span> {country.area ? `${country.area.toLocaleString()} km²` : 'No data'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Additional Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Languages:</span> {formatLanguages(country.languages)}</p>
                  <p><span className="font-medium">Currencies:</span> {formatCurrencies(country.currencies)}</p>
                  <p><span className="font-medium">Region:</span> {country.region}</p>
                  <p><span className="font-medium">Subregion:</span> {country.subregion || 'No data'}</p>
                  <p><span className="font-medium">Bordering Countries:</span> {formatBorders(country.borders)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;

