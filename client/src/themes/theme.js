import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans"',
    allVariants: {
      color: "#5E6676",
    },
    h1: {
      fontSize: 40,
    },
    h6: {
      fontSize: 16,
      lineHeight: "22px",
      fontWeight: "600",
    },
  },
  palette: {
    primary: { main: "#516BF6" },
  },
});
