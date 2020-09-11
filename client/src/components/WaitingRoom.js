import React, { useState, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import InterviewApi from "../utils/api/interview";
import { UserContext } from "../utils/context/userContext";
import copy from "copy-to-clipboard";
import io from "socket.io-client";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import AvatarImg from "../assets/images/avatar.png";

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

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const WaitingRoom = (props) => {
  const classes = useStyles();
  const socket = useRef();
  const history = useHistory();
  const { path } = useParams();
  const [stateSnackbar, setStateSnackbar] = useState({ openSnackbar: false, SnackbarMessage: "" });
  const { openSnackbar, SnackbarMessage } = stateSnackbar;
  const { onClose, open, interviewParam, isSharedLink } = props;
  const { userData } = useContext(UserContext);
  const [interview, setInterview] = useState({});
  const [link, setLink] = useState();
  const [participant, setParticipant] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const AppUrl = process.env.REACT_APP_APP_URL;
  const SocketUrl = process.env.REACT_APP_SOCKET_URL;
  let pathKey;
  isSharedLink ? (pathKey = path) : (pathKey = interviewParam.path);

  // when user join the interview room
  const joinInterview = async (path) => {
    let status;
    InterviewApi.joinInterview(path)
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 200) {
          setInterview(res);
          checkIfParticipantExist(res);
          setLink(AppUrl + "/room/" + res.path)
          connectSocket(res);
          setIsLoaded(true);
        } else {
          handleErrorJoin(res.errors)
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // redirect user to dashboard or close dialog with alert message
  const handleErrorJoin = (message) => {
    if (!isSharedLink) {
      handleClose();
      setStateSnackbar({ openSnackbar: true, SnackbarMessage: message });
    } else {
      history.push({
        pathname: "/dashboard",
        state: { detail: { openSnackbar: true, SnackbarMessage: message } },
      });
    }
  };

  // remove user from interview participants 
  const exitInterview = async (path) => {
    let status;
    InterviewApi.exitInterview(path)
      .then((res) => {
        status = res.status;
        if (status < 500) return res.text();
        else throw Error("Server error");
      })
      .then((res) => {
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // redirect users to interview page after click on start
  const startInterview = (interview) => {
    history.push({
      pathname: "/interview",
      state: { detail: interview },
    });
  };

  // emit socket event on click on start
  const clickStartInterview = () => {
    socket.current.emit("onStartInterview", interview);
  };

  // set participant if already exist in interview
  const checkIfParticipantExist = (interview) => {
    let participantObj = interview.participants.find(
      (o) => o._id !== userData.user._id
    );
    if (participantObj) {
      const participantName = participantObj.firstName + " " + participantObj.lastName;
      setParticipant(participantName);
    }
  };

  // connect to socket and handle socket events
  const connectSocket = (interview) => {
    socket.current = io.connect(SocketUrl, {
      query: `room=${interview._id}`,
    });
    socket.current.on("join", (data) => {
      if (data.id !== userData.user._id) {
        setParticipant(data.name);
      }
      setInterview(data.interview);
    });
    socket.current.on("exit", (data) => {
      setParticipant(false);
    });
    socket.current.on("startInterview", (data) => {
      startInterview(data);
    });
  };

  // on enter dialog
  const onEnterDialog = () => {
    joinInterview(pathKey);
  };

  // copie link to clipboard
  const copieLink = () => {
    copy(link);
  };

  // on exit dialog 
  const onExitDialog = () => {
    exitInterview(pathKey);
  };

  // handle close dialog
  const handleClose = () => {
    onClose();
  };

  // close snackbar alert
  const handleCloseSnackbar = () => {
    setStateSnackbar({ openSnackbar: false });
  };

  return (
    <>
      <Dialog
        onClose={!isSharedLink ? handleClose : null}
        open={open}
        maxWidth="md"
        onEnter={onEnterDialog}
        onExit={onExitDialog}
      >
        {isLoaded && (
          <div className={classes.dialogContainer}>
            {!isSharedLink && (
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <Typography component="h5" variant="h5" className={classes.title}>
              Waiting Room
            </Typography>
            {userData.user._id === interview.owner._id && (
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
                      value={link}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={copieLink}
                  >
                    Copy
                </Button>
                </div>
              </div>
            )}
            <Typography
              component="h5"
              variant="h5"
              className={classes.participantTitle}
            >
              Participants
            </Typography>
            <div className={classes.participantContainer}>
              {participant && (
                <div className={classes.participantItem}>
                  <Avatar
                    alt={participant + "image"}
                    src={AvatarImg}
                    className={classes.avatarImg}
                  />
                  <Typography
                    component="h5"
                    variant="h5"
                    className={classes.participantName}
                  >
                    {participant}
                  </Typography>
                </div>
              )}

              <div className={classes.participantItem}>
                <Avatar
                  alt={
                    userData.user.firstName +
                    " " +
                    userData.user.lastName +
                    "image"
                  }
                  src={AvatarImg}
                  className={classes.avatarImg}
                />
                <Typography
                  component="h5"
                  variant="h5"
                  className={classes.participantName}
                >
                  {userData.user.firstName + " " + userData.user.lastName}
                </Typography>
              </div>
            </div>
            {participant && userData.user._id === interview.owner._id && (
              <div className={classes.createButtonContainer}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={clickStartInterview}
                >
                  Start
              </Button>
              </div>
            )}
          </div>
        )}
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {SnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

WaitingRoom.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  isSharedLink: PropTypes.bool,
  interviewParam: PropTypes.object,
};

WaitingRoom.defaultProps = {
  isSharedLink: true,
};

export default WaitingRoom;
