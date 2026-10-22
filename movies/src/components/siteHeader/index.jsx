import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import {
  AccountCircle as AccountCircleIcon,
  ArrowDropDownCircle as ArrowDropDownCircleIcon,
  Check,
  Favorite as FavoriteIcon,
  MiscellaneousServices as MiscellaneousServicesIcon,
  Movie as MovieIcon,
  People as PeopleIcon,
  QuestionMark as QuestionMarkIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Shuffle as ShuffleIcon,
  Subscriptions as SubscriptionsIcon,
  TheaterComedy as TheaterComedyIcon,
} from "@mui/icons-material";

import { MoviesContext } from "../../contexts/moviesContext";
import tmpImg from "../../images/pexels-dziana-hasanbekava-5480827.jpg";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorDisc, setAnchorDisc] = useState(null);
  const [anchorMisc, setAnchorMisc] = useState(null);
  const [anchorAcc, setAnchorAcc] = useState(null);
  const { discoverState, changeDiscoverState } = useContext(MoviesContext);
  const { searchValue, changeSearchValue } = useContext(MoviesContext);
  const location = useLocation();
  const openMisc = Boolean(anchorMisc),
    openDisc = Boolean(anchorDisc),
    openAcc = Boolean(anchorAcc);

  const navigate = useNavigate();

  const handleTextChange = (event) => {
    changeSearchValue(event.target.value);
  };

  const constructPath = (url, state) => {
    if (state == 0) state = discoverState;
    switch (state) {
      case 1:
        return url + "/discover";
      case 2:
        return url + "/playing";
      case 3:
        return url + "/top";
      case 4:
        return url + "/upcoming";
      default:
        return url;
    }
  };

  const discoverStateOptions = [
    "Discover",
    "Now Playing",
    "Top Rated",
    "Upcoming",
  ];

  const handleDiscoverMenuSelect = (discoverType) => {
    setAnchorDisc(null);
    let start = "/movies";
    if (location.pathname.startsWith("/shows")) start = "/shows";
    changeDiscoverState(discoverType);
    console.log(constructPath(start, discoverType));
    navigate(constructPath(start, discoverType));
  };

  const handleAccMenuSelect = (url) => {
    setAnchorAcc(null);
    navigate(url);
  };

  const handleMenuMisc = (event) => {
    setAnchorMisc(event.currentTarget);
  };

  const handleCloseMisc = (event) => {
    setAnchorMisc(null);
  };

  const handleMenuDisc = (event) => {
    setAnchorDisc(event.currentTarget);
  };

  const handleCloseDisc = (event) => {
    setAnchorDisc(null);
  };

  const handleMenuAcc = (event) => {
    setAnchorAcc(event.currentTarget);
  };

  const handleCloseAcc = (event) => {
    setAnchorAcc(null);
  };

  const headerButtonSx = {
    height: 60,
    color: "white",
    margin: "auto",
    fontSize: 22,
    fontWeight: 600,
    padding: 0,

    transition: "transform 200ms ease, color 200ms ease",

    "&:hover": {
      transform: "translateY(-3px)",
      color: "yellow",
    },
  };

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: "dimgrey",
          borderRadius: 2,
          width: "99%",
          left: 0,
          right: 0,
          margin: "auto",
        }}
      >
        <Toolbar sx={{ display: "flex" }}>
          <Box
            component="img"
            src={tmpImg}
            sx={{
              height: 60,
              width: 120,
              boxShadow: 5,
              borderRadius: 5,
            }}
            edge="start"
          />
          <TextField
            id="name-search"
            label="Search for a movie"
            type="search"
            variant="filled"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              margin: 1.5,
              width: 1500,
              backgroundColor: "white",
              boxShadow: 5,
              borderRadius: 3,
            }}
            value={searchValue}
            onChange={handleTextChange}
          />
          <Toolbar
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              color="inherit"
              disableRipple
              startIcon={
                location.pathname.startsWith("/movies") ? (
                  <TheaterComedyIcon />
                ) : (
                  <MovieIcon />
                )
              }
              onClick={() => {
                if (location.pathname.startsWith("/movies"))
                  navigate(constructPath("/shows", 0));
                else navigate(constructPath("/movies", 0));
              }}
              sx={headerButtonSx}
            >
              {location.pathname.startsWith("/movies") ? "TV Shows" : "Movies"}
            </Button>
            <Button
              id="discoverSelect"
              disableRipple
              variant="text"
              color="inherit"
              onClick={handleMenuDisc}
              startIcon={<ArrowDropDownCircleIcon />}
              sx={headerButtonSx}
            >
              Discover
            </Button>

            <Menu
              id="discoverMenu"
              anchorEl={anchorDisc}
              onClose={handleCloseDisc}
              open={openDisc}
            >
              {discoverStateOptions.map((option, index) => (
                <MenuItem
                  onClick={() => handleDiscoverMenuSelect(index + 1)}
                  disabled={discoverState === index + 1}
                  sx={discoverState !== index + 1 ? { color: "black" } : {}}
                >
                  <ListItemIcon>
                    {discoverState === index + 1 ? (
                      <Check fontSize="small" />
                    ) : null}
                  </ListItemIcon>
                  {option}
                </MenuItem>
              ))}
            </Menu>

            <Button
              disableRipple
              variant="text"
              color="inherit"
              onClick={() => {
                navigate(constructPath("/people", -1));
              }}
              startIcon={<PeopleIcon />}
              sx={headerButtonSx}
            >
              People
            </Button>
            <Button
              variant="text"
              color="inherit"
              startIcon={<MiscellaneousServicesIcon />}
              onClick={handleMenuMisc}
              sx={headerButtonSx}
            >
              Misc.
            </Button>

            <Menu
              id="miscMenu"
              anchorEl={anchorMisc}
              onClose={handleCloseMisc}
              open={openMisc}
            >
              <MenuItem>
                <ListItemIcon>
                  <ShuffleIcon />
                </ListItemIcon>
                I'm Feeling Lucky
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <QuestionMarkIcon />
                </ListItemIcon>
                Quiz Mode
              </MenuItem>
            </Menu>
            <IconButton
              color="inherit"
              sx={headerButtonSx}
              onClick={handleMenuAcc}
            >
              <AccountCircleIcon sx={{ color: "white", fontSize: 50 }} />
            </IconButton>
            <Menu
              id="accMenu"
              anchorEl={anchorAcc}
              onClose={handleCloseAcc}
              open={openAcc}
            >
              <MenuItem onClick={() => handleAccMenuSelect("/favorites")}>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                Favorites
              </MenuItem>
              <MenuItem onClick={() => handleAccMenuSelect("/watchlist")}>
                <ListItemIcon>
                  <SubscriptionsIcon />
                </ListItemIcon>
                Watchlist
              </MenuItem>
              <MenuItem onClick={() => handleAccMenuSelect("/settings")}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                Settings
              </MenuItem>
            </Menu>
          </Toolbar>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;
