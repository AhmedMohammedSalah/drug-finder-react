import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Common role check function
const hasRequiredRole = (user, allowedRoles) => {
  return user && allowedRoles.includes(user.role);
};

export function RequireAuth({ children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export function RequireRole({ allowedRoles, children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole(user, allowedRoles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export function RequireNoRole({ children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (user) {
    // Redirect to appropriate dashboard based on role
    const redirectPath =
      user.role === "client"
        ? "/client"
        : user.role === "pharmacist"
        ? "/pharmacy"
        : user.role === "admin"
        ? "/admin"
        : "/";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
