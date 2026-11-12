import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import {
  Film,
  BookOpen,
  Sparkles,
  Heart,
  History,
  SlidersHorizontal,
  Code2,
  Shield,
  Search,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Scale,
  Bot
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectItem: (item: Book | Movie, type: MediaType) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectItem,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user, books, movies, wishlist, theme, toggleTheme, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter books and movies based on global search query (Unicode compatible)
  const q = searchQuery.toLowerCase().trim();
  const matchingBooks = q.length > 1
    ? books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        (b.alternateTitle && b.alternateTitle.toLowerCase().includes(q)) ||
        b.author.toLowerCase().includes(q) ||
        b.primaryGenre.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchingMovies = q.length > 1
    ? movies.filter(m =>
        m.title.toLowerCase().includes(q) ||
        (m.alternateTitle && m.alternateTitle.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q) ||
        m.genres.some(g => g.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  const hasSearchResults = matchingBooks.length > 0 || matchingMovies.length > 0;

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent flex items-center">
                  <Film className="w-4 h-4 text-violet-400 -mr-1" />
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  CineBook <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Java Spring Boot
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none hidden md:block">
                Multilingual Recommendation System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'books'
                  ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Books
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'movies'
                  ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'assistant'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-violet-400" />
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Compare
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'wishlist'
                  ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Wishlist
              {wishlist.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
            
            {/* Java Source & Exporter button */}
            <button
              onClick={() => setActiveTab('java-export')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                activeTab === 'java-export'
                  ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 border border-amber-500/50'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              Java 21 / Maven
            </button>

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === 'admin'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-300 hover:text-rose-300'
                }`}
              >
                <Shield className="w-3 h-3 text-rose-400" />
                Admin
              </button>
            )}
          </div>

          {/* Right Side: Global Search + Theme Toggle + User Menu */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Bar */}
            <div ref={searchRef} className="relative hidden md:block w-48 xl:w-64">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search books, movies, scripts..."
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              {/* Instant Search Results Dropdown */}
              {isSearchFocused && searchQuery.length > 1 && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
                    Instant Results
                  </div>
                  
                  {!hasSearchResults && (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No matching books or movies found.
                    </div>
                  )}

                  {matchingBooks.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-bold text-violet-400 uppercase tracking-wider px-1 mb-1">
                        Books ({matchingBooks.length})
                      </div>
                      {matchingBooks.map(b => (
                        <div
                          key={`b-${b.id}`}
                          onClick={() => {
                            onSelectItem(b, 'book');
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <img src={b.coverImageUrl} alt={b.title} className="w-8 h-11 object-cover rounded shadow" />
                          <div className="overflow-hidden">
                            <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                              <span>{b.title}</span>
                              {b.alternateTitle && (
                                <span className="text-[10px] text-violet-300 font-normal">({b.alternateTitle})</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {b.author} • <span className="text-cyan-400">{b.originalLanguage}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchingMovies.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-1 mb-1">
                        Movies ({matchingMovies.length})
                      </div>
                      {matchingMovies.map(m => (
                        <div
                          key={`m-${m.id}`}
                          onClick={() => {
                            onSelectItem(m, 'movie');
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <img src={m.posterImageUrl} alt={m.title} className="w-8 h-11 object-cover rounded shadow" />
                          <div className="overflow-hidden">
                            <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                              <span>{m.title}</span>
                              {m.alternateTitle && (
                                <span className="text-[10px] text-cyan-300 font-normal">({m.alternateTitle})</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              Dir: {m.director} • <span className="text-cyan-400">{m.originalLanguage}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-slate-500 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:block max-w-[90px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onOpenProfile();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                        Language & Preferences
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('wishlist');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        My Wishlist ({wishlist.length})
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('history');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-amber-400" />
                        Recently Viewed
                      </button>

                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-rose-400" />
                          Admin Portal
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-500/20 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-white/5">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'home' ? 'bg-violet-600 text-white' : 'text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'books' ? 'bg-violet-600 text-white' : 'text-slate-300'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'movies' ? 'bg-violet-600 text-white' : 'text-slate-300'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'discover' ? 'bg-cyan-600 text-white' : 'text-slate-300'
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'assistant' ? 'bg-violet-700 text-white' : 'text-slate-300'
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'compare' ? 'bg-slate-700 text-white' : 'text-slate-300'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
              activeTab === 'wishlist' ? 'bg-rose-600 text-white' : 'text-slate-300'
            }`}
          >
            Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('java-export')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 text-amber-300 bg-amber-500/20`}
          >
            Java / Maven
          </button>
        </div>
      </div>
    </nav>
  );
};
