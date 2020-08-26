import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AvatarImg from "../assets/images/avatar.png";
import Logo from "../assets/images/logo.png";
import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import { UserContext } from "../utils/context/userContext";

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

const AppHeader = () => {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  const { userData, setUserData } = useContext(UserContext);
  return (
    <AppBar position="absolute" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={Logo} />
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
        <Avatar
          alt="Remy Sharp"
          src={AvatarImg}
          className={classes.avatarImg}
        />
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
