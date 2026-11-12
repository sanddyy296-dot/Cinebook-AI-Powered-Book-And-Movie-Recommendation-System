import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import {
  Heart,
  Download,
  Trash2,
  Star,
  BookOpen,
  Film,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';

interface WishlistPageProps {
  onSelectItem: (item: Book | Movie, type: MediaType) => void;
  onNavigateTab: (tab: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectItem,
  onNavigateTab,
}) => {
  const { wishlist, books, movies, toggleWishlist, user, showToast } = useApp();

  const [filterType, setFilterType] = useState<MediaType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');

  // Map wishlist items to full book / movie objects
  const savedItems = wishlist
    .map(w => {
      if (w.itemType === 'book') {
        const item = books.find(b => b.id === w.itemId);
        return item ? { ...w, data: item, type: 'book' as MediaType } : null;
      } else {
        const item = movies.find(m => m.id === w.itemId);
        return item ? { ...w, data: item, type: 'movie' as MediaType } : null;
      }
    })
    .filter(Boolean) as {
      id: string;
      userId: number;
      itemType: MediaType;
      itemId: number;
      addedAt: string;
      data: Book | Movie;
      type: MediaType;
    }[];

  const filteredItems = savedItems
    .filter(item => {
      if (filterType !== 'ALL' && item.type !== filterType) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.data.averageRating - a.data.averageRating;
      if (sortBy === 'title') return a.data.title.localeCompare(b.data.title);
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

  // Export Wishlist to CSV
  const handleExportCsv = () => {
    if (savedItems.length === 0) {
      showToast('Wishlist is empty. Nothing to export.', 'warning');
      return;
    }

    const headers = ['Type', 'Title', 'Alternate Title', 'Creator (Author/Director)', 'Language', 'Rating', 'Added Date'];
    const rows = savedItems.map(item => {
      const isBook = item.type === 'book';
      const creator = isBook ? (item.data as Book).author : (item.data as Movie).director;
      return [
        `"${item.type.toUpperCase()}"`,
        `"${item.data.title.replace(/"/g, '""')}"`,
        `"${(item.data.alternateTitle || '').replace(/"/g, '""')}"`,
        `"${creator.replace(/"/g, '""')}"`,
        `"${item.data.originalLanguage}"`,
        item.data.averageRating,
        `"${item.addedAt}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cinebook_ai_wishlist_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Successfully exported ${savedItems.length} items to CSV!`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Saved Wishlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {savedItems.length} titles saved in your personal library
          </p>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={handleExportCsv}
          disabled={savedItems.length === 0}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 shadow transition-all"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Export Wishlist to CSV
        </button>
      </div>

      {/* Filter and Sort Row */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterType === 'ALL' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Items ({savedItems.length})
          </button>
          <button
            onClick={() => setFilterType('book')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
              filterType === 'book' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Books ({savedItems.filter(i => i.type === 'book').length})
          </button>
          <button
            onClick={() => setFilterType('movie')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
              filterType === 'movie' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Movies ({savedItems.filter(i => i.type === 'movie').length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
          >
            <option value="date">Sort by: Date Saved (Newest)</option>
            <option value="rating">Sort by: Rating (Highest)</option>
            <option value="title">Sort by: Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Explore our curated books and movies catalogue and click the heart icon to save titles for later.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => onNavigateTab('books')}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
            >
              Explore Books
            </button>
            <button
              onClick={() => onNavigateTab('movies')}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
            >
              Explore Movies
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredItems.map(item => {
            const isBook = item.type === 'book';
            const data = item.data;

            return (
              <div
                key={`${item.type}-${data.id}`}
                onClick={() => onSelectItem(data, item.type)}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/10 cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
                  <img
                    src={isBook ? (data as Book).coverImageUrl : (data as Movie).posterImageUrl}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow ${
                    isBook ? 'bg-violet-600' : 'bg-cyan-600'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.type, data.id);
                    }}
                    title="Remove from wishlist"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-rose-400 hover:bg-rose-500/20 transition-colors shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/85 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                    {data.originalLanguage}
                  </span>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {data.title}
                    </h3>
                    {data.alternateTitle && (
                      <p className="text-[11px] text-violet-300 truncate">
                        {data.alternateTitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {isBook ? (data as Book).author : `Dir: ${(data as Movie).director}`}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {data.averageRating.toFixed(1)}
                    </span>
                    <span className="text-slate-500">Saved: {item.addedAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
