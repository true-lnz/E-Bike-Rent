// web/src/router/index.tsx

import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminAllAccessories from "../components/Admin/AdminAllAccessories";
import AdminAllBikes from "../components/Admin/AdminAllBikes";
import AdminMaintenanceRequests from "../components/Admin/AdminMaintenanceRequests";
import AdminRentRequests from "../components/Admin/AdminRentRequest";
import BikeList from "../components/Bikes/BikeList";
import MyRent from "../components/Dashboard/MyRent";
import Maintenance from "../components/Maintenance/Maintenance";
import { ProtectedRoute } from "../components/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AuthPage from "../pages/Auth/AuthPage";
import { BikeDetailPage } from "../pages/BikeDetailPage";
import ContactPage from "../pages/ContactPage";
import HomePage from "../pages/HomePage";
import PolicyPage from "../pages/PolicyPage";

export const router = createBrowserRouter([
	{
		element: <MainLayout />, // Для большинства страниц
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/auth", element: <AuthPage /> },
			{ path: "/bikes/:id", element: <BikeDetailPage /> },
			{ path: "/policy", element: <PolicyPage /> },
			{ path: "*", element: <HomePage /> },
		]
	},

	{
		element: <ProtectedRoute />, // Проверяет авторизацию
		children: [
			{ // Личный кабинет (Dashboard)
				path: "/dashboard",
				element: <DashboardLayout />,
				children: [
					{ index: true, element: <Navigate to="bikes" replace /> }, // Дефолтный редирект
					{ path: "bikes", element: <BikeList onlyAvailableByDefault={true} /> },
					{ path: "maintenances", element: <Maintenance /> },
					{ path: "my-rents", element: <MyRent /> },
					{ path: "contact", element: <ContactPage /> },
				],
			},
		],
	},
	{
				element: <ProtectedRoute requireAdmin />, // Проверяет на права админа
				children: [
					{		// Админка (Admin)
						path: "/admin",
						element: <AdminLayout />,
						children: [
							{ index: true, element: <Navigate to="rent-requests" replace /> }, // Дефолтный редирект
							{ path: "rent-requests", element: <AdminRentRequests /> },
							{ path: "maintenance-requests", element: <AdminMaintenanceRequests /> },
							{ path: "all-bikes", element: <AdminAllBikes /> },
							{ path: "all-accessories", element: <AdminAllAccessories /> },
						],
					},
				]
			}
]);