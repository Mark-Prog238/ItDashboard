"use client"
import {Field, FieldGroup} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,DialogClose } from "@/components/ui/dialog"
import { useDeviceDialog } from "../stores/use-device-dialog"
import {update} from "@/features/pos-devices/functions/pos-devices-functions-update-device";
import {useRouter} from "next/navigation";
export default function PosDevicesEditRowForm() {
    const { selectedDevice, closeEdit } = useDeviceDialog()
    const router = useRouter()

    // action za update
    const updateValues = async(form: FormData) => {
        const data = {
            ValkirePosUnitID: selectedDevice?.ValkirePosUnitID ?? "",
            Vehicle: form.get("vehicle") as string,
            FiscBusinessPremiseID: form.get("FiscBusinessPremiseID") as string,
            FiscElectronicDeviceID: form.get("FiscElectronicDeviceID") as string,
        };
        await update(data);
        router.refresh();
        closeEdit();
    }
    return (
        <Dialog open={!!selectedDevice} onOpenChange={(open) => !open && closeEdit()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="items-center justify-center flex font-semibold capitalize pb-5">Posodobi podatke vozila</DialogTitle>

                </DialogHeader>
                {/* Form fields here */}
                    <form action={updateValues}>
                        <FieldGroup>
                            {/* ID VOZILA*/}
                            <Field>
                                <Label htmlFor="id">ValkirePosUnitID</Label>
                                <Input id="id" name="id" disabled={true} defaultValue={selectedDevice?.ValkirePosUnitID} />
                            </Field>
                            {/* REG VOZILA*/}
                            <Field>
                                <Label htmlFor="vehicle">Reg</Label>
                                <Input id="vehicle" name="vehicle" defaultValue={selectedDevice?.Vehicle} />
                            </Field>
                            {/*BLAGAJNA-FiscBusinessPremiseID*/}
                            <Field>
                                <Label htmlFor="FiscBusinessPremiseID">FiscBusinessPremiseID</Label>
                                <Input id="FiscBusinessPremiseID" name="FiscBusinessPremiseID" defaultValue={selectedDevice?.FiscBusinessPremiseID} />
                            </Field>
                            {/*BLAGAJNA-FiscElectronicDeviceID*/}
                            <Field>
                                <Label htmlFor="FiscElectronicDeviceID">FiscElectronicDeviceID</Label>
                                <Input id="FiscElectronicDeviceID" name="FiscElectronicDeviceID" defaultValue={selectedDevice?.FiscElectronicDeviceID} />
                            </Field>
                            {/*FOOTER ZA BUTTENE*/}
                            <DialogFooter>
                                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </FieldGroup>
                    </form>
            </DialogContent>
        </Dialog>
    )
}
/*
FiscBusinessPremiseID
FiscElectronicDeviceID*/
