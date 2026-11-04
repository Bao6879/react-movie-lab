import { getMovies, getPeople, getShows } from "../api/tmdb-api";
import PageTemplate from "../components/templateContentListPage";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import MovieActions from "../components/movieActions";
import { useLocation } from "react-router";

const ContentDiscoverPage = (props) => {
  const location = useLocation();
  const section = location.pathname.split("/")[1];
  const category = location.pathname.split("/")[2];

  let type = "movie";
  let getContent = getMovies;
  if (section === "shows") {
    type = "tv";
    getContent = getShows;
  } else if (section === "people") {
    type = "person";
    getContent = getPeople;
  }

  const { data, error, isPending, isError } = useQuery({
    queryKey: [section, { category: category }],
    queryFn: getContent,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const items = data.results;

  // Redundant, but necessary to avoid app crashing.
  const favorites = items.filter((m) => m.favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  const addToFavorites = (movieId) => true;

  return (
    <PageTemplate
      type={type}
      items={items}
      action={(movie) => {
        return <MovieActions movie={movie} />;
      }}
    />
  );
};
export default ContentDiscoverPage;
