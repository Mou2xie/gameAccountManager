import { useCallback, useEffect, useMemo, useState } from "react";
import type { ICharacter, ITag } from "@/libs/db";
import { Modal } from "./Modal";
import { tagService } from "@/services/tagService";
import { characterService } from "@/services/characterService";
import { Plus, Minus, Trash2, X } from "lucide-react";

type CharacterCardProps = {
    character: ICharacter & { subAccountId: number };
    onCharacterMutate?: () => Promise<void> | void;
};

type CharacterTag = ITag & { characterTagId: number };

export const CharaterCard = ({ character, onCharacterMutate }: CharacterCardProps) => {
    const {
        id: characterId,
        name,
        level,
        class: characterClass,
        jobRank,
        cardTime,
    } = character;

    const [assignedTags, setAssignedTags] = useState<CharacterTag[]>([]);
    const [availableTags, setAvailableTags] = useState<ITag[]>([]);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState<string>("");
    const [newTagLabel, setNewTagLabel] = useState("");
    const [newTagAmount] = useState("");
    const [isSavingTag, setIsSavingTag] = useState(false);

    const displayCardTime = cardTime ? `${cardTime} 小时` : "未打卡";

    const loadAssignedTags = useCallback(async () => {
        if (!characterId) {
            setAssignedTags([]);
            return;
        }
        const tags = await tagService.getTagsByCharacterId(characterId);
        setAssignedTags(tags);
    }, [characterId]);

    useEffect(() => {
        loadAssignedTags();
    }, [loadAssignedTags]);

    const loadAvailableTags = useCallback(async () => {
        const tags = await tagService.getAllTags();
        setAvailableTags(tags);
    }, []);

    const handleOpenTagModal = async () => {
        await loadAvailableTags();
        setIsTagModalOpen(true);
    };

    const assignedTagIds = useMemo(() => {
        return new Set(
            assignedTags
                .map(tag => tag.id)
                .filter((id): id is number => typeof id === "number"),
        );
    }, [assignedTags]);

    const handleAttachExistingTag = async (tagId: number) => {
        if (!characterId) {
            return;
        }

        try {
            setIsSavingTag(true);
            await tagService.attachTagToCharacter(characterId, tagId);
            await loadAssignedTags();
            setSelectedTagId("");
        } catch (error) {
            console.error(error);
            alert("添加物品失败，请稍后再试");
        } finally {
            setIsSavingTag(false);
        }
    };

    const handleCreateAndAttachTag = async () => {
        if (!characterId) {
            return;
        }
        const label = newTagLabel.trim();
        if (!label) {
            alert("请输入物品名称");
            return;
        }
        try {
            setIsSavingTag(true);
            const newTagId = await tagService.createTag(label);
            await tagService.attachTagToCharacter(characterId, newTagId);
            await loadAvailableTags();
            await loadAssignedTags();
            setNewTagLabel("");
        } catch (error) {
            console.error(error);
            alert("创建物品失败，请稍后再试");
        } finally {
            setIsSavingTag(false);
        }
    };

    const handleRemoveTag = async (tagId?: number) => {
        if (!characterId || !tagId) {
            return;
        }
        try {
            await tagService.detachTagFromCharacter(characterId, tagId);
            await loadAssignedTags();
        } catch (error) {
            console.error(error);
            alert("移除物品失败，请稍后再试");
        }
    };

    const badgeClassName = "border border-gray-400 text-gray-600 bg-white";

    const handleAdjustCardTime = async (delta: number) => {
        if (!characterId) {
            return;
        }
        const numericTime = Number(cardTime ?? 0);
        const nextValue = Math.max(0, numericTime + delta);
        try {
            await characterService.updateCharacter(characterId, {
                cardTime: nextValue.toString(),
            });
            await onCharacterMutate?.();
        } catch (error) {
            console.error(error);
            alert("更新时间失败，请稍后重试");
        }
    };

    const handleDeleteCharacter = async () => {
        if (!characterId) {
            return;
        }
        const confirmed = window.confirm(`确定删除角色「${name}」吗？`);
        if (!confirmed) {
            return;
        }
        try {
            await characterService.deleteCharacter(characterId);
            await onCharacterMutate?.();
        } catch (error) {
            console.error(error);
            alert("删除角色失败，请稍后重试");
        }
    };

    return (
        <div className=" app-panel p-6 space-y-4 shadow-sm">
            <div className=" flex items-center justify-between">
                <div className=" space-y-1">
                    <p className=" font-semibold text-gray-900">{name}</p>
                    <p className=" text-sm text-gray-500">Lv {level}</p>
                </div>
                <div className=" flex items-center gap-3 text-gray-600">
                    <button
                        className=" icon-button border-rose-300 text-rose-500"
                        onClick={() => handleAdjustCardTime(-1)}
                        disabled={!characterId}
                    >
                        <Minus className=" w-4 h-4" />
                    </button>
                    <span className=" text-sm font-medium min-w-[72px] text-center">{displayCardTime}</span>
                    <button
                        className=" icon-button border-rose-300 text-rose-500"
                        onClick={() => handleAdjustCardTime(1)}
                        disabled={!characterId}
                    >
                        <Plus className=" w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className=" space-y-2 text-sm text-gray-600">
                    <p>
                        职业：<span className=" text-gray-800">{characterClass || "未设置"}</span>
                    </p>
                    <p>
                        阶级：<span className=" text-gray-800">{jobRank || "未设置"}</span>
                    </p>
                </div>
                <div className=" space-y-2">
                    <div className=" flex items-center justify-between">
                        <p className=" text-sm text-gray-500">物品</p>
                    </div>
                    <div className=" flex flex-wrap gap-2 items-center">
                        {assignedTags.length === 0 && (
                            <span className=" text-xs text-gray-400">暂无物品</span>
                        )}
                        {assignedTags.map(tag => (
                            <span
                                key={tag.characterTagId}
                                className={` px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badgeClassName}`}
                            >
                                {tag.label}
                                {tag.amount ? `(${tag.amount})` : ""}
                                <button
                                    className=" text-gray-500 hover:text-rose-500"
                                    onClick={() => handleRemoveTag(tag.id)}
                                    title="移除物品"
                                >
                                    <X className=" w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button
                            className=" icon-button"
                            onClick={handleOpenTagModal}
                            disabled={!characterId}
                            title="添加物品"
                        >
                            <Plus className=" w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div className=" flex justify-end">
                <button
                    className=" text-gray-400 hover:text-rose-500 transition"
                    onClick={handleDeleteCharacter}
                    disabled={!characterId}
                    title="删除角色"
                >
                    <Trash2 className=" w-5 h-5" />
                </button>
            </div>
            <Modal
                isShow={isTagModalOpen}
                setModalShow={(show) => {
                    if (!show) {
                        setSelectedTagId("");
                        setNewTagLabel("");
                    }
                    setIsTagModalOpen(show);
                }}
            >
                <p className=" text-gray-500 font-semibold">添加物品</p>
                <div className=" space-y-4 mt-4">
                    <div className=" space-y-2">
                        <p className=" text-sm text-gray-500">从已有物品中选择</p>
                        <div className=" flex flex-wrap gap-2">
                            {availableTags.length > 0 ? (
                                availableTags.map(tag => {
                                    const tagId = tag.id;
                                    if (tagId === undefined) {
                                        return null;
                                    }
                                    const alreadyAssigned = assignedTagIds.has(tagId);
                                    return (
                                        <button
                                            key={tagId}
                                            className={` px-3 py-1 rounded-full text-xs font-medium border transition border-gray-200 text-gray-600 ${
                                                alreadyAssigned ? " opacity-40 cursor-not-allowed" : " hover:border-info hover:text-info"
                                            }`}
                                            onClick={() => {
                                                if (alreadyAssigned) return;
                                                handleAttachExistingTag(tagId);
                                            }}
                                            type="button"
                                            disabled={alreadyAssigned}
                                        >
                                            {tag.label}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className=" text-xs text-gray-400">暂无可用物品</p>
                            )}
                        </div>
                    </div>
                    <div className=" divider">或</div>
                    <label className=" block text-sm text-gray-500">
                        新物品名称
                        <input
                            type="text"
                            className=" mt-1 input input-bordered w-full focus:outline-none"
                            value={newTagLabel}
                            onChange={(event) => setNewTagLabel(event.target.value)}
                            placeholder="如：魔泉、血瓶等"
                        />
                    </label>
                    <button
                        className=" app-btn-primary w-full"
                        onClick={handleCreateAndAttachTag}
                        disabled={isSavingTag}
                    >
                        创建并添加
                    </button>
                </div>
            </Modal>
        </div>
    );
};
