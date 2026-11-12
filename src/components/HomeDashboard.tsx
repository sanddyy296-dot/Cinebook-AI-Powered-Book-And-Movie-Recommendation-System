import React from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import { RecommendationEngine } from '../services/recommendationEngine';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Star,
  Heart,
  TrendingUp,
  Award,
  Dice5,
  BookOpen,
  Film,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  Languages,
  Eye
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectItem: (item: Book | Movie, type: MediaType) => void;
  onNavigateTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectItem,
  onNavigateTab,
  onOpenProfile,
}) => {
  const { user, books, movies, preferences, wishlist, ratings, viewedHistory, isInWishlist, toggleWishlist } = useApp();

  // Compute recommendations dynamically
  const recommendations = RecommendationEngine.getRecommendations(
    books,
    movies,
    preferences,
    wishlist,
    ratings,
    6
  );

  const featuredBook = books.find(b => b.featured) || books[0];
  const featuredMovie = movies.find(m => m.featured) || movies[0];

  const trendingBooks = books.filter(b => b.trending).slice(0, 4);
  const trendingMovies = movies.filter(m => m.trending).slice(0, 4);

  // Highest rated titles across both books and movies
  const highestRated = [
    ...books.map(b => ({ item: b, type: 'book' as MediaType })),
    ...movies.map(m => ({ item: m, type: 'movie' as MediaType })),
  ]
    .sort((a, b) => b.item.averageRating - a.item.averageRating)
    .slice(0, 4);

  // Recently viewed
  const recentlyViewedItems = viewedHistory.slice(0, 4).map(v => {
    if (v.itemType === 'book') {
      const book = books.find(b => b.id === v.itemId);
      return book ? { item: book, type: 'book' as MediaType, time: v.viewedAt } : null;
    } else {
      const movie = movies.find(m => m.id === v.itemId);
      return movie ? { item: movie, type: 'movie' as MediaType, time: v.viewedAt } : null;
    }
  }).filter(Boolean) as { item: Book | Movie; type: MediaType; time: string }[];

  const handleSurpriseMe = () => {
    const surprise = RecommendationEngine.getSurpriseItem(books, movies);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#38bdf8', '#ec4899', '#f59e0b']
      });
    } catch {
      // Ignore if confetti not supported
    }
    onSelectItem(surprise.item, surprise.type);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero / Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            AI-Powered Multilingual Discovery Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover What Moves You in <span className="glow-gradient-text">Books & Cinema</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {user ? (
              <>Welcome back, <span className="font-bold text-white">{user.fullName}</span>! Personalized recommendations computed using your hybrid preferences in <span className="text-cyan-300 font-medium">{preferences.preferredLanguages.join(', ')}</span>.</>
            ) : (
              <>Unified recommendation platform for cinema and literature across Tamil, Hindi, English, Malayalam, Japanese, and more.</>
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('discover')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-violet-500/25 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              Explore Recommendations
            </button>

            <button
              onClick={handleSurpriseMe}
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all shadow"
            >
              <Dice5 className="w-4 h-4 text-amber-400" />
              Surprise Me!
            </button>

            <button
              onClick={() => onNavigateTab('assistant')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-cyan-300" />
              AI Discovery Assistant
            </button>
          </div>

          {/* Quick preference badges */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Your Active Preferences:</span>
            {preferences.preferredLanguages.map(lang => (
              <span key={lang} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                {lang}
              </span>
            ))}
            <button
              onClick={onOpenProfile}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 ml-1"
            >
              Adjust Weights
            </button>
          </div>
        </div>
      </div>

      {/* Featured Spotlight: Side by side Book & Movie */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              Featured Titles
            </h2>
            <p className="text-xs text-slate-400">Curated masterpieces from our verified multilingual catalogue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Featured Book Card */}
          <div
            onClick={() => onSelectItem(featuredBook, 'book')}
            className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 cursor-pointer group flex flex-col sm:flex-row gap-5 items-center sm:items-start"
          >
            <div className="relative w-32 sm:w-36 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <img src={featuredBook.coverImageUrl} alt={featuredBook.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-violet-600/90 text-[10px] font-bold text-white shadow">
                BOOK
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between h-full text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {featuredBook.primaryGenre}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {featuredBook.originalLanguage}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {featuredBook.title}
                </h3>
                {featuredBook.alternateTitle && (
                  <p className="text-xs text-violet-300 font-medium">{featuredBook.alternateTitle}</p>
                )}
                <p className="text-xs text-slate-300 mt-1">Author: {featuredBook.author}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {featuredBook.synopsis || featuredBook.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {featuredBook.averageRating.toFixed(1)} <span className="text-slate-500 font-normal">({featuredBook.ratingCount.toLocaleString()})</span>
                </div>
                <span className="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Book <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Featured Movie Card */}
          <div
            onClick={() => onSelectItem(featuredMovie, 'movie')}
            className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 cursor-pointer group flex flex-col sm:flex-row gap-5 items-center sm:items-start"
          >
            <div className="relative w-32 sm:w-36 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <img src={featuredMovie.posterImageUrl} alt={featuredMovie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-cyan-600/90 text-[10px] font-bold text-white shadow">
                MOVIE
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between h-full text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {featuredMovie.genres[0]}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {featuredMovie.originalLanguage}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {featuredMovie.title}
                </h3>
                {featuredMovie.alternateTitle && (
                  <p className="text-xs text-cyan-300 font-medium">{featuredMovie.alternateTitle}</p>
                )}
                <p className="text-xs text-slate-300 mt-1">Director: {featuredMovie.director}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {featuredMovie.synopsis}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {featuredMovie.averageRating.toFixed(1)} <span className="text-slate-500 font-normal">({featuredMovie.ratingCount.toLocaleString()})</span>
                </div>
                <span className="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Watch & Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Recommended For You (Hybrid Algorithm Output) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Recommended for You</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                Hybrid Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ranked with {Math.round(preferences.contentWeight * 100)}% content affinity + {Math.round(preferences.popularityWeight * 100)}% Bayesian popularity
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('discover')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Fine-Tune Engine <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map(rec => {
            const isBook = rec.itemType === 'book';
            const item = rec.item;
            const inWishlist = isInWishlist(rec.itemType, item.id);

            return (
              <div
                key={`${rec.itemType}-${item.id}`}
                className="glass-card glass-card-hover rounded-3xl p-4 border border-white/10 flex flex-col justify-between group relative"
              >
                {/* Match Score Badge */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-xs font-extrabold text-cyan-300 shadow">
                  {rec.matchScore}% Match
                </div>

                <div className="flex gap-4 cursor-pointer" onClick={() => onSelectItem(item, rec.itemType)}>
                  <div className="relative w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={isBook ? (item as Book).coverImageUrl : (item as Movie).posterImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className={`absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-bold text-white ${
                      isBook ? 'bg-violet-600' : 'bg-cyan-600'
                    }`}>
                      {rec.itemType.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    {item.alternateTitle && (
                      <p className="text-xs text-violet-300 truncate">{item.alternateTitle}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {isBook ? (item as Book).author : `Dir: ${(item as Movie).director}`}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.averageRating.toFixed(1)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-cyan-300 font-medium">
                        {item.originalLanguage}
                      </span>
                    </div>

                    {/* Primary Explanation Pill */}
                    {rec.reasons.length > 0 && (
                      <p className="text-[11px] text-slate-300 mt-2 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60 line-clamp-2">
                        ✨ {rec.reasons[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Content: {rec.contentScore}% • Pop: {rec.popularityScore}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(rec.itemType, item.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-400 text-rose-400' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Books & Movies Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trending Books */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              Trending Books
            </h3>
            <button
              onClick={() => onNavigateTab('books')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              View All Books
            </button>
          </div>

          <div className="space-y-3">
            {trendingBooks.map(book => (
              <div
                key={book.id}
                onClick={() => onSelectItem(book, 'book')}
                className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={book.coverImageUrl} alt={book.title} className="w-12 h-16 object-cover rounded-lg shadow shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300">
                        {book.primaryGenre}
                      </span>
                      <span className="text-[10px] text-cyan-400">{book.originalLanguage}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5 justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {book.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {book.ratingCount.toLocaleString()} votes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Movies */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Trending Movies
            </h3>
            <button
              onClick={() => onNavigateTab('movies')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              View All Movies
            </button>
          </div>

          <div className="space-y-3">
            {trendingMovies.map(movie => (
              <div
                key={movie.id}
                onClick={() => onSelectItem(movie, 'movie')}
                className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={movie.posterImageUrl} alt={movie.title} className="w-12 h-16 object-cover rounded-lg shadow shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 truncate">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">Dir: {movie.director}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                        {movie.genres[0]}
                      </span>
                      <span className="text-[10px] text-violet-300">{movie.originalLanguage}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5 justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {movie.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {movie.ratingCount.toLocaleString()} votes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Multilingual Discovery Spotlight */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Multilingual Cultural Spotlight</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Discover stories and films in native Indian and international scripts
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Tamil', script: 'தமிழ்', count: 'Ponniyin Selvan, Nayakan' },
            { name: 'Hindi', script: 'हिन्दी', count: 'Dangal, Godaan' },
            { name: 'Telugu', script: 'తెలుగు', count: 'RRR' },
            { name: 'Malayalam', script: 'മലയാളം', count: 'Manjummel Boys' },
            { name: 'Bengali', script: 'বাংলা', count: 'Pather Panchali, Gitanjali' },
            { name: 'Japanese', script: '日本語', count: 'Spirited Away, Murakami' },
          ].map(lang => (
            <div
              key={lang.name}
              onClick={() => onNavigateTab('books')}
              className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-all text-center group"
            >
              <div className="text-lg font-bold text-violet-300 group-hover:text-cyan-300 transition-colors">
                {lang.script}
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">{lang.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">{lang.count}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
