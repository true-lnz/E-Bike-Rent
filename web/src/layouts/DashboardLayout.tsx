import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Headers/MainHeader";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
			<Footer />
    </>
  );
}