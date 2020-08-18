import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "40px",
    display: "flex",
  },
  button: {
    padding: "10px 40px",
    borderRadius: "5em",
    fontWeight: "600",
    fontSize: "13px",
    textTransform: "uppercase",
    color: "#5E6676",
  },
  text: {
    marginRight: "20px",
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "3",
  },
}));

const AccountHeader = ({ title, buttonTitle }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.text}>
        {title}
      </Typography>
      <Button variant="outlined" className={classes.button}>
        {buttonTitle}
      </Button>
    </div>
  );
};

AccountHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
};

export default AccountHeader;
