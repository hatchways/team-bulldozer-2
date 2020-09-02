import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import WaitingRoom from "../components/WaitingRoom";

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

const UpcomingInterviews = ({ upcomingInterviewsList }) => {
  const classes = useStyles();

  const [openWaitingRoom, setOpenWaitingRoom] = useState(false);

  const handleClickOpenWaitingRoom = () => {
    setOpenWaitingRoom(true);
  };

  const handleCloseWaitingRoom = (value) => {
    setOpenWaitingRoom(false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerCard}>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Interview title
          </Typography>
        </div>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Difficulty level
          </Typography>
        </div>
        <div className={classes.headerTitle}>
          <Typography component="h6" variant="h6" color="inherit">
            Action
          </Typography>
        </div>
      </div>
      {upcomingInterviewsList.map((value, index) => {
        return (
          <div
            className={
              index === upcomingInterviewsList.length - 1
                ? classes.lastItem
                : classes.item
            }
            key={index}
          >
            <div className={classes.itemContent}>
              <Typography component="h6" variant="h6" color="inherit">
                <Link>{value.title}</Link>
              </Typography>
            </div>
            <div className={classes.itemContent}>
              <Typography component="h6" variant="h6" color="inherit">
                {value.level.name}
              </Typography>
            </div>
            <div className={classes.itemContent}>
              <Button variant="outlined" className={classes.button}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                className={classes.button}
                onClick={handleClickOpenWaitingRoom}
              >
                Join
              </Button>
              <WaitingRoom
                open={openWaitingRoom}
                onClose={handleCloseWaitingRoom}
              ></WaitingRoom>
            </div>
          </div>
        );
      })}
    </div>
  );
};

UpcomingInterviews.propTypes = {
  upcomingInterviewsList: PropTypes.array.isRequired,
};

export default UpcomingInterviews;
