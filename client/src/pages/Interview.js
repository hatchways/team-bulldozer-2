import React, { useState, useEffect, useRef, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Peer from "simple-peer";
import AceEditor from "react-ace";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import { UserContext } from "../utils/context/userContext";
import io from "socket.io-client";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
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
  header: {
    backgroundColor: "#516BF6",
    display: "flex",
    width: "100%",
    height: "70px",
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
  code: {
    width: "100%",
    display: "flex",
  },
  video: {
    width: "90%",
    borderRadius: 10,
    float: "right",
    marginRight: "5px",
    marginTop: "5px",
  },
  partnerVideo: {
    width: "10%",
    position: "absolute",
    zIndex: 1,
    marginLeft: "11.5%",
    marginTop: "7.5%",
    borderRadius: 10,
  },
  videoContainer: {
    backgroundColor: "#272822",
  },
  console: {
    backgroundColor: "#272822",
  },
  consoleContainer: {
    padding: "30px 30px 30px 30px",
  },
  consoleHeader: {
    backgroundColor: "#434343",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 50,
  },
  consolecontent: {
    backgroundColor: "#4C4C4C",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    height: 100,
  },
  codeContent: {
    paddingTop: 10,
    paddingLeft: 10,
  },
  headerButton: {
    borderRadius: "5em",
    fontWeight: "500",
    fontSize: 13,
    textTransform: "uppercase",
    color: "#FFFFFF",
    border: "1px solid #FFFFFF",
    padding: "10px 20px;"
  },
  headerButtonContent: {
    lineHeight: "77px",
    marginRight: 10
  },
  headerTitleContent: {
    flexGrow: 1,
    lineHeight: "80px",
    marginLeft: 10
  },
  interviewTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "500",
    lineHeight: "unset"
  }
}));

const Interview = () => {
  const classes = useStyles();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const SocketUrl = process.env.REACT_APP_SOCKET_URL;
  const [participant, setparticipant] = useState({
    name: "",
    id: null
  });
  const [yourSocketID, setYourSocketID] = useState("");
  const [codeValue, setCodeValue] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const { userData } = useContext(UserContext);
  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    if (!location.state) {
      history.push("/dashboard");
    } else {
      let interview = location.state.detail;
      let participantObj = interview.participants.find(
        (o) => o._id !== userData.user._id
      );
      setparticipant({ id: participantObj._id, name: participantObj.firstName + ' ' + participantObj.lastName });
      socket.current = io.connect(SocketUrl, {
        query: `room=${interview._id}`,
      });
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
        });
      socket.current.on("changeCode", (data) => {
        setCodeValue(data.code);
      });
      socket.current.on("yourSocketID", (id) => {
        setYourSocketID(id);
      });
      socket.current.on("onCalling", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      });
    }
  }, [location]);

  const onChangeCode = (data) => {
    socket.current.emit("onChangeCode", {
      code: data,
    });
  };

  const handleClickEndInterview = () => {
  };

  const callParticipant = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "webrtc@live.com",
            credential: "muazkh",
          },
        ],
      },
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callParticipant", {
        signalData: data,
        from: yourSocketID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
  }

  const declineCall = () => {
    setReceivingCall(false);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video playsInline muted ref={userVideo} autoPlay className={classes.video} />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = <video playsInline ref={partnerVideo} autoPlay className={classes.partnerVideo} />;
  }

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <div className={classes.header}>
        <div className={classes.headerTitleContent}>
          <Typography
            component="h4"
            variant="h4"
            className={classes.interviewTitle}
          >
            Interview with {participant.name}
          </Typography>
        </div>
        <div className={classes.headerButtonContent}>
          <Button
            variant="outlined"
            size="small"
            className={classes.headerButton}
            onClick={() => callParticipant()}
          >
            Call participant
            </Button>
        </div>
        <div className={classes.headerButtonContent}>
          <Button
            variant="outlined"
            size="small"
            className={classes.headerButton}
            onClick={handleClickEndInterview()}
          >
            End Interview
        </Button>
        </div>
      </div>
      <Grid container>
        <Grid item xs={12} sm={4} className={classes.question}></Grid>
        <Grid item xs={12} sm={8} className={classes.editor}>
          <Grid item xs={12} sm={12} className={classes.code}>
            <Grid item xs={12} sm={8}>
              <AceEditor
                mode="javascript"
                theme="monokai"
                onChange={onChangeCode}
                showPrintMargin={false}
                showGutter={false}
                name="UNIQUE_ID_OF_DIV"
                wrapEnabled={true}
                width="100%"
                height="60vh"
                className={classes.codeContent}
                value={codeValue}
                setOptions={{
                  enableBasicAutocompletion: true,
                  highlightSelectedWord: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: false,
                  tabSize: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} className={classes.videoContainer}>
              {UserVideo}
              {PartnerVideo}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} className={classes.console}>
            <div className={classes.consoleContainer}>
              <div className={classes.consoleHeader}></div>
              <div className={classes.consolecontent}></div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!callAccepted && receivingCall && caller !== yourSocketID}
        autoHideDuration={6000}
        onClose={declineCall}
        message="The Participant want to call you"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={acceptCall}>
              Accept
            </Button>
            <Button color="secondary" size="small" onClick={declineCall}>
              Decline
            </Button>
          </React.Fragment>
        }
      />
    </main>
  );
};

export default Interview;
