import { LoadingOverlay } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  redirectUnauth?: string;
  redirectForbidden?: string;
}

export const ProtectedRoute = ({
  requireAdmin = false,
  redirectUnauth = "/auth",
  redirectForbidden = "/dashboard"
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <LoadingOverlay
      visible
      overlayProps={{ radius: 'sm', blur: 2 }}
      loaderProps={{ color: 'blue.5', type: 'bars' }}
    />
  );

  if (!user) {
    return <Navigate to={redirectUnauth} replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to={redirectForbidden} replace />;
  }

  return <Outlet />;
};