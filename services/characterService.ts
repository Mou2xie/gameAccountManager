import { db } from "@/libs/db";
import type { ICharacter } from "@/libs/db";

export const characterService = {
    async getCharactersBySubAccountId(subAccountId: number): Promise<ICharacter[]> {
        const characters = await db.characters
            .where("subId")
            .equals(subAccountId)
            .toArray();
        return characters.sort(
            (a, b) =>
                (a.index ?? Number.MAX_SAFE_INTEGER) -
                (b.index ?? Number.MAX_SAFE_INTEGER),
        );
    },

    async createCharacter(
        character: Omit<ICharacter, "id">,
    ): Promise<number> {
        const id = await db.characters.add(character);
        return id;
    },

    async updateCharacter(id: number, updates: Partial<ICharacter>) {
        await db.characters.update(id, updates);
    },

    async deleteCharacter(id: number) {
        await db.characters.delete(id);
    },
};
