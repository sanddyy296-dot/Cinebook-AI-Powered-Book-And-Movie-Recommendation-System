export type MediaType = 'book' | 'movie';

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  alternateTitle?: string; // Original script title e.g. "பொன்னியின் செல்வன்"
  author: string;
  additionalAuthors?: string[];
  description: string;
  synopsis: string;
  primaryGenre: string;
  genres: string[];
  originalLanguage: string;
  originalLanguageScript?: string;
  availableTranslations: string[];
  publicationDate: string;
  publicationYear: number;
  publisher: string;
  isbn10: string;
  isbn13: string;
  pageCount: number;
  seriesName?: string;
  seriesNumber?: number;
  coverImageUrl: string;
  averageRating: number;
  ratingCount: number;
  featured?: boolean;
  trending?: boolean;
  externalUrl?: string;
  dateAdded: string;
}

export interface Movie {
  id: number;
  title: string;
  alternateTitle?: string; // Original script title e.g. "நாயகன்"
  synopsis: string;
  director: string;
  principalCast: string[];
  genres: string[];
  originalLanguage: string;
  originalLanguageScript?: string;
  availableAudioLanguages: string[];
  subtitleLanguages: string[];
  releaseDate: string;
  releaseYear: number;
  runtimeMinutes: number;
  country: string;
  productionCompany: string;
  ageRating: string;
  posterImageUrl: string;
  trailerUrl?: string;
  averageRating: number;
  ratingCount: number;
  featured?: boolean;
  trending?: boolean;
  dateAdded: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
}

export interface UserPreference {
  userId: number;
  preferredLanguages: string[];
  favoriteGenres: string[];
  favoriteAuthors: string[];
  favoriteDirectors: string[];
  preferredContentType: 'ALL' | 'BOOKS' | 'MOVIES';
  minRatingThreshold: number;
  contentWeight: number; // For hybrid recommendation (0.0 to 1.0)
  popularityWeight: number; // 1.0 - contentWeight
}

export interface RatingReview {
  id: string;
  userId: number;
  userName: string;
  itemType: MediaType;
  itemId: number;
  rating: number; // 1 - 5
  reviewText?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: number;
  itemType: MediaType;
  itemId: number;
  addedAt: string;
  notes?: string;
}

export interface ViewedItem {
  itemType: MediaType;
  itemId: number;
  viewedAt: string;
}

export interface RecommendationResult {
  item: Book | Movie;
  itemType: MediaType;
  matchScore: number; // 0 - 100%
  contentScore: number;
  popularityScore: number;
  reasons: string[];
}

export interface JavaSourceFile {
  path: string;
  name: string;
  category: 'Entity' | 'Repository' | 'Service' | 'Controller' | 'Security' | 'Config' | 'Algorithm' | 'Database' | 'Template' | 'Test';
  content: string;
  description: string;
}
