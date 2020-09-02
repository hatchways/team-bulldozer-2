import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InterviewApi from "../utils/api/interview";

const useStyles = makeStyles((theme) => ({
  title: {
    color: "#516BF6",
    textAlign: "center",
    fontWeight: 600,
  },
  dialogContainer: {
    padding: "50px 80px",
  },
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: 200,
  },
  createButton: {
    borderRadius: "5em",
    padding: "10px 30px",
  },
  createButtonContainer: {
    textAlign: "center",
    marginTop: theme.spacing(3),
  },
  label: {
    fontWeight: 400,
    fontSize: 14,
    marginTop: 20,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  input: {
    margin: "5px 0px 35px 0px ",
    width: 300,
  },
}));

const CreateInterview = (props) => {
  const classes = useStyles();
  const { onClose, onSend, open } = props;
  const [difficulty, setDifficulty] = useState();
  const [difficultyList, setDifficultyList] = useState([]);
  const [title, setTitle] = useState();
  const { register, handleSubmit, errors } = useForm();

  const handleClose = () => {
    onClose();
  };

  const handleChangeDifficulty = (event) => {
    setDifficulty(event.target.value);
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const onSubmit = () => {
    onSend({
      title: title,
      level: difficulty,
    });
  };

  const getDifficultyList = async () => {
    let status;
    InterviewApi.getListDifficultyLevels()
      .then((res) => {
        status = res.status;
        if (status < 500) return res.json();
        else throw Error("Server error");
      })
      .then((res) => {
        if (status === 200) {
          setDifficultyList(res);
          setDifficulty(res[0]._id);
        } else {
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getDifficultyList();
  }, []);

  return (
    <Dialog onClose={handleClose} open={open}>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <div className={classes.dialogContainer}>
        <Typography component="h5" variant="h5" className={classes.title}>
          Create
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl variant="outlined" className={classes.formControl}>
            <Typography component="h6" variant="h6" className={classes.label}>
              Difficulty level
            </Typography>
            <Select native value={difficulty} onChange={handleChangeDifficulty}>
              {difficultyList.map((value, index) => {
                return (
                  <option value={value._id} key={index}>
                    {value.name}
                  </option>
                );
              })}
            </Select>
            <Typography component="h6" variant="h6" className={classes.label}>
              Interview title
            </Typography>
            <TextField
              variant="outlined"
              className={classes.input}
              required
              fullWidth
              id="title"
              placeholder="Interview title"
              name="title"
              onChange={(event) => handleChange(event)}
              inputRef={register({ required: "Interview Title is required" })}
              helperText={errors.title ? errors.title.message : null}
              autoFocus
            />
          </FormControl>
          <div className={classes.createButtonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.createButton}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

CreateInterview.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default CreateInterview;
