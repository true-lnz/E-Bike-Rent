import { LoadingOverlay } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingOverlay />;

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
