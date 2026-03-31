import React, { useState, useEffect, useMemo } from 'react';
import { getAllCountries, searchCountriesByName, searchCountriesByCapital } from './api';
import { Country, CountryWithFavorite } from './types';
import CountryCard from './CountryCard';
import CountryModal from './CountryModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';

interface CountryListProps {
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: any;
}

const CountryList: React.FC<CountryListProps> = ({ onLogout, isDarkMode, onToggleDarkMode, currentUser }) => {
  const [countries, setCountries] = useState<CountryWithFavorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<CountryWithFavorite | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('none');
  const [countryOrder, setCountryOrder] = useState<Record<string, number>>({});
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [searchNotFoundError, setSearchNotFoundError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.favoriteCountries) {
      setFavorites(new Set(currentUser.favoriteCountries));
    } else {
      setFavorites(new Set());
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const updatedUser = { ...currentUser, favoriteCountries: Array.from(favorites) };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  }, [favorites, currentUser]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Country[];
        if (debouncedQuery === '') {
          data = await getAllCountries();
        } else {
          data = await searchCountriesByName(debouncedQuery);
          if (data.length === 0) {
            data = await searchCountriesByCapital(debouncedQuery);
          }
        }
        const nextOrder = { ...countryOrder };
        const countriesWithFavorites: CountryWithFavorite[] = data.map(country => {
          const key = country.name.common;
          const orderValue = nextOrder[key] ?? Math.random();
          nextOrder[key] = orderValue;

          return {
            ...country,
            isFavorite: favorites.has(country.name.common),
            randomOrder: orderValue,
          };
        });

        setCountryOrder(nextOrder);

        const stableOrderCountries = [...countriesWithFavorites].sort((a, b) => {
          if (a.randomOrder !== undefined && b.randomOrder !== undefined) {
            return a.randomOrder - b.randomOrder;
          }
          return 0;
        });

        setCountries(stableOrderCountries);

        if (searchAttempted && debouncedQuery !== '' && stableOrderCountries.length === 0) {
          setSearchNotFoundError('An error occurred: such a country does not exist');
        } else {
          setSearchNotFoundError(null);
        }
      } catch (err) {
        setError('Failed to load countries. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [debouncedQuery, favorites]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setSearchAttempted(true);
    } else {
      setSearchAttempted(false);
      setSearchNotFoundError(null);
    }
  };

  const handleSearchSubmit = () => {
    setSearchAttempted(true);
    if (searchQuery.trim() === '') {
      setSearchNotFoundError(null);
    }
  };

  const handleFlagClick = (country: CountryWithFavorite) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const handleToggleFavorite = (country: CountryWithFavorite) => {
    const countryName = country.name.common;
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(countryName)) {
        newFavorites.delete(countryName);
      } else {
        newFavorites.add(countryName);
      }
      return newFavorites;
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCountry(null);
  };

  const regionOptions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(countries.map(country => country.region).filter(Boolean)));
    return ['All', ...uniqueRegions.sort()];
  }, [countries]);

  const displayedCountries = useMemo(() => {
    let filtered = regionFilter === 'All' ? [...countries] : countries.filter(country => country.region === regionFilter);

    filtered = filtered.slice().sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

    if (sortOption !== 'none') {
      filtered = filtered.slice().sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;

        if (sortOption === 'name_asc') {
          return a.name.common.localeCompare(b.name.common);
        }
        if (sortOption === 'name_desc') {
          return b.name.common.localeCompare(a.name.common);
        }
        if (sortOption === 'pop_asc') {
          return a.population - b.population;
        }
        if (sortOption === 'pop_desc') {
          return b.population - a.population;
        }

        return 0;
      });
    }

    return filtered;
  }, [countries, regionFilter, sortOption]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
      <Header
        onLogout={onLogout}
        onSearch={handleSearch}
        onSubmitSearch={handleSearchSubmit}
        searchQuery={searchQuery}
        onRegionFilter={() => {}}
        onSort={() => {}}
        onToggleDarkMode={onToggleDarkMode}
        isDarkMode={isDarkMode}
        onBack={() => setSearchQuery('')}
        showBack={searchQuery.length > 0}
        currentUser={currentUser}
      />
      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-end items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-700'} px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-gray-400' : 'focus:ring-blue-500'}`}
            >
              {regionOptions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-lg`}>⇅</span>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-700'} px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-gray-400' : 'focus:ring-blue-500'}`}
            >
              <option value="none">Sort by</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="pop_asc">Population ↓</option>
              <option value="pop_desc">Population ↑</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-2xl flex items-center gap-3">
              <Loader />
              <span className="font-semibold text-lg">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {searchNotFoundError && (
          <div className="text-center py-10 text-red-600 bg-red-100 rounded-lg">
            An error occurred: such a country does not exist
          </div>
        )}

        {!loading && !error && !searchNotFoundError && countries.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No countries found for your search.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayedCountries.map((country) => (
            <CountryCard
              key={country.name.common}
              country={country}
              onFlagClick={handleFlagClick}
              onToggleFavorite={handleToggleFavorite}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>

      <CountryModal
        country={selectedCountry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default CountryList;