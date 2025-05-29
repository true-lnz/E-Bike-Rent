// src/pages/HomePage.jsx
import AccessoriesList from "../components/AccessoriesList";
import BikeList from "../components/BikeList";
import ContactCard from "../components/ContactCard";
import HeroSection from "../components/Hero";
import { MaintenanceList } from "../components/Maintenance/MaintenanceList";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<BikeList />
			<AccessoriesList />
			<MaintenanceList onCreated={function (): void {} } />
			<ContactCard />
		</>
	);
}
