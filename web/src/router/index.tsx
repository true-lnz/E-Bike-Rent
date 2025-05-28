import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminAllAccessories from "../components/AdminAllAccessories";
import AdminAllBikes from "../components/AdminAllBikes";
import AdminMaintenanceRequests from "../components/AdminMaintenanceRequests";
import AdminRentRequests from "../components/AdminRentRequest";
import PinCodeForm from "../components/Auth/PinCodeForm";
import { RegComplete } from "../components/Auth/RegComplete";
import BikeList from "../components/BikeList";
import Maintenance from "../components/Maintenance/Maintenance";
import MyRent from "../components/MyRent";
import PrivateRoute from "../components/PrivateRoute";
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
			{ path: "/auth/code", element: <PinCodeForm /> },
			{ path: "auth/complete", element: <RegComplete /> },

			{ path: "/bikes/:id", element: <BikeDetailPage /> },

			{ path: "/policy", element: <PolicyPage /> },

			{ path: "*", element: <HomePage /> },
		]
	},

	{
		element: <PrivateRoute />, // Проверяет авторизацию
		children: [
			
			{ // Личный кабинет (Dashboard)
				path: "/dashboard",
				element: <DashboardLayout />,
				children: [
					{ index: true, element: <Navigate to="bikes" replace /> }, // Дефолтный редирект
					{ path: "bikes", element: <BikeList onlyAvailableByDefault={true} /> }, // todo ТУТ КОГДА НИБУДЬ БУДЕТ ПАРАМЕТР ОТОБРАЖЕНИЯ
					{ path: "maintenances", element: <Maintenance /> },
					{ path: "my-rents", element: <MyRent /> },
					{ path: "contacts", element: <ContactPage /> },
				],
			},


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
		],
	},
]);