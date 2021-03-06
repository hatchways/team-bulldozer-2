import React, { useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./themes/theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import Register from "./pages/Register";
import RouteContainer from "./routes/RouteContainer";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import WaitingRoom from "./components/WaitingRoom";
import "./App.css";
import AuthApi from "./utils/api/auth";
import { UserContext } from "./utils/context/userContext";

function App() {
  const [userData, setUserData] = useState({
    isSignedIn: true,
    user: undefined,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const checkLoggedIn = async () => {
      let status;
      AuthApi.me()
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
          } else {
            setUserData({
              isSignedIn: false,
              user: undefined,
            });
          }
          setIsLoaded(true);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    checkLoggedIn();
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {isLoaded && (
        <BrowserRouter>
          <UserContext.Provider value={{ userData, setUserData }}>
            <RouteContainer
              path="/"
              component={Register}
              layoutProps={{
                titleHeader: "Already have an account?",
                buttonTitleHeader: "Sign In",
                buttonUrlHeader: "/login",
              }}
              exact
            />
            <RouteContainer
              path="/login"
              component={Login}
              layoutProps={{
                titleHeader: "Don't have an account?",
                buttonTitleHeader: "Sign Up",
                buttonUrlHeader: "/",
              }}
            />
            <RouteContainer
              path="/dashboard"
              component={Dashboard}
              isPrivateRoute
            />
            <RouteContainer
              path="/interview"
              component={Interview}
              isPrivateRoute
            />
            <RouteContainer
              path="/room/:path"
              component={() => <WaitingRoom open={true} />}
              isPrivateRoute
            />
          </UserContext.Provider>
        </BrowserRouter>
      )}
    </MuiThemeProvider>
  );
}

export default App;
