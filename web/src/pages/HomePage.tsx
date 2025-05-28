// src/pages/HomePage.jsx
import BikeList from "../components/BikeList";
import ContactCard from "../components/ContactCard";
import { MaintenanceList } from "../components/Maintenance/MaintenanceList";

export default function HomePage() {
	return (
		<>
			<BikeList />
			<MaintenanceList onCreated={function (): void {} } />
			<ContactCard />
		</>
	);
}
