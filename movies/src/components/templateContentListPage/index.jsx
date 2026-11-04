import React, { useState } from "react";
import FilterCard from "../filterCard";
import ContentList from "../contentList";
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

function ContentListPageTemplate({ items, action, type = "movie" }) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const [seenFilter, setSeenFilter] = useState("all");
  const [ratingValue, setRatingValue] = useState([0, 10]);
  const [releaseDateRange, setReleaseDateRange] = useState([
    "1900-01-01",
    "2050-01-01",
  ]);
  const [sortDirection, setSortDirection] = useState(1);
  const [sortCriteria, setSortCriteria] = useState(0);
  const { searchValue, changeSearchValue } = useContext(MoviesContext);

  const genreId = Number(genreFilter);

  const getDisplayedItems = (items) => {
    let m = items
      .filter((m) => {
        //Name
        return m.title.toLowerCase().includes(searchValue.toLowerCase());
      })
      .filter((m) => {
        //Genre
        return genreId > 0 ? m.genre_ids.includes(genreId) : true;
      })
      .filter((m) => {
        //Rating
        return (
          m.vote_average >= ratingValue[0] && m.vote_average <= ratingValue[1]
        );
      })
      .filter((m) => {
        //Release Date
        return m.date >= releaseDateRange[0] && m.date <= releaseDateRange[1];
      });
    console.log(m);
    let direction = 1; //Descending
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
          return direction * (new Date(b.date) - new Date(a.date));
        });
      case 3: //Title
        return [...m].sort((a, b) => {
          return direction * b.title.localeCompare(a.title);
        });
    }
  };

  const handleChange = (type, value) => {
    switch (type) {
      case "name":
        setNameFilter(value);
        break;
      case "genre":
        setGenreFilter(value);
        break;
      case "seen":
        setSeenFilter(value);
        break;
      case "rating":
        setRatingValue(value);
        break;
      case "releaseDateRange":
        setReleaseDateRange(value);
        break;
    }
  };

  let displayedItems = getDisplayedItems(items);

  return (
    <Grid container size={12}>
      <Grid size={12} sx={{ marginTop: 3, display: "flex" }}>
        <Typography variant="h5" sx={{ marginLeft: 5 }}>
          Sorting Options:
        </Typography>
        <Chip
          icon={sortDirection === 1 ? <SouthIcon /> : <NorthIcon />}
          label={sortDirection === 1 ? "Descending" : "Ascending"}
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
      <Grid container size={12}>
        <Grid
          size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
          sx={{ padding: "20px" }}
        >
          <FilterCard
            type={type}
            onUserInput={handleChange}
            titleFilter={nameFilter}
            genreFilter={genreFilter}
            seenFilter={seenFilter}
            ratingValue={ratingValue}
            releaseDateRange={releaseDateRange}
          />
        </Grid>
        <Grid container size={{ xs: 12, md: 10 }}>
          <ContentList action={action} items={displayedItems}></ContentList>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default ContentListPageTemplate;
