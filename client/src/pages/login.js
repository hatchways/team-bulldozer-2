import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";

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
}));

const Login = () => {
  const classes = useStyles();

  const { login, errors, handleSubmit } = useForm();

  const [fields, setFields] = useState({
    username: "",
    password: "",
  });

  const handleChange = (field, event) => {
    setFields({
      ...fields,
      [field]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(fields);
  };

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h1" className={classes.title}>
        Sign In
      </Typography>
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography component="h6" variant="h6">
          Username
        </Typography>
        <TextField
          error={errors.username ? true : false}
          variant="outlined"
          className={classes.input}
          required
          fullWidth
          id="username"
          placeholder="Username"
          name="username"
          inputRef={login({ required: "Username is required" })}
          onChange={(event) => handleChange("username", event)}
          helperText={errors.username ? errors.username.message : null}
          autoFocus
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
          inputRef={login({
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default Login;
