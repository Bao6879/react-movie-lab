import { useContext } from "react";
import PageTemplate from "../components/templateContentListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getShow } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import WriteReview from "../components/cardIcons/writeReview";

const FavoriteShowsPage = () => {
  const { favorites } = useContext(MoviesContext);

  const showIds = favorites
    .filter((key) => key.startsWith("show-"))
    .map((key) => key.replace("show-", ""));

  // Create an array of queries and run in parallel.
  const favoriteShowQueries = useQueries({
    queries: showIds.map((movieId) => {
      return {
        queryKey: ["show", { id: movieId }],
        queryFn: getShow,
      };
    }),
  });

  // Check if any of the parallel queries is still loading.
  const isPending = favoriteShowQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <Spinner />;
  }

  const shows = favoriteShowQueries.map((q) => {
    q.data.genre_ids = q.data.genres.map((g) => g.id);
    return q.data;
  });

  const toDo = () => true;

  return (
    <PageTemplate
      items={shows}
      action={(show) => {
        return (
          <>
            <RemoveFromFavorites movie={show} />
            <WriteReview movie={show} />
          </>
        );
      }}
    />
  );
};

export default FavoriteShowsPage;
