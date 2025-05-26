import { createBrowserRouter } from "react-router-dom";
import PinCodeForm from "../components/Auth/PinCodeForm";
import { RegComplete } from "../components/Auth/RegComplete";
import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AuthPage from "../pages/Auth/AuthPage";
import BikeDetailPage from "../pages/BikeDetailPage";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />, // Для большинства страниц
    children: [
      { path: "/", element: <HomePage /> },

      { path: "/auth", element: <AuthPage /> },
			{ path: "/auth/code", element: <PinCodeForm /> },
			{ path: "auth/complete", element: <RegComplete /> },
      { path: "/bikes/:id", element: <BikeDetailPage /> },
      { path: "*", element: <HomePage /> },
    ]
  },
  {
    element: <DashboardLayout />, // Для страниц входа/регистрации
    children: [
      // { path: "/auth", element: <Auth /> },
    ]
  },
  {
    element: <AdminLayout />, // Для админ-раздела
    children: [
      // { path: "/admin", element: <AdminDashboard /> },
    ]
  }
]);
