import { Outlet } from "react-router-dom";
import Header from "../components/Headers/MainHeader";

export default function AdminLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}