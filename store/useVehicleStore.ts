import { create } from "zustand";
import type { Vehicle } from "@/types";

interface VehicleStore {
  savedVehicles: Vehicle[];
  saveVehicle: (vehicle: Vehicle) => void;
  unsaveVehicle: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  savedVehicles: [],

  saveVehicle: (vehicle) => {
    if (!get().isSaved(vehicle.id)) {
      set((state) => ({ savedVehicles: [...state.savedVehicles, vehicle] }));
    }
  },

  unsaveVehicle: (id) => {
    set((state) => ({
      savedVehicles: state.savedVehicles.filter((v) => v.id !== id),
    }));
  },

  isSaved: (id) => get().savedVehicles.some((v) => v.id === id),
}));