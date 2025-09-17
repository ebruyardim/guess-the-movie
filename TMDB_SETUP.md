# TMDB API Setup Guide

This guide will help you set up The Movie Database (TMDB) API for the Guess The Movie game.

## Getting Your TMDB API Key

1. **Visit TMDB**: Go to [The Movie Database](https://www.themoviedb.org/) and create an account
2. **Access API Settings**: 
   - Log in to your account
   - Go to your account settings
   - Click on the "API" link in the left sidebar
3. **Request API Key**:
   - Click "Request an API Key"
   - Choose "Developer" option
   - Fill out the required information
   - Accept the terms of use
4. **Get Your Key**: Once approved, you'll receive your API key

## Environment Configuration

1. **Create Environment File**: Create a `.env.local` file in the root of your project
2. **Add Your API Key**: Add the following line to your `.env.local` file:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the actual API key you received from TMDB.

## API Features Implemented

The application uses the following TMDB API endpoints:

- **Popular Movies**: `/movie/popular` - Gets popular movies for the daily game
- **Movie Images**: `/movie/{id}/images` - Gets backdrop images and stills for movie scenes
- **Movie Search**: `/search/movie` - Allows users to search for movies to guess
- **Movie Details**: `/movie/{id}` - Gets detailed movie information

## Game Features

- **Daily Movie Scene**: Shows a random scene from a popular movie
- **Smart Image Selection**: Prioritizes backdrop images over posters for better scene recognition
- **Movie Search**: Real-time search with movie posters and release years
- **Quality Filtering**: Only shows movies with good ratings and sufficient votes
- **Responsive Design**: Works on all device sizes

## Rate Limiting

TMDB has rate limiting in place. The application is designed to:
- Cache movie data appropriately
- Use debounced search to minimize API calls
- Handle rate limit errors gracefully

## Troubleshooting

If you encounter issues:

1. **Check API Key**: Ensure your API key is correctly set in `.env.local`
2. **Restart Development Server**: After adding the environment variable, restart your Next.js development server
3. **Check Network Tab**: Use browser dev tools to see if API calls are being made successfully
4. **Verify TMDB Status**: Check [TMDB Status Page](https://status.themoviedb.org/) for any service issues

## API Documentation

For more information about the TMDB API, visit:
- [TMDB API Documentation](https://developer.themoviedb.org/docs/getting-started)
- [API Reference](https://developer.themoviedb.org/reference)
