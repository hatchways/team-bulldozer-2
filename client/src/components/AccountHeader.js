import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "40px",
    display: "flex",
  },
  button: {
    padding: "10px 40px",
    borderRadius: "5em",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "uppercase",
    color: "#5E6676",
    [theme.breakpoints.down("xs")]: {
      padding: "0px 20px",
    },
  },
  text: {
    marginRight: "20px",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: "3",
  },
}));

const AccountHeader = ({ title, buttonTitle, buttonUrl }) => {
  const classes = useStyles();
  let history = useHistory();

  const handleButtonClick = () => {
    history.push(buttonUrl);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.text}>
        {title}
      </Typography>
      <Button
        variant="outlined"
        className={classes.button}
        onClick={() => {
          handleButtonClick();
        }}
      >
        {buttonTitle}
      </Button>
    </div>
  );
};

AccountHeader.propTypes = {
  title: PropTypes.string,
  buttonTitle: PropTypes.string,
};

export default AccountHeader;
