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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlices";
import { useState } from "react";

const pages = [
  { name: "Raw Products", route: "RawProducts" },
  { name: "Products", route: "Products" },
  { name: "Products family", route: "Productsfamilly" },
  { name: "Quotes", route: "Quotes" },
  { name: "Scraps", route: "Scraps" },
];

const settings = ["Signup", "Login", "Logout"];

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { user, token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).then(navigate("/"));
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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HomeIcon
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              cursor: "pointer",
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
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
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.route}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">
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
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.route}
                component={Link}
                to={`/${page.route}`}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <IconButton
            onClick={handleThemeChange}
            color="inherit"
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="User Menu">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                {token ? (
                  <Avatar sx={{ bgcolor: "orange" }}>{avatarLetter}</Avatar>
                ) : (
                  <Avatar
                    alt="Default User"
                    src="/static/images/avatar/2.jpg"
                  />
                )}
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
              {settings.map((setting) =>
                (setting === "Signup" || setting === "Login") && !token ? (
                  <MenuItem
                    key={setting}
                    onClick={() => handleUserMenuClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ) : (
                  setting === "Logout" &&
                  token && (
                    <MenuItem
                      key={setting}
                      onClick={() => handleUserMenuClick(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  )
                )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
