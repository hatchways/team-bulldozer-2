import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {},
});

const AppLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container>{children}</Container>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AppLayout;
