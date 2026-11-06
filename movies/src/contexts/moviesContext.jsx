import React, { useState } from "react";

export const MoviesContext = React.createContext(null);

// Movie and show ids overlap on TMDB (movie 1396 and show 1396 are different things),
// so the lists store "movie-550" / "show-1396" instead of bare ids.
// Movies from getMovie have no type, so anything that isn't a show counts as a movie.
export const makeKey = (item) => {
  if (item.type === "show") {
    return "show-" + item.id;
  }
  return "movie-" + item.id;
};

const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState([]);
  const [seen, setSeen] = useState([]);
  const [myReviews, setMyReviews] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [reviewCount, setReviewCount] = useState(0); //Will be used for the account stuff later.
  let [discoverState, setDiscoverState] = useState(1);

  const addToFavorites = (movie) => {
    let newFavorites = [];
    if (!favorites.includes(makeKey(movie))) {
      newFavorites = [...favorites, makeKey(movie)];
    } else {
      newFavorites = [...favorites];
    }
    setFavorites(newFavorites);
  };

  const addToSeen = (movie) => {
    let newSeen = [];
    if (!seen.includes(makeKey(movie))) {
      newSeen = [...seen, makeKey(movie)];
    } else {
      newSeen = [...seen];
    }
    setSeen(newSeen);
  };

  const addReview = (movie, review) => {
    setMyReviews({ ...myReviews, [makeKey(movie)]: review });
  };

  const addToWatchlist = (movie) => {
    let newWatchlist = [];
    if (!watchlist.includes(makeKey(movie))) {
      newWatchlist = [...watchlist, makeKey(movie)];
    } else {
      newWatchlist = [...watchlist];
    }
    setWatchlist(newWatchlist);
  };

  const changeDiscoverState = (number) => {
    setDiscoverState(number);
  };

  const changeReviewCount = (number) => {
    setReviewCount(number);
  };

  const changeSearchValue = (value) => {
    setSearchValue(value);
  };

  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((key) => key !== makeKey(movie)));
  };

  const removeFromSeen = (movie) => {
    setSeen(seen.filter((key) => key !== makeKey(movie)));
  };

  const removeFromWatchlist = (movie) => {
    setWatchlist(watchlist.filter((key) => key !== makeKey(movie)));
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        watchlist,
        seen,
        discoverState,
        searchValue,
        reviewCount,
        myReviews,
        addToFavorites,
        addToWatchlist,
        addToSeen,
        removeFromFavorites,
        removeFromWatchlist,
        removeFromSeen,
        addReview,
        changeDiscoverState,
        changeSearchValue,
        changeReviewCount,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
