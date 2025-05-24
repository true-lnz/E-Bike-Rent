import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import BikeDetailPage from "../pages/BikeDetailPage";
import BikeListPage from "../pages/BikeListPage";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />, // Для большинства страниц
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/bikes", element: <BikeListPage /> },
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
