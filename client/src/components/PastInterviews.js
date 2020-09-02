import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  item: {
    width: "100%",
    height: "auto",
    display: "flex",
    backgroundColor: "#FFFFFF",
    padding: "30px 20px 30px 20px",
    borderBottom: "1px solid #D4D9E2",
  },
  lastItem: {
    width: "100%",
    height: "auto",
    display: "flex",
    backgroundColor: "#FFFFFF",
    padding: "30px 20px 30px 20px",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  itemContent: {
    width: "33%",
  },
  headerTitle: {
    width: "33%",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 22,
  },
  button: {
    padding: "10px 30px",
    borderRadius: "5em",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "uppercase",
    color: "#5E6676",
    marginRight: 10,
  },
  headerCard: {
    backgroundColor: "#516BF6",
    width: "100%",
    height: "50px",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    padding: "15px 20px",
    display: "flex",
  },
}));

const PastInterviews = ({ pastInterviewsList }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.headerCard}>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Held on
          </Typography>
        </div>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Codding
          </Typography>
        </div>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Communication
          </Typography>
        </div>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Questions
          </Typography>
        </div>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Detailed feedback
          </Typography>
        </div>
      </div>
      {pastInterviewsList.map((value, index) => {
        return (
          <div
            className={
              index === pastInterviewsList.length - 1
                ? classes.lastItem
                : classes.item
            }
            key={index}
          >
            <div className={classes.itemContent}>
              <Typography component="h6" variant="h6" color="inherit">
                {value.date}
              </Typography>
            </div>
            <div className={classes.itemContent}>
              <Rating
                name="half-rating-read"
                defaultValue={value.codding}
                precision={0.5}
                readOnly
              />
            </div>
            <div className={classes.itemContent}>
              <Rating
                name="half-rating-read"
                defaultValue={value.communication}
                precision={0.5}
                readOnly
              />
            </div>
            <div className={classes.itemContent}>
              <Button variant="outlined" className={classes.button}>
                View
              </Button>
            </div>
            <div className={classes.itemContent}>
              <Button variant="outlined" className={classes.button}>
                View
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

PastInterviews.propTypes = {
  pastInterviewsList: PropTypes.array.isRequired,
};

export default PastInterviews;
