// src/pages/HomePage.jsx
import AccessoriesList from "../components/Accessory/AccessoriesList";
import BikeList from "../components/Bikes/BikeList";
import ContactCard from "../components/Main/ContactCard";
import HeroSection from "../components/Main/Hero";
import { MaintenanceList } from "../components/Maintenance/MaintenanceList";
import RentalAdvertise from "../components/Main/RentalAdvertise";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<RentalAdvertise />
			<BikeList />
			<AccessoriesList />
			<MaintenanceList onCreated={function (): void {} } />
			<ContactCard />
		</>
	);
}
