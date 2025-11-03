import { db } from "@/libs/db";

export const subAccountService = {
    async createSubAccount(mainId: number, name: string, note: string = "") {
        try {
            return await (db as any).subAccounts.add({
                mainId,
                name,
                note,
            });
        } catch (err) {
            throw err;
        }
    },
};