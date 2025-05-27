import { useEffect, useState } from "react";
import { maintenanceService } from "../../services/maintenanceService";
import type { Maintenance } from "../../types/maintenance";
import { MaintenanceHistory } from "../Maintenance/MaintenanceHistory";
import { MaintenanceList } from "../Maintenance/MaintenanceList";

export default function Maintenance() {
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