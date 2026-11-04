import { getShows } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import MovieActions from "../components/movieActions";

const ShowsDiscoverPage = (props) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["discoverShow"],
    queryFn: getShows,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const shows = data.results;

  console.log(shows);
  return (
    <PageTemplate
      title="Discover Shows"
      movies={shows}
      // action={(shows) => {
      //   return <MovieActions movie={show} />;
      // }}
    />
  );
};
export default ShowsDiscoverPage;
