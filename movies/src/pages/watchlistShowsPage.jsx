import { useContext } from "react";
import PageTemplate from "../components/templateContentListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getShow } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromWatchlist from "../components/cardIcons/removeFromWatchlist";
import WriteReview from "../components/cardIcons/writeReview";

const WatchlistShowsPage = () => {
  const { watchlist } = useContext(MoviesContext);

  const showIds = watchlist
    .filter((key) => key.startsWith("show-"))
    .map((key) => key.replace("show-", ""));

  // Create an array of queries and run in parallel.
  const watchlistShowQueries = useQueries({
    queries: showIds.map((movieId) => {
      return {
        queryKey: ["show", { id: movieId }],
        queryFn: getShow,
      };
    }),
  });

  // Check if any of the parallel queries is still loading.
  const isPending = watchlistShowQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <Spinner />;
  }

  const shows = watchlistShowQueries.map((q) => {
    q.data.genre_ids = q.data.genres.map((g) => g.id);
    return q.data;
  });

  return (
    <PageTemplate
      items={shows}
      action={(show) => {
        return (
          <>
            <RemoveFromWatchlist movie={show} />
            <WriteReview movie={show} />
          </>
        );
      }}
    />
  );
};

export default WatchlistShowsPage;
