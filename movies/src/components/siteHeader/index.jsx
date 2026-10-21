import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import tmpImg from "../../images/pexels-dziana-hasanbekava-5480827.jpg";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import MovieIcon from "@mui/icons-material/Movie";
import { useLocation } from "react-router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import PeopleIcon from "@mui/icons-material/People";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import { MoviesContext } from "../../contexts/moviesContext";
import { useContext } from "react";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { discoverState, changeDiscoverState } = useContext(MoviesContext);
  const location = useLocation();
  const open = Boolean(anchorEl);

  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

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
    }
  };

  const handleDiscoverMenuSelect = (discoverType) => {
    setAnchorEl(null);
    let start = "/movies";
    if (location.pathname.startsWith("/shows")) start = "/shows";
    changeDiscoverState(discoverType);
    console.log(constructPath(start, discoverType));
    navigate(constructPath(start, discoverType));
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
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
            // value={props.titleFilter}
            // onChange={handleTextChange}
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
              TV Shows
            </Button>
            <Button
              id="discoverSelect"
              disableRipple
              variant="text"
              color="inherit"
              onClick={handleMenu}
              startIcon={<ArrowDropDownCircleIcon />}
              sx={headerButtonSx}
            >
              Discover
            </Button>

            <Menu
              id="discoverMenu"
              anchorEl={anchorEl}
              onClose={handleClose}
              open={open}
            >
              <MenuItem
                onClick={() => handleDiscoverMenuSelect(1)}
                sx={
                  discoverState == 1
                    ? { color: "red", disabled: true }
                    : { color: "black" }
                }
              >
                Discover
              </MenuItem>
              <MenuItem
                onClick={() => handleDiscoverMenuSelect(2)}
                sx={
                  discoverState == 2
                    ? { color: "red", disabled: true }
                    : { color: "black" }
                }
              >
                Now Playing
              </MenuItem>
              <MenuItem
                onClick={() => handleDiscoverMenuSelect(3)}
                sx={
                  discoverState == 3
                    ? { color: "red", disabled: true }
                    : { color: "black" }
                }
              >
                Top Rated
              </MenuItem>
              <MenuItem
                onClick={() => handleDiscoverMenuSelect(4)}
                sx={
                  discoverState == 4
                    ? { color: "red", disabled: true }
                    : { color: "black" }
                }
              >
                Upcoming
              </MenuItem>
            </Menu>

            <Button
              disableRipple
              variant="text"
              color="inherit"
              startIcon={<PeopleIcon />}
              sx={headerButtonSx}
            >
              People
            </Button>
            <Button
              variant="text"
              color="inherit"
              startIcon={<MiscellaneousServicesIcon />}
              sx={headerButtonSx}
            >
              Misc.
            </Button>
            <IconButton key="" color="inherit" sx={headerButtonSx}>
              <AccountCircleIcon sx={{ color: "white", fontSize: 50 }} />
            </IconButton>
          </Toolbar>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;
