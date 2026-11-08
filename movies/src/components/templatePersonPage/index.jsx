import React, { useState, useEffect } from "react";
import GlobalStyles from "@mui/material/GlobalStyles";
import MovieHeader from "../headerMovie";
import Grid from "@mui/material/Grid";
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
import Button from "@mui/material/Button";
import LanguageIcon from "@mui/icons-material/Language";
import MovieIcon from "@mui/icons-material/Movie";
import img from "../../images/film-poster-placeholder.png";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PersonCredits from "../personCredits";
import { dateFormatter } from "../../util";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const TemplatePersonPage = ({ person }) => {
  const [photoNum, setPhotoNum] = useState(0);
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["images", { id: person.id, type: "person" }],
    queryFn: getMovieImages,
  });

  let photoCount = 0;
  if (data) {
    photoCount = Math.min(data.profiles.length, 10);
  }

  useEffect(() => {
    if (photoCount < 2) return;
    const timer = setInterval(() => {
      setPhotoNum((prev) => (prev + 1) % photoCount);
    }, 4000);

    return () => clearInterval(timer);
  }, [photoCount]);

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const photos = data.profiles.slice(0, 10);

  const knownFor = [
    ...person.combined_credits.crew,
    ...person.combined_credits.cast,
  ]
    .sort((a, b) => {
      return b.vote_count - a.vote_count;
    })
    .slice(0, 5);

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles styles={{ body: { backgroundColor: "black" } }} />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.900",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Container maxWidth="xl" sx={{ paddingTop: 4 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              {/* name */}
              <Panel>
                <MovieHeader movie={person} />
              </Panel>
            </Grid>
            <Grid size={4}>
              {/* photo */}
              <Panel>
                <Box
                  component="img"
                  src={
                    photos.length !== 0
                      ? `https://image.tmdb.org/t/p/w500${photos[photoNum].file_path}`
                      : img
                  }
                  sx={{
                    width: "100%",
                    aspectRatio: "2 / 3",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: 1,
                  }}
                ></Box>
              </Panel>
            </Grid>
            <Grid container size={8} spacing={2}>
              {/* right side: chips + links, biography, details */}
              <Grid size={12}>
                <Panel>
                  {/* row 1: chips */}
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    divider={
                      <Typography component="span" color="text.secondary">
                        •
                      </Typography>
                    }
                    sx={{
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Chip label={person.known_for_department} color="primary" />
                    <Chip label={dateFormatter(person.birthday)} />
                    <Chip label={person.place_of_birth} />
                  </Stack>

                  {/* row 2: links out */}
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ flexWrap: "wrap" }}
                  >
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<MovieIcon />}
                      component="a"
                      href={`https://www.imdb.com/name/${person.imdb_id}`}
                      target="_blank"
                    >
                      IMDb
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<LanguageIcon />}
                      component="a"
                      href={`${person.homepage}`}
                      target="_blank"
                    >
                      Homepage
                    </Button>
                  </Stack>
                </Panel>
              </Grid>
              <Grid size={8}>
                {/* biography */}
                <Panel>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Biography
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: 3,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {person.biography}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ color: "warning.light" }}
                  >
                    Also known as
                  </Typography>
                  <Typography variant="body1">
                    {person.also_known_as.join(", ")}
                  </Typography>
                </Panel>
              </Grid>
              <Grid size={4}>
                {/* details */}
                <Panel>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Born
                      </Typography>
                      <Typography variant="body1">
                        {dateFormatter(person.birthday)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Died
                      </Typography>
                      <Typography variant="body1">
                        {dateFormatter(person.deathday)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Gender
                      </Typography>
                      <Typography variant="body1">
                        {person.gender === 1
                          ? "Female"
                          : person.gender === 2
                            ? "Male"
                            : person.gender === 3
                              ? "Non-binary"
                              : "Unknown"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Popularity
                      </Typography>
                      <Typography variant="body1">
                        {person.popularity.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Credits
                      </Typography>
                      <Typography variant="body1">
                        {person.combined_credits.cast.length +
                          person.combined_credits.crew.length +
                          " appearances"}
                      </Typography>
                    </Box>
                  </Stack>
                </Panel>
              </Grid>
            </Grid>
            <Grid size={12}>
              {/* known for*/}
              <Panel>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: 2 }}
                >
                  Known for
                </Typography>

                <Grid container columns={5} spacing={2}>
                  {knownFor.map((k) => (
                    <Grid size={1} key={k.credit_id}>
                      <Link
                        component={RouterLink}
                        to={
                          k.media_type === "movie"
                            ? `/movies/${k.id}`
                            : `/shows/${k.id}`
                        }
                        underline="none"
                        color="inherit"
                        sx={{ display: "block" }}
                      >
                        <Box
                          component="img"
                          src={
                            k.poster_path != undefined
                              ? `https://image.tmdb.org/t/p/w185` +
                                k.poster_path
                              : img
                          }
                          sx={{
                            width: "100%",
                            aspectRatio: "2 / 3",
                            objectFit: "cover",
                            display: "block",
                            borderRadius: 1,
                            marginBottom: 1,
                          }}
                        />
                        <Typography
                          variant="subtitle1"
                          noWrap
                          sx={{ fontWeight: "bold" }}
                        >
                          {k.title || k.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "warning.light",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {k.character || k.job}
                        </Typography>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Panel>
            </Grid>
            <Grid size={12}>
              {/* credits */}
              <Panel>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: 2 }}
                >
                  Credits
                </Typography>
                <PersonCredits person={person} />
              </Panel>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TemplatePersonPage;
