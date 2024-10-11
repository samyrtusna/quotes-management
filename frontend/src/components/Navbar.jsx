import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../features/authSlices";
import authService from "../service/authService";

import { useEffect, useState } from "react";

const pages = [
  { name: "Raw Products", route: "RawProducts" },
  { name: "Products", route: "Products" },
  { name: "Products family", route: "Productsfamilly" },
  { name: "Quotes", route: "Quotes" },
  { name: "Scraps", route: "Scraps" },
];
const settings = ["Signup", "Login", "Logout"];

function Navbar(props) {
  const { darkMode, setDarkMode, drawerOpen } = props;
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { user, token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    console.log("Token : ", token);
    try {
      await authService.logout({ token: token });
      dispatch(setLogout());
      navigate("/");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuClick = (setting) => {
    setAnchorElUser(null);
    if (setting === "Logout") {
      handleLogout();
      console.log("User logged out");
    } else {
      navigate(`/${setting.toLowerCase()}`);
    }
  };

  const avatarLetter =
    token && user?.username
      ? user.username.charAt(0) === user.username.charAt(0).toUpperCase()
        ? user.username.charAt(0)
        : user.username.charAt(0).toUpperCase()
      : "";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: { lg: "60%", md: "80%", sm: "100%" },
        marginLeft: drawerOpen ? "300px" : { lg: "20%", md: "10%" },
        transition: "width 0.3s, margin 0.3s",
        backgroundImage: darkMode
          ? 'url("/images/dark_Bg02.jpg")'
          : 'url("/images/background_01.jpg")',
        marginTop: "40px",
        height: "50px",
        borderRadius: "10px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HomeIcon
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              cursor: "pointer",
              color: darkMode ? "#ffffff" : "GrayText",
            }}
          />

          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "flex",
                sm: "none",
              },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon sx={{ color: darkMode ? "#ffffff" : "GrayText" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.route}
                  onClick={handleCloseNavMenu}
                  sx={{ bgcolor: "inherit" }}
                >
                  <Typography
                    textAlign="center"
                    sx={{ color: darkMode ? "#ffffff" : "GrayText" }}
                  >
                    <Link
                      to={`/${page.route}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {page.name}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <HomeIcon
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              cursor: "pointer",
              color: darkMode ? "#ffffff" : "GrayText",
            }}
          />

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.route}
                component={Link}
                to={`/${page.route}`}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: darkMode ? "#ffffff" : "GrayText",
                  display: "block",
                  textTransform: "none",
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <IconButton
            onClick={handleThemeChange}
            color="inherit"
          >
            {darkMode ? (
              <LightModeIcon sx={{ color: "#ffffff" }} />
            ) : (
              <DarkModeIcon sx={{ color: "GrayText" }} />
            )}
          </IconButton>
          <Box sx={{ flexGrow: 0 }}>
            {token ? (
              <Box>
                <Tooltip title="User Menu">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
                        color: "#ffffff",
                        "&:hover": {
                          bgcolor: darkMode ? "#3a4242" : "primary.main",
                        },
                      }}
                    >
                      {avatarLetter}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    key="logout"
                    onClick={() => handleUserMenuClick("Logout")}
                    sx={{ height: "20px" }}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ color: "GrayText" }}
                    >
                      logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                <Button
                  onClick={handleOpenUserMenu}
                  variant="text"
                  sx={{ color: "GrayText" }}
                >
                  <PersonIcon fontSize="large" />
                </Button>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => handleUserMenuClick("Login")}>
                    <Typography
                      textAlign="center"
                      sx={{ color: "GrayText" }}
                    >
                      Login
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleUserMenuClick("Signup")}>
                    <Typography
                      textAlign="center"
                      sx={{ color: "GrayText" }}
                    >
                      Signup
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
