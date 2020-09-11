import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "5px 15px",
    },
    title: {
        color: "#516BF6",
        fontWeight: 600,
        marginBottom: 10,
        marginTop: 20,
    },
    content: {
        '@global': {
            p: {
                fontWeight: 500,
                fontSize: 16,
                color: "#5E6676"
            },
            pre: {
                display: "grid",
                backgroundColor: "#F1F4FA",
                whiteSpace: "pre-wrap"
            }
        },
    }
}));

const InterviewQuestions = (props) => {
    const classes = useStyles();
    const { showContent, content } = props;
    return (
        <div className={classes.root}>

            {showContent && (
                <div>
                    <Typography component="h5" variant="h5" className={classes.title}>
                        {content.title}
                    </Typography>
                    <div className={classes.content} dangerouslySetInnerHTML={{
                        __html: content.body
                    }}>

                    </div>
                </div>

            )}
        </div>
    );
};

InterviewQuestions.propTypes = {
    content: PropTypes.object,
    showContent: PropTypes.bool,
};

InterviewQuestions.defaultProps = {
    showContent: false
};


export default InterviewQuestions;
