import { Book, Movie, MediaType, UserPreference, RecommendationResult, WishlistItem, RatingReview } from '../types';

export class RecommendationEngine {
  /**
   * Computes Jaccard Similarity between two sets of genres
   */
  private static calculateGenreSimilarity(itemGenres: string[], userFavoriteGenres: string[]): number {
    if (!itemGenres.length || !userFavoriteGenres.length) return 0;
    const itemSet = new Set(itemGenres.map(g => g.toLowerCase()));
    const userSet = new Set(userFavoriteGenres.map(g => g.toLowerCase()));
    
    let intersection = 0;
    userSet.forEach(genre => {
      if (itemSet.has(genre)) intersection++;
    });

    const union = new Set([...itemSet, ...userSet]).size;
    return union > 0 ? intersection / union : 0;
  }

  /**
   * Computes Bayesian Weighted Rating (IMDb formula)
   * WR = (v / (v + m)) * R + (m / (v + m)) * C
   */
  private static calculateBayesianRating(rating: number, count: number, globalMean = 4.5, minVotes = 1000): number {
    const v = count;
    const m = minVotes;
    const R = rating;
    const C = globalMean;
    const weightedScore = (v / (v + m)) * R + (m / (v + m)) * C;
    // Normalize to 0-100 scale (since ratings are 1-5)
    return Math.min(100, Math.max(0, (weightedScore / 5.0) * 100));
  }

  /**
   * Generates Hybrid Recommendations for a User
   */
  public static getRecommendations(
    books: Book[],
    movies: Movie[],
    preferences: UserPreference,
    wishlist: WishlistItem[] = [],
    ratings: RatingReview[] = [],
    limit = 12
  ): RecommendationResult[] {
    const savedBookIds = new Set(wishlist.filter(w => w.itemType === 'book').map(w => w.itemId));
    const savedMovieIds = new Set(wishlist.filter(w => w.itemType === 'movie').map(w => w.itemId));

    const contentWeight = preferences.contentWeight ?? 0.65;
    const popularityWeight = preferences.popularityWeight ?? 0.35;

    const results: RecommendationResult[] = [];

    // Filter books if preferred content type allows
    if (preferences.preferredContentType === 'ALL' || preferences.preferredContentType === 'BOOKS') {
      books.forEach(book => {
        const isSaved = savedBookIds.has(book.id);
        const userRating = ratings.find(r => r.itemType === 'book' && r.itemId === book.id);
        
        const reasons: string[] = [];
        let contentScore = 0;

        // 1. Genre Match
        const genreSim = this.calculateGenreSimilarity(book.genres, preferences.favoriteGenres);
        const matchingGenres = book.genres.filter(g => 
          preferences.favoriteGenres.some(fg => fg.toLowerCase() === g.toLowerCase())
        );
        if (matchingGenres.length > 0) {
          reasons.push(`Matches your genre preference: ${matchingGenres.join(', ')}`);
          contentScore += genreSim * 50;
        }

        // 2. Language Match
        const matchesOriginalLang = preferences.preferredLanguages.some(
          l => l.toLowerCase() === book.originalLanguage.toLowerCase()
        );
        const matchesTranslatedLang = book.availableTranslations.some(tl =>
          preferences.preferredLanguages.some(pl => pl.toLowerCase() === tl.toLowerCase())
        );

        if (matchesOriginalLang) {
          reasons.push(`Written in original language: ${book.originalLanguage}`);
          contentScore += 25;
        } else if (matchesTranslatedLang) {
          reasons.push(`Available in your translated language`);
          contentScore += 15;
        }

        // 3. Author Match
        const matchesAuthor = preferences.favoriteAuthors.some(
          a => a.toLowerCase() === book.author.toLowerCase()
        );
        if (matchesAuthor) {
          reasons.push(`By one of your favorite authors: ${book.author}`);
          contentScore += 25;
        }

        // 4. Rating Match
        if (book.averageRating >= preferences.minRatingThreshold) {
          contentScore += 10;
        }

        contentScore = Math.min(100, contentScore);

        // Popularity Score
        const popularityScore = this.calculateBayesianRating(book.averageRating, book.ratingCount);
        if (book.averageRating >= 4.7 && book.ratingCount > 5000) {
          reasons.push(`Top-rated community classic (${book.averageRating}★ from ${book.ratingCount.toLocaleString()} readers)`);
        }

        // Hybrid Combination
        const hybridScore = Math.round((contentScore * contentWeight) + (popularityScore * popularityWeight));

        // Cold-start fallback: if reasons is empty, add generic reason
        if (reasons.length === 0) {
          reasons.push(`High community rating in ${book.primaryGenre}`);
        }

        results.push({
          item: book,
          itemType: 'book',
          matchScore: hybridScore,
          contentScore: Math.round(contentScore),
          popularityScore: Math.round(popularityScore),
          reasons,
        });
      });
    }

    // Filter movies if preferred content type allows
    if (preferences.preferredContentType === 'ALL' || preferences.preferredContentType === 'MOVIES') {
      movies.forEach(movie => {
        const isSaved = savedMovieIds.has(movie.id);
        const userRating = ratings.find(r => r.itemType === 'movie' && r.itemId === movie.id);

        const reasons: string[] = [];
        let contentScore = 0;

        // 1. Genre Match
        const genreSim = this.calculateGenreSimilarity(movie.genres, preferences.favoriteGenres);
        const matchingGenres = movie.genres.filter(g => 
          preferences.favoriteGenres.some(fg => fg.toLowerCase() === g.toLowerCase())
        );
        if (matchingGenres.length > 0) {
          reasons.push(`Matches your genre preference: ${matchingGenres.join(', ')}`);
          contentScore += genreSim * 50;
        }

        // 2. Language Match
        const matchesOriginalLang = preferences.preferredLanguages.some(
          l => l.toLowerCase() === movie.originalLanguage.toLowerCase()
        );
        const matchesAudioLang = movie.availableAudioLanguages.some(al =>
          preferences.preferredLanguages.some(pl => pl.toLowerCase() === al.toLowerCase())
        );

        if (matchesOriginalLang) {
          reasons.push(`Original language: ${movie.originalLanguage}`);
          contentScore += 25;
        } else if (matchesAudioLang) {
          reasons.push(`Dubbed/Audio available in your language`);
          contentScore += 15;
        }

        // 3. Director Match
        const matchesDirector = preferences.favoriteDirectors.some(
          d => d.toLowerCase() === movie.director.toLowerCase()
        );
        if (matchesDirector) {
          reasons.push(`Directed by your favorite director: ${movie.director}`);
          contentScore += 25;
        }

        // 4. Rating Match
        if (movie.averageRating >= preferences.minRatingThreshold) {
          contentScore += 10;
        }

        contentScore = Math.min(100, contentScore);

        // Popularity Score
        const popularityScore = this.calculateBayesianRating(movie.averageRating, movie.ratingCount);
        if (movie.averageRating >= 4.7 && movie.ratingCount > 10000) {
          reasons.push(`Blockbuster acclaim (${movie.averageRating}★ from ${movie.ratingCount.toLocaleString()} cinephiles)`);
        }

        // Hybrid Combination
        const hybridScore = Math.round((contentScore * contentWeight) + (popularityScore * popularityWeight));

        if (reasons.length === 0) {
          reasons.push(`Acclaimed ${movie.genres[0]} masterwork`);
        }

        results.push({
          item: movie,
          itemType: 'movie',
          matchScore: hybridScore,
          contentScore: Math.round(contentScore),
          popularityScore: Math.round(popularityScore),
          reasons,
        });
      });
    }

    // Sort by descending matchScore with deterministic tie-breaking (by averageRating then id)
    return results
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        if (b.item.averageRating !== a.item.averageRating) return b.item.averageRating - a.item.averageRating;
        return a.item.id - b.item.id;
      })
      .slice(0, limit);
  }

  /**
   * Finds titles similar to a target book or movie
   */
  public static getSimilarItems(
    targetItem: Book | Movie,
    type: MediaType,
    allBooks: Book[],
    allMovies: Movie[],
    limit = 4
  ): (Book | Movie)[] {
    const targetGenres = new Set(targetItem.genres.map(g => g.toLowerCase()));
    
    if (type === 'book') {
      const book = targetItem as Book;
      return allBooks
        .filter(b => b.id !== book.id)
        .map(b => {
          let score = 0;
          if (b.author.toLowerCase() === book.author.toLowerCase()) score += 50;
          if (b.originalLanguage.toLowerCase() === book.originalLanguage.toLowerCase()) score += 20;
          const commonGenres = b.genres.filter(g => targetGenres.has(g.toLowerCase())).length;
          score += commonGenres * 15;
          return { item: b, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(res => res.item);
    } else {
      const movie = targetItem as Movie;
      return allMovies
        .filter(m => m.id !== movie.id)
        .map(m => {
          let score = 0;
          if (m.director.toLowerCase() === movie.director.toLowerCase()) score += 50;
          if (m.originalLanguage.toLowerCase() === movie.originalLanguage.toLowerCase()) score += 20;
          const commonGenres = m.genres.filter(g => targetGenres.has(g.toLowerCase())).length;
          score += commonGenres * 15;
          return { item: m, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(res => res.item);
    }
  }

  /**
   * Pick a serendipitous surprise item
   */
  public static getSurpriseItem(books: Book[], movies: Movie[]): { item: Book | Movie; type: MediaType } {
    const isBook = Math.random() > 0.5;
    if (isBook && books.length > 0) {
      const randomBook = books[Math.floor(Math.random() * books.length)];
      return { item: randomBook, type: 'book' };
    } else {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      return { item: randomMovie, type: 'movie' };
    }
  }
}
