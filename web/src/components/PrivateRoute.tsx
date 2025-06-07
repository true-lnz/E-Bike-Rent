// components/PrivateRoute.tsx
import { LoadingOverlay } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
	const { user, isLoading } = useAuth();

	if (isLoading) return 
	<LoadingOverlay
		visible
		overlayProps={{ radius: 'sm', blur: 2 }}
		loaderProps={{ color: 'blue.5', type: 'bars' }}
	/>;

	if (!user) {
		return <Navigate to="/auth" replace />;
	}

	return <Outlet />;
}
