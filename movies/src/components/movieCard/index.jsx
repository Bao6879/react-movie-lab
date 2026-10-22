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

export default function MovieCard({ movie, action }) {
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
    queryKey: ["images", { id: movie.id }],
    queryFn: getMovieImages,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const posterUrl = `https://image.tmdb.org/t/p/w500/${data.posters[currentPoster].file_path}`;

  if (favorites.find((id) => id === movie.id)) {
    movie.favorite = true;
  } else {
    movie.favorite = false;
  }

  const handleAddToFavorite = (e) => {
    e.preventDefault();
    addToFavorites(movie);
  };

  return (
    <Card
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      sx={{
        transition:
          "transform 300ms ease, box-shadow 300ms ease, background-color 300ms ease",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 5,
          backgroundColor: "lightgrey",
        },
      }}
    >
      <CardHeader
        avatar={
          movie.favorite ? (
            <Avatar sx={{ backgroundColor: "red" }}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
        action={action(movie)}
        title={
          <Typography
            variant="body1"
            component="p"
            sx={{ textAlign: "center", fontWeight: "bolder" }}
          >
            {movie.title}
          </Typography>
        }
      />
      <Link to={`/movies/${movie.id}`}>
        <CardMedia sx={{ height: 500 }} image={posterUrl} />
      </Link>
      <CardContent>
        <Box>
          <Typography
            variant="caption"
            component="p"
            sx={{ fontStyle: "italic", fontSize: 15, textAlign: "center" }}
          >
            {dateFormatter(movie.release_date)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
