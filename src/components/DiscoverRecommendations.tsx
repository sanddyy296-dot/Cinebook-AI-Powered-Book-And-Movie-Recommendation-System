import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import { RecommendationEngine } from '../services/recommendationEngine';
import {
  Sparkles,
  Sliders,
  Star,
  Heart,
  TrendingUp,
  BookOpen,
  Film,
  CheckCircle2,
  Info,
  HelpCircle,
  Zap,
  Dice5
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiscoverRecommendationsProps {
  onSelectItem: (item: Book | Movie, type: MediaType) => void;
  onOpenProfile: () => void;
}

export const DiscoverRecommendations: React.FC<DiscoverRecommendationsProps> = ({
  onSelectItem,
  onOpenProfile,
}) => {
  const { books, movies, preferences, wishlist, ratings, updatePreferences, isInWishlist, toggleWishlist } = useApp();

  const [contentType, setContentType] = useState<'ALL' | 'BOOKS' | 'MOVIES'>(preferences.preferredContentType || 'ALL');
  const [contentWeight, setContentWeight] = useState<number>(preferences.contentWeight ?? 0.65);
  const [minRating, setMinRating] = useState<number>(preferences.minRatingThreshold ?? 4.0);

  // Dynamic recommendation results
  const recommendations = RecommendationEngine.getRecommendations(
    books,
    movies,
    {
      ...preferences,
      preferredContentType: contentType,
      contentWeight,
      popularityWeight: Number((1.0 - contentWeight).toFixed(2)),
      minRatingThreshold: minRating,
    },
    wishlist,
    ratings,
    18
  );

  const handleApplyPreferences = () => {
    updatePreferences({
      preferredContentType: contentType,
      contentWeight,
      popularityWeight: Number((1.0 - contentWeight).toFixed(2)),
      minRatingThreshold: minRating,
    });
  };

  const handleSurpriseMe = () => {
    const surprise = RecommendationEngine.getSurpriseItem(books, movies);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a78bfa', '#38bdf8', '#f43f5e']
      });
    } catch {
      // Ignore
    }
    onSelectItem(surprise.item, surprise.type);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Recommendation Engine
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Transparent, explainable hybrid recommendation algorithms combining Jaccard content similarity and Bayesian weighted popularity
        </p>
      </div>

      {/* Interactive Algorithm Control Center */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-violet-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Algorithm Tuning Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSurpriseMe}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-all shadow"
            >
              <Dice5 className="w-4 h-4 text-amber-400" />
              Surprise Discovery
            </button>
            <button
              onClick={onOpenProfile}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-xs font-semibold text-violet-300 border border-violet-500/30 transition-all"
            >
              Edit Languages & Genres
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          
          {/* Content Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Media Target
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => setContentType('ALL')}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  contentType === 'ALL' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setContentType('BOOKS')}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  contentType === 'BOOKS' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Books
              </button>
              <button
                onClick={() => setContentType('MOVIES')}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  contentType === 'MOVIES' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Movies
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Filter suggestions strictly by literature, cinema, or combined unified pool.
            </p>
          </div>

          {/* Hybrid Weight Balancer */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Hybrid Weight Balance</span>
              <span className="text-cyan-400 font-bold">
                {Math.round(contentWeight * 100)}% Content / {Math.round((1 - contentWeight) * 100)}% Popularity
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={contentWeight}
              onChange={e => setContentWeight(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Personalized Taste (Niche)</span>
              <span>Global Acclaim (Blockbuster)</span>
            </div>
          </div>

          {/* Minimum Rating Threshold */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Min Rating Threshold</span>
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                {minRating.toFixed(1)}+
              </span>
            </div>
            <input
              type="range"
              min="3.0"
              max="4.8"
              step="0.1"
              value={minRating}
              onChange={e => setMinRating(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              Only recommend titles that meet your minimum quality standard.
            </p>
          </div>

        </div>

        {/* Algorithm Formula Explanation Box */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Formula:</strong> <code className="text-cyan-300 font-mono text-[11px]">Score = ({contentWeight} × Jaccard_Affinity) + ({(1 - contentWeight).toFixed(2)} × Bayesian_WR)</code>
            </span>
          </div>
          <button
            onClick={handleApplyPreferences}
            className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shrink-0"
          >
            Save as Default Profile
          </button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400">
            Computed <strong className="text-white">{recommendations.length}</strong> top matches based on your active parameters
          </span>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Matches with Current Filters</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try lowering the minimum rating threshold or selecting 'All' content types.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(rec => {
              const isBook = rec.itemType === 'book';
              const item = rec.item;
              const inWishlist = isInWishlist(rec.itemType, item.id);

              return (
                <div
                  key={`${rec.itemType}-${item.id}`}
                  className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 flex flex-col justify-between group relative"
                >
                  {/* Match Percentage Pill */}
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 shadow-lg">
                    <span className="text-xs font-black bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
                      {rec.matchScore}% MATCH
                    </span>
                  </div>

                  <div className="flex gap-4 cursor-pointer" onClick={() => onSelectItem(item, rec.itemType)}>
                    <div className="relative w-28 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-xl bg-slate-800">
                      <img
                        src={isBook ? (item as Book).coverImageUrl : (item as Movie).posterImageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold text-white shadow ${
                        isBook ? 'bg-violet-600' : 'bg-cyan-600'
                      }`}>
                        {rec.itemType.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.alternateTitle && (
                        <p className="text-xs text-violet-300 font-medium truncate">
                          {item.alternateTitle}
                        </p>
                      )}
                      
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {isBook ? (item as Book).author : `Dir: ${(item as Movie).director}`}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {item.averageRating.toFixed(1)}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-cyan-300 font-medium">
                          {item.originalLanguage}
                        </span>
                      </div>

                      {/* Component score bars */}
                      <div className="mt-3 space-y-1.5 text-[10px] text-slate-400">
                        <div>
                          <div className="flex justify-between mb-0.5">
                            <span>Content Affinity</span>
                            <span className="font-semibold text-slate-300">{rec.contentScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${rec.contentScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-0.5">
                            <span>Bayesian Popularity</span>
                            <span className="font-semibold text-slate-300">{rec.popularityScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${rec.popularityScore}%` }} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Recommendation Reasons / Explanations */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-cyan-400" />
                      Why Recommended
                    </div>
                    <div className="space-y-1">
                      {rec.reasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wishlist and Action Row */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => onSelectItem(item, rec.itemType)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      View Full Details →
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(rec.itemType, item.id);
                      }}
                      className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
