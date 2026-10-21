import { useState } from "react";
import { getMovies } from "../api/tmdb-api";
import PageTemplate from "../components/templateMovieListPage";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";
import AddToWatchlistIcon from "../components/cardIcons/addToWatchlist";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";

const HomePage = (props) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["discover"],
    queryFn: getMovies,
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
        const [anchor, setAnchor] = useState(null);
        const handleMenu = (event) => {
          setAnchor(event.currentTarget);
        };
        return (
          <>
            <IconButton onClick={handleMenu}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
            >
              <MenuItem onClick={() => setAnchor(null)}>
                <AddToFavoritesIcon movie={movie} />
              </MenuItem>
              <MenuItem onClick={() => setAnchor(null)}>
                <AddToWatchlistIcon movie={movie} />
              </MenuItem>
            </Menu>
          </>
        );
      }}
    />
  );
};
export default HomePage;
