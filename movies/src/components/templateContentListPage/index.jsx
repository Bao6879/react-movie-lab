import React, { useState } from "react";
import FilterCard from "../filterCard";
import ContentList from "../contentList";
import Grid from "@mui/material/Grid";
import { MoviesContext, makeKey } from "../../contexts/moviesContext";
import { useContext } from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

function ContentListPageTemplate({ items, action, type = "movie" }) {
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const [seenFilter, setSeenFilter] = useState("all");
  const [ratingValue, setRatingValue] = useState(
    type === "person" ? [0, 100] : [0, 10],
  );
  const [releaseDateRange, setReleaseDateRange] = useState([
    "1900-01-01",
    "2050-01-01",
  ]);
  const [sortDirection, setSortDirection] = useState(1);
  const [sortCriteria, setSortCriteria] = useState(0);
  const { searchValue, changeSearchValue, seen } = useContext(MoviesContext);

  const genreId = Number(genreFilter);

  const getDisplayedItems = (items) => {
    let m = items
      .filter((m) => {
        //Name
        return m.title.toLowerCase().includes(searchValue.toLowerCase());
      })
      .filter((m) => {
        //Genre | Department
        if (m.type === "person")
          return genreId === 0 || m.known_for_department === genreFilter;
        return genreId > 0 ? m.genre_ids.includes(genreId) : true;
      })
      .filter((m) => {
        //Rating
        if (m.type === "person") {
          if (ratingValue[1] === 100) return m.popularity >= ratingValue[0];
          return (
            m.popularity >= ratingValue[0] && m.popularity < ratingValue[1]
          );
        }
        return (
          m.vote_average >= ratingValue[0] && m.vote_average <= ratingValue[1]
        );
      })
      .filter((m) => {
        //Release Date
        if (m.type === "person") return true;
        return m.date >= releaseDateRange[0] && m.date <= releaseDateRange[1];
      })
      .filter((m) => {
        //Seen
        if (seenFilter === "all" || m.type === "person") return true;
        if (seenFilter === "seen") return seen.includes(makeKey(m));
        return !seen.includes(makeKey(m));
      });
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
    setPage(1);
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
  let pageCount = Math.ceil(displayedItems.length / 20);
  // Search can shrink the list without going through handleChange so never point past the last page (and never below page 1)
  const currentPage = Math.max(1, Math.min(page, pageCount));
  displayedItems = displayedItems.slice(
    (currentPage - 1) * 20,
    currentPage * 20,
  );

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
            setPage(1);
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
            setPage(1);
          }}
          sx={{ marginLeft: 5 }}
        />
        {type !== "person" ? (
          <>
            <Chip
              icon={<StarIcon />}
              label="By Rating"
              size="medium"
              color="success"
              variant={sortCriteria === 1 ? "filled" : "outlined"}
              onClick={() => {
                setSortCriteria(1);
                setPage(1);
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
                setPage(1);
              }}
              sx={{ marginLeft: 5 }}
            />
          </>
        ) : null}
        <Chip
          icon={<TextFieldsIcon />}
          label="By Title"
          size="medium"
          color="info"
          variant={sortCriteria === 3 ? "filled" : "outlined"}
          onClick={() => {
            setSortCriteria(3);
            setPage(1);
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
        <Grid size={12}>
          <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
            <Pagination
              count={pageCount}
              page={currentPage}
              size="large"
              onChange={(event, value) => {
                setPage(value);
                window.scrollTo(0, 0);
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default ContentListPageTemplate;
