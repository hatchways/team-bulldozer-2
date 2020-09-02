import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import UpcomingInterviews from "../components/UpcomingInterviews";
import PastInterviews from "../components/PastInterviews";
import CreateInterview from "../components/CreateInterview";
import InterviewApi from "../utils/api/interview";

const useStyles = makeStyles((theme) => ({
  titleCard: {
    color: "#516BF6",
    marginBottom: 40,
    textAlign: "center",
  },
  content: {},
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  appBarSpacer: theme.mixins.toolbar,
  pastInterviewsContainer: {
    marginTop: theme.spacing(10),
    width: "100%",
  },
  upcomingInterviewsContainer: {
    marginTop: theme.spacing(5),
    width: "100%",
  },
  startButton: {
    padding: "10px 40px",
    borderRadius: "5em",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "uppercase",
    marginRight: 10,
    color: "#516BF6",
    "&:hover": {
      backgroundColor: "#516BF6",
      color: "#FFFFFF",
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [openCreateInterview, setOpenCreateInterview] = useState(false);
  const [interviewList, setInterviewList] = useState({
    upcoming: [],
    passed: [],
  });

  const handleClickOpenCreateInterview = () => {
    setOpenCreateInterview(true);
  };

  const handleCloseCreateInterview = () => {
    setOpenCreateInterview(false);
  };

  const getInterviewList = async () => {
    let status;
    InterviewApi.getListInterviews()
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 200) {
          setInterviewList(res);
        } else {
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSendCreateInterview = (value) => {
    setOpenCreateInterview(false);
    let status;
    InterviewApi.createInterview(value)
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 201) {
          getInterviewList();
        } else {
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getInterviewList();
  }, []);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            className={classes.startButton}
            onClick={handleClickOpenCreateInterview}
          >
            Start
          </Button>
          <CreateInterview
            open={openCreateInterview}
            onClose={handleCloseCreateInterview}
            onSend={handleSendCreateInterview}
          ></CreateInterview>
          <div className={classes.upcomingInterviewsContainer}>
            <Typography
              component="h4"
              variant="h4"
              className={classes.titleCard}
            >
              Upcoming practice interviews
            </Typography>
            <UpcomingInterviews
              upcomingInterviewsList={interviewList.upcoming}
            ></UpcomingInterviews>
          </div>
          <div className={classes.pastInterviewsContainer}>
            <Typography
              component="h4"
              variant="h4"
              className={classes.titleCard}
            >
              Past practice interviews
            </Typography>
            <PastInterviews
              pastInterviewsList={interviewList.passed}
            ></PastInterviews>
          </div>
        </Grid>
      </Container>
    </main>
  );
};

export default Dashboard;
