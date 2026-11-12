import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, MediaType } from '../types';
import { RecommendationEngine } from '../services/recommendationEngine';
import {
  X,
  Star,
  Heart,
  Globe,
  BookOpen,
  Calendar,
  Layers,
  Send,
  ExternalLink,
  Languages,
  CheckCircle2
} from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onSelectBook,
}) => {
  const { books, movies, isInWishlist, toggleWishlist, addRating, getUserRating, ratings, user } = useApp();
  
  if (!book) return null;

  const inWishlist = isInWishlist('book', book.id);
  const userExistingRating = getUserRating('book', book.id);
  const [selectedStars, setSelectedStars] = useState<number>(userExistingRating ? userExistingRating.rating : 5);
  const [reviewText, setReviewText] = useState<string>(userExistingRating?.reviewText || '');
  const [hoverStars, setHoverStars] = useState<number | null>(null);

  const bookReviews = ratings.filter(r => r.itemType === 'book' && r.itemId === book.id);
  const similarBooks = RecommendationEngine.getSimilarItems(book, 'book', books, movies, 3) as Book[];

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    addRating('book', book.id, selectedStars, reviewText.trim() ? reviewText.trim() : undefined);
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
          
          {/* Left Column: Cover & Quick Actions */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-[240px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1 shadow">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {book.averageRating.toFixed(1)}
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist('book', book.id)}
              className={`w-full max-w-[240px] mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-md ${
                inWishlist
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-400 text-rose-400' : ''}`} />
              {inWishlist ? 'In Your Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Quick Metadata Box */}
            <div className="w-full max-w-[240px] mt-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Pages:</span>
                <span className="font-semibold text-white">{book.pageCount || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Published:</span>
                <span className="font-semibold text-white">{book.publicationYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ISBN-13:</span>
                <span className="font-mono text-[11px] text-cyan-300">{book.isbn13}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Publisher:</span>
                <span className="font-medium text-white truncate max-w-[120px]">{book.publisher}</span>
              </div>
              {book.externalUrl && (
                <div className="pt-2 border-t border-slate-700/50">
                  <a
                    href={book.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs font-medium"
                  >
                    Wikipedia / Info <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Synopsis, Languages, Reviews */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              {/* Genre and Language Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {book.primaryGenre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  {book.originalLanguage} {book.originalLanguageScript && `(${book.originalLanguageScript})`}
                </span>
                {book.featured && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Featured
                  </span>
                )}
              </div>

              {/* Title & Alternate Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {book.title}
              </h1>
              {book.alternateTitle && (
                <h2 className="text-base sm:text-lg text-violet-400 font-medium mt-0.5">
                  {book.alternateTitle}
                </h2>
              )}

              {/* Author and Series */}
              <p className="text-sm font-semibold text-slate-300 mt-2">
                By <span className="text-cyan-400 hover:underline">{book.author}</span>
                {book.seriesName && (
                  <span className="text-slate-400 font-normal"> (Book {book.seriesNumber || 1} of {book.seriesName})</span>
                )}
              </p>

              {/* Synopsis / Description */}
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Synopsis
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {book.synopsis || book.description}
                </p>
              </div>

              {/* Available Translated Editions */}
              {book.availableTranslations.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Available Translated Editions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {book.availableTranslations.map(lang => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 rounded-md text-xs bg-slate-700/60 text-slate-200 border border-slate-600/40"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres List */}
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  All Genres
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {book.genres.map(g => (
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

            {/* Rating Submission & User Reviews Section */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>Community Ratings & Reviews ({bookReviews.length})</span>
                <span className="text-xs font-normal text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {book.averageRating.toFixed(1)} / 5 ({book.ratingCount.toLocaleString()} total votes)
                </span>
              </h3>

              {/* Submit / Edit Rating Form */}
              <form onSubmit={handleSubmitRating} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {userExistingRating ? 'Update Your Rating' : 'Rate This Book'}
                  </span>
                  
                  {/* Interactive Star Picker */}
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
                    placeholder="Write a brief review or feedback (optional)..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-violet-500/20 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {userExistingRating ? 'Update' : 'Submit'}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                {bookReviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No reviews yet. Be the first to share your thoughts on this book!
                  </p>
                ) : (
                  bookReviews.map(r => (
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

            {/* Similar Books Section */}
            {similarBooks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Readers Also Liked
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {similarBooks.map(sim => (
                    <div
                      key={sim.id}
                      onClick={() => onSelectBook(sim)}
                      className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 cursor-pointer transition-all flex items-center gap-2 group"
                    >
                      <img src={sim.coverImageUrl} alt={sim.title} className="w-8 h-12 object-cover rounded shadow group-hover:scale-105 transition-transform" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{sim.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{sim.author}</p>
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
