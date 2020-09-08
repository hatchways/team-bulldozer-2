import React, { useContext, useState } from "react";
import { Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AvatarImg from "../assets/images/avatar.png";
import Logo from "../assets/images/logo.png";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { UserContext } from "../utils/context/userContext";
import AuthApi from "../utils/api/auth";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  logo: {
    width: 70,
    height: 70,
  },
  logoContainer: {
    flexGrow: 1,
  },
  links: {
    flexGrow: 0.1,
    color: "#5E6676",
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "22px",
    letterSpacing: "-0.5px",
  },
  appBar: {
    backgroundColor: "#FFFFFF",
    boxShadow: "unset",
  },
  avatarName: {
    color: "#5E6676",
    marginLeft: 10,
    marginRight: 50,
  },
  avatarImg: {
    marginLeft: 100,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    marginTop: 5,
    marginLeft: 30
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

const AppHeader = () => {
  const classes = useStyles();
  let history = useHistory();
  const preventDefault = (event) => event.preventDefault();
  const [avatarMenu, setAvatarMenu] = useState(null);
  const { userData, setUserData } = useContext(UserContext);

  const handleClickAvatarMenu = (event) => {
    setAvatarMenu(event.currentTarget);
  };

  const handleCloseAvatarMenu = () => {
    setAvatarMenu(null);
  };

  const logoutUser = () => {
    let status;
    AuthApi.logout()
      .then((res) => {
        status = res.status;
        if (status < 500) return res.text();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 200) {
          setUserData(false)
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <AppBar position="absolute" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={Logo} alt="logo" />
        </div>
        <Link
          href="#"
          onClick={preventDefault}
          color="primary"
          className={classes.links}
        >
          Dashboard
        </Link>
        <Link
          href="#"
          onClick={preventDefault}
          color="inherit"
          className={classes.links}
        >
          Blog
        </Link>
        <Link
          href="#"
          onClick={preventDefault}
          color="inherit"
          className={classes.links}
        >
          Faq
        </Link>
        <div>
          <Avatar
            alt={
              userData.user
                ? userData.user.firstName +
                " " +
                userData.user.lastName +
                " image"
                : null
            }
            src={AvatarImg}
            className={classes.avatarImg}
            onClick={handleClickAvatarMenu}
          />
          <StyledMenu
            id="user-menu"
            anchorEl={avatarMenu}
            keepMounted
            open={Boolean(avatarMenu)}
            onClose={handleCloseAvatarMenu}
          >
            <MenuItem onClick={handleCloseAvatarMenu}>Profile</MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>My account</MenuItem>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </StyledMenu>
        </div>
        <Typography
          component="h6"
          variant="h6"
          color="inherit"
          className={classes.avatarName}
        >
          {userData.user
            ? userData.user.firstName + " " + userData.user.lastName
            : null}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
