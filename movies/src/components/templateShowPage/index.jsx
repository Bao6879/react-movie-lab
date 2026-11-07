import React, { useState, useEffect, useContext } from "react";
import { MoviesContext, makeKey } from "../../contexts/moviesContext";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
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
import SeasonEpisodes from "../seasonEpisodes";
import ButtonBase from "@mui/material/ButtonBase";
import { dateFormatter } from "../../util";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const TemplateShowPage = ({ show }) => {
  const [postNum, setPostNum] = useState(0);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
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
    queryKey: ["images", { id: show.id, type: "show" }],
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
  const ageRating = show.content_ratings.results.find(
    (r) => r.iso_3166_1 === "US",
  )?.rating;
  const trailer = show.videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );

  const isFavourite = favorites.includes(makeKey(show));
  const isInWatchlist = watchlist.includes(makeKey(show));
  const isSeen = seen.includes(makeKey(show));
  const hasReviewed = myReviews[makeKey(show)] !== undefined;

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles styles={{ body: { backgroundColor: "black" } }} />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.900",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
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
                <MovieHeader movie={show} />
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
                      : show.poster_path != null
                        ? `https://image.tmdb.org/t/p/original${show.poster_path}`
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
                    <Chip label={dateFormatter(show.first_air_date)} />
                    {ageRating != undefined ? (
                      <Chip label={ageRating} variant="outlined" />
                    ) : null}
                    {/* shows*/}
                    <Chip
                      label={
                        show.number_of_seasons +
                        (show.number_of_seasons === 1 ? " season" : " seasons")
                      }
                    />
                    <Chip label={show.number_of_episodes + " episodes"} />
                    {show.genres.map((g) => (
                      <Chip key={g.id} label={g.name} color="primary" />
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
                        if (isFavourite) removeFromFavorites(show);
                        else addToFavorites(show);
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
                        if (isInWatchlist) removeFromWatchlist(show);
                        else addToWatchlist(show);
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
                        if (isSeen) removeFromSeen(show);
                        else addToSeen(show);
                      }}
                    >
                      {isSeen ? "Mark as unseen" : "Mark as seen"}
                    </Button>
                    {/* trailer*/}
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
                      href={`${show.homepage}`}
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
                    {show.overview}
                  </Typography>

                  {/* creators */}
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "warning.light" }}
                  >
                    Created by
                  </Typography>
                  <Stack spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
                    {show.created_by.slice(0, 4).map((creator) => (
                      <Link
                        key={creator.id}
                        component={RouterLink}
                        to={`/people/${creator.id}`}
                        color="info.light"
                        underline="hover"
                        variant="body1"
                      >
                        {creator.name}
                      </Link>
                    ))}
                  </Stack>
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
                      <Typography variant="body1">{show.status}</Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Type
                      </Typography>
                      <Typography variant="body1">{show.showType}</Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                      >
                        Original language
                      </Typography>
                      <Typography variant="body1">
                        {show.original_language.toUpperCase()}
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
                        {show.vote_average.toFixed(2)}
                        {" average from "}
                        {show.vote_count}
                        {" votes"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "warning.light" }}
                        gutterBottom
                      >
                        Networks
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{ flexWrap: "wrap" }}
                      >
                        {show.networks.map((n) => (
                          <Chip
                            key={n.id}
                            label={n.name}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
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
                        {show.production_companies.map((com) => (
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
                    to={`/shows/${show.id}/credits`}
                    color="info.light"
                    underline="hover"
                  >
                    Full cast and crew
                  </Link>
                </Box>

                {/* aggregate_credits = cast across every season */}
                <Grid container columns={5} spacing={2}>
                  {show.aggregate_credits.cast.slice(0, 5).map((c) => (
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
                          {/* shows: a list of roles instead of one character */}
                          {c.roles[0]?.character}
                        </Typography>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Panel>
            </Grid>
            <Grid size={12}>
              {/* seasons */}
              <Panel>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: 2 }}
                >
                  Seasons
                </Typography>

                {/* one row that scrolls sideways instead of wrapping */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    padding: 0.5,
                    paddingBottom: 1.5,
                  }}
                >
                  {show.seasons.map((s) => (
                    <Box key={s.id} sx={{ width: 160, flexShrink: 0 }}>
                      <ButtonBase
                        onClick={() => {
                          setSelectedSeason(s.season_number);
                        }}
                        sx={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          borderRadius: 1,
                          padding: 0.5,
                          outline: "2px solid",
                          outlineColor:
                            s.season_number === selectedSeason
                              ? "warning.light"
                              : "transparent",
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            s.poster_path != undefined
                              ? `https://image.tmdb.org/t/p/w185` +
                                s.poster_path
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
                          {s.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "warning.light" }}
                        >
                          {s.episode_count +
                            " episodes" +
                            (s.air_date != null
                              ? " • " + s.air_date.slice(0, 4)
                              : "")}
                        </Typography>
                      </ButtonBase>
                    </Box>
                  ))}
                </Box>
                {selectedSeason !== null ? (
                  <SeasonEpisodes
                    show={show}
                    season={selectedSeason}
                    key={selectedSeason}
                  />
                ) : null}
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
                    to={`/shows/${show.id}/recommendations`}
                    color="info.light"
                    underline="hover"
                  >
                    See all
                  </Link>
                </Box>

                {show.recommendations.results.length !== 0 ? (
                  <Grid container columns={5} spacing={2}>
                    {show.recommendations.results.slice(0, 5).map((r) => (
                      <Grid size={1} key={r.id}>
                        <Link
                          component={RouterLink}
                          to={`/shows/${r.id}`}
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
                            {r.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "warning.light" }}
                          >
                            {(r.first_air_date
                              ? r.first_air_date.slice(0, 4)
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
                      movie={show}
                      onDone={() => setShowForm(false)}
                    />
                  ) : (
                    <MovieReviews movie={show} />
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

export default TemplateShowPage;
