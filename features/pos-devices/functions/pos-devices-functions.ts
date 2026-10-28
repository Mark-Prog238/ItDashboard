// lib/pingVnc.ts
import net from 'net';
import {checkHostVncStatus} from "@/app/actions/checkVnc";
import {pingDeviceStatusToast} from "@/app/actions/toasts";
export interface TcpPingResult {
    host: string;
    port: number;
    online: boolean;
    latencyMs?: number;
    banner?: string; // e.g., "RFB 003.008" if it's a real VNC server
    error?: string;
}

export function pingVncPort(
    host: string,
    port: number = 5900,
    timeoutMs: number = 3000
): Promise<TcpPingResult> {
    return new Promise((resolve) => {
        const start = performance.now();
        const socket = new net.Socket();
        let settled = false;

        const finalize = (result: TcpPingResult) => {
            if (!settled) {
                settled = true;
                socket.destroy();
                resolve(result);
            }
        };

        socket.setTimeout(timeoutMs);

        // 1. TCP Handshake succeeded (Port is open!)
        socket.on('connect', () => {
            const latencyMs = Math.round(performance.now() - start);

            // Wait up to 300ms to see if VNC sends its "RFB 003.xxx" greeting banner
            setTimeout(() => {
                finalize({ host, port, online: true, latencyMs });
            }, 300);
        });

        // 2. Optional: Capture the VNC RFB protocol banner
        socket.once('data', (data) => {
            const latencyMs = Math.round(performance.now() - start);
            const banner = data.toString('utf-8').trim();
            finalize({ host, port, online: true, latencyMs, banner });
        });

        // 3. Timeout or Connection Refused
        socket.on('timeout', () => {
            finalize({ host, port, online: false, error: 'Connection timed out' });
        });

        socket.on('error', (err) => {
            finalize({ host, port, online: false, error: err.message });
        });

        socket.connect(port, host);
    });
}

export const pingDevice = async (ip: string) => {
    const res = await checkHostVncStatus(ip, 5900);
    if (res.online) {
        const msg = `Čas odziva: ${res.latencyMs}ms`
        pingDeviceStatusToast(ip, "ONLINE", msg)
    } else {
        const msg = `OFLINE (${res.error})`
        pingDeviceStatusToast(ip, "OFLINE", msg)
    }
}

