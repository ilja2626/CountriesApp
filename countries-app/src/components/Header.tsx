import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../features/auth/types';

interface HeaderProps {
  onLogout: () => void;
  onSearch: (query: string) => void;
  onSubmitSearch: () => void;
  searchQuery: string;
  onRegionFilter: (region: string) => void;
  onSort: (sortBy: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onBack: () => void;
  showBack: boolean;
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  onSearch,
  onSubmitSearch,
  searchQuery,
  onToggleDarkMode,
  isDarkMode,
  onBack,
  showBack,
  currentUser,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearch(value);
  };

  const handleHomeClick = () => {
    navigate('/');
    onSearch('');
  };

  return (
    <div className="relative">
      <header className={`bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl sticky top-0 z-50 transition-all duration-300 rounded-b-3xl overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
        {/* Left wavy line */}
        <svg
          className="absolute left-0 top-0 h-full w-10"
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 Q20,25 0,50 Q20,75 0,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.4"
          />
        </svg>
        {/* Right wavy line */}
        <svg
          className="absolute right-0 top-0 h-full w-10"
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
        >
          <path
            d="M40,0 Q20,25 40,50 Q20,75 40,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
            opacity="0.4"
          />
        </svg>
        <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleHomeClick}>
            <h1 className="text-3xl font-bold tracking-wide">CountriesApp</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            {showBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium shadow-md"
              >
                Back
              </button>
            )}

            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Search countries..."
              className="px-4 py-2 rounded-lg text-gray-800 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-md"
            />

            <button
              onClick={onToggleDarkMode}
              className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium shadow-md"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {currentUser && (
              <span className="px-4 py-2 text-white font-medium">
                Welcome, {currentUser.nickname}!
              </span>
            )}

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
    </div>
  );
};

export default Header;