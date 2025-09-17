const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieImage {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
  vote_count: number;
}

export interface MovieImages {
  backdrops: MovieImage[];
  posters: MovieImage[];
  stills: MovieImage[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

class TMDBService {
  private async fetchApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file');
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('language', 'en-US');
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('TMDB API key is invalid or missing. Please check your NEXT_PUBLIC_TMDB_API_KEY in .env.local');
      } else if (response.status === 429) {
        throw new Error('TMDB API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetchApi<ApiResponse<Movie>>('/movie/popular', { page: page.toString() });
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetchApi<ApiResponse<Movie>>('/movie/top_rated', { page: page.toString() });
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<Movie> {
    return this.fetchApi<Movie>(`/movie/${movieId}`);
  }

  // Get movie images (backdrops, posters, stills)
  async getMovieImages(movieId: number): Promise<MovieImages> {
    return this.fetchApi<MovieImages>(`/movie/${movieId}/images`);
  }

  // Get a random movie for daily guessing
  async getRandomMovie(genreId?: number): Promise<{ movie: Movie; sceneImage: string; options: Movie[] }> {
    let eligibleMovies: Movie[] = [];

    if (genreId) {
      // Get movies from specific genre
      const firstPage = await this.getMoviesByGenre(genreId, 1);
      const totalPages = Math.min(firstPage.total_pages, 500); // TMDB limits to 500 pages
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const genreMovies = await this.getMoviesByGenre(genreId, randomPage);
      
      // Filter movies that have images and are well-rated
      eligibleMovies = genreMovies.results.filter(movie => 
        movie.backdrop_path && 
        movie.vote_average > 6.0 && 
        movie.vote_count > 100
      );
    } else {
      // Get popular movies to ensure quality content
      const firstPage = await this.getPopularMovies(1);
      const totalPages = Math.min(firstPage.total_pages, 500); // TMDB limits to 500 pages
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const popularMovies = await this.getPopularMovies(randomPage);
      
      // Filter movies that have images and are well-rated
      eligibleMovies = popularMovies.results.filter(movie => 
        movie.backdrop_path && 
        movie.vote_average > 6.0 && 
        movie.vote_count > 100
      );
    }

    if (eligibleMovies.length === 0) {
      throw new Error('No eligible movies found');
    }

    // Select a random movie
    const randomMovie = eligibleMovies[Math.floor(Math.random() * eligibleMovies.length)];
    
    // Get movie images to find a good scene
    const movieImages = await this.getMovieImages(randomMovie.id);
    
    // Prefer backdrops (scene images) over posters
    let sceneImage = '';
    if (movieImages.backdrops && movieImages.backdrops.length > 0) {
      // Get a random backdrop
      const randomBackdrop = movieImages.backdrops[Math.floor(Math.random() * movieImages.backdrops.length)];
      sceneImage = `https://image.tmdb.org/t/p/original${randomBackdrop.file_path}`;
    } else if (movieImages.stills && movieImages.stills.length > 0) {
      // Fallback to stills if no backdrops
      const randomStill = movieImages.stills[Math.floor(Math.random() * movieImages.stills.length)];
      sceneImage = `https://image.tmdb.org/t/p/original${randomStill.file_path}`;
    } else {
      // Final fallback to movie backdrop
      sceneImage = `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`;
    }

    // Get 3 additional movies from the same genre for options
    const options = await this.getMultipleChoiceOptions(randomMovie);

    return {
      movie: randomMovie,
      sceneImage,
      options
    };
  }

  // Get multiple choice options from the same genre
  private async getMultipleChoiceOptions(correctMovie: Movie): Promise<Movie[]> {
    if (!correctMovie.genre_ids || correctMovie.genre_ids.length === 0) {
      // Fallback to popular movies if no genre info
      const popularMovies = await this.getPopularMovies(1);
      return popularMovies.results
        .filter(movie => movie.id !== correctMovie.id)
        .slice(0, 3);
    }

    // Get movies from the same genre
    const genreId = correctMovie.genre_ids[0]; // Use the first genre
    const genreMovies = await this.getMoviesByGenre(genreId, 1);
    
    // Filter out the correct movie and get 3 options
    const options = genreMovies.results
      .filter(movie => movie.id !== correctMovie.id)
      .slice(0, 3);

    // If we don't have enough movies from the same genre, fill with popular movies
    if (options.length < 3) {
      const popularMovies = await this.getPopularMovies(1);
      const additionalOptions = popularMovies.results
        .filter(movie => 
          movie.id !== correctMovie.id && 
          !options.some(option => option.id === movie.id)
        )
        .slice(0, 3 - options.length);
      
      options.push(...additionalOptions);
    }

    return options;
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetchApi<ApiResponse<Movie>>('/search/movie', { 
      query, 
      page: page.toString(),
      include_adult: 'false'
    });
  }

  // Get movie genres
  async getGenres(): Promise<{ genres: Array<{ id: number; name: string }> }> {
    return this.fetchApi<{ genres: Array<{ id: number; name: string }> }>('/genre/movie/list');
  }

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetchApi<ApiResponse<Movie>>('/discover/movie', {
      with_genres: genreId.toString(),
      page: page.toString(),
      sort_by: 'popularity.desc'
    });
  }
}

export const tmdbService = new TMDBService();
