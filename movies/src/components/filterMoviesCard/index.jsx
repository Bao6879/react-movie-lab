import React, { useState } from "react";
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
import { getGenres, getAgeRatings } from "../../api/tmdb-api";
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
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";

const formControl = {
  margin: 1,
  minWidth: "90%",
  backgroundColor: "rgb(255, 255, 255)",
};

export default function FilterMoviesCard(props) {
  const [ageRatingNotSelected, setAgeRatingNotSelected] = useState([]);
  const [ratingValue, setRatingValue] = useState([0, 10]);
  const [runtimeValue, setRuntimeValue] = useState([0, 390]);
  const [dateFrom, setDateFrom] = useState("1900-01-01");
  const [dateTo, setDateTo] = useState("2050-01-01");
  const {
    data: genreData,
    error: genreError,
    isPending: genreIsPending,
    isError: genreIsError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const {
    data: ageRatingData,
    error: ageRatingError,
    isPending: ageRatingIsPending,
    isError: ageRatingIsError,
  } = useQuery({
    queryKey: ["certifications"],
    queryFn: getAgeRatings,
  });

  if (genreIsPending || ageRatingIsPending) {
    return <Spinner />;
  }

  if (genreIsError) {
    return <h1>{genreError.message}</h1>;
  } else if (ageRatingIsError) return <h1>{ageRatingError.message}</h1>;
  const genres = genreData.genres;
  if (genres[0].name !== "All") {
    genres.unshift({ id: "0", name: "All" });
  }

  const ageRatings = ageRatingData.certifications.US;

  let valueMarks = [],
    runtimeMarks = [];
  for (let i = 0; i <= 10; i++) valueMarks.push({ value: i, label: i });
  for (let i = 0; i <= 300; i += 30) runtimeMarks.push({ value: i, label: i });

  const handleChange = (e, type, value) => {
    e.preventDefault();
    props.onUserInput(type, value);
  };

  const handleGenreChange = (e) => {
    handleChange(e, "genre", e.target.value);
  };

  const handleAgeRatingChange = (e) => {
    const { value, checked } = e.target;
    setAgeRatingNotSelected((previous) =>
      checked
        ? previous.filter((rating) => rating !== value)
        : [...previous, value],
    );
    handleChange(e, "age", ageRatingNotSelected);
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
            defaultValue="all"
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
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              handleChange(e, "dateFrom", event.target.value);
            }}
          />
          <TextField
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              handleChange(e, "dateTo", event.target.value);
            }}
          />
          <Divider />
          <Typography variant="body1">By Genre:</Typography>
          <FormControl sx={{ ...formControl }}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              defaultValue=""
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
          <FormControl>
            {ageRatings.map((rating) => {
              return (
                <FormControlLabel
                  key={rating.certification}
                  label={rating.certification}
                  control={
                    <Checkbox
                      value={rating.certification}
                      checked={
                        !ageRatingNotSelected.includes(rating.certification)
                      }
                      onChange={handleAgeRatingChange}
                    />
                  }
                />
              );
            })}
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
              setRatingValue(newValue);
              handleChange(event, "rating", newValue);
            }}
          />
          <Divider />
          <Typography variant="body1">By Runtime:</Typography>
          <Slider
            value={runtimeValue}
            step={10}
            marks={runtimeMarks}
            min={0}
            max={300}
            onChange={(event, newValue) => {
              setRuntimeValue(newValue);
              handleChange(event, "runtime", newValue);
            }}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
