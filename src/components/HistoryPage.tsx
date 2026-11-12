import React from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import {
  History,
  Clock,
  BookOpen,
  Film,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HistoryPageProps {
  onSelectItem: (item: Book | Movie, type: MediaType) => void;
  onNavigateTab: (tab: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectItem,
  onNavigateTab,
}) => {
  const { viewedHistory, books, movies } = useApp();

  const historyItems = viewedHistory
    .map(v => {
      if (v.itemType === 'book') {
        const item = books.find(b => b.id === v.itemId);
        return item ? { ...v, data: item, type: 'book' as MediaType } : null;
      } else {
        const item = movies.find(m => m.id === v.itemId);
        return item ? { ...v, data: item, type: 'movie' as MediaType } : null;
      }
    })
    .filter(Boolean) as {
      itemType: MediaType;
      itemId: number;
      viewedAt: string;
      data: Book | Movie;
      type: MediaType;
    }[];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <History className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Recently Viewed History
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Revisit titles you've explored during your CineBook AI discovery session
        </p>
      </div>

      {historyItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Recently Viewed Titles</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Browse our books and movies catalogue or ask the AI Assistant for recommendations!
          </p>
          <button
            onClick={() => onNavigateTab('home')}
            className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Go to Home Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item, idx) => {
            const isBook = item.type === 'book';
            const data = item.data;

            return (
              <div
                key={`${item.type}-${data.id}-${idx}`}
                onClick={() => onSelectItem(data, item.type)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <img
                    src={isBook ? (data as Book).coverImageUrl : (data as Movie).posterImageUrl}
                    alt={data.title}
                    className="w-12 h-16 object-cover rounded-xl shadow shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold text-white ${
                        isBook ? 'bg-violet-600' : 'bg-cyan-600'
                      }`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-cyan-400 font-medium">
                        {data.originalLanguage}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 truncate">
                      {data.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {isBook ? (data as Book).author : `Dir: ${(data as Movie).director}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {data.averageRating.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Viewed: {new Date(item.viewedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
