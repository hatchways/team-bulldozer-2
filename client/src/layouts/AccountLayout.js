import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import AccountHeader from "../components/AccountHeader";
import BackgroundAccount from "../assets/images/account.png";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${BackgroundAccount})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  gridHeader: {
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
    },
  },
}));

const AccountLayout = ({ children, titleHeader, buttonTitleHeader }) => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={3} md={4} className={classes.image} />
      <Grid item xs={12} sm={9} md={8} component={Paper} elevation={6} square>
        <Grid
          container
          direction="row"
          alignItems="center"
          className={classes.gridHeader}
        >
          <AccountHeader title={titleHeader} buttonTitle={buttonTitleHeader} />
        </Grid>
        {children}
      </Grid>
    </Grid>
  );
};

AccountLayout.propTypes = {
  children: PropTypes.element.isRequired,
  titleHeader: PropTypes.string,
  buttonTitleHeader: PropTypes.string,
};

AccountLayout.defaultProps = {
  titleHeader: null,
  buttonTitleHeader: null,
};

export default AccountLayout;
