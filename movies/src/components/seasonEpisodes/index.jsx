import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { getSeason } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";
import img from "../../images/film-poster-placeholder.png";
import { dateFormatter } from "../../util";

export default function SeasonEpisodes({ show, season }) {
  const [page, setPage] = useState(1);

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["season", { id: show.id, season: season }],
    queryFn: getSeason,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const episodes = data.episodes;
  const pageEpisodes = episodes.slice((page - 1) * 5, page * 5);
  const pageCount = Math.ceil(episodes.length / 5);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" component="h3" sx={{ marginBottom: 2 }}>
        {data.name}
      </Typography>

      <Stack divider={<Divider flexItem />} spacing={2}>
        {pageEpisodes.map((e) => (
          <Box key={e.id} sx={{ display: "flex", gap: 2 }}>
            <Box
              component="img"
              src={
                e.still_path != undefined
                  ? `https://image.tmdb.org/t/p/w300` + e.still_path
                  : img
              }
              sx={{
                width: 220,
                flexShrink: 0,
                aspectRatio: "16 / 9",
                objectFit: "cover",
                display: "block",
                borderRadius: 1,
              }}
            />

            {/* right: text */}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {"E" + e.episode_number + " • " + e.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "warning.light" }}>
                {dateFormatter(e.air_date) +
                  " • " +
                  e.runtime +
                  " m  • " +
                  e.vote_average.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {e.overview}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(event, value) => {
            setPage(value);
          }}
        />
      </Box>
    </Box>
  );
}
