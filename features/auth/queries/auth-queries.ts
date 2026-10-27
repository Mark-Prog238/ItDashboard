import {dashboardDB} from "@/lib/db/pg-pool";
export async function getUserGroups(userid: string) {
    try {
        const res = await dashboardDB.query(`
            SELECT * FROM ad_user_groups WHERE user_id = $1`, [userid])
        if (res.rows.length === 0) {
            return null;
        }
        return res.rows[0].user_groups;
    } catch(error) {
        console.error("Error fetching user groups:", error);
    }
}

export async function updateUserGroups(userId: string, groups: string[]): Promise<boolean> {
    try {
        await dashboardDB.query(
            `INSERT INTO ad_user_groups (user_id, user_groups, last_updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET 
                user_groups = EXCLUDED.user_groups,
                last_updated_at = NOW()`,
            [userId, groups]
        );

        return true;
    } catch (error) {
        console.error("Error updating user groups:", error);
        return false;
    }
}