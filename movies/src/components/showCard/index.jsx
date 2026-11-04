import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import img from "../../images/film-poster-placeholder.png";
import { Link } from "react-router";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import { getMovieImages } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import { dateFormatter } from "../../util";
import Spinner from "../spinner";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function ShowCard({ show, action }) {
  const { favorites, addToFavorites } = useContext(MoviesContext);
  const [currentPoster, setCurrentPoster] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    //On render
    if (!hovering) return;
    const timer = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(timer);
  }, [hovering]);
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["images", { id: show.id, type: "tv" }],
    queryFn: getMovieImages,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const posterUrl = `https://image.tmdb.org/t/p/w500/${data.backdrops[currentPoster].file_path}`;

  if (favorites.find((id) => id === show.id)) {
    show.favorite = true;
  } else {
    show.favorite = false;
  }

  const handleAddToFavorite = (e) => {
    e.preventDefault();
    addToFavorites(show);
  };

  return (
    <Card
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      sx={{
        transition: "transform 300ms ease, box-shadow 300ms ease",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 20,
        },
        display: "flex",
        height: 300,
        borderRadius: 10,
      }}
    >
      {/* <CardHeader
        avatar={
          show.favorite ? (
            <Avatar sx={{ backgroundColor: "red" }}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
        action={action(show)}
        title={
          <Typography
            variant="body1"
            component="p"
            sx={{ textAlign: "center", fontWeight: "bolder" }}
          >
            {show.title}
          </Typography>
        }
      /> */}
      <Link to={`/shows/${show.id}`}>
        <CardMedia
          sx={{ aspectRatio: "16/9", height: "100%" }}
          image={posterUrl}
        />
      </Link>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 3,
          padding: 3,
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
            {show.title}
          </Typography>
          {show.original_name !== show.name && (
            <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
              {show.original_name}
            </Typography>
          )}
          <Typography variant="subtitle1" sx={{ color: "grey.400", mb: 1 }}>
            {dateFormatter(show.date)} · {show.origin_country} ·{" "}
            {show.original_language.toUpperCase()}
          </Typography>
          <Typography variant="body1">{show.overview}</Typography>
        </Box>
        <Stack sx={{ alignItems: "flex-end", flexShrink: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            ★ {show.vote_average.toFixed(1)}
          </Typography>
          <Typography variant="subtitle1">
            {show.vote_count.toLocaleString()} votes
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "success.light" }}>
            {Math.round(show.popularity)} popularity
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}
