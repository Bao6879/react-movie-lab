import { useContext } from "react";
import PageTemplate from "../components/templateContentListPage/index.jsx";
import { MoviesContext } from "../contexts/moviesContext.jsx";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api.jsx";
import Spinner from "../components/spinner/index.jsx";
import RemoveFromWatchlist from "../components/cardIcons/removeFromWatchlist.jsx";
import WriteReview from "../components/cardIcons/writeReview.jsx";

const WatchlistMoviesPage = () => {
  const { watchlist } = useContext(MoviesContext);

  const movieIds = watchlist
    .filter((key) => key.startsWith("movie-"))
    .map((key) => key.replace("movie-", ""));

  // Create an array of queries and run in parallel.
  const watchlistQueries = useQueries({
    queries: movieIds.map((movieId) => {
      return {
        queryKey: ["movie", { id: movieId }],
        queryFn: getMovie,
      };
    }),
  });

  // Check if any of the parallel queries is still loading.
  const isPending = watchlistQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <Spinner />;
  }

  const movies = watchlistQueries.map((q) => {
    q.data.genre_ids = q.data.genres.map((g) => g.id);
    return q.data;
  });

  return (
    <PageTemplate
      items={movies}
      action={(movie) => {
        return (
          <>
            <RemoveFromWatchlist movie={movie} />
          </>
        );
      }}
    />
  );
};

export default WatchlistMoviesPage;
