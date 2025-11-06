import { db } from "@/libs/db";
import type { ITag, ITagColorSet } from "@/libs/db";

type CharacterTagRecord = ITag & { characterTagId: number };

const PRESET_TAG_COLOR_SETS: ITagColorSet[] = [
    { background: "#FDF2F8", border: "#F9A8D4", text: "#BE185D" },
    { background: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8" },
    { background: "#ECFEFF", border: "#67E8F9", text: "#0F766E" },
    { background: "#F0FDF4", border: "#6EE7B7", text: "#15803D" },
    { background: "#FEF3C7", border: "#FCD34D", text: "#B45309" },
    { background: "#F5F3FF", border: "#C4B5FD", text: "#5B21B6" },
    { background: "#FFF7ED", border: "#FDBA74", text: "#C2410C" },
    { background: "#EEF2FF", border: "#A5B4FC", text: "#3730A3" },
    { background: "#F8FAFC", border: "#CBD5F5", text: "#1E293B" },
    { background: "#F7FEE7", border: "#A3E635", text: "#3F6212" },
];

const colorSetKey = (colorSet: ITagColorSet): string =>
    [colorSet.background, colorSet.border, colorSet.text].join("|");

const createColorSetFromHue = (hue: number): ITagColorSet => ({
    background: `hsl(${hue} 90% 95%)`,
    border: `hsl(${hue} 65% 75%)`,
    text: `hsl(${hue} 60% 30%)`,
});

const pickUniqueColorSet = async (): Promise<ITagColorSet> => {
    const tags = await db.tags.toArray();
    const usedKeys = new Set(
        tags
            .map(tag => tag.colorSet)
            .filter((colorSet): colorSet is ITagColorSet => Boolean(colorSet))
            .map(colorSetKey),
    );

    const available = PRESET_TAG_COLOR_SETS.filter(colorSet => !usedKeys.has(colorSetKey(colorSet)));
    if (available.length) {
        const index = Math.floor(Math.random() * available.length);
        return available[index];
    }

    for (let attempt = 0; attempt < 8; attempt += 1) {
        const hue = Math.floor(Math.random() * 360);
        const candidate = createColorSetFromHue(hue);
        const candidateKey = colorSetKey(candidate);
        if (!usedKeys.has(candidateKey)) {
            return candidate;
        }
    }

    return createColorSetFromHue(Math.floor(Math.random() * 360));
};

export const tagService = {
    async getAllTags(): Promise<ITag[]> {
        return await db.tags.toArray();
    },

    async createTag(label: string, amount?: number): Promise<number> {
        const colorSet = await pickUniqueColorSet();
        return await db.tags.add({ label, amount, colorSet });
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
