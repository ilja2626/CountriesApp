import React from 'react';
import { CountryWithFavorite } from './types';

interface CountryCardProps {
  country: CountryWithFavorite;
  onFlagClick: (country: CountryWithFavorite) => void;
  onToggleFavorite: (country: CountryWithFavorite) => void;
  isDarkMode: boolean;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, onFlagClick, onToggleFavorite, isDarkMode }) => {
  return (
    <div className={`rounded-xl shadow-md overflow-hidden card-hover relative ${isDarkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'}`}>
      <button
        onClick={() => onToggleFavorite(country)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full ${isDarkMode ? 'bg-gray-900/80 hover:bg-gray-800' : 'bg-white/80 hover:bg-white'} transition-colors duration-200 shadow-sm`}
        title={country.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-5 h-5 ${country.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400 hover:text-yellow-400'} transition-colors duration-200`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        className="w-full h-40 object-cover cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onFlagClick(country)}
      />
      <div className="p-4">
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{country.name.common}</h3>
        <p className={`mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
          <span className="font-medium">Capital:</span> {country.capital?.[0] || 'No data'}
        </p>
        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
          <span className="font-medium">Population:</span> {country.population.toLocaleString()}
        </p>
        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
          <span className="font-medium">Region:</span> {country.region}
        </p>
      </div>
    </div>
  );
};

export default CountryCard;