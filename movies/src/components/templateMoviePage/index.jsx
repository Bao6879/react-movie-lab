import React, { useState, useEffect, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import GlobalStyles from "@mui/material/GlobalStyles";
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
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LanguageIcon from "@mui/icons-material/Language";
import img from "../../images/film-poster-placeholder.png";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FavoriteOutlined } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MovieReviews from "../movieReviews";
import ReviewForm from "../reviewForm";
import { dateFormatter } from "../../util";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const TemplateMoviePage = ({ movie, children }) => {
  const [postNum, setPostNum] = useState(0);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    seen,
    addToSeen,
    removeFromSeen,
    myReviews,
  } = useContext(MoviesContext);
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
  const ageRating = movie.release_dates.results
    .find((m) => m.iso_3166_1 === "US")
    ?.release_dates.find((r) => r.certification !== "")?.certification;
  console.log(ageRating);
  const trailer = movie.videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );

  const isFavourite = favorites.includes(movie.id);
  const isInWatchlist = watchlist.includes(movie.id);
  const isSeen = seen.includes(movie.id);
  const hasReviewed = myReviews[movie.id] !== undefined;

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles styles={{ body: { backgroundColor: "black" } }} />
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
                <Panel>
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
                    <Chip label={dateFormatter(movie.release_date)} />
                    {ageRating != undefined ? (
                      <Chip label={ageRating} variant="outlined" />
                    ) : null}
                    <Chip
                      label={
                        Math.floor(movie.runtime / 60) +
                        "h " +
                        (movie.runtime % 60) +
                        "m"
                      }
                    />
                    {movie.genres.map((m) => (
                      <Chip key={m.id} label={m.name} color="primary" />
                    ))}
                  </Stack>

                  {/* row 2: buttons */}
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ flexWrap: "wrap" }}
                  >
                    {/* favourite*/}
                    <Button
                      variant={isFavourite ? "outlined" : "contained"}
                      color="error"
                      startIcon={
                        isFavourite ? <FavoriteIcon /> : <FavoriteOutlined />
                      }
                      onClick={() => {
                        if (isFavourite) removeFromFavorites(movie);
                        else addToFavorites(movie);
                      }}
                    >
                      {isFavourite
                        ? "Remove from favourite"
                        : "Add to favourite"}
                    </Button>
                    {/* watchlist */}
                    <Button
                      variant={isInWatchlist ? "outlined" : "contained"}
                      color="info"
                      startIcon={
                        isInWatchlist ? (
                          <BookmarkIcon />
                        ) : (
                          <BookmarkBorderIcon />
                        )
                      }
                      onClick={() => {
                        if (isInWatchlist) removeFromWatchlist(movie);
                        else addToWatchlist(movie);
                      }}
                    >
                      {isInWatchlist
                        ? "Remove from watchlist"
                        : "Add to watchlist"}
                    </Button>
                    {/* seen */}
                    <Button
                      variant={isSeen ? "outlined" : "contained"}
                      color="success"
                      startIcon={
                        isSeen ? <VisibilityIcon /> : <VisibilityOutlinedIcon />
                      }
                      onClick={() => {
                        if (isSeen) removeFromSeen(movie);
                        else addToSeen(movie);
                      }}
                    >
                      {isSeen ? "Mark as unseen" : "Mark as seen"}
                    </Button>
                    {/* trailer */}
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<PlayArrowIcon />}
                      component="a"
                      href={
                        trailer !== undefined
                          ? `https://www.youtube.com/watch?v=` + trailer.key
                          : undefined
                      }
                      disabled={trailer === undefined}
                      target="_blank"
                    >
                      Trailer
                    </Button>
                    {/* homepage */}
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<LanguageIcon />}
                      component="a"
                      href={`${movie.homepage}`}
                      target="_blank"
                    >
                      Homepage
                    </Button>
                  </Stack>
                </Panel>
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
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
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
                              color="info.light"
                              underline="hover"
                              variant="body1"
                            >
                              {crew.name}
                            </Link>
                          ))}
                      </Stack>
                    </Grid>
                    <Grid size={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Screenplay
                      </Typography>
                      <Stack spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
                        {movie.credits.crew
                          .filter(
                            (crew) =>
                              crew.job === "Writer" ||
                              crew.job === "Screenplay",
                          )
                          .slice(0, 4)
                          .map((crew) => (
                            <Link
                              key={`${crew.id}-${crew.job}`}
                              component={RouterLink}
                              to={`/people/${crew.id}`}
                              color="info.light"
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
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Status
                      </Typography>
                      <Typography variant="body1">{movie.status}</Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Original language
                      </Typography>
                      <Typography variant="body1">
                        {movie.original_language.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Budget
                      </Typography>
                      <Typography variant="body1">
                        $
                        {movie.budget === 0
                          ? "-"
                          : movie.budget.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
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
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Rating
                      </Typography>
                      <Typography variant="body1">
                        {movie.vote_average.toFixed(2)}
                        {" average from "}
                        {movie.vote_count}
                        {" votes"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
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
              <Panel>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h5" component="h2">
                    Top cast
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={`/movies/${movie.id}/credits`}
                    color="info.light"
                    underline="hover"
                  >
                    Full cast and crew
                  </Link>
                </Box>

                <Grid container columns={5} spacing={2}>
                  {movie.credits.cast.slice(0, 5).map((c) => (
                    <Grid size={1} key={c.id}>
                      <Link
                        component={RouterLink}
                        to={`/people/${c.id}`}
                        underline="none"
                        color="inherit"
                        sx={{ display: "block" }}
                      >
                        <Box
                          component="img"
                          src={
                            c.profile_path != undefined
                              ? `https://image.tmdb.org/t/p/w185` +
                                c.profile_path
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
                          {c.name}
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
                          {c.character}
                        </Typography>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Panel>
            </Grid>
            <Grid size={12}>
              {/* recommendations */}
              <Panel>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h5" component="h2">
                    Recommendations
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={`/movies/${movie.id}/recommendations`}
                    color="info.light"
                    underline="hover"
                  >
                    See all
                  </Link>
                </Box>

                {movie.recommendations.results.length !== 0 ? (
                  <Grid container columns={5} spacing={2}>
                    {movie.recommendations.results.slice(0, 5).map((r) => (
                      <Grid size={1} key={r.id}>
                        <Link
                          component={RouterLink}
                          to={`/movies/${r.id}`}
                          underline="none"
                          color="inherit"
                          sx={{ display: "block" }}
                        >
                          <Box
                            component="img"
                            src={
                              r.poster_path != undefined
                                ? `https://image.tmdb.org/t/p/w185` +
                                  r.poster_path
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
                            {r.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "warning.light" }}
                          >
                            {(r.release_date !== ""
                              ? r.release_date.slice(0, 4)
                              : "N/A") +
                              " • " +
                              r.vote_average.toFixed(2)}
                          </Typography>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                ) : null}
              </Panel>
            </Grid>
            <Grid size={12}>
              {/* reviews */}
              <Accordion
                expanded={reviewsOpen}
                onChange={() => {
                  setReviewsOpen(!reviewsOpen);
                }}
                disableGutters
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  backgroundImage: "none",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginRight: 2,
                    }}
                  >
                    <Typography variant="h5" component="h2">
                      Reviews
                    </Typography>
                    {!hasReviewed ? (
                      <Button
                        variant="outlined"
                        size="small"
                        component="span"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReviewsOpen(true);
                          setShowForm(!showForm);
                        }}
                      >
                        {showForm ? "Back to reviews" : "Write a review"}
                      </Button>
                    ) : null}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {showForm ? (
                    <ReviewForm
                      movie={movie}
                      onDone={() => setShowForm(false)}
                    />
                  ) : (
                    <MovieReviews movie={movie} />
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TemplateMoviePage;
