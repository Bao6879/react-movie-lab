import React, { useState } from "react";

export const MoviesContext = React.createContext(null);

const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState([]);
  const [myReviews, setMyReviews] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  let [discoverState, setDiscoverState] = useState(1);

  const addToFavorites = (movie) => {
    let newFavorites = [];
    if (!favorites.includes(movie.id)) {
      newFavorites = [...favorites, movie.id];
    } else {
      newFavorites = [...favorites];
    }
    setFavorites(newFavorites);
  };

  const addReview = (movie, review) => {
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  const addToWatchlist = (movie) => {
    let newWatchlist = [];
    if (!watchlist.includes(movie.id)) {
      newWatchlist = [...watchlist, movie.id];
    } else {
      newWatchlist = [...watchlist];
    }
    setWatchlist(newWatchlist);
  };

  const changeDiscoverState = (number) => {
    setDiscoverState(number);
  };

  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((mId) => mId !== movie.id));
  };

  const removeFromWatchlist = (movie) => {
    setWatchlist(watchlist.filter((mId) => mId !== movie.id));
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        watchlist,
        discoverState,
        addToFavorites,
        addToWatchlist,
        removeFromFavorites,
        removeFromWatchlist,
        addReview,
        changeDiscoverState,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
