import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { userContext } from "../utils/context/userContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
  },
  titleCard: {
    color: "#516BF6",
    marginBottom: 40,
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
  content: {},
  container: {
    paddingTop: theme.spacing(20),
    paddingBottom: theme.spacing(10),
  },
  appBarSpacer: theme.mixins.toolbar,
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
    padding: "10px 40px",
    borderRadius: "5em",
    fontWeight: "600",
    fontSize: 13,
    textTransform: "uppercase",
    color: "#5E6676",
    marginRight: 10,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const elements = [
    { date: "Monday, May 25, 2020", link: "Simple Array Sum" },
    { date: "Monday, May 25, 2020", link: "Simple Array Sum" },
    { date: "Monday, May 25, 2020", link: "Simple Array Sum" },
  ];
  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography
              component="h4"
              variant="h4"
              className={classes.titleCard}
            >
              Upcoming practice interviews
            </Typography>
            <div className={classes.headerCard}>
              <div className={classes.headerTitle}>
                <Typography component="h6" variant="h6" color="inherit">
                  When
                </Typography>
              </div>
              <div className={classes.headerTitle}>
                <Typography component="h6" variant="h6" color="inherit">
                  Interview theme
                </Typography>
              </div>
              <div className={classes.headerTitle}>
                <Typography component="h6" variant="h6" color="inherit">
                  Action
                </Typography>
              </div>
            </div>
            {elements.map((value, index) => {
              return (
                <div
                  className={
                    index == elements.length - 1
                      ? classes.lastItem
                      : classes.item
                  }
                >
                  <div className={classes.itemContent}>
                    <Typography component="h6" variant="h6" color="inherit">
                      {value.date}
                    </Typography>
                  </div>
                  <div className={classes.itemContent}>
                    <Typography component="h6" variant="h6" color="inherit">
                      <Link href="#">{value.link}</Link>
                    </Typography>
                  </div>
                  <div className={classes.itemContent}>
                    <Button variant="outlined" className={classes.button}>
                      Cancel
                    </Button>
                    <Button variant="outlined" className={classes.button}>
                      Join
                    </Button>
                  </div>
                </div>
              );
            })}
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
