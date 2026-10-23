import {endpointCentralDB} from "@/lib/pg_db";

const now: Date = new Date();
export const soonToExpirePasswordUsers = async () => {
    const minTimeMs: number = now.getTime();
    const maxTimeMs = minTimeMs + (86400000 * 10000);
    console.log(minTimeMs);
    console.log(maxTimeMs);



    const result = await endpointCentralDB.query(`
        SELECT
            p.resource_id,
            p.bad_pwd_time
        FROM aduserpwdinfo p
        WHERE p.bad_pwd_time >= $1;
`, [minTimeMs]);

    return result;
};

soonToExpirePasswordUsers()
    .then((res) => console.log("REZULTAT:", res.rows))
    .catch((err) => console.error("NAPAKA:", err));