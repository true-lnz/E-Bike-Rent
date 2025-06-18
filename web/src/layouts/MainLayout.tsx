import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/MainHeader";

export default function MainLayout() {
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
			<ScrollRestoration />
		</>
	);
}