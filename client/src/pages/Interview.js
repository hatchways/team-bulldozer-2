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
  const [participant, setparticipant] = useState({
    name: "",
    id: null
  });
  const [yourSocketID, setYourSocketID] = useState("");
  const [codeValue, setCodeValue] = useState();
  const [stream, setStream] = useState();
  const [interview, setInterview] = useState();
  const [yourQuestionContent, setYourQuestionContent] = useState("<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p><p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p><p>You can return the answer in any order.</p><p>&nbsp;</p><p><strong>Example 1:</strong></p><pre><strong>Input:</strong> nums = [2,7,11,15], target = 9↵<strong>Output:</strong> [0,1]<strong>Output:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre><p><strong>Example 2:</strong></p><pre><strong>Input:</strong> nums = [3,2,4], target = 6<strong>Output:</strong> [1,2]</pre><p><strong>Example 3:</strong></p><pre><strong>Input:</strong> nums = [3,3], target = 6<strong>Output:</strong> [0,1]</pre><p>&nbsp;</p><p><strong>Constraints:</strong></p><ul><li><code>2 &lt;= nums.length &lt;= 10<sup>5</sup></code></li><li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li><li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li><li><strong>Only one valid answer exists.</strong></li></ul>");
  const [participantQuestionContent, setParticipantQuestionContent] = useState("");
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
    if (!location.state) {
      history.push("/dashboard");
    } else {
      let interview = location.state.detail;
      let participantObj = interview.participants.find(
        (o) => o._id !== userData.user._id
      );
      setInterview(interview);
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
      socket.current.on("onConsoleChange", (data) => {
        if (data.result.output) {
          setConsoleOutputContent(data.result.output)
        } else {
          setConsoleOutputContent(data.result.errors)
        }
      });

    }
  }, [location]);

  const onChangeCode = (data) => {
    socket.current.emit("onChangeCode", {
      code: data,
    });
  };

  const runInterviewCode = async (data) => {
    let status;
    setConsoleOutputContent("Start compiling code....")
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

  const handleRunCode = () => {
    const body = {
      language: programmingLanguage,
      code: codeValue,
      stdin: "",
      interviewId: interview._id
    }
    runInterviewCode(body)
  };

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
    peer.on('error', (err) => {
      if (err.code == "ERR_CONNECTION_FAILURE") {
        setCallAccepted(false);
        setReceivingCall(false);
      }
    })
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
    peer.on('error', (err) => {
      if (err.code == "ERR_CONNECTION_FAILURE") {
        setCallAccepted(false);
        setReceivingCall(false);
      }
    })
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
