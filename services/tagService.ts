import { db } from "@/libs/db";
import type { ITag } from "@/libs/db";

type CharacterTagRecord = ITag & { characterTagId: number };

export const tagService = {
    async getAllTags(): Promise<ITag[]> {
        return await db.tags.toArray();
    },

    async createTag(label: string, amount?: number): Promise<number> {
        return await db.tags.add({ label, amount });
    },

    async getTagsByCharacterId(characterId: number): Promise<CharacterTagRecord[]> {
        const relationships = await db.characterTags
            .where("charId")
            .equals(characterId)
            .toArray();

        if (!relationships.length) {
            return [];
        }

        const tagIds = relationships.map(rel => rel.tagId);
        const tags = tagIds.length ? await db.tags.bulkGet(tagIds) : [];
        const tagsById = new Map(
            tags
                .filter((tag): tag is ITag & { id: number } => Boolean(tag?.id))
                .map(tag => [tag.id, tag]),
        );

        return relationships
            .map(rel => {
                const tag = tagsById.get(rel.tagId);
                if (!tag) {
                    return null;
                }
                return {
                    ...tag,
                    characterTagId: rel.id!,
                } satisfies CharacterTagRecord;
            })
            .filter(Boolean) as CharacterTagRecord[];
    },

    async attachTagToCharacter(characterId: number, tagId: number): Promise<number | undefined> {
        const existing = await db.characterTags
            .where({ charId: characterId, tagId })
            .first();

        if (existing) {
            return existing.id;
        }

        return await db.characterTags.add({ charId: characterId, tagId });
    },

    async detachTagFromCharacter(characterId: number, tagId: number): Promise<void> {
        const link = await db.characterTags
            .where({ charId: characterId, tagId })
            .first();
        if (!link?.id) {
            return;
        }
        await db.characterTags.delete(link.id);
    },

    async deleteTag(tagId: number): Promise<void> {
        await db.transaction("rw", db.tags, db.characterTags, async () => {
            await db.characterTags.where("tagId").equals(tagId).delete();
            await db.tags.delete(tagId);
        });
    },
};
