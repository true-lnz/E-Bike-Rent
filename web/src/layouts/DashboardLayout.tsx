import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer";
import DashboardHeader from "../components/Headers/DashboardHeader";

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