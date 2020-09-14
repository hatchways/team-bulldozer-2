import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme) => ({
    consoleContainer: {
        padding: "30px 30px 30px 30px",
        height: "auto"
    },
    consoleHeader: {
        backgroundColor: "#434343",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 50,
        display: "flex"
    },
    consoleHeaderButtonContent: {
        lineHeight: "48px",
        marginRight: "20px"
    },
    consoleHeaderButton: {
        borderRadius: "5em",
        fontWeight: "500",
        fontSize: 13,
        textTransform: "uppercase",
        color: "#FFFFFF",
        border: "1px solid #FFFFFF",
        padding: "4px 20px;"
    },
    consoleHeaderTitle: {
        fontWeight: "500",
        fontSize: 15,
        color: "#FFFFFF",
        lineHeight: "50px",
        marginLeft: "20px"
    },
    consoleOutput: {
        fontWeight: "500",
        fontSize: 15,
        color: "#FFFFFF",
    },
    consoleHeaderTitleContent: {
        flexGrow: 1,
    },
    consoleContent: {
        backgroundColor: "#4C4C4C",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        height: "150px",
        padding: 20
    },
    formSelectLanguage: {
        marginTop: 8,
    },
    selectLanguage: {
        "& .MuiNativeSelect-select": {
            color: "#FFFFFF",
            backgroundColor: "#434343",
            borderRadius: "5em",
            padding: "6px 30px"
        },
        "& .MuiNativeSelect-icon": {
            color: "#FFFFFF",
        },
    },
    selectLanguageOption: {
        backgroundColor: "#434343 !important",
    }

}));

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const InterviewConsole = (props) => {
    const classes = useStyles();
    const programmingLanguages = [{ name: "javascript", value: 0 }, { name: "python", value: 1 }]
    const { onRunCode, onChangeProgrammingLanguage, defaultProgrammingLanguage, consoleOutput } = props;
    const handleClickRunCode = () => {
        onRunCode();
    }
    const handleChangeProgrammingLanguage = (event) => {
        let programmingLanguageObj = programmingLanguages.find(
            (o) => o.value === parseInt(event.target.value)
        );
        onChangeProgrammingLanguage(programmingLanguageObj)
    }
    return (
        <div className={classes.consoleContainer}>
            <div className={classes.consoleHeader}>
                <div className={classes.consoleHeaderTitleContent}>
                    <Typography
                        component="h4"
                        variant="h4"
                        className={classes.consoleHeaderTitle}
                    >
                        Console
                    </Typography>
                </div>
                <div className={classes.consoleHeaderButtonContent}>
                    <FormControl className={classes.formSelectLanguage}>
                        <NativeSelect input={<BootstrapInput />} value={defaultProgrammingLanguage} onChange={handleChangeProgrammingLanguage} className={classes.selectLanguage}>
                            {programmingLanguages.map((data, index) => {
                                return (
                                    <option value={data.value} key={index} className={classes.selectLanguageOption}>
                                        {data.name}
                                    </option >
                                );
                            })}
                        </NativeSelect >
                    </FormControl>
                </div>
                <div className={classes.consoleHeaderButtonContent}>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.consoleHeaderButton}
                        onClick={() => handleClickRunCode()}
                    >
                        Run code
                    </Button>
                </div>
            </div>
            <div className={classes.consoleContent}>
                <Typography
                    component="h4"
                    variant="h4"
                    className={classes.consoleOutput}
                >
                    {consoleOutput}
                </Typography>
            </div>
        </div>
    );
};

InterviewConsole.propTypes = {
    defaultProgrammingLanguage: PropTypes.number,
    onChangeProgrammingLanguage: PropTypes.func,
    onRunCode: PropTypes.func,
    consoleOutput: PropTypes.string,
};



export default InterviewConsole;
