// 🎵 Spotify Artist Images Data
export interface SpotifyArtistImageData {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  genres: string[];
  popularity: number;
  verified: boolean;
}

export interface SpotifyImagesData {
  lastUpdated: string;
  totalArtists: number;
  artists: Record<string, SpotifyArtistImageData>;
}

// Spotify artist images data
export const spotifyArtistImages: SpotifyImagesData = {
  lastUpdated: "2024-01-15T10:00:00Z",
  totalArtists: 0,
  artists: {}
};

// Helper function to get artist data by name
export const getSpotifyArtistData = (artistName: string): SpotifyArtistImageData | null => {
  return spotifyArtistImages.artists[artistName] || null;
};

// REMOVED: Unused helper functions (hasSpotifyData, getAllSpotifyArtistNames, getSpotifyArtistsByGenre, getTopSpotifyArtists) 