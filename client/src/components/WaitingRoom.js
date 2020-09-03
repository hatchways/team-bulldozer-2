import React, { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AvatarImg from "../assets/images/avatar.png";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import InterviewApi from "../utils/api/interview";
import { UserContext } from "../utils/context/userContext";
import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  title: {
    color: "#516BF6",
    fontWeight: 600,
    marginBottom: 30,
  },
  participantTitle: {
    color: "#516BF6",
    fontWeight: 600,
    fontSize: 20,
    marginTop: 30,
  },
  dialogContainer: {
    padding: "50px 60px",
  },
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: 200,
  },
  createButtonContainer: {
    marginTop: theme.spacing(3),
  },
  button: {
    borderRadius: "5em",
    padding: "15px 50px",
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  linkSection: {
    display: "flex",
  },
  linkTextField: {
    width: 400,
    marginRight: 40,
  },
  participantContainer: {
    border: "1px solid #D4D9E2",
    borderRadius: 6,
    width: 700,
    padding: "20px 40px",
    marginTop: 10,
  },
  participantItem: {
    display: "flex",
    marginTop: 10,
  },
  participantName: {
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 2.5,
  },
  avatarImg: {
    marginRight: 10,
  },
}));

const WaitingRoom = (props) => {
  const classes = useStyles();
  const socket = useRef();
  const { onClose, open, interviewParam } = props;
  const { userData } = useContext(UserContext);
  const [interview, setInterview] = useState({});
  let params = useParams();

  const handleClose = () => {
    onClose();
  };

  const getInterviewDetails = async () => {
    let status;
    let pathName;

    interviewParam
      ? (pathName = interviewParam.path)
      : (pathName = params.path);

    InterviewApi.getDetailsByPath(pathName)
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 200) {
          setInterview(res);
        } else {
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    socket.current = io.connect("/");
    if (interviewParam) {
      setInterview(interviewParam);
    } else {
      getInterviewDetails();
    }
    socket.current.on("allUsers", (users) => {
      console.log("users :>> ", users);
    });
  }, []);

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md">
      {onClose && (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      <div className={classes.dialogContainer}>
        <Typography component="h5" variant="h5" className={classes.title}>
          Waiting Room
        </Typography>
        <div className={classes.linkContainer}>
          <Typography component="h6" variant="h6" className={classes.label}>
            Share link
          </Typography>
          <div className={classes.linkSection}>
            <div className={classes.linkTextField}>
              <TextField
                variant="outlined"
                className={classes.input}
                fullWidth
                id="link"
                placeholder="https://interview.io/sWhtjLds"
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Copy
            </Button>
          </div>
        </div>
        <Typography
          component="h5"
          variant="h5"
          className={classes.participantTitle}
        >
          Participants
        </Typography>
        <div className={classes.participantContainer}>
          <div className={classes.participantItem}>
            <Avatar
              alt="Remy Sharp"
              src={AvatarImg}
              className={classes.avatarImg}
            />
            <Typography
              component="h5"
              variant="h5"
              className={classes.participantName}
            >
              Participants
            </Typography>
          </div>
          <div className={classes.participantItem}>
            <Avatar
              alt="Remy Sharp"
              src={AvatarImg}
              className={classes.avatarImg}
            />
            <Typography
              component="h5"
              variant="h5"
              className={classes.participantName}
            >
              Participants
            </Typography>
          </div>
        </div>

        <div className={classes.createButtonContainer}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Start
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

WaitingRoom.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  interviewParam: PropTypes.object,
};

export default WaitingRoom;
