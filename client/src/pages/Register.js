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

const Register = () => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, event) => {
    setFields({
      ...fields,
      [field]: event.target.value,
    });
  };

  const onSubmit = (data) => {
    console.log(fields);
  };

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h1" className={classes.title}>
        Get started!
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
          onChange={(event) => handleChange("username", event)}
          inputRef={register({ required: "Username is required" })}
          helperText={errors.username ? errors.username.message : null}
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

export default Register;
