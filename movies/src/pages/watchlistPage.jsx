import { useContext } from "react";
import PageTemplate from "../components/templateContentListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromWatchlist from "../components/cardIcons/removeFromWatchlist.jsx";
import WriteReview from "../components/cardIcons/writeReview";

const watchlistPage = () => {
  const { watchlist } = useContext(MoviesContext);

  // the list holds "movie-550" / "show-1396" keys: keep the movies, cut off "movie-"
  // (shows get their own page later)
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

  const toDo = () => true;

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

export default watchlistPage;
