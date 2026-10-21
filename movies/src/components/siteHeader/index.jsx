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

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  const menuOptions = [
    { label: "Home", path: "/" },
    { label: "Favorites", path: "/movies/favorites" },
    { label: "Upcoming", path: "/movies/upcoming" },
    { label: "Watchlist", path: "/movies/watchlist" },
  ];

  const handleMenuSelect = (pageURL) => {
    setAnchorEl(null);
    navigate(pageURL);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
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
              onClick={() => handleMenuSelect("/")}
              startIcon={
                location.pathname == "/" ? <TheaterComedyIcon /> : <MovieIcon />
              }
              sx={headerButtonSx}
            >
              TV Shows
            </Button>
            <Button
              key=""
              variant="text"
              color="inherit"
              onClick={() => handleMenuSelect("/")}
              startIcon={<ArrowDropDownCircleIcon />}
              sx={headerButtonSx}
            >
              Discover
            </Button>
            <Button
              key=""
              variant="text"
              color="inherit"
              onClick={() => handleMenuSelect("/")}
              startIcon={<PeopleIcon />}
              sx={headerButtonSx}
            >
              People
            </Button>
            <Button
              key=""
              variant="text"
              color="inherit"
              onClick={() => handleMenuSelect("/")}
              startIcon={<MiscellaneousServicesIcon />}
              sx={headerButtonSx}
            >
              Misc.
            </Button>
            <IconButton
              key=""
              color="inherit"
              onClick={() => handleMenuSelect("/")}
              sx={headerButtonSx}
            >
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
