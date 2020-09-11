import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    root: {
    },
    content: {
        padding: "5px 15px",
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
                <div className={classes.content} dangerouslySetInnerHTML={{
                    __html: content
                }}>

                </div>
            )}
        </div>
    );
};

InterviewQuestions.propTypes = {
    content: PropTypes.string,
    showContent: PropTypes.bool,
};

InterviewQuestions.defaultProps = {
    showContent: false
};


export default InterviewQuestions;
