import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router";
import ContentDiscoverPage from "./pages/contentDiscoverPage";
import MoviePage from "./pages/movieDetailsPage";
import ShowPage from "./pages/showDetailsPage";
import FavoriteMoviesPage from "./pages/favoriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import WatchlistPage from "./pages/watchlistPage";
import SiteHeader from "./components/siteHeader";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MoviesContextProvider from "./contexts/moviesContext";
import AddMovieReviewPage from "./pages/addMovieReviewPage";

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
            <Route path="/favorites" element={<FavoriteMoviesPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
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
