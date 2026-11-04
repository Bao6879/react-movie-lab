import React from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import img from "../../images/pexels-dziana-hasanbekava-5480827.jpg";
import { getGenres, getGenresShows } from "../../api/tmdb-api";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Divider from "@mui/material/Divider";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Slider from "@mui/material/Slider";

const formControl = {
  margin: 1,
  minWidth: "90%",
  backgroundColor: "rgb(255, 255, 255)",
};

export default function FilterCard(props) {
  const { ratingValue, releaseDateRange } = props;
  const {
    data: genreData,
    error: genreError,
    isPending: genreIsPending,
    isError: genreIsError,
  } = useQuery({
    queryKey: ["genres", { type: props.type }],
    queryFn: props.type === "movie" ? getGenres : getGenresShows,
  });

  if (genreIsPending) {
    return <Spinner />;
  }

  if (genreIsError) {
    return <h1>{genreError.message}</h1>;
  }
  const genres = genreData.genres;
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  let valueMarks = [];
  for (let i = 0; i <= 10; i++) valueMarks.push({ value: i, label: i });

  const handleChange = (e, type, value) => {
    props.onUserInput(type, value);
  };

  const handleGenreChange = (e) => {
    handleChange(e, "genre", e.target.value);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography variant="h5">Filters</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2} useFlexGap sx={{ padding: 2 }}>
          <Typography variant="body1">By Seen:</Typography>
          <RadioGroup
            value={props.seenFilter}
            name="radio-buttons-group"
            onChange={(e) => handleChange(e, "seen", e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel
              value="seen"
              control={<Radio />}
              label="Stuff I have seen"
            />
            <FormControlLabel
              value="unseen"
              control={<Radio />}
              label="Stuff I haven't seen"
            />
          </RadioGroup>
          <Divider />
          <Typography variant="body1">By Release Date:</Typography>
          <TextField
            type="date"
            value={releaseDateRange[0]}
            onChange={(event) => {
              handleChange(event, "releaseDateRange", [
                event.target.value,
                releaseDateRange[1],
              ]);
            }}
          />
          <TextField
            type="date"
            value={releaseDateRange[1]}
            onChange={(event) => {
              handleChange(event, "releaseDateRange", [
                releaseDateRange[0],
                event.target.value,
              ]);
            }}
          />
          <Divider />
          <Typography variant="body1">By Genre:</Typography>
          <FormControl sx={{ ...formControl }}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              value={props.genreFilter}
              onChange={handleGenreChange}
            >
              {genres.map((genre) => {
                return (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Divider />
          <Typography variant="body1">By Rating:</Typography>
          <Slider
            value={ratingValue}
            step={0.5}
            marks={valueMarks}
            min={0}
            max={10}
            onChange={(event, newValue) => {
              handleChange(event, "rating", newValue);
            }}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
