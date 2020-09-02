import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AccountLayout from "../layouts/AccountLayout";
import { UserContext } from "../utils/context/userContext";

const RouteContainer = ({
  component: Component,
  isPrivateRoute,
  layoutProps,
  ...routeProps
}) => {
  const { userData } = useContext(UserContext);
  const isSignedIn = userData.isSignedIn;
  // Check if user is authenticated and if route is private
  if (isPrivateRoute && !isSignedIn) {
    return <Route {...routeProps} render={() => <Redirect to="/" />} />;
  } else if (!isPrivateRoute && isSignedIn) {
    return (
      <Route {...routeProps} render={() => <Redirect to="/dashboard" />} />
    );
  }

  const Layout = isSignedIn ? AppLayout : AccountLayout;

  return (
    <Route
      {...routeProps}
      render={(props) => (
        <Layout {...layoutProps}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
};

RouteContainer.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  isPrivateRoute: PropTypes.bool,
  layoutProps: PropTypes.object,
};

RouteContainer.defaultProps = {
  isPrivateRoute: false,
  layoutProps: {},
};

export default RouteContainer;
