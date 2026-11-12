import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Movie } from '../types';
import { RecommendationEngine } from '../services/recommendationEngine';
import {
  X,
  Star,
  Heart,
  Globe,
  Film,
  Calendar,
  Clock,
  Play,
  Send,
  ExternalLink,
  Languages,
  Users,
  Award
} from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onSelectMovie,
}) => {
  const { books, movies, isInWishlist, toggleWishlist, addRating, getUserRating, ratings } = useApp();

  if (!movie) return null;

  const inWishlist = isInWishlist('movie', movie.id);
  const userExistingRating = getUserRating('movie', movie.id);
  const [selectedStars, setSelectedStars] = useState<number>(userExistingRating ? userExistingRating.rating : 5);
  const [reviewText, setReviewText] = useState<string>(userExistingRating?.reviewText || '');
  const [hoverStars, setHoverStars] = useState<number | null>(null);

  const movieReviews = ratings.filter(r => r.itemType === 'movie' && r.itemId === movie.id);
  const similarMovies = RecommendationEngine.getSimilarItems(movie, 'movie', books, movies, 3) as Movie[];

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    addRating('movie', movie.id, selectedStars, reviewText.trim() ? reviewText.trim() : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Poster & Quick Info */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-[240px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={movie.posterImageUrl}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1 shadow">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {movie.averageRating.toFixed(1)}
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist('movie', movie.id)}
              className={`w-full max-w-[240px] mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-md ${
                inWishlist
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-400 text-rose-400' : ''}`} />
              {inWishlist ? 'In Your Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Trailer Button */}
            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-[240px] mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                Watch Official Trailer
              </a>
            )}

            {/* Quick Metadata Box */}
            <div className="w-full max-w-[240px] mt-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Runtime:</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {movie.runtimeMinutes} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Release Year:</span>
                <span className="font-semibold text-white">{movie.releaseYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Classification:</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] font-bold text-amber-300">
                  {movie.ageRating || 'U/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Country:</span>
                <span className="font-medium text-white">{movie.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Studio:</span>
                <span className="font-medium text-white truncate max-w-[120px]">{movie.productionCompany}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Cast, Languages, Reviews */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              {/* Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {movie.genres[0]}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  {movie.originalLanguage} {movie.originalLanguageScript && `(${movie.originalLanguageScript})`}
                </span>
                {movie.trending && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Trending
                  </span>
                )}
              </div>

              {/* Title & Alternate Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>
              {movie.alternateTitle && (
                <h2 className="text-base sm:text-lg text-cyan-400 font-medium mt-0.5">
                  {movie.alternateTitle}
                </h2>
              )}

              {/* Director and Cast */}
              <div className="mt-2.5 space-y-1">
                <p className="text-sm font-semibold text-slate-300">
                  Directed by <span className="text-cyan-400 font-bold">{movie.director}</span>
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Starring: {movie.principalCast.join(', ')}</span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Synopsis
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              {/* Audio and Subtitle Languages */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {movie.availableAudioLanguages.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      Audio / Dubbed In
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {movie.availableAudioLanguages.map(a => (
                        <span key={a} className="px-2 py-0.5 rounded bg-slate-700/60 text-[11px] text-slate-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {movie.subtitleLanguages.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                      <Languages className="w-3 h-3 text-violet-400" />
                      Subtitles
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {movie.subtitleLanguages.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-700/60 text-[11px] text-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map(g => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Submission & User Reviews */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>Audience Reviews ({movieReviews.length})</span>
                <span className="text-xs font-normal text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.averageRating.toFixed(1)} / 5 ({movie.ratingCount.toLocaleString()} ratings)
                </span>
              </h3>

              {/* Submit Rating Form */}
              <form onSubmit={handleSubmitRating} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {userExistingRating ? 'Update Your Rating' : 'Rate This Movie'}
                  </span>
                  
                  {/* Star Picker */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setSelectedStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(null)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (hoverStars !== null ? star <= hoverStars : star <= selectedStars)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-300 ml-1.5">
                      {hoverStars !== null ? hoverStars : selectedStars} / 5
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this movie..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {userExistingRating ? 'Update' : 'Submit'}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {movieReviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No reviews yet. Be the first to review this movie!
                  </p>
                ) : (
                  movieReviews.map(r => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-750 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200">{r.userName}</span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {r.rating}/5
                        </div>
                      </div>
                      {r.reviewText && (
                        <p className="text-slate-300 text-xs italic">"{r.reviewText}"</p>
                      )}
                      <span className="text-[10px] text-slate-500 mt-1 block">{r.createdAt}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Cinephiles Also Watched
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {similarMovies.map(sim => (
                    <div
                      key={sim.id}
                      onClick={() => onSelectMovie(sim)}
                      className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      <img src={sim.posterImageUrl} alt={sim.title} className="w-8 h-12 object-cover rounded shadow group-hover:scale-105 transition-transform" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{sim.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">Dir: {sim.director}</p>
                        <span className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-300" /> {sim.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
