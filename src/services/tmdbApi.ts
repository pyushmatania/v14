// TMDB API Service for fetching real movie data
const TMDB_API_KEY = '00c8935eeb21058413bf54ae11048768';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGM4OTM1ZWViMjEwNTg0MTNiZjU0YWUxMTA0ODc2OCIsIm5iZiI6MTc1MjIwNzkwMi44ODksInN1YiI6IjY4NzA5MjFlNWFiYmI2OWUzZDlhNTgxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7udmAb8IF7qfjyIxOLB1UguBBRUFgh04DvN2TLk6WMM';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  popularity: number;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TMDBActor {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
  known_for: TMDBMovie[];
  gender?: number;
}

export interface TMDBProductionCompany {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  popularity: number;
  vote_average: number;
  release_date: string;
  runtime?: number;
  tagline?: string;
  genres?: Array<{ id: number; name: string }>;
  production_companies: TMDBProductionCompany[];
  credits?: {
    cast: TMDBActor[];
    crew: TMDBActor[];
  };
}

class TMDBService {
  private async makeRequest(endpoint: string, params: Record<string, string | number> = {}) {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('language', 'en-US');
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return response.json();
  }

  async getPopularMovies(page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/movie/popular', { page });
  }

  async getTopRatedMovies(page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/movie/top_rated', { page });
  }

  async getNowPlayingMovies(page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/movie/now_playing', { page });
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.makeRequest(`/movie/${movieId}`, { 
      append_to_response: 'credits,images' 
    });
  }

  async getPopularActors(page: number = 1): Promise<{ results: TMDBActor[] }> {
    return this.makeRequest('/person/popular', { page });
  }

  async getActorDetails(actorId: number): Promise<TMDBActor> {
    return this.makeRequest(`/person/${actorId}`, { 
      append_to_response: 'movie_credits,images' 
    });
  }

  async searchMovies(query: string, page: number = 1): Promise<{ results: TMDBMovie[] }> {
    return this.makeRequest('/search/movie', { query, page });
  }

  async searchActors(query: string, page: number = 1): Promise<{ results: TMDBActor[] }> {
    return this.makeRequest('/search/person', { query, page });
  }

  async searchCompanies(query: string, page: number = 1): Promise<{ results: TMDBProductionCompany[] }> {
    return this.makeRequest('/search/company', { query, page });
  }

  getImageUrl(path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getBackdropUrl(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const tmdbService = new TMDBService();

// REMOVED: Unused helper functions (convertTMDBMovieToCommunityItem, convertTMDBActorToCommunityItem, convertTMDBCompanyToCommunityItem) 