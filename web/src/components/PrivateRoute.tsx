// components/PrivateRoute.tsx
import { Center, Loader } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<Center h="100vh">
				<Loader />
			</Center>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return <Outlet />;
}
