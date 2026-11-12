import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { INITIAL_GENRES, INITIAL_LANGUAGES } from '../data/initialData';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  Languages,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface BooksCatalogueProps {
  onSelectBook: (book: Book) => void;
}

export const BooksCatalogue: React.FC<BooksCatalogueProps> = ({ onSelectBook }) => {
  const { books, isInWishlist, toggleWishlist } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [pageFilter, setPageFilter] = useState<string>('ALL'); // 'ALL', 'SHORT' (<300), 'MEDIUM' (300-600), 'EPIC' (>600)
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'title' | 'year'>('popularity');

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Search query (English & Unicode native scripts like Tamil/Devanagari)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAlt = book.alternateTitle ? book.alternateTitle.toLowerCase().includes(q) : false;
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchPublisher = book.publisher.toLowerCase().includes(q);
          const matchGenre = book.genres.some(g => g.toLowerCase().includes(q));
          if (!matchTitle && !matchAlt && !matchAuthor && !matchPublisher && !matchGenre) return false;
        }

        // Genre filter
        if (selectedGenre !== 'ALL') {
          if (!book.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())) return false;
        }

        // Language filter (original language or translated editions)
        if (selectedLanguage !== 'ALL') {
          const matchesOriginal = book.originalLanguage.toLowerCase() === selectedLanguage.toLowerCase();
          const matchesTranslation = book.availableTranslations.some(t => t.toLowerCase() === selectedLanguage.toLowerCase());
          if (!matchesOriginal && !matchesTranslation) return false;
        }

        // Min rating
        if (minRating > 0 && book.averageRating < minRating) return false;

        // Page count filter
        if (pageFilter === 'SHORT' && book.pageCount >= 300) return false;
        if (pageFilter === 'MEDIUM' && (book.pageCount < 300 || book.pageCount > 600)) return false;
        if (pageFilter === 'EPIC' && book.pageCount <= 600) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') return b.ratingCount - a.ratingCount;
        if (sortBy === 'rating') return b.averageRating - a.averageRating;
        if (sortBy === 'year') return b.publicationYear - a.publicationYear;
        return a.title.localeCompare(b.title);
      });
  }, [books, searchQuery, selectedGenre, selectedLanguage, minRating, pageFilter, sortBy]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE));
  const displayedBooks = filteredBooks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('ALL');
    setSelectedLanguage('ALL');
    setMinRating(0);
    setPageFilter('ALL');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-violet-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Books Catalogue
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Browse verified Indian and world literature with native Unicode script support
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-4">
        
        {/* Search input + Sort Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search books by title, author, or script (e.g. பொன்னியின் செல்வன், Premchand)..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="popularity">Sort by: Popularity (Most Votes)</option>
              <option value="rating">Sort by: Highest Rated</option>
              <option value="year">Sort by: Newest Publication</option>
              <option value="title">Sort by: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          
          {/* Genre Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Genre</label>
            <select
              value={selectedGenre}
              onChange={e => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Genres</option>
              {INITIAL_GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={e => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Languages</option>
              {INITIAL_LANGUAGES.map(l => (
                <option key={l.code} value={l.name}>{l.name} ({l.script})</option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Minimum Rating</label>
            <select
              value={minRating}
              onChange={e => {
                setMinRating(parseFloat(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="0">Any Rating</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Top Rated</option>
            </select>
          </div>

          {/* Page Length */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Length</label>
            <select
              value={pageFilter}
              onChange={e => {
                setPageFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Lengths</option>
              <option value="SHORT">&lt; 300 pages (Quick Reads)</option>
              <option value="MEDIUM">300 - 600 pages</option>
              <option value="EPIC">&gt; 600 pages (Epics)</option>
            </select>
          </div>

        </div>

        {/* Active Filters count + Reset */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredBooks.length}</strong> books (Page {currentPage} of {totalPages})</span>
          {(searchQuery || selectedGenre !== 'ALL' || selectedLanguage !== 'ALL' || minRating > 0 || pageFilter !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Books Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, genre, or language filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {displayedBooks.map(book => {
              const inWishlist = isInWishlist('book', book.id);

              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/10 cursor-pointer group flex flex-col justify-between"
                >
                  {/* Book Cover Image */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-300 flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {book.averageRating.toFixed(1)}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist('book', book.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-rose-400 transition-colors shadow"
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>

                    {/* Language Overlay Badge */}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/85 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                      {book.originalLanguage}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      {book.alternateTitle && (
                        <p className="text-[11px] text-violet-300 truncate">
                          {book.alternateTitle}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {book.author}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{book.pageCount} pages</span>
                      <span>{book.publicationYear}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-all"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-violet-600 text-white shadow'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};
