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
import InterviewApi from "../utils/api/interview";
import io from "socket.io-client";
import InterviewQuestions from "../components/InterviewQuestions";
import InterviewConsole from "../components/InterviewConsole";
import 'ace-builds/webpack-resolver';
import "ace-builds/src-noconflict/theme-monokai";
const useStyles = makeStyles((theme) => ({
  titleCard: {
    color: "#516BF6",
    marginBottom: 40,
    textAlign: "center",
  },
  container: {
    minHeight: "calc(100vh - 100px)"
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
    height: "80%"
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
  },
  questionHeaderButton: {
    borderRadius: "5em",
    fontWeight: "500",
    fontSize: 13,
    color: "#5E6676",
    border: "1px solid #FAFAFA",
    padding: "10px 20px;",
    boxShadow: "0px 0px 14px rgba(108, 115, 130, 0.1)",
    marginRight: 10,
    textTransform: "unset",
    marginTop: 10,
    "&:hover": {
      backgroundColor: "#FFFFFF"
    },
    "&.active": {
      color: "#516BF6",
      backgroundColor: "#FFFFFF",
      border: "1px solid #FFFFFF",
    },
  },
  headerQuestion: {
    textAlign: "center",
    marginTop: 10
  }
}));

const Interview = () => {
  const classes = useStyles();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const SocketUrl = process.env.REACT_APP_SOCKET_URL;
  const [participant, setparticipant] = useState({ name: "", id: null });
  const [yourSocketID, setYourSocketID] = useState("");
  const [codeValue, setCodeValue] = useState();
  const [stream, setStream] = useState();
  const [interview, setInterview] = useState();
  const [yourQuestionContent, setYourQuestionContent] = useState({ title: "", body: "" });
  const [participantQuestionContent, setParticipantQuestionContent] = useState({ title: "", body: "" });
  const [showYourQuestion, setShowYourQuestion] = useState(true);
  const [showParticipantQuestion, setShowParticipantQuestion] = useState(false);
  const [consoleOutputContent, setConsoleOutputContent] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState(0);
  const [programmingLanguageName, setProgrammingLanguageName] = useState("javascript");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const { userData } = useContext(UserContext);
  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    // check if location has state
    if (!location.state) {
      history.push("/dashboard");
    } else {
      // get interview data from state
      let interview = location.state.detail;
      // get participant object from interview
      let participantObj = interview.participants.find(
        (o) => o._id !== userData.user._id
      );
      // get user object from interview
      let userObj = interview.participants.find(
        (o) => o._id == userData.user._id
      );
      setInterview(interview);
      setParticipantQuestionContent({ title: participantObj.question.title, body: participantObj.question.body })
      setYourQuestionContent({ title: userObj.question.title, body: userObj.question.body })
      setparticipant({ id: participantObj._id, name: participantObj.firstName + ' ' + participantObj.lastName });
      // connect to socket
      socket.current = io.connect(SocketUrl, {
        query: `room=${interview._id}`,
      });
      // open user stream and get audio and video autorization
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          if (userVideo.current) {
            // add stream to userVideo ref
            userVideo.current.srcObject = stream;
          }
        });
      // get event from socket when code changed
      socket.current.on("changeCode", (data) => {
        setCodeValue(data.code);
      });
      // get user socket id
      socket.current.on("yourSocketID", (id) => {
        setYourSocketID(id);
      });
      // get event when user is calling
      socket.current.on("onCalling", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      });
      // get event when console content changed
      socket.current.on("onConsoleChange", (data) => {
        if (data.result.output) {
          setConsoleOutputContent(data.result.output)
        } else {
          setConsoleOutputContent(data.result.errors)
        }
      });

    }
  }, [location]);

  // on change code emit socket event with the code  
  const onChangeCode = (data) => {
    socket.current.emit("onChangeCode", {
      code: data,
    });
  };

  // api for runnig code
  const runInterviewCode = async (data) => {
    let status;
    InterviewApi.conpileCode(data)
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 200) {
          if (res.output) {
            setConsoleOutputContent(res.output)
          } else {
            setConsoleOutputContent(res.errors)
          }
        } else {
          setConsoleOutputContent("Conpilation finished with error")
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleClickEndInterview = () => {
  };

  // when click on run code 
  const handleRunCode = () => {
    const body = {
      language: programmingLanguage,
      code: codeValue,
      stdin: "",
      interviewId: interview._id
    }
    setConsoleOutputContent("Start compiling code....")
    // call api run code
    runInterviewCode(body)
  };

  // when switch programming language
  const handleClickSelectProgrammingLanguage = (data) => {
    setProgrammingLanguage(data.value)
    setProgrammingLanguageName(data.name)
  };

  const handleClickShowYourQuestion = () => {
    setShowYourQuestion(true)
    setShowParticipantQuestion(false)
  };

  const handleClickShowParticipantQuestion = () => {
    setShowParticipantQuestion(true)
    setShowYourQuestion(false)
  };

  const callParticipant = () => {
    // create new instance of peer with credencials
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
    // when get peer signal emit socket event to call participant this event id fired when the peer wants to send signaling data to the remote peer.
    peer.on("signal", (data) => {
      socket.current.emit("callParticipant", {
        signalData: data,
        from: yourSocketID,
      });
    });
    // on peer stream event add stream to partnerVideo ref
    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });
    // handle peer error when user connection failed close the video section
    peer.on('error', (err) => {
      if (err.code == "ERR_CONNECTION_FAILURE") {
        setCallAccepted(false);
        setReceivingCall(false);
      }
    })
    // when call accepted send peer signal event with data
    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  // when click on accept call
  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    // on peer signal event emit a socket event to notify that the call has been accepted
    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });
    // on stream event add the stream to partnerVideo ref
    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });
    // handle peer event error 
    peer.on('error', (err) => {
      if (err.code == "ERR_CONNECTION_FAILURE") {
        setCallAccepted(false);
        setReceivingCall(false);
      }
    })
    // emit peer signal with caller signal 
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
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={4} className={classes.question}>
          <div className={classes.headerQuestion}>
            <Button
              variant="outlined"
              size="small"
              className={`${classes.questionHeaderButton} ${showYourQuestion ? 'active' : null}`}
              onClick={handleClickShowYourQuestion}
            >
              Your Question
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={`${classes.questionHeaderButton} ${showParticipantQuestion ? 'active' : null}`}
              onClick={handleClickShowParticipantQuestion}
            >
              Participant Question
            </Button>
          </div>
          <InterviewQuestions content={yourQuestionContent} showContent={showYourQuestion}></InterviewQuestions>
          <InterviewQuestions content={participantQuestionContent} showContent={showParticipantQuestion}></InterviewQuestions>
        </Grid>
        <Grid item xs={12} sm={8} className={classes.editor}>
          <Grid item xs={12} sm={12} className={classes.code}>
            <Grid item xs={12} sm={8} >
              <AceEditor
                mode={programmingLanguageName}
                theme="monokai"
                onChange={onChangeCode}
                showPrintMargin={false}
                showGutter={false}
                name="UNIQUE_ID_OF_DIV"
                wrapEnabled={true}
                width="100%"
                height="100%"
                className={classes.codeContent}
                value={codeValue}
                setOptions={{
                  highlightSelectedWord: true,
                  useWorker: false,
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
            <InterviewConsole
              onRunCode={handleRunCode}
              onChangeProgrammingLanguage={handleClickSelectProgrammingLanguage}
              consoleOutput={consoleOutputContent}
              defaultProgrammingLanguage={programmingLanguage}>
            </InterviewConsole>
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
