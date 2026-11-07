import { useContext } from "react";
import PageTemplate from "../components/templateContentListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getShow } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromSeen from "../components/cardIcons/removeFromSeen";
import WriteReview from "../components/cardIcons/writeReview";

const SeenShowsPage = () => {
  const { seen } = useContext(MoviesContext);

  const showIds = seen
    .filter((key) => key.startsWith("show-"))
    .map((key) => key.replace("show-", ""));

  // Create an array of queries and run in parallel.
  const seenShowQueries = useQueries({
    queries: showIds.map((movieId) => {
      return {
        queryKey: ["show", { id: movieId }],
        queryFn: getShow,
      };
    }),
  });

  // Check if any of the parallel queries is still loading.
  const isPending = seenShowQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <Spinner />;
  }

  const shows = seenShowQueries.map((q) => {
    q.data.genre_ids = q.data.genres.map((g) => g.id);
    return q.data;
  });

  return (
    <PageTemplate
      items={shows}
      action={(show) => {
        return (
          <>
            <RemoveFromSeen movie={show} />
            <WriteReview movie={show} />
          </>
        );
      }}
    />
  );
};

export default SeenShowsPage;
