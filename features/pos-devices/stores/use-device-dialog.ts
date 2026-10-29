import { create } from 'zustand';
import { Devices } from '../types';

interface DeviceDialogStore {
    selectedDevice: Devices | null;
    openEdit: (device: Devices) => void;
    closeEdit: () => void;
}

export const useDeviceDialog = create<DeviceDialogStore>((set) => ({
    selectedDevice: null,
    openEdit: (device) => set({ selectedDevice: device }),
    closeEdit: () => set({ selectedDevice: null }), // <--- HERE is closeEdit!
}));