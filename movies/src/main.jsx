import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router";
import ContentDiscoverPage from "./pages/contentDiscoverPage";
import MoviePage from "./pages/movieDetailsPage";
import ShowPage from "./pages/showDetailsPage";
import PersonPage from "./pages/personDetailsPage";
import FavoriteMoviesPage from "./pages/favoriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import WatchlistMoviesPage from "./pages/watchlistMoviesPage";
import SiteHeader from "./components/siteHeader";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MoviesContextProvider from "./contexts/moviesContext";
import AddMovieReviewPage from "./pages/addMovieReviewPage";
import SeenMoviesPage from "./pages/seenMoviesPage";
import FavoriteShowsPage from "./pages/favoriteShowsPage";
import WatchlistShowsPage from "./pages/watchlistShowsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MoviesContextProvider>
          <SiteHeader />
          <Routes>
            <Route path="/favoritesMovie" element={<FavoriteMoviesPage />} />
            <Route path="/watchlistMovie" element={<WatchlistMoviesPage />} />
            <Route path="/seenMovie" element={<SeenMoviesPage />} />

            <Route path="/favoritesShow" element={<FavoriteShowsPage />} />
            <Route path="/watchlistShow" element={<WatchlistShowsPage />} />
            {/* <Route path="/seenShow" element={<SeenShowsPage />} /> */}

            <Route path="/reviews/:id" element={<MovieReviewPage />} />
            <Route path="/movies/:id" element={<MoviePage />} />
            <Route path="/reviews/form" element={<AddMovieReviewPage />} />

            <Route path="/movies/discover" element={<ContentDiscoverPage />} />
            <Route path="/movies/playing" element={<ContentDiscoverPage />} />
            <Route path="/movies/top" element={<ContentDiscoverPage />} />
            <Route path="/movies/upcoming" element={<ContentDiscoverPage />} />

            <Route path="/shows/discover" element={<ContentDiscoverPage />} />
            <Route path="/shows/playing" element={<ContentDiscoverPage />} />
            <Route path="/shows/top" element={<ContentDiscoverPage />} />
            <Route path="/shows/upcoming" element={<ContentDiscoverPage />} />
            <Route path="/shows/:id" element={<ShowPage />} />

            <Route path="/people" element={<ContentDiscoverPage />} />
            <Route path="/people/:id" element={<PersonPage />} />
            <Route path="*" element={<Navigate to="/movies/discover" />} />
          </Routes>
        </MoviesContextProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const rootElement = createRoot(document.getElementById("root"));
rootElement.render(<App />);
