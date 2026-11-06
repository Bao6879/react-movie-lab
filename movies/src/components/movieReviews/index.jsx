import React, { useState, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";
import { Link as RouterLink } from "react-router";
import { getMovieReviews } from "../../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";
import { dateFormatter } from "../../util";

export default function MovieReviews({ movie }) {
  const [page, setPage] = useState(1);
  const { myReviews } = useContext(MoviesContext);

  const { data, error, isPending, isError } = useQuery({
    queryKey: ["reviews", { id: movie.id }],
    queryFn: getMovieReviews,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const myReview = myReviews[movie.id];
  let reviews = data.results;
  if (myReview !== undefined) {
    reviews = [myReview, ...data.results];
  }
  const pageReviews = reviews.slice((page - 1) * 5, page * 5);
  const pageCount = Math.ceil(reviews.length / 5);

  return (
    <Box>
      {reviews.length !== 0 ? (
        <>
          <Stack divider={<Divider flexItem />} spacing={2}>
            {pageReviews.map((r) => (
              <Box key={r.id}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {r.author}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "warning.light" }}>
                    {dateFormatter(r.created_at) +
                      (r.author_details.rating !== null
                        ? " • " + r.author_details.rating + "/10"
                        : "")}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    marginTop: 1,
                    whiteSpace: "pre-line",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {r.content}
                </Typography>

                <Link
                  component={RouterLink}
                  to={`/reviews/${r.id}`}
                  state={{ review: r, movie: movie }}
                  color="info.light"
                  underline="hover"
                  variant="body2"
                >
                  Read full review
                </Link>
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
        </>
      ) : (
        <Typography variant="h2">No reviews here.</Typography>
      )}
    </Box>
  );
}
