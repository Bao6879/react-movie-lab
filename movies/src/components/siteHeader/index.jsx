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

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
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

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: "grey",
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
              width: 1000,
              backgroundColor: "white",
              boxShadow: 5,
              borderRadius: 1,
            }}
            // value={props.titleFilter}
            // onChange={handleTextChange}
          />
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleMenuSelect("/")}
            sx={{
              height: 60,
              borderRadius: 2,
              color: "black",
              marginLeft: "auto",
              marginRight: 0,
              boxShadow: 5,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            TV Shows
          </Button>
          <Button
            key=""
            variant="contained"
            color="inherit"
            onClick={() => handleMenuSelect("/")}
            sx={{
              height: 60,
              borderRadius: 2,
              color: "black",
              marginLeft: 2,
              marginRight: 0,
              boxShadow: 5,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Discover
          </Button>
          <Button
            key=""
            variant="contained"
            color="inherit"
            onClick={() => handleMenuSelect("/")}
            sx={{
              height: 60,
              borderRadius: 2,
              color: "black",
              marginLeft: 2,
              marginRight: 0,
              boxShadow: 5,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            People
          </Button>
          <Button
            key=""
            variant="contained"
            color="inherit"
            onClick={() => handleMenuSelect("/")}
            sx={{
              height: 60,
              borderRadius: 2,
              color: "black",
              marginLeft: 2,
              marginRight: 0,
              boxShadow: 5,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Miscellaneous
          </Button>
          <Button
            key=""
            variant="contained"
            color="inherit"
            onClick={() => handleMenuSelect("/")}
            sx={{
              height: 60,
              borderRadius: 2,
              color: "black",
              marginLeft: 2,
              marginRight: 0,
              boxShadow: 5,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Account
          </Button>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;
