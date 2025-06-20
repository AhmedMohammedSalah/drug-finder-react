import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

export function RequireAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function RequireRole({ allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    // Redirect to home or a "not authorized" page
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}

export function RequireNoRole() {
    const user = JSON.parse( localStorage.getItem( "user" ) );
    // console.log( user );
  if (user) {
      return <Navigate to="/" replace />;
    }
  return <Outlet />;
}
