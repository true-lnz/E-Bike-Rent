// src/pages/DashboardPage.jsx
import { Loader, Text } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) return <Loader />;
	if (!isAuthenticated)
		return <Text>Вы не авторизованы</Text>;

	return (
		<>
			<Outlet />
		</>
	);
}
