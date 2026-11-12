import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Movie, User, UserPreference, WishlistItem, RatingReview, ViewedItem, MediaType } from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_MOVIES,
  INITIAL_USER,
  ADMIN_USER,
  INITIAL_PREFERENCES,
  INITIAL_REVIEWS
} from '../data/initialData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  user: User | null;
  preferences: UserPreference;
  books: Book[];
  movies: Movie[];
  wishlist: WishlistItem[];
  ratings: RatingReview[];
  viewedHistory: ViewedItem[];
  theme: 'dark' | 'light';
  toasts: ToastMessage[];
  login: (asAdmin?: boolean) => void;
  logout: () => void;
  updatePreferences: (newPref: Partial<UserPreference>) => void;
  toggleWishlist: (itemType: MediaType, itemId: number) => boolean;
  isInWishlist: (itemType: MediaType, itemId: number) => boolean;
  addRating: (itemType: MediaType, itemId: number, rating: number, reviewText?: string) => void;
  getUserRating: (itemType: MediaType, itemId: number) => RatingReview | undefined;
  recordView: (itemType: MediaType, itemId: number) => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  addBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
  deleteBook: (id: number) => void;
  addMovie: (movie: Omit<Movie, 'id' | 'dateAdded'>) => void;
  deleteMovie: (id: number) => void;
  toggleFeatured: (itemType: MediaType, id: number) => void;
  toggleTrending: (itemType: MediaType, id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cinebook_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [preferences, setPreferences] = useState<UserPreference>(() => {
    const saved = localStorage.getItem('cinebook_pref');
    return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('cinebook_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinebook_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('cinebook_wishlist');
    return saved ? JSON.parse(saved) : [
      { id: 'w-1', userId: 1, itemType: 'book', itemId: 1, addedAt: '2025-02-10' },
      { id: 'w-2', userId: 1, itemType: 'movie', itemId: 101, addedAt: '2025-02-12' },
    ];
  });

  const [ratings, setRatings] = useState<RatingReview[]>(() => {
    const saved = localStorage.getItem('cinebook_ratings');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [viewedHistory, setViewedHistory] = useState<ViewedItem[]>(() => {
    const saved = localStorage.getItem('cinebook_history');
    return saved ? JSON.parse(saved) : [
      { itemType: 'book', itemId: 1, viewedAt: '2025-02-15T10:00:00Z' },
      { itemType: 'movie', itemId: 101, viewedAt: '2025-02-15T11:00:00Z' },
      { itemType: 'movie', itemId: 103, viewedAt: '2025-02-15T12:00:00Z' },
    ];
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('cinebook_theme') as 'dark' | 'light') || 'dark';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('cinebook_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cinebook_pref', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('cinebook_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('cinebook_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('cinebook_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('cinebook_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('cinebook_history', JSON.stringify(viewedHistory));
  }, [viewedHistory]);

  useEffect(() => {
    localStorage.setItem('cinebook_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (asAdmin = false) => {
    const targetUser = asAdmin ? ADMIN_USER : INITIAL_USER;
    setUser(targetUser);
    showToast(`Signed in as ${targetUser.fullName} (${targetUser.role})`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Successfully logged out', 'info');
  };

  const updatePreferences = (newPref: Partial<UserPreference>) => {
    setPreferences(prev => ({ ...prev, ...newPref }));
    showToast('Recommendation preferences updated!', 'success');
  };

  const isInWishlist = (itemType: MediaType, itemId: number) => {
    if (!user) return false;
    return wishlist.some(w => w.userId === user.id && w.itemType === itemType && w.itemId === itemId);
  };

  const toggleWishlist = (itemType: MediaType, itemId: number) => {
    if (!user) {
      showToast('Please sign in to save items to your wishlist', 'warning');
      return false;
    }

    const exists = isInWishlist(itemType, itemId);
    if (exists) {
      setWishlist(prev => prev.filter(w => !(w.userId === user.id && w.itemType === itemType && w.itemId === itemId)));
      showToast('Removed from your wishlist', 'info');
      return false;
    } else {
      const newItem: WishlistItem = {
        id: 'w-' + Date.now(),
        userId: user.id,
        itemType,
        itemId,
        addedAt: new Date().toISOString().split('T')[0],
      };
      setWishlist(prev => [newItem, ...prev]);
      showToast('Added to your wishlist!', 'success');
      return true;
    }
  };

  const getUserRating = (itemType: MediaType, itemId: number) => {
    if (!user) return undefined;
    return ratings.find(r => r.userId === user.id && r.itemType === itemType && r.itemId === itemId);
  };

  const addRating = (itemType: MediaType, itemId: number, ratingVal: number, reviewText?: string) => {
    if (!user) {
      showToast('Please sign in to submit a rating or review', 'warning');
      return;
    }

    const existingIndex = ratings.findIndex(
      r => r.userId === user.id && r.itemType === itemType && r.itemId === itemId
    );

    const newRecord: RatingReview = {
      id: existingIndex >= 0 ? ratings[existingIndex].id : 'rev-' + Date.now(),
      userId: user.id,
      userName: user.fullName,
      itemType,
      itemId,
      rating: ratingVal,
      reviewText,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (existingIndex >= 0) {
      setRatings(prev => {
        const copy = [...prev];
        copy[existingIndex] = newRecord;
        return copy;
      });
      showToast('Your rating and review were updated!', 'success');
    } else {
      setRatings(prev => [newRecord, ...prev]);
      showToast('Thank you for rating!', 'success');
    }

    // Update item's average rating dynamically
    if (itemType === 'book') {
      setBooks(prev => prev.map(b => {
        if (b.id === itemId) {
          const newCount = existingIndex >= 0 ? b.ratingCount : b.ratingCount + 1;
          const newAvg = Number(((b.averageRating * b.ratingCount + ratingVal) / newCount).toFixed(1));
          return { ...b, ratingCount: newCount, averageRating: newAvg };
        }
        return b;
      }));
    } else {
      setMovies(prev => prev.map(m => {
        if (m.id === itemId) {
          const newCount = existingIndex >= 0 ? m.ratingCount : m.ratingCount + 1;
          const newAvg = Number(((m.averageRating * m.ratingCount + ratingVal) / newCount).toFixed(1));
          return { ...m, ratingCount: newCount, averageRating: newAvg };
        }
        return m;
      }));
    }
  };

  const recordView = (itemType: MediaType, itemId: number) => {
    setViewedHistory(prev => {
      const filtered = prev.filter(v => !(v.itemType === itemType && v.itemId === itemId));
      return [{ itemType, itemId, viewedAt: new Date().toISOString() }, ...filtered.slice(0, 20)];
    });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addBook = (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    const nextId = Math.max(0, ...books.map(b => b.id)) + 1;
    const newBook: Book = {
      ...bookData,
      id: nextId,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setBooks(prev => [newBook, ...prev]);
    showToast(`Book "${newBook.title}" added successfully!`, 'success');
  };

  const deleteBook = (id: number) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    showToast('Book removed from catalogue', 'info');
  };

  const addMovie = (movieData: Omit<Movie, 'id' | 'dateAdded'>) => {
    const nextId = Math.max(100, ...movies.map(m => m.id)) + 1;
    const newMovie: Movie = {
      ...movieData,
      id: nextId,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setMovies(prev => [newMovie, ...prev]);
    showToast(`Movie "${newMovie.title}" added successfully!`, 'success');
  };

  const deleteMovie = (id: number) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    showToast('Movie removed from catalogue', 'info');
  };

  const toggleFeatured = (itemType: MediaType, id: number) => {
    if (itemType === 'book') {
      setBooks(prev => prev.map(b => b.id === id ? { ...b, featured: !b.featured } : b));
    } else {
      setMovies(prev => prev.map(m => m.id === id ? { ...m, featured: !m.featured } : m));
    }
    showToast('Featured status updated', 'info');
  };

  const toggleTrending = (itemType: MediaType, id: number) => {
    if (itemType === 'book') {
      setBooks(prev => prev.map(b => b.id === id ? { ...b, trending: !b.trending } : b));
    } else {
      setMovies(prev => prev.map(m => m.id === id ? { ...m, trending: !m.trending } : m));
    }
    showToast('Trending status updated', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        preferences,
        books,
        movies,
        wishlist,
        ratings,
        viewedHistory,
        theme,
        toasts,
        login,
        logout,
        updatePreferences,
        toggleWishlist,
        isInWishlist,
        addRating,
        getUserRating,
        recordView,
        toggleTheme,
        showToast,
        removeToast,
        addBook,
        deleteBook,
        addMovie,
        deleteMovie,
        toggleFeatured,
        toggleTrending,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
