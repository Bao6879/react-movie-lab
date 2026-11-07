import { useContext } from "react";
import PageTemplate from "../components/templateContentListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromSeen from "../components/cardIcons/removeFromSeen";
import WriteReview from "../components/cardIcons/writeReview";

const SeenMoviesPage = () => {
  const { seen } = useContext(MoviesContext);

  const movieIds = seen
    .filter((key) => key.startsWith("movie-"))
    .map((key) => key.replace("movie-", ""));

  // Create an array of queries and run in parallel.
  const seenMovieQueries = useQueries({
    queries: movieIds.map((movieId) => {
      return {
        queryKey: ["movie", { id: movieId }],
        queryFn: getMovie,
      };
    }),
  });

  // Check if any of the parallel queries is still loading.
  const isPending = seenMovieQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <Spinner />;
  }

  const movies = seenMovieQueries.map((q) => {
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
            <RemoveFromSeen movie={movie} />
            <WriteReview movie={movie} />
          </>
        );
      }}
    />
  );
};

export default SeenMoviesPage;
