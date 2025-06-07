import { LoadingOverlay } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) return
	<LoadingOverlay
		visible
		overlayProps={{ radius: 'sm', blur: 2 }}
		loaderProps={{ color: 'blue.5', type: 'bars' }}
	/>;

	if (user?.role !== "admin") {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};
