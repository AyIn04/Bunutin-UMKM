import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { isLoggedIn } from "../services/authService";

export default function ProtectedRoute() {
  const location = useLocation();

  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}