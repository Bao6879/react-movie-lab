import React from "react";
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

const TemplateMoviePage = ({ movie, children }) => {
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

  const images = data.posters;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // backgroundImage:
        //   linear - gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
        // {url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")}
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="xl" sx={{ marginTop: 4 }}>
        <Grid container spacing={8}>
          <Grid size={12}>
            {/* title */}
            <Panel>title</Panel>
          </Grid>
          <Grid size={4}>
            {/* poster */}
            <Panel>poster</Panel>
          </Grid>
          <Grid container size={8} spacing={8}>
            {/* right side: actions, overview, stats */}
            <Grid size={12}>
              {/* actions */}
              <Panel>actions</Panel>
            </Grid>
            <Grid size={8}>
              {/* overview */}
              <Panel>overview</Panel>
            </Grid>
            <Grid size={4}>
              {/* stats */}
              <Panel>stats</Panel>
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
