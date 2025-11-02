import { db } from "@/libs/db";

export const mainAccountService = {
    async createMainAccount(account: string) {
        try {
            await (db as any).mainAccounts.add({
                account,
            });
            return true;
        } catch (err) {
            throw err;
        }
    },
    async deleteMainAccount(id: number) {
        try {
            await (db as any).mainAccounts.delete(id);
            return true;
        } catch (err) {
            throw err;
        }
    },
    async updateMainAccount(id: number, account: string) {
        try {
            await (db as any).mainAccounts.update(id, { account });
            return true;
        } catch (err) {
            throw err;
        }
    },
    async getAllMainAccounts() {
        try {
            const mainAccountsList = await (db as any).mainAccounts.toArray();
            return mainAccountsList;
        } catch (err) {
            throw err;
        }
    },
};