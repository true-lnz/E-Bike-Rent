import { Outlet, ScrollRestoration } from "react-router-dom";
import DashboardHeader from "../components/ui/DashboardHeader";
import Footer from "../components/ui/Footer";

export default function DashboardLayout() {
	return (
		<>
			<DashboardHeader />
			<main>
				<Outlet />
			</main>
			<Footer />
			<ScrollRestoration />
		</>
	);
}