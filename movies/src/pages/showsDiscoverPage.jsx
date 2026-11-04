import { getShows } from "../api/tmdb-api";
import PageTemplate from "../components/templateContentListPage";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import MovieActions from "../components/movieActions";
import { useLocation } from "react-router";

const ShowsDiscoverPage = (props) => {
  const location = useLocation();
  const category = location.pathname.split("/")[2];
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["show", { category: category }],
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
      type="tv"
      items={shows}
      // action={(shows) => {
      //   return <MovieActions movie={show} />;
      // }}
    />
  );
};
export default ShowsDiscoverPage;
