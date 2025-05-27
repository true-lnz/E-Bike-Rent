// src/pages/MaintenancePage.jsx
import { MaintenanceHistory } from "../components/Maintenance/MaintenanceHistory";
import { MaintenanceList } from "../components/Maintenance/MaintenanceList";
// import { MaintenanceList } from "../components/Maintenance/MaintenanceList";
import type { Maintenance } from "../types/maintenance";

const mockData: Maintenance[] = [
	{
		id: 1,
		user_id: 123,
		bicycle_name: "Merida Big.Nine",
		status: "в процессе",
		details: "замена цепи",
		created_at: "2025-05-24T10:00:00Z",
		price: 2500,
		estimated_time: "2025-06-02T10:00:00Z",
	},
	{
		id: 2,
		user_id: 123,
		bicycle_name: "Merida Big.Nine",
		status: "отменено",
		details: "замена цепи",
		created_at: "2025-05-24T10:00:00Z",
		price: 2500,
		estimated_time: "2025-06-02T10:00:00Z",
	},
	{
		id: 3,
		user_id: 123,
		bicycle_name: "Merida Big.Nine",
		status: "готово",
		details: "замена цепи",
		created_at: "2025-05-24T10:00:00Z",
		price: 2500,
		estimated_time: "2025-06-02T10:00:00Z",
	},
];

export default function MaintenancePage() {
	return (
		<>
			<MaintenanceHistory />
			<MaintenanceList />
		</>

	);
}