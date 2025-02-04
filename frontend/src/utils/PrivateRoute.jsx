import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { useContext } from "react";

const AuthRoute = ({ element, requireAuth, redirectTo }) => {
  const { isLoading, userEmail } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;

  // Case 1: Require Authentication (e.g., Protect Dashboard)
  if (requireAuth && !userEmail) {
    return <Navigate to={redirectTo || "/"} replace />;
  }

  // Case 2: Redirect Authenticated Users (e.g., Prevent Access to Sign-in Page)
  if (!requireAuth && userEmail) {
    return <Navigate to={redirectTo || "/dashboard"} replace />;
  }

  return element;
};

export default AuthRoute;
