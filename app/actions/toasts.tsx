import {toast} from "@/components/ui/toast";



export function pingDeviceStatusToast(IP: string, status: string, msg: string) {
    const id = toast.add({
        title: `Naprava ${IP} ${status}`,
        description: msg,
        actionProps: {
            onClick() {
                toast.close(id)
            },
        },
    })
}
