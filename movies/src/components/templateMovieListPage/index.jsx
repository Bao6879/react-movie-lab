import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid";
import { MoviesContext } from "../../contexts/moviesContext";
import { useContext } from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TextFieldsIcon from "@mui/icons-material/TextFields";

function MovieListPageTemplate({ movies, title, action }) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const [sortDirection, setSortDirection] = useState(1);
  const [sortCriteria, setSortCriteria] = useState(0);
  const { searchValue, changeSearchValue } = useContext(MoviesContext);

  const genreId = Number(genreFilter);

  const getDisplayedMovies = (movies) => {
    let m = movies
      .filter((m) => {
        return (
          m.title.toLowerCase().startsWith(searchValue.toLowerCase()) !== false
        );
      })
      .filter((m) => {
        return genreId > 0 ? m.genre_ids.includes(genreId) : true;
      });
    let direction = 1; //Ascending
    if (sortDirection === 0) direction = -1;
    switch (sortCriteria) {
      case 0: //Popularity
        return [...m].sort((a, b) => {
          return direction * (b.popularity - a.popularity);
        });
      case 1: //Rating
        return [...m].sort((a, b) => {
          return direction * (b.vote_average - a.vote_average);
        });
      case 2: //Release date
        return [...m].sort((a, b) => {
          return (
            direction * (new Date(b.release_date) - new Date(a.release_date))
          );
        });
      case 3: //Title
        console.log(
          [...m].sort((a, b) => {
            return direction * a.title.localeCompare(b.title);
          }),
        );
        return [...m].sort((a, b) => {
          return direction * a.title.localeCompare(b.title);
        });
    }
  };

  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else setGenreFilter(value);
  };

  let displayedMovies = getDisplayedMovies(movies);

  return (
    <Grid container>
      <Grid size={12} sx={{ marginTop: 3, display: "flex" }}>
        <Typography variant="h5" sx={{ marginLeft: 5 }}>
          Sorting Options:
        </Typography>
        <Chip
          icon={sortDirection === 1 ? <NorthIcon /> : <SouthIcon />}
          label={sortDirection === 1 ? "Ascending" : "Descending"}
          size="medium"
          color="primary"
          onClick={() => {
            setSortDirection((previous) => (previous + 1) % 2);
          }}
          sx={{ marginLeft: 5 }}
        />
        <Chip
          icon={<FavoriteIcon />}
          label="By Popularity"
          size="medium"
          color="error"
          variant={sortCriteria === 0 ? "filled" : "outlined"}
          onClick={() => {
            setSortCriteria(0);
          }}
          sx={{ marginLeft: 5 }}
        />
        <Chip
          icon={<StarIcon />}
          label="By Rating"
          size="medium"
          color="success"
          variant={sortCriteria === 1 ? "filled" : "outlined"}
          onClick={() => {
            setSortCriteria(1);
          }}
          sx={{ marginLeft: 5 }}
        />
        <Chip
          icon={<CalendarTodayIcon />}
          label="By Release Date"
          variant={sortCriteria === 2 ? "filled" : "outlined"}
          color="secondary"
          size="medium"
          onClick={() => {
            setSortCriteria(2);
          }}
          sx={{ marginLeft: 5 }}
        />
        <Chip
          icon={<TextFieldsIcon />}
          label="By Title"
          size="medium"
          color="info"
          variant={sortCriteria === 3 ? "filled" : "outlined"}
          onClick={() => {
            setSortCriteria(3);
          }}
          sx={{ marginLeft: 5 }}
        />
      </Grid>
      <Grid container>
        <Grid
          size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
          sx={{ padding: "20px" }}
        >
          <FilterCard
            onUserInput={handleChange}
            titleFilter={nameFilter}
            genreFilter={genreFilter}
          />
        </Grid>
        <Grid container size={{ xs: 12, md: 9 }}>
          <MovieList action={action} movies={displayedMovies}></MovieList>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default MovieListPageTemplate;
