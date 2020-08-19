import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./themes/theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import Register from "./pages/Register";
import RouteContainer from "./routes/RouteContainer";
import Login from "./pages/login";
import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <RouteContainer
          path="/"
          component={Register}
          layoutProps={{
            titleHeader: "Already have an account?",
            buttonTitleHeader: "Sign In",
          }}
          exact
        />
        <RouteContainer
          path="/login"
          component={Login}
          layoutProps={{
            titleHeader: "Don't have an account?",
            buttonTitleHeader: "Sign Up",
          }}
          exact
        />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
