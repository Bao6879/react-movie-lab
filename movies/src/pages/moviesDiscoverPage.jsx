import { getDiscoverMovies, getPlayingMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import MovieActions from "../components/movieActions";
import { useLocation } from "react-router";

const MoviesDiscoverPage = (props) => {
  const location = useLocation();
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["movies", location.pathname],
    queryFn: location.pathname.includes("playing")
      ? getPlayingMovies
      : getDiscoverMovies,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const movies = data.results;

  // Redundant, but necessary to avoid app crashing.
  const favorites = movies.filter((m) => m.favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  const addToFavorites = (movieId) => true;

  return (
    <PageTemplate
      title="Discover Movies"
      movies={movies}
      action={(movie) => {
        return <MovieActions movie={movie} />;
      }}
    />
  );
};
export default MoviesDiscoverPage;
