import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Movie, MediaType } from '../types';
import { INITIAL_GENRES, INITIAL_LANGUAGES } from '../data/initialData';
import {
  Shield,
  Plus,
  Trash2,
  Star,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Film,
  CheckCircle2,
  Layers,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    books,
    movies,
    ratings,
    wishlist,
    addBook,
    deleteBook,
    addMovie,
    deleteMovie,
    toggleFeatured,
    toggleTrending,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'movies'>('overview');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);

  // New Book Form State
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAltTitle, setNewBookAltTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('Historical Fiction');
  const [newBookLanguage, setNewBookLanguage] = useState('Tamil');
  const [newBookYear, setNewBookYear] = useState('2024');
  const [newBookPages, setNewBookPages] = useState('320');
  const [newBookCover, setNewBookCover] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600');
  const [newBookSynopsis, setNewBookSynopsis] = useState('');

  // New Movie Form State
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieAltTitle, setNewMovieAltTitle] = useState('');
  const [newMovieDirector, setNewMovieDirector] = useState('');
  const [newMovieCast, setNewMovieCast] = useState('');
  const [newMovieGenre, setNewMovieGenre] = useState('Drama');
  const [newMovieLanguage, setNewMovieLanguage] = useState('Tamil');
  const [newMovieYear, setNewMovieYear] = useState('2024');
  const [newMovieRuntime, setNewMovieRuntime] = useState('145');
  const [newMoviePoster, setNewMoviePoster] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600');
  const [newMovieSynopsis, setNewMovieSynopsis] = useState('');

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-rose-500/30 max-w-lg mx-auto mt-12">
        <Shield className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400 mt-2">
          This portal is protected by role-based authorization. Please sign in as an Administrator using the profile menu or demo login.
        </p>
      </div>
    );
  }

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      showToast('Title and Author are required', 'warning');
      return;
    }

    addBook({
      title: newBookTitle.trim(),
      alternateTitle: newBookAltTitle.trim() || undefined,
      author: newBookAuthor.trim(),
      description: newBookSynopsis.trim() || 'A masterpiece of literature.',
      synopsis: newBookSynopsis.trim() || 'A masterpiece of literature.',
      primaryGenre: newBookGenre,
      genres: [newBookGenre, 'Fiction'],
      originalLanguage: newBookLanguage,
      availableTranslations: ['English'],
      publicationDate: `${newBookYear}-01-01`,
      publicationYear: parseInt(newBookYear, 10) || 2024,
      publisher: 'Independent Publisher',
      isbn10: '0000000000',
      isbn13: '978-0000000000',
      pageCount: parseInt(newBookPages, 10) || 300,
      coverImageUrl: newBookCover.trim(),
      averageRating: 5.0,
      ratingCount: 1,
      featured: false,
      trending: true,
    });

    setShowAddBookModal(false);
    setNewBookTitle('');
    setNewBookAltTitle('');
    setNewBookAuthor('');
    setNewBookSynopsis('');
  };

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieTitle.trim() || !newMovieDirector.trim()) {
      showToast('Title and Director are required', 'warning');
      return;
    }

    const castArray = newMovieCast.split(',').map(c => c.trim()).filter(Boolean);

    addMovie({
      title: newMovieTitle.trim(),
      alternateTitle: newMovieAltTitle.trim() || undefined,
      synopsis: newMovieSynopsis.trim() || 'An acclaimed cinematic experience.',
      director: newMovieDirector.trim(),
      principalCast: castArray.length > 0 ? castArray : ['Lead Actor'],
      genres: [newMovieGenre, 'Drama'],
      originalLanguage: newMovieLanguage,
      availableAudioLanguages: [newMovieLanguage, 'English'],
      subtitleLanguages: ['English'],
      releaseDate: `${newMovieYear}-01-01`,
      releaseYear: parseInt(newMovieYear, 10) || 2024,
      runtimeMinutes: parseInt(newMovieRuntime, 10) || 135,
      country: 'India',
      productionCompany: 'Premiere Studios',
      ageRating: 'U/A',
      posterImageUrl: newMoviePoster.trim(),
      averageRating: 5.0,
      ratingCount: 1,
      featured: false,
      trending: true,
    });

    setShowAddMovieModal(false);
    setNewMovieTitle('');
    setNewMovieAltTitle('');
    setNewMovieDirector('');
    setNewMovieSynopsis('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Administrator Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Catalogue Management, Analytics, & Role-Based System Operations
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddBookModal(true)}
            className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Book
          </button>
          <button
            onClick={() => setShowAddMovieModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Movie
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Books</span>
            <BookOpen className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white">{books.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Movies</span>
            <Film className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{movies.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Reviews Submitted</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{ratings.length}</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Wishlist Records</span>
            <Award className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{wishlist.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 -mb-px ${
            activeTab === 'overview' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Overview & Trending
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 -mb-px ${
            activeTab === 'books' ? 'border-violet-400 text-violet-300' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Manage Books ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('movies')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 -mb-px ${
            activeTab === 'movies' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Manage Movies ({movies.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/10">
            <h3 className="text-sm font-bold text-white mb-3">System Health & Catalog Integrity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Database Encoding</span>
                <span className="text-emerald-400 font-mono font-bold">utf8mb4 (Unicode OK)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Active Recommendation Engine</span>
                <span className="text-cyan-400 font-bold">Hybrid (Content + Bayesian)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Security Authentication</span>
                <span className="text-violet-400 font-bold">Spring Security 6 (BCrypt)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Manage Books */}
      {activeTab === 'books' && (
        <div className="glass-card rounded-3xl p-6 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3">Title & Script</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Language</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3 text-center">Featured</th>
                <th className="pb-3 text-center">Trending</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {books.map(b => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-semibold text-white">
                    {b.title}
                    {b.alternateTitle && <span className="text-[11px] text-violet-300 block font-normal">{b.alternateTitle}</span>}
                  </td>
                  <td className="py-3 text-slate-300">{b.author}</td>
                  <td className="py-3 text-cyan-300 font-medium">{b.originalLanguage}</td>
                  <td className="py-3 text-amber-300 font-bold">{b.averageRating.toFixed(1)}★</td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => toggleFeatured('book', b.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.featured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-500'}`}
                    >
                      {b.featured ? 'YES' : 'NO'}
                    </button>
                  </td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => toggleTrending('book', b.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.trending ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-500'}`}
                    >
                      {b.trending ? 'YES' : 'NO'}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteBook(b.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Manage Movies */}
      {activeTab === 'movies' && (
        <div className="glass-card rounded-3xl p-6 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3">Title & Script</th>
                <th className="pb-3">Director</th>
                <th className="pb-3">Language</th>
                <th className="pb-3">Runtime</th>
                <th className="pb-3 text-center">Featured</th>
                <th className="pb-3 text-center">Trending</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {movies.map(m => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-semibold text-white">
                    {m.title}
                    {m.alternateTitle && <span className="text-[11px] text-cyan-300 block font-normal">{m.alternateTitle}</span>}
                  </td>
                  <td className="py-3 text-slate-300">{m.director}</td>
                  <td className="py-3 text-violet-300 font-medium">{m.originalLanguage}</td>
                  <td className="py-3 text-slate-300">{m.runtimeMinutes} min</td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => toggleFeatured('movie', m.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.featured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-500'}`}
                    >
                      {m.featured ? 'YES' : 'NO'}
                    </button>
                  </td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => toggleTrending('movie', m.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.trending ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-500'}`}
                    >
                      {m.trending ? 'YES' : 'NO'}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteMovie(m.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete movie"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add New Book to Catalogue</h3>
            <form onSubmit={handleCreateBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newBookTitle}
                  onChange={e => setNewBookTitle(e.target.value)}
                  placeholder="e.g. Sivagamiyin Sabatham"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Alternate Title (Original Script)</label>
                <input
                  type="text"
                  value={newBookAltTitle}
                  onChange={e => setNewBookAltTitle(e.target.value)}
                  placeholder="e.g. சிவகாமியின் சபதம்"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={newBookAuthor}
                    onChange={e => setNewBookAuthor(e.target.value)}
                    placeholder="e.g. Kalki"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Language</label>
                  <select
                    value={newBookLanguage}
                    onChange={e => setNewBookLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {INITIAL_LANGUAGES.map(l => (
                      <option key={l.code} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Genre</label>
                  <select
                    value={newBookGenre}
                    onChange={e => setNewBookGenre(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {INITIAL_GENRES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Year</label>
                  <input
                    type="number"
                    value={newBookYear}
                    onChange={e => setNewBookYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Pages</label>
                  <input
                    type="number"
                    value={newBookPages}
                    onChange={e => setNewBookPages(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={newBookSynopsis}
                  onChange={e => setNewBookSynopsis(e.target.value)}
                  placeholder="Summary of the book..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add New Movie to Catalogue</h3>
            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newMovieTitle}
                  onChange={e => setNewMovieTitle(e.target.value)}
                  placeholder="e.g. Vikram"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Alternate Title (Original Script)</label>
                <input
                  type="text"
                  value={newMovieAltTitle}
                  onChange={e => setNewMovieAltTitle(e.target.value)}
                  placeholder="e.g. விக்ரம்"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Director *</label>
                  <input
                    type="text"
                    required
                    value={newMovieDirector}
                    onChange={e => setNewMovieDirector(e.target.value)}
                    placeholder="e.g. Lokesh Kanagaraj"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Language</label>
                  <select
                    value={newMovieLanguage}
                    onChange={e => setNewMovieLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {INITIAL_LANGUAGES.map(l => (
                      <option key={l.code} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Principal Cast (comma separated)</label>
                <input
                  type="text"
                  value={newMovieCast}
                  onChange={e => setNewMovieCast(e.target.value)}
                  placeholder="Kamal Haasan, Vijay Sethupathi, Fahadh Faasil"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Genre</label>
                  <select
                    value={newMovieGenre}
                    onChange={e => setNewMovieGenre(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {INITIAL_GENRES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Year</label>
                  <input
                    type="number"
                    value={newMovieYear}
                    onChange={e => setNewMovieYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Runtime (min)</label>
                  <input
                    type="number"
                    value={newMovieRuntime}
                    onChange={e => setNewMovieRuntime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={newMovieSynopsis}
                  onChange={e => setNewMovieSynopsis(e.target.value)}
                  placeholder="Plot summary..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
