import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import AuthApi from "../utils/api/auth";
import { UserContext } from "../utils/context/userContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(8, 50, 20, 20),
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(5),
    },
  },
  input: {
    margin: "5px 0px 35px 0px ",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    padding: "15px 50px",
    borderRadius: "5em",
  },
  title: {
    marginBottom: theme.spacing(5),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "absolute",
  },
  buttonProgress: {
    color: "#516BF6",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Login = () => {
  const classes = useStyles();
  const { setUserData } = useContext(UserContext);
  let history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageAlert, setmessageAlert] = useState("");
  const handleChange = (field, event) => {
    setFields({
      ...fields,
      [field]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    setLoading(true);
    let status;
    AuthApi.login(fields)
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 200) {
          setUserData({
            isSignedIn: true,
            user: res,
          });
          history.push("/dashboard");
        } else {
          setShowAlert(true);
          setmessageAlert(res.response);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h1" className={classes.title}>
        Sign In
      </Typography>
      {showAlert ? <Alert severity="error">{messageAlert}</Alert> : null}
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography component="h6" variant="h6">
          Email
        </Typography>
        <TextField
          error={errors.email ? true : false}
          variant="outlined"
          className={classes.input}
          required
          fullWidth
          id="email"
          placeholder="john@mail.com"
          name="email"
          autoComplete="email"
          inputRef={register({
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Entered value does not match email format",
            },
          })}
          helperText={errors.email ? errors.email.message : null}
          onChange={(event) => handleChange("email", event)}
        />
        <Typography component="h6" variant="h6">
          Password
        </Typography>
        <TextField
          error={errors.password ? true : false}
          variant="outlined"
          className={classes.input}
          required
          fullWidth
          name="password"
          inputRef={register({
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 letter",
            },
          })}
          placeholder="••••••••••••"
          type="password"
          id="password"
          onChange={(event) => handleChange("password", event)}
          helperText={errors.password ? errors.password.message : null}
        />
        <div className={classes.wrapper}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Continue
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
