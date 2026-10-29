"use server"
import {updateDeviceData} from "@/features/pos-devices/queries/valkire-device-queries";
import {Devices} from "@/features/pos-devices/types";


export const update = async (data: {
    ValkirePosUnitID: string;
    Vehicle: string;
    FiscBusinessPremiseID: string;
    FiscElectronicDeviceID: string
}) => {
    console.log(data)
    await updateDeviceData(data)
    return "Device updated successfully."
}