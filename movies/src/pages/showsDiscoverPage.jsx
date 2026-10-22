import { getShows } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import MovieActions from "../components/movieActions";

const ShowsDiscoverPage = (props) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["discover"],
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
    <div>
      <h1>{shows[0].name}</h1>
    </div>
  );
};
export default ShowsDiscoverPage;
