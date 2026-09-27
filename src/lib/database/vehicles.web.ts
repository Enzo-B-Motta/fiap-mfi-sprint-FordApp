import AsyncStorage from "@react-native-async-storage/async-storage";
import { Vehicle } from "../types";
import { RANGER_RAPTOR } from "../vehicles";

const KEY = "ford-vehicles-v1";
export async function listVehicles(): Promise<Vehicle[]> {
  const saved = await AsyncStorage.getItem(KEY);
  const rows: Vehicle[] = saved ? JSON.parse(saved) : [];
  return [RANGER_RAPTOR, ...rows.filter((v) => v.id !== RANGER_RAPTOR.id)];
}
export async function saveVehicle(vehicle: Vehicle): Promise<void> {
  const rows = await listVehicles();
  await AsyncStorage.setItem(KEY, JSON.stringify([vehicle, ...rows.filter((v) => v.id !== vehicle.id)]));
}
export async function deleteVehicle(id: string): Promise<void> {
  if (id === RANGER_RAPTOR.id) return;
  await AsyncStorage.setItem(KEY, JSON.stringify((await listVehicles()).filter((v) => v.id !== id)));
}
