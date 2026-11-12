import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import { GeminiDiscoveryService, AiFilterResult } from '../services/geminiAiService';
import {
  Bot,
  Send,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  Film,
  Star,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface AiDiscoveryAssistantProps {
  onSelectItem: (item: Book | Movie, type: MediaType) => void;
}

const SAMPLE_PROMPTS = [
  'Recommend a Tamil historical or action movie',
  'Find English science-fiction books under 700 pages',
  'Suggest Malayalam movies with high ratings',
  'Find books written by Frank Herbert or Kalki',
  'Recommend films directed by Christopher Nolan',
  'Find Hindi classic books or movies with 4.8 rating',
];

export const AiDiscoveryAssistant: React.FC<AiDiscoveryAssistantProps> = ({ onSelectItem }) => {
  const { books, movies } = useApp();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiFilterResult | null>(null);

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await GeminiDiscoveryService.searchByNaturalLanguage(q, books, movies);
      setResult(res);
    } catch (err) {
      console.error('Error during AI discovery:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-6 h-6 text-violet-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Discovery Assistant
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Ask for recommendations in natural language. Powered by Gemini API with verified catalogue grounding.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center"
        >
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'Recommend a Tamil mystery or action film' or 'Find sci-fi books under 500 pages'..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Ask AI
          </button>
        </form>

        {/* Quick Suggestion Prompts */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Try Sample Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  handleSearch(prompt);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Analyzing Intent & Querying Catalogue...</h3>
          <p className="text-xs text-slate-400 mt-1">Translating natural language constraints into SQL filters</p>
        </div>
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          
          {/* Explanation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/60 to-cyan-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  AI Intent Parsed
                </span>
              </div>
              <p className="text-sm font-semibold text-white">{result.explanation}</p>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-1.5">
              {result.detectedLanguage && (
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
                  Lang: {result.detectedLanguage}
                </span>
              )}
              {result.detectedGenre && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                  Genre: {result.detectedGenre}
                </span>
              )}
              {result.maxPages && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  Pages ≤ {result.maxPages}
                </span>
              )}
              {result.minRating && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  Rating ≥ {result.minRating}★
                </span>
              )}
            </div>
          </div>

          {/* Matches Grid */}
          <div className="space-y-6">
            
            {/* Matched Books */}
            {result.matchedBooks.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  Matching Books ({result.matchedBooks.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {result.matchedBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => onSelectItem(book, 'book')}
                      className="glass-card glass-card-hover rounded-2xl p-3 border border-white/10 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-2 bg-slate-800">
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-violet-600/90 text-[10px] font-bold text-white">
                          BOOK
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">{book.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                          <span className="text-cyan-400 font-semibold">{book.originalLanguage}</span>
                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            {book.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Movies */}
            {result.matchedMovies.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  Matching Movies ({result.matchedMovies.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {result.matchedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => onSelectItem(movie, 'movie')}
                      className="glass-card glass-card-hover rounded-2xl p-3 border border-white/10 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-2 bg-slate-800">
                        <img src={movie.posterImageUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-cyan-600/90 text-[10px] font-bold text-white">
                          MOVIE
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">{movie.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate">Dir: {movie.director}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                          <span className="text-violet-400 font-semibold">{movie.originalLanguage}</span>
                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            {movie.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No matches */}
            {result.matchedBooks.length === 0 && result.matchedMovies.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                No items in the catalogue matched all the criteria. Try a broader search prompt!
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
