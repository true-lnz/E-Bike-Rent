import { createBrowserRouter } from "react-router-dom";
import PinCodeForm from "../components/Auth/PinCodeForm";
import { RegComplete } from "../components/Auth/RegComplete";
import PrivateRoute from "../components/PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AdminPage from "../pages/AdminPage";
import AuthPage from "../pages/Auth/AuthPage";
import BikeDetailPage from "../pages/BikeDetailPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
	{
		element: <MainLayout />, // Для большинства страниц
		children: [
			{ path: "/", element: <HomePage /> },
			{
				element: <PrivateRoute />,
				children: [
					{ path: "/dashboard", element: <DashboardPage /> },
					{ path: "/admin", element: <AdminPage /> },
				],
			},
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
