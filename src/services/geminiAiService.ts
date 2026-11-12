import { GoogleGenAI } from '@google/genai';
import { Book, Movie, MediaType } from '../types';

export interface AiFilterResult {
  detectedType?: MediaType | 'both';
  detectedLanguage?: string;
  detectedGenre?: string;
  maxPages?: number;
  minRating?: number;
  authorOrDirector?: string;
  explanation: string;
  matchedBooks: Book[];
  matchedMovies: Movie[];
}

export class GeminiDiscoveryService {
  private static getApiKey(): string | null {
    // Check various sources safely
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY;
    }
    // Check Vite env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
    return null;
  }

  /**
   * Natural Language Query Parser using Gemini with deterministic fallback
   */
  public static async searchByNaturalLanguage(
    query: string,
    allBooks: Book[],
    allMovies: Movie[]
  ): Promise<AiFilterResult> {
    const apiKey = this.getApiKey();
    const cleanQuery = query.toLowerCase().trim();

    // Fast intelligent heuristic parser (always works even without API key)
    const heuristic = this.heuristicParse(query, allBooks, allMovies);

    if (!apiKey) {
      return heuristic;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the CineBook AI recommendation assistant.
Analyze this user query for book and movie discovery: "${query}".
Return a JSON object with:
- "mediaType": "book" | "movie" | "both"
- "language": string or null (e.g. "Tamil", "Hindi", "English", "Malayalam", etc.)
- "genre": string or null (e.g. "Mystery", "Sci-Fi", "Drama", "Historical Fiction", etc.)
- "maxPages": number or null
- "minRating": number or null
- "creator": string or null (author or director name)
- "summary": a 1-sentence friendly explanation of what you are searching for.

Respond ONLY with valid JSON, no markdown backticks, no markdown codeblock.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text?.trim() || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const matchedBooks = (parsed.mediaType === 'movie') 
        ? [] 
        : allBooks.filter(b => {
            if (parsed.language && b.originalLanguage.toLowerCase() !== parsed.language.toLowerCase() && !b.availableTranslations.some(t => t.toLowerCase() === parsed.language.toLowerCase())) return false;
            if (parsed.genre && !b.genres.some(g => g.toLowerCase().includes(parsed.genre.toLowerCase()))) return false;
            if (parsed.maxPages && b.pageCount > parsed.maxPages) return false;
            if (parsed.minRating && b.averageRating < parsed.minRating) return false;
            if (parsed.creator && !b.author.toLowerCase().includes(parsed.creator.toLowerCase())) return false;
            return true;
          });

      const matchedMovies = (parsed.mediaType === 'book') 
        ? [] 
        : allMovies.filter(m => {
            if (parsed.language && m.originalLanguage.toLowerCase() !== parsed.language.toLowerCase() && !m.availableAudioLanguages.some(a => a.toLowerCase() === parsed.language.toLowerCase())) return false;
            if (parsed.genre && !m.genres.some(g => g.toLowerCase().includes(parsed.genre.toLowerCase()))) return false;
            if (parsed.minRating && m.averageRating < parsed.minRating) return false;
            if (parsed.creator && !m.director.toLowerCase().includes(parsed.creator.toLowerCase())) return false;
            return true;
          });

      return {
        detectedType: parsed.mediaType,
        detectedLanguage: parsed.language || undefined,
        detectedGenre: parsed.genre || undefined,
        maxPages: parsed.maxPages || undefined,
        minRating: parsed.minRating || undefined,
        authorOrDirector: parsed.creator || undefined,
        explanation: parsed.summary || `Found matches matching your request: "${query}"`,
        matchedBooks,
        matchedMovies,
      };
    } catch (err) {
      console.warn('Gemini API call failed or rate-limited; utilizing local intelligent parser:', err);
      return heuristic;
    }
  }

  /**
   * Deterministic NLP heuristic filter
   */
  private static heuristicParse(query: string, allBooks: Book[], allMovies: Movie[]): AiFilterResult {
    const q = query.toLowerCase();

    // Type detection
    let detectedType: MediaType | 'both' = 'both';
    if (q.includes('book') || q.includes('novel') || q.includes('read') || q.includes('page')) {
      detectedType = 'book';
    } else if (q.includes('movie') || q.includes('film') || q.includes('watch') || q.includes('cinema') || q.includes('director')) {
      detectedType = 'movie';
    }

    // Language detection
    const languages = ['tamil', 'hindi', 'telugu', 'malayalam', 'kannada', 'bengali', 'japanese', 'korean', 'english', 'spanish', 'french'];
    const detectedLang = languages.find(l => q.includes(l));

    // Genre detection
    const genres = ['sci-fi', 'science fiction', 'mystery', 'thriller', 'drama', 'action', 'fantasy', 'classics', 'philosophy', 'biography', 'animation', 'historical'];
    const detectedGenre = genres.find(g => q.includes(g));

    // Page count detection (e.g. "under 300 pages", "< 400 pages")
    let maxPages: number | undefined;
    const pageMatch = q.match(/(?:under|less than|<)\s*(\d+)\s*(?:page|pages)?/);
    if (pageMatch) {
      maxPages = parseInt(pageMatch[1], 10);
    }

    // High rating detection
    let minRating: number | undefined;
    if (q.includes('high rating') || q.includes('highest rated') || q.includes('top rated') || q.includes('best')) {
      minRating = 4.5;
    }

    // Filter books
    const matchedBooks = detectedType === 'movie' ? [] : allBooks.filter(b => {
      if (detectedLang) {
        const langMatch = b.originalLanguage.toLowerCase() === detectedLang ||
          b.availableTranslations.some(t => t.toLowerCase() === detectedLang);
        if (!langMatch) return false;
      }
      if (detectedGenre) {
        const cleanG = detectedGenre === 'science fiction' ? 'sci-fi' : detectedGenre;
        if (!b.genres.some(g => g.toLowerCase().includes(cleanG))) return false;
      }
      if (maxPages && b.pageCount > maxPages) return false;
      if (minRating && b.averageRating < minRating) return false;
      return true;
    });

    // Filter movies
    const matchedMovies = detectedType === 'book' ? [] : allMovies.filter(m => {
      if (detectedLang) {
        const langMatch = m.originalLanguage.toLowerCase() === detectedLang ||
          m.availableAudioLanguages.some(a => a.toLowerCase() === detectedLang);
        if (!langMatch) return false;
      }
      if (detectedGenre) {
        const cleanG = detectedGenre === 'science fiction' ? 'sci-fi' : detectedGenre;
        if (!m.genres.some(g => g.toLowerCase().includes(cleanG))) return false;
      }
      if (minRating && m.averageRating < minRating) return false;
      return true;
    });

    const summaryParts: string[] = [];
    if (detectedLang) summaryParts.push(detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1));
    if (detectedGenre) summaryParts.push(detectedGenre.toUpperCase());
    if (maxPages) summaryParts.push(`under ${maxPages} pages`);
    if (minRating) summaryParts.push(`with rating ≥ ${minRating}★`);

    const explanation = summaryParts.length > 0
      ? `Filters applied: ${summaryParts.join(' • ')}`
      : `Catalogue search matching keywords in "${query}"`;

    return {
      detectedType,
      detectedLanguage: detectedLang ? detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1) : undefined,
      detectedGenre,
      maxPages,
      minRating,
      explanation,
      matchedBooks,
      matchedMovies,
    };
  }
}
