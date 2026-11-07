const PAGES = 20;

const fetchPages = (url) => {
  const requests = [];
  for (let page = 1; page <= PAGES; page++) {
    requests.push(
      fetch(`${url}&page=${page}`).then((response) => {
        if (!response.ok) {
          throw new Error("Page " + page + " failed");
        }
        return response.json();
      }),
    );
  }

  return Promise.all(requests).then((pages) => {
    let all = [];
    for (const pageData of pages) {
      all = [...all, ...pageData.results];
    }

    let finalData = [];
    const seenIds = new Set();
    for (let i = 0; i < all.length; i++) {
      if (!seenIds.has(all[i].id)) {
        seenIds.add(all[i].id);
        finalData.push(all[i]);
      }
    }

    return { ...pages[0], results: finalData };
  });
};

export const getMovies = (args) => {
  const [, categoryPart] = args.queryKey;
  const { category } = categoryPart;

  let path = "discover/movie";
  if (category === "playing") {
    path = "movie/now_playing";
  } else if (category === "top") {
    path = "movie/top_rated";
  } else if (category === "upcoming") {
    path = "movie/upcoming";
  }

  return fetchPages(
    `https://api.themoviedb.org/3/${path}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`,
  ).then((data) => ({
    ...data,
    results: data.results.map((movie) => ({
      ...movie,
      date: movie.release_date,
      image: movie.poster_path,
      type: "movie",
    })),
  }));
};

export const getShows = (args) => {
  const [, categoryPart] = args.queryKey;
  const { category } = categoryPart;

  let path = "discover/tv";
  if (category === "playing") {
    path = "tv/airing_today";
  } else if (category === "top") {
    path = "tv/top_rated";
  } else if (category === "upcoming") {
    path = "tv/on_the_air";
  }

  return fetchPages(
    `https://api.themoviedb.org/3/${path}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&include_null_first_air_dates=false`,
  ).then((data) => ({
    ...data,
    results: data.results.map((show) => ({
      ...show,
      title: show.name,
      date: show.first_air_date,
      image: show.poster_path,
      type: "show",
    })),
  }));
};

export const getPeople = () => {
  return fetchPages(
    `https://api.themoviedb.org/3/person/popular?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`,
  ).then((data) => ({
    ...data,
    results: data.results.map((person) => ({
      ...person,
      title: person.name,
      image: person.profile_path,
      type: "person",
    })),
  }));
};

export const getMovie = (args) => {
  const [, idPart] = args.queryKey;
  const { id } = idPart;
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=credits,recommendations,videos,release_dates`,
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .then((movie) => ({
      ...movie,
      date: movie.release_date,
      image: movie.poster_path,
      type: "movie",
    }))
    .catch((error) => {
      throw error;
    });
};

export const getPerson = (args) => {
  const [, idPart] = args.queryKey;
  const { id } = idPart;
  return fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=combined_credits`,
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .then((person) => ({
      ...person,
      // same names as the other fetchers, so the header works
      title: person.name,
      type: "person",
    }))
    .catch((error) => {
      throw error;
    });
};

export const getShow = (args) => {
  const [, idPart] = args.queryKey;
  const { id } = idPart;
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=aggregate_credits,recommendations,videos,content_ratings`,
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .then((show) => ({
      ...show,
      title: show.name,
      date: show.first_air_date,
      showType: show.type,
      type: "show",
    }))
    .catch((error) => {
      throw error;
    });
};

export const getGenres = () => {
  return fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
      import.meta.env.VITE_TMDB_KEY +
      "&language=en-US",
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getGenresShows = () => {
  return fetch(
    "https://api.themoviedb.org/3/genre/tv/list?api_key=" +
      import.meta.env.VITE_TMDB_KEY +
      "&language=en-US",
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getMovieImages = ({ queryKey }) => {
  const [, idPart] = queryKey;
  const { id, type = "movie" } = idPart;
  // TMDB calls shows "tv" in its URLs
  let path = type;
  if (type === "show") {
    path = "tv";
  }
  return fetch(
    `https://api.themoviedb.org/3/${path}/${id}/images?api_key=${import.meta.env.VITE_TMDB_KEY}`,
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getSeason = ({ queryKey }) => {
  const [, idPart] = queryKey;
  const { id, season } = idPart;
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${import.meta.env.VITE_TMDB_KEY}`,
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getMovieReviews = ({ queryKey }) => {
  const [, idPart] = queryKey;
  const { id, type = "movie" } = idPart;
  // TMDB calls shows "tv" in its URLs
  let path = type;
  if (type === "show") {
    path = "tv";
  }
  return fetch(
    `https://api.themoviedb.org/3/${path}/${id}/reviews?api_key=${import.meta.env.VITE_TMDB_KEY}`,
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.status_message || "Something went wrong");
        });
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};
