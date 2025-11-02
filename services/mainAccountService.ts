import { db } from "@/libs/db";

export const mainAccountService = {
    createMainAccount: async (account: string) => {
        try {
            const mainAccount = await (db as any).mainAccounts.add({
                account,
            });
            return mainAccount;
        } catch (err) {
            throw err;
        }
    },
    deleteMainAccount: async (id: number) => {
        try {
            await (db as any).mainAccounts.delete(id);
        } catch (err) {
            throw err;
        }
    },
    updateMainAccount: async (id: number, account: string) => {
        try {
            await (db as any).mainAccounts.update(id, { account });
        } catch (err) {
            throw err;
        }
    }
};