import { db } from "@/libs/db";
import type { ISubAccount } from "@/libs/db";

export const subAccountService = {
    async createSubAccount(
        mainId: number,
        name: string,
        note: string = "",
    ): Promise<number> {
        return await db.subAccounts.add({
            mainId,
            name,
            note,
        });
    },

    async getSubAccountsByMainId(mainId: number): Promise<ISubAccount[]> {
        return await db.subAccounts
            .where("mainId")
            .equals(mainId)
            .sortBy("id");
    },

    async deleteSubAccount(id: number): Promise<void> {
        await db.subAccounts.delete(id);
    },

    async updateSubAccount(
        id: number,
        updates: Pick<ISubAccount, "name" | "note">,
    ): Promise<void> {
        await db.subAccounts.update(id, updates);
    },
};
