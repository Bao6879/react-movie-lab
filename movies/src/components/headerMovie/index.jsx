import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

const MovieHeader = (props) => {
  const movie = props.movie;
  const navigate = useNavigate();

  let year = "";
  if (movie.release_date) {
    year = movie.release_date.slice(0, 4);
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 3,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" component="h1">
          {movie.title}{" "}
          {year && (
            <Typography variant="h4" component="span" color="text.secondary">
              ({year})
            </Typography>
          )}
        </Typography>

        {movie.tagline && (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            "{movie.tagline}"
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MovieHeader;
