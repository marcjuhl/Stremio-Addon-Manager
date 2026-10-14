import { StremioAddonDescriptor } from '../types/stremio';

/**
 * Realistic collection of Stremio add-ons used for Demo / Sandbox Mode.
 * Allows users to test the drag-and-drop reordering, filtering, JSON export/import,
 * and UI responsiveness without needing to connect an active Stremio account.
 */
export const DEMO_ADDONS: StremioAddonDescriptor[] = [
  {
    transportUrl: "https://v3-cinemeta.strem.io/manifest.json",
    transportName: "http",
    flags: {
      official: true,
      protected: true,
    },
    manifest: {
      id: "com.linvo.cinemeta",
      version: "3.0.12",
      name: "Cinemeta",
      description: "Official IMDb, TheMovieDB, TVMaze and Trakt metadata provider for movies and series.",
      logo: "https://v3-cinemeta.strem.io/favicon.ico",
      types: ["movie", "series"],
      resources: ["catalog", "meta"],
      catalogs: [
        { type: "movie", id: "top", name: "Top Movies" },
        { type: "series", id: "top", name: "Top Series" },
      ],
    },
  },
  {
    transportUrl: "https://opensubtitles-v3.strem.io/manifest.json",
    transportName: "http",
    flags: {
      official: true,
      protected: false,
    },
    manifest: {
      id: "org.stremio.opensubtitles-v3",
      version: "1.0.0",
      name: "OpenSubtitles v3",
      description: "Official subtitles from OpenSubtitles.org for movies and TV shows in dozens of languages.",
      logo: "https://opensubtitles-v3.strem.io/favicon.ico",
      types: ["movie", "series"],
      resources: ["subtitles"],
      catalogs: [],
    },
  },
  {
    transportUrl: "https://torrentio.strem.fun/manifest.json",
    transportName: "http",
    flags: {
      official: false,
      protected: false,
    },
    manifest: {
      id: "com.stremio.torrentio.addon",
      version: "1.0.13",
      name: "Torrentio RD",
      description: "Streams torrents from multiple scrapers with RealDebrid / Premiumize debrid caching support.",
      logo: "https://torrentio.strem.fun/images/icon.png",
      types: ["movie", "series"],
      resources: ["stream"],
      catalogs: [],
      behaviorHints: {
        configurable: true,
        p2p: true,
      },
    },
  },
  {
    transportUrl: "https://watchhub.strem.io/manifest.json",
    transportName: "http",
    flags: {
      official: true,
      protected: false,
    },
    manifest: {
      id: "com.stremio.watchhub",
      version: "1.0.2",
      name: "WatchHub",
      description: "Find where to stream officially across Netflix, Prime Video, Disney+, Apple TV+, and HBO Max.",
      logo: "https://watchhub.strem.io/favicon.ico",
      types: ["movie", "series"],
      resources: ["stream"],
      catalogs: [],
    },
  },
  {
    transportUrl: "https://cyberflix.kodi.al/manifest.json",
    transportName: "http",
    flags: {
      official: false,
      protected: false,
    },
    manifest: {
      id: "com.cyberflix.catalog",
      version: "1.4.2",
      name: "Cyberflix Catalog",
      description: "Curated catalog playlists from Netflix, Disney+, Apple TV, Hulu, and HBO Max directly inside Stremio.",
      logo: "https://cyberflix.kodi.al/logo.png",
      types: ["movie", "series"],
      resources: ["catalog"],
      catalogs: [
        { type: "movie", id: "netflix.movies", name: "Netflix Movies" },
        { type: "series", id: "netflix.series", name: "Netflix Series" },
        { type: "movie", id: "disney.movies", name: "Disney+ Movies" },
      ],
    },
  },
  {
    transportUrl: "https://anime-kitsu.strem.fun/manifest.json",
    transportName: "http",
    flags: {
      official: false,
      protected: false,
    },
    manifest: {
      id: "community.anime.kitsu",
      version: "2.1.0",
      name: "Anime Kitsu",
      description: "Anime catalog and metadata from Kitsu.io with episode thumbnails and Japanese titles.",
      logo: "https://anime-kitsu.strem.fun/favicon.ico",
      types: ["anime", "series"],
      resources: ["catalog", "meta"],
      catalogs: [
        { type: "anime", id: "kitsu-anime-trending", name: "Trending Anime" },
        { type: "anime", id: "kitsu-anime-airing", name: "Top Airing Anime" },
      ],
    },
  },
  {
    transportUrl: "https://youtube.strem.io/manifest.json",
    transportName: "http",
    flags: {
      official: true,
      protected: false,
    },
    manifest: {
      id: "com.stremio.youtube",
      version: "1.0.4",
      name: "YouTube Channels",
      description: "Browse and watch popular YouTube creators and podcasts in Stremio.",
      logo: "https://youtube.strem.io/favicon.ico",
      types: ["channel"],
      resources: ["catalog", "meta", "stream"],
      catalogs: [
        { type: "channel", id: "youtube_channels", name: "YouTube Trending" }
      ],
    },
  },
  {
    transportUrl: "https://subdl.strem.fun/manifest.json",
    transportName: "http",
    flags: {
      official: false,
      protected: false,
    },
    manifest: {
      id: "org.stremio.subdl",
      version: "1.1.5",
      name: "SubDL Subtitles",
      description: "Subtitles provider pulling directly from SubDL database with auto-sync capability.",
      logo: "https://subdl.strem.fun/favicon.ico",
      types: ["movie", "series"],
      resources: ["subtitles"],
      catalogs: [],
    },
  },
];
