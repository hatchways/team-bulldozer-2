import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
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
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: "#516BF6",
    position: "absolute",
    top: "50%",
    left: "20%",
    marginTop: -12,
    marginLeft: -12,
  },
  submit: {
    padding: "15px 50px",
    borderRadius: "5em",
  },
  title: {
    marginBottom: theme.spacing(5),
  },
}));

const Register = () => {
  const classes = useStyles();
  let history = useHistory();
  const { setUserData } = useContext(UserContext);
  const { register, handleSubmit, errors } = useForm();
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const onSubmit = (data) => {
    setLoading(true);
    let status;
    AuthApi.register(fields)
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 201) {
          setUserData({
            isSignedIn: true,
            user: res,
          });
          history.push("/dashboard");
        } else {
          setLoading(false);
          setShowAlert(true);
          setmessageAlert(res.response.errors);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h1" className={classes.title}>
        Get started!
      </Typography>
      {showAlert ? <Alert severity="error">{messageAlert}</Alert> : null}
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography component="h6" variant="h6">
          First Name
        </Typography>
        <TextField
          error={errors.firstName ? true : false}
          variant="outlined"
          className={classes.input}
          required
          fullWidth
          id="firstName"
          placeholder="First Name"
          name="firstName"
          onChange={(event) => handleChange("firstName", event)}
          inputRef={register({ required: "First Name is required" })}
          helperText={errors.firstName ? errors.firstName.message : null}
          autoFocus
        />
        <Typography component="h6" variant="h6">
          Last Name
        </Typography>
        <TextField
          error={errors.lastName ? true : false}
          variant="outlined"
          className={classes.input}
          required
          fullWidth
          id="lastName"
          placeholder="Last Name"
          name="lastName"
          onChange={(event) => handleChange("lastName", event)}
          inputRef={register({ required: "Last Name is required" })}
          helperText={errors.lastName ? errors.lastName.message : null}
          autoFocus
        />
        <Typography component="h6" variant="h6">
          Email Address
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
          placeholder="••••••••••••"
          type="password"
          id="password"
          inputRef={register({
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 letter",
            },
          })}
          onChange={(event) => handleChange("password", event)}
          helperText={errors.password ? errors.password.message : null}
        />
        <Typography component="h6" variant="h6">
          Confirm Password
        </Typography>
        <TextField
          error={errors.confirmPassword ? true : false}
          variant="outlined"
          className={classes.input}
          required
          fullWidth
          name="confirmPassword"
          placeholder="••••••••••••"
          type="password"
          id="confirmPassword"
          inputRef={register({
            required: "Confirm password is required",
            minLength: {
              value: 6,
              message: "Confirm password must be at least 6 letter",
            },
          })}
          onChange={(event) => handleChange("confirmPassword", event)}
          helperText={
            errors.confirmPassword ? errors.confirmPassword.message : null
          }
        />
        <div className={classes.wrapper}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submit}
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

export default Register;
