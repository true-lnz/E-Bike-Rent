import { LoadingOverlay, Text } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import DashboardHeader from "../components/Headers/DashboardHeader";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
	const { user, isAuthenticated, loading } = useAuth();

	if (loading) return <LoadingOverlay />;
	if (!isAuthenticated)
		return <Text>Вы не авторизованы</Text>;

  return (
    <>
      <DashboardHeader />
      <main>
				<Outlet />
      </main>
			<Footer />
    </>
  );
}