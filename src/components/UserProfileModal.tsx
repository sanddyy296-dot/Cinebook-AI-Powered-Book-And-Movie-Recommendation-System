import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_GENRES, INITIAL_LANGUAGES } from '../data/initialData';
import {
  X,
  User as UserIcon,
  SlidersHorizontal,
  Languages,
  Check,
  Save,
  Shield,
  Star
} from 'lucide-react';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { user, preferences, updatePreferences } = useApp();

  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(preferences.preferredLanguages);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(preferences.favoriteGenres);
  const [authorInput, setAuthorInput] = useState('');
  const [favoriteAuthors, setFavoriteAuthors] = useState<string[]>(preferences.favoriteAuthors);
  const [directorInput, setDirectorInput] = useState('');
  const [favoriteDirectors, setFavoriteDirectors] = useState<string[]>(preferences.favoriteDirectors);
  const [contentWeight, setContentWeight] = useState<number>(preferences.contentWeight ?? 0.65);
  const [minRating, setMinRating] = useState<number>(preferences.minRatingThreshold ?? 4.0);

  const toggleLanguage = (langName: string) => {
    setPreferredLanguages(prev =>
      prev.includes(langName) ? prev.filter(l => l !== langName) : [...prev, langName]
    );
  };

  const toggleGenre = (genre: string) => {
    setFavoriteGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (authorInput.trim() && !favoriteAuthors.includes(authorInput.trim())) {
      setFavoriteAuthors([...favoriteAuthors, authorInput.trim()]);
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (author: string) => {
    setFavoriteAuthors(favoriteAuthors.filter(a => a !== author));
  };

  const handleAddDirector = (e: React.FormEvent) => {
    e.preventDefault();
    if (directorInput.trim() && !favoriteDirectors.includes(directorInput.trim())) {
      setFavoriteDirectors([...favoriteDirectors, directorInput.trim()]);
      setDirectorInput('');
    }
  };

  const handleRemoveDirector = (director: string) => {
    setFavoriteDirectors(favoriteDirectors.filter(d => d !== director));
  };

  const handleSave = () => {
    updatePreferences({
      preferredLanguages: preferredLanguages.length > 0 ? preferredLanguages : ['English'],
      favoriteGenres: favoriteGenres.length > 0 ? favoriteGenres : ['Fiction'],
      favoriteAuthors,
      favoriteDirectors,
      contentWeight,
      popularityWeight: Number((1.0 - contentWeight).toFixed(2)),
      minRatingThreshold: minRating,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Identity Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-xl font-black text-white shadow-lg">
            {user?.fullName.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {user?.fullName || 'Guest User'}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {user?.role || 'STUDENT'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">{user?.email || 'guest@cinebookai.com'}</p>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="mt-6 space-y-6">
          
          {/* Multilingual Preferences */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-cyan-400" />
              Preferred Languages (Multilingual Filter)
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Select languages to prioritize in the recommendation engine:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INITIAL_LANGUAGES.map(lang => {
                const isSelected = preferredLanguages.includes(lang.name);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-violet-600/30 border-cyan-400/50 text-cyan-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{lang.name} <span className="text-[11px] font-normal text-slate-400">({lang.script})</span></span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Genres */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Favorite Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {INITIAL_GENRES.map(genre => {
                const isSelected = favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200'
                        : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Authors */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Favorite Authors
            </label>
            <form onSubmit={handleAddAuthor} className="flex gap-2 mb-2">
              <input
                type="text"
                value={authorInput}
                onChange={e => setAuthorInput(e.target.value)}
                placeholder="Add author name (e.g. Kalki Krishnamurthy, Frank Herbert)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500"
              >
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5">
              {favoriteAuthors.map(author => (
                <span
                  key={author}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700"
                >
                  {author}
                  <button
                    type="button"
                    onClick={() => handleRemoveAuthor(author)}
                    className="text-slate-400 hover:text-rose-400 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Favorite Directors */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Favorite Directors
            </label>
            <form onSubmit={handleAddDirector} className="flex gap-2 mb-2">
              <input
                type="text"
                value={directorInput}
                onChange={e => setDirectorInput(e.target.value)}
                placeholder="Add director name (e.g. Mani Ratnam, Christopher Nolan)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500"
              >
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5">
              {favoriteDirectors.map(director => (
                <span
                  key={director}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700"
                >
                  {director}
                  <button
                    type="button"
                    onClick={() => handleRemoveDirector(director)}
                    className="text-slate-400 hover:text-rose-400 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Recommendation Content Weight</span>
                <span className="text-cyan-400">{Math.round(contentWeight * 100)}%</span>
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
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Minimum Rating Threshold</span>
                <span className="text-amber-400">{minRating.toFixed(1)}★</span>
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
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-violet-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
