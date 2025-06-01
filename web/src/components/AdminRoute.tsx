import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = () => {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/auth" replace />;
	}

	if (user.role !== "admin") {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};

