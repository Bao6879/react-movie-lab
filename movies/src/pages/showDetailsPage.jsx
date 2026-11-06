import React from "react";
import { useParams } from "react-router";
import PageTemplate from "../components/templateShowPage";
import { getShow } from "../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";

const ShowPage = () => {
  const { id } = useParams();
  const {
    data: show,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["show", { id: id }],
    queryFn: getShow,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return <PageTemplate show={show} />;
};

export default ShowPage;
