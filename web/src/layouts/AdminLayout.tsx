import { Outlet, ScrollRestoration } from "react-router-dom";
import AdminHeader from "../components/Headers/AdminHeader";

export default function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <main>
        <Outlet />
      </main>
			<ScrollRestoration />
    </>
  );
}