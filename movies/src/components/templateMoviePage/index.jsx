import React, { useState, useEffect } from "react";
import MovieHeader from "../headerMovie";
import Grid from "@mui/material/Grid";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getMovieImages } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Spinner from "../spinner";
import Container from "@mui/material/Container";
import Panel from "../panel";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router";
import img from "../../images/film-poster-placeholder.png";

const TemplateMoviePage = ({ movie, children }) => {
  const [postNum, setPostNum] = useState(0);
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["images", { id: movie.id }],
    queryFn: getMovieImages,
  });

  let posterCount = 0;
  if (data) {
    posterCount = Math.min(data.posters.length, 10);
  }

  useEffect(() => {
    if (posterCount < 2) return;
    const timer = setInterval(() => {
      setPostNum((prev) => (prev + 1) % posterCount);
    }, 4000);

    return () => clearInterval(timer);
  }, [posterCount]);

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const posters = data.posters.slice(0, 10);
  console.log(movie);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.900",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {/* title */}
            <Panel>
              <MovieHeader movie={movie} />
            </Panel>
          </Grid>
          <Grid size={4}>
            {/* poster */}
            <Panel>
              <Box
                component="img"
                src={
                  posters.length !== 0
                    ? `https://image.tmdb.org/t/p/w500${posters[postNum].file_path}`
                    : movie.poster_path != null
                      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                      : img
                }
                sx={{ width: "100%", display: "block", borderRadius: 1 }}
              ></Box>
            </Panel>
          </Grid>
          <Grid container size={8} spacing={2}>
            {/* right side: actions, overview, stats */}
            <Grid size={12}>
              {/* actions */}
              <Panel>actions</Panel>
            </Grid>
            <Grid size={8}>
              {/* overview */}
              <Panel>
                <Typography variant="h5" component="h2" gutterBottom>
                  Overview
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
                  {movie.overview}
                </Typography>

                {/* two columns under the overview: directors left, writers right */}
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Typography variant="subtitle2" color="grey.400">
                      Directed by
                    </Typography>
                    <Stack spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
                      {movie.credits.crew
                        .filter((crew) => crew.job === "Director")
                        .slice(0, 4)
                        .map((crew) => (
                          <Link
                            key={`${crew.id}-${crew.job}`}
                            component={RouterLink}
                            to={`/people/${crew.id}`}
                            color="inherit"
                            underline="hover"
                            variant="body1"
                          >
                            {crew.name}
                          </Link>
                        ))}
                    </Stack>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="subtitle2" color="grey.400">
                      Screenplay
                    </Typography>
                    <Stack spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
                      {movie.credits.crew
                        .filter(
                          (crew) =>
                            crew.job === "Writer" || crew.job === "Screenplay",
                        )
                        .slice(0, 4)
                        .map((crew) => (
                          <Link
                            key={`${crew.id}-${crew.job}`}
                            component={RouterLink}
                            to={`/people/${crew.id}`}
                            color="inherit"
                            underline="hover"
                            variant="body1"
                          >
                            {crew.name}
                          </Link>
                        ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Panel>
            </Grid>
            <Grid size={4}>
              {/* stats */}
              <Panel>
                <Typography variant="h5" component="h2" gutterBottom>
                  Details
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1">{movie.status}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Original language
                    </Typography>
                    <Typography variant="body1">
                      {movie.original_language.toUpperCase()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Budget
                    </Typography>
                    <Typography variant="body1">
                      $
                      {movie.budget === 0 ? "-" : movie.budget.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Revenue
                    </Typography>
                    <Typography variant="body1">
                      $
                      {movie.revenue === 0
                        ? "-"
                        : movie.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rating
                    </Typography>
                    <Typography variant="body1">
                      {movie.vote_average}
                      {" average from "}
                      {movie.vote_count}
                      {" votes"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Production companies
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: "wrap" }}
                    >
                      {movie.production_companies.map((com) => (
                        <Chip
                          key={com.id}
                          label={com.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Panel>
            </Grid>
          </Grid>
          <Grid size={12}>
            {/* cast */}
            <Panel>cast</Panel>
          </Grid>
          <Grid size={12}>
            {/* recommendations */}
            <Panel>recommendations</Panel>
          </Grid>
          <Grid size={12}>
            {/* reviews */}
            <Panel>reviews</Panel>
          </Grid>
        </Grid>
      </Container>
      {/* <MovieHeader movie={movie} /> */}

      {/* <Grid container spacing={5} style={{ padding: "15px" }}>
        <Grid size={{ xs: 3 }}>
          <div
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          ></div>
        </Grid>

        <Grid size={{ xs: 9 }}>{children}</Grid>
      </Grid> */}
    </Box>
  );
};

export default TemplateMoviePage;
