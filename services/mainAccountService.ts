import { db, type IMainAccount } from "@/libs/db";

export const mainAccountService = {
    async createMainAccount(account: string) {
        try {
            const newAccountId = await db.mainAccounts.add({
                account,
            });
            return newAccountId;
        } catch (err) {
            throw err;
        }
    },
    async deleteMainAccount(id: number) {
        try {
            await db.mainAccounts.delete(id);
            return true;
        } catch (err) {
            throw err;
        }
    },
    async getAllMainAccounts(): Promise<IMainAccount[]> {
        try {
            const mainAccountsList = await db.mainAccounts.toArray();
            return mainAccountsList;
        } catch (err) {
            throw err;
        }
    },
};
