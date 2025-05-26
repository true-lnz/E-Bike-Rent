// src/pages/DashboardPage.jsx
import { Loader, Text } from "@mantine/core";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
	const { user, isAuthenticated, loading } = useAuth();

	if (loading) return <Loader />;
	if (!isAuthenticated) return <Text>Вы не авторизованы</Text>;

	return (
		<>
			<Text>Вы авторизованы!</Text>;
		</>
	);
}
