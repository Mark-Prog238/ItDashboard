'use server'

import { pingVncPort} from "./pos-devices-functions-pingVnc";

export async function checkHostVncStatus(ip: string, port = 5900) {
    const result = await pingVncPort(ip, port, 2500);
    return result;
}