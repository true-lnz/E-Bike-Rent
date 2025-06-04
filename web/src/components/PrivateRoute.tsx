// components/PrivateRoute.tsx
import { Center, Loader } from "@mantine/core";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ authOnly = true, unverifiedOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Center h="100vh"><Loader /></Center>;
  }

  if (authOnly && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!unverifiedOnly && authOnly && !user?.is_verified) {
    return <Navigate to="/auth/complete" replace />;
  }

  if (unverifiedOnly && user?.is_verified) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}