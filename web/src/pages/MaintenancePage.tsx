import { useEffect, useState } from "react";
import { MaintenanceHistory } from "../components/Maintenance/MaintenanceHistory";
import { MaintenanceList } from "../components/Maintenance/MaintenanceList";
import { maintenanceService } from "../services/maintenanceService";
import type { Maintenance } from "../types/maintenance";

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenances = () => {
    setLoading(true);
    maintenanceService
      .getUserMaintenances()
      .then(setMaintenances)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  return (
    <>
      <MaintenanceHistory data={maintenances} loading={loading} />
      <MaintenanceList onCreated={fetchMaintenances} />
    </>
  );
}