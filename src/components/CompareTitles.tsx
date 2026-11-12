import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import {
  Scale,
  Star,
  BookOpen,
  Film,
  Clock,
  Layers,
  Globe,
  Award,
  Check,
  X
} from 'lucide-react';

export const CompareTitles: React.FC = () => {
  const { books, movies } = useApp();

  const [compareType, setCompareType] = useState<MediaType>('book');
  const [firstId, setFirstId] = useState<number>(books[0]?.id || 1);
  const [secondId, setSecondId] = useState<number>(books[1]?.id || 2);

  const firstBook = compareType === 'book' ? books.find(b => b.id === firstId) || books[0] : null;
  const secondBook = compareType === 'book' ? books.find(b => b.id === secondId) || books[1] : null;

  const firstMovie = compareType === 'movie' ? movies.find(m => m.id === firstId) || movies[0] : null;
  const secondMovie = compareType === 'movie' ? movies.find(m => m.id === secondId) || movies[1] : null;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Scale className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Compare Titles Side-by-Side
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Analyze ratings, genres, length, and community reception between any two books or movies
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-4">
        
        {/* Type toggle */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setCompareType('book');
                setFirstId(books[0]?.id || 1);
                setSecondId(books[1]?.id || 2);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                compareType === 'book' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Compare Books
            </button>
            <button
              onClick={() => {
                setCompareType('movie');
                setFirstId(movies[0]?.id || 101);
                setSecondId(movies[1]?.id || 102);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                compareType === 'movie' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Compare Movies
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title 1</label>
            <select
              value={firstId}
              onChange={e => setFirstId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {compareType === 'book'
                ? books.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.author})
                    </option>
                  ))
                : movies.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.title} (Dir: {m.director})
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title 2</label>
            <select
              value={secondId}
              onChange={e => setSecondId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {compareType === 'book'
                ? books.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.author})
                    </option>
                  ))
                : movies.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.title} (Dir: {m.director})
                    </option>
                  ))}
            </select>
          </div>
        </div>

      </div>

      {/* Comparison Grid */}
      {compareType === 'book' && firstBook && secondBook && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex gap-4">
              <img src={firstBook.coverImageUrl} alt={firstBook.title} className="w-24 aspect-[2/3] object-cover rounded-xl shadow-lg shrink-0" />
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300">
                  {firstBook.primaryGenre}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{firstBook.title}</h3>
                {firstBook.alternateTitle && (
                  <p className="text-xs text-violet-300 font-medium">{firstBook.alternateTitle}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Author: {firstBook.author}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {firstBook.averageRating.toFixed(1)} <span className="text-slate-500 font-normal">({firstBook.ratingCount.toLocaleString()} votes)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Original Language:</span>
                <span className="font-semibold text-white">{firstBook.originalLanguage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Page Count:</span>
                <span className="font-semibold text-cyan-300">{firstBook.pageCount} pages</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Published:</span>
                <span className="font-semibold text-white">{firstBook.publicationYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Publisher:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">{firstBook.publisher}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Translations:</span>
                <div className="flex flex-wrap gap-1">
                  {firstBook.availableTranslations.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex gap-4">
              <img src={secondBook.coverImageUrl} alt={secondBook.title} className="w-24 aspect-[2/3] object-cover rounded-xl shadow-lg shrink-0" />
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300">
                  {secondBook.primaryGenre}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{secondBook.title}</h3>
                {secondBook.alternateTitle && (
                  <p className="text-xs text-violet-300 font-medium">{secondBook.alternateTitle}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Author: {secondBook.author}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {secondBook.averageRating.toFixed(1)} <span className="text-slate-500 font-normal">({secondBook.ratingCount.toLocaleString()} votes)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Original Language:</span>
                <span className="font-semibold text-white">{secondBook.originalLanguage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Page Count:</span>
                <span className="font-semibold text-cyan-300">{secondBook.pageCount} pages</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Published:</span>
                <span className="font-semibold text-white">{secondBook.publicationYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Publisher:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">{secondBook.publisher}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Translations:</span>
                <div className="flex flex-wrap gap-1">
                  {secondBook.availableTranslations.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {compareType === 'movie' && firstMovie && secondMovie && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Movie 1 */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex gap-4">
              <img src={firstMovie.posterImageUrl} alt={firstMovie.title} className="w-24 aspect-[2/3] object-cover rounded-xl shadow-lg shrink-0" />
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  {firstMovie.genres[0]}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{firstMovie.title}</h3>
                {firstMovie.alternateTitle && (
                  <p className="text-xs text-cyan-300 font-medium">{firstMovie.alternateTitle}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Dir: {firstMovie.director}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {firstMovie.averageRating.toFixed(1)} <span className="text-slate-500 font-normal">({firstMovie.ratingCount.toLocaleString()} ratings)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Original Language:</span>
                <span className="font-semibold text-white">{firstMovie.originalLanguage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Runtime:</span>
                <span className="font-semibold text-cyan-300">{firstMovie.runtimeMinutes} minutes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Release Year:</span>
                <span className="font-semibold text-white">{firstMovie.releaseYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Cast:</span>
                <span className="font-medium text-white truncate max-w-[150px]">{firstMovie.principalCast.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Movie 2 */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex gap-4">
              <img src={secondMovie.posterImageUrl} alt={secondMovie.title} className="w-24 aspect-[2/3] object-cover rounded-xl shadow-lg shrink-0" />
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  {secondMovie.genres[0]}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{secondMovie.title}</h3>
                {secondMovie.alternateTitle && (
                  <p className="text-xs text-cyan-300 font-medium">{secondMovie.alternateTitle}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Dir: {secondMovie.director}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {secondMovie.averageRating.toFixed(1)} <span className="text-slate-500 font-normal">({secondMovie.ratingCount.toLocaleString()} ratings)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Original Language:</span>
                <span className="font-semibold text-white">{secondMovie.originalLanguage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Runtime:</span>
                <span className="font-semibold text-cyan-300">{secondMovie.runtimeMinutes} minutes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Release Year:</span>
                <span className="font-semibold text-white">{secondMovie.releaseYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Cast:</span>
                <span className="font-medium text-white truncate max-w-[150px]">{secondMovie.principalCast.join(', ')}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
