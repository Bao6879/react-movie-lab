import React from "react";
import { useParams } from "react-router";
import PageTemplate from "../components/templatePersonPage";
import { getPerson } from "../api/tmdb-api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";

const PersonPage = () => {
  const { id } = useParams();
  const {
    data: person,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["person", { id: id }],
    queryFn: getPerson,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return <PageTemplate person={person} />;
};

export default PersonPage;
