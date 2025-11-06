import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import type { ICharacter, ITag } from "@/libs/db";
import { Modal } from "./Modal";
import { tagService } from "@/services/tagService";
import { characterService } from "@/services/characterService";
import { Plus, Minus, Trash2, X, Pencil, HelpCircle } from "lucide-react";
import {
    EAllClass,
    EClassCategory,
    ECombatClass,
    ECraftingClass,
    EStorageClass,
} from "@/models/Class";

const MIN_CARD_TIME = 0;
const MAX_CARD_TIME = 6;
const MIN_LEVEL = 1;
const MAX_LEVEL = 120;

const categoryToClasses: Record<EClassCategory, EAllClass[]> = {
    [EClassCategory.Combat]: Object.values(ECombatClass) as unknown as EAllClass[],
    [EClassCategory.Crafting]: Object.values(ECraftingClass) as unknown as EAllClass[],
    [EClassCategory.Storage]: Object.values(EStorageClass) as unknown as EAllClass[],
};

const getDefaultClassForCategory = (category: EClassCategory): EAllClass =>
    categoryToClasses[category][0];

const getCategoryByClassName = (className?: string): EClassCategory => {
    if (className) {
        const match = Object.entries(categoryToClasses).find(([, classes]) =>
            classes.includes(className as EAllClass),
        );
        if (match) {
            return match[0] as EClassCategory;
        }
    }
    return EClassCategory.Combat;
};

const getNormalizedClassName = (
    category: EClassCategory,
    className?: string,
): EAllClass =>
    categoryToClasses[category].includes(className as EAllClass)
        ? (className as EAllClass)
        : getDefaultClassForCategory(category);

const buildTagStyle = (tag?: Pick<ITag, "colorSet">): CSSProperties => {
    if (!tag?.colorSet) {
        return {
            borderColor: "var(--color-primary)",
            backgroundColor: "var(--color-muted)",
            color: "var(--color-primary)",
        } satisfies CSSProperties;
    }
    return {
        borderColor: tag.colorSet.border,
        backgroundColor: tag.colorSet.background,
        color: tag.colorSet.text,
    } satisfies CSSProperties;
};

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

    const initialCategory = getCategoryByClassName(characterClass);

    const [assignedTags, setAssignedTags] = useState<CharacterTag[]>([]);
    const [availableTags, setAvailableTags] = useState<ITag[]>([]);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isTagEditMode, setIsTagEditMode] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState<string>("");
    const [newTagLabel, setNewTagLabel] = useState("");
    const [newTagAmount] = useState("");
    const [isSavingTag, setIsSavingTag] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState(() => ({
        name: name ?? "",
        classCategory: initialCategory,
        className: getNormalizedClassName(initialCategory, characterClass),
        level: String(level ?? MIN_LEVEL),
        jobRank: jobRank ?? "",
        note: character.note ?? "",
    }));

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

    useEffect(() => {
        if (isEditModalOpen) {
            return;
        }
        const category = getCategoryByClassName(characterClass);
        setEditForm({
            name: name ?? "",
            classCategory: category,
            className: getNormalizedClassName(category, characterClass),
            level: String(level ?? MIN_LEVEL),
            jobRank: jobRank ?? "",
            note: character.note ?? "",
        });
    }, [character.note, characterClass, isEditModalOpen, jobRank, level, name]);

    const loadAvailableTags = useCallback(async () => {
        const tags = await tagService.getAllTags();
        setAvailableTags(tags);
    }, []);

    const handleOpenTagModal = async () => {
        await loadAvailableTags();
        setIsTagEditMode(false);
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

    const handleOpenEditModal = () => {
        const category = getCategoryByClassName(characterClass);
        setEditForm({
            name: name ?? "",
            classCategory: category,
            className: getNormalizedClassName(category, characterClass),
            level: String(level ?? MIN_LEVEL),
            jobRank: jobRank ?? "",
            note: character.note ?? "",
        });
        setIsEditModalOpen(true);
    };

    const handleSubmitEdit = async () => {
        if (!characterId) {
            return;
        }
        const trimmedName = editForm.name.trim();
        if (!trimmedName) {
            alert("请输入角色名称");
            return;
        }
        const parsedLevel = Number(editForm.level);
        if (
            Number.isNaN(parsedLevel) ||
            parsedLevel < MIN_LEVEL ||
            parsedLevel > MAX_LEVEL
        ) {
            alert(`请输入 ${MIN_LEVEL} 到 ${MAX_LEVEL} 之间的等级`);
            return;
        }
        try {
            await characterService.updateCharacter(characterId, {
                name: trimmedName,
                class: editForm.className,
                level: parsedLevel,
                jobRank: editForm.jobRank.trim() || undefined,
                note: editForm.note.trim() || undefined,
            });
            setIsEditModalOpen(false);
            await onCharacterMutate?.();
        } catch (error) {
            console.error(error);
            alert("更新角色失败，请稍后重试");
        }
    };

    const handleAdjustLevel = async (delta: number) => {
        if (!characterId) {
            return;
        }
        const numericLevel = Number(level ?? MIN_LEVEL);
        const nextValue = Math.min(
            MAX_LEVEL,
            Math.max(MIN_LEVEL, numericLevel + delta),
        );
        if (Number.isNaN(numericLevel) || nextValue === numericLevel) {
            return;
        }
        try {
            await characterService.updateCharacter(characterId, {
                level: nextValue,
            });
            await onCharacterMutate?.();
        } catch (error) {
            console.error(error);
            alert("更新等级失败，请稍后重试");
        }
    };

    const tagPillClassName =
        "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border transition-colors";

    const handleAdjustCardTime = async (delta: number) => {
        if (!characterId) {
            return;
        }
        const numericTime = Number(cardTime ?? MIN_CARD_TIME);
        const nextValue = Math.min(
            MAX_CARD_TIME,
            Math.max(MIN_CARD_TIME, numericTime + delta),
        );
        if (nextValue === numericTime) {
            return;
        }
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

    const handleDeleteTag = async (tagId: number, label: string) => {
        const confirmed = window.confirm(`确定删除物品「${label}」吗？该物品将从所有角色中移除。`);
        if (!confirmed) return;
        try {
            await tagService.deleteTag(tagId);
            await loadAvailableTags();
            await loadAssignedTags();
        } catch (error) {
            console.error(error);
            alert("删除物品失败，请稍后再试");
        }
    };

    return (
        <div className=" app-panel p-5 space-y-3 flex flex-col">
            <div className=" grid grid-cols-3 border-b border-[var(--color-border-strong)] pb-3">
                <div className=" space-y-1">
                    <p className=" text-xl text-gray-700">{name}</p>
                    <p className=" text-sm text-[var(--color-accent)]">
                        职业：{characterClass || "未设置"}
                    </p>
                </div>
                <div className=" flex items-center text-[var(--color-accent)] justify-center">
                    <button
                        className=" p-1 border rounded-full border-[var(--color-accent)] cursor-pointer disabled:opacity-50"
                        onClick={() => handleAdjustLevel(-1)}
                        disabled={!characterId || level <= MIN_LEVEL}
                    >
                        <Minus className=" w-4 h-4" />
                    </button>
                    <span className="  text-sm font-medium min-w-[60px] text-center">Lv {level}</span>
                    <button
                        className=" p-1 border rounded-full border-[var(--color-accent)] cursor-pointer disabled:opacity-50"
                        onClick={() => handleAdjustLevel(1)}
                        disabled={!characterId || level >= MAX_LEVEL}
                    >
                        <Plus className=" w-4 h-4" />
                    </button>
                </div>
                <div className=" flex items-center justify-end text-[var(--color-accent)]">
                    <button
                        className=" p-1 border rounded-full border-[var(--color-accent)] cursor-pointer disabled:opacity-50"
                        onClick={() => handleAdjustCardTime(-1)}
                        disabled={!characterId}
                    >
                        <Minus className=" w-4 h-4" />
                    </button>
                    <span className=" text-sm font-medium min-w-[72px] text-center">{displayCardTime}</span>
                    <button
                        className=" p-1 border rounded-full border-[var(--color-accent)] cursor-pointer disabled:opacity-50"
                        onClick={() => handleAdjustCardTime(1)}
                        disabled={!characterId}
                    >
                        <Plus className=" w-4 h-4" />
                    </button>
                    <div className=" relative ml-3 group">
                        <HelpCircle
                            className=" w-4 h-4 text-(--color-primary) cursor-pointer"
                            aria-label="卡时说明"
                        />
                        <span className=" pointer-events-none absolute left-1/2 bottom-full z-10 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                            卡时每天6点自动+1
                        </span>
                    </div>
                </div>
            </div>
            <div className=" space-y-3 grow">
                <p className=" text-sm text-[var(--color-accent)]">物品</p>
                <div className=" flex flex-wrap gap-2 items-center">
                    {assignedTags.map(tag => (
                        <span
                            key={tag.characterTagId}
                            className={tagPillClassName}
                            style={buildTagStyle(tag)}
                        >
                            {tag.label}
                            {tag.amount ? `(${tag.amount})` : ""}
                            <button
                                className=" text-current opacity-70 hover:opacity-100 cursor-pointer hover:text-rose-500"
                                onClick={() => handleRemoveTag(tag.id)}
                                title="移除物品"
                            >
                                <X className=" w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <button
                        className=" px-3 py-1 rounded-full text-xs font-medium border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition"
                        onClick={handleOpenTagModal}
                        disabled={!characterId}
                        title="添加物品"
                    >
                        <Plus className=" w-3 h-3 inline-block mr-1" /> 添加
                    </button>
                </div>
            </div>
            <div className=" flex justify-end gap-4 ">
                <button
                    className=" text-[var(--color-primary)] hover:text-[var(--color-accent)] transition cursor-pointer"
                    onClick={handleOpenEditModal}
                    disabled={!characterId}
                    title="编辑角色"
                >
                    <Pencil className=" w-5 h-5" />
                </button>
                <button
                    className=" text-[var(--color-primary)] hover:text-[var(--color-accent)] transition cursor-pointer"
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
                        setIsTagEditMode(false);
                    }
                    setIsTagModalOpen(show);
                }}
            >
                <p className=" text-gray-500 font-semibold">添加物品</p>
                <div className="mt-3">
                    <div>
                        <div className=" flex items-center justify-between">
                            <p className=" text-sm text-gray-500">从已有物品中选择</p>
                            <button
                                type="button"
                                className=" text-xs text-gray-400 hover:text-gray-600 transition"
                                onClick={() => setIsTagEditMode(prev => !prev)}
                            >
                                {isTagEditMode ? "完成编辑" : "编辑物品"}
                            </button>
                        </div>
                        <div className=" flex flex-wrap gap-2 mt-3">
                            {availableTags.length > 0 ? (
                                availableTags.map(tag => {
                                    const tagId = tag.id;
                                    if (tagId === undefined) {
                                        return null;
                                    }
                                    const alreadyAssigned = assignedTagIds.has(tagId);
                                    const canAttach = !alreadyAssigned && !isTagEditMode && !isSavingTag;
                                    return (
                                        <span
                                            key={tagId}
                                            className={`${tagPillClassName} ${alreadyAssigned
                                                ? " cursor-default border-gray-200 bg-gray-50 text-gray-400"
                                                : canAttach
                                                    ? " cursor-pointer hover:opacity-90"
                                                    : " cursor-default"}`}
                                            style={alreadyAssigned ? undefined : buildTagStyle(tag)}
                                            onClick={() => {
                                                if (!canAttach) {
                                                    return;
                                                }
                                                void handleAttachExistingTag(tagId);
                                            }}
                                            role="button"
                                            tabIndex={canAttach ? 0 : -1}
                                            onKeyDown={(event) => {
                                                if (!canAttach) {
                                                    return;
                                                }
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    void handleAttachExistingTag(tagId);
                                                }
                                            }}
                                            aria-disabled={!canAttach}
                                        >
                                            <span className={` text-current ${alreadyAssigned ? " opacity-60" : ""}`}>
                                                {tag.label}
                                            </span>
                                            {isTagEditMode && (
                                                <span
                                                    role="button"
                                                    tabIndex={0}
                                                    className=" text-current opacity-60 hover:opacity-100 cursor-pointer hover:text-rose-500"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleDeleteTag(tagId, tag.label);
                                                    }}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter" || event.key === " ") {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            handleDeleteTag(tagId, tag.label);
                                                        }
                                                    }}
                                                    title="删除物品"
                                                >
                                                    <X className=" w-3 h-3" />
                                                </span>
                                            )}
                                        </span>
                                    );
                                })
                            ) : (
                                <p className=" text-xs text-gray-400">暂无物品</p>
                            )}
                        </div>
                    </div>
                    <label className=" block text-sm text-gray-500 mb-5 border-t border-gray-200 pt-5 mt-5">
                        创建新物品
                        <input
                            type="text"
                            className=" mt-2 input input-bordered w-full focus:outline-none"
                            value={newTagLabel}
                            onChange={(event) => setNewTagLabel(event.target.value)}
                            placeholder="物品名称"
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
            <Modal
                isShow={isEditModalOpen}
                setModalShow={(show) => setIsEditModalOpen(show)}
            >
                <p className=" text-gray-900 font-semibold">编辑角色</p>
                <div className=" space-y-4 mt-4">
                    <label className=" block text-sm text-gray-500">
                        角色名称
                        <input
                            type="text"
                            className=" app-input mt-2"
                            value={editForm.name}
                            onChange={(event) =>
                                setEditForm(prev => ({
                                    ...prev,
                                    name: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label className=" block text-sm text-gray-500">
                        职业类型
                        <select
                            className=" app-select mt-2"
                            value={editForm.classCategory}
                            onChange={(event) => {
                                const category = event.target.value as EClassCategory;
                                setEditForm(prev => ({
                                    ...prev,
                                    classCategory: category,
                                    className: getDefaultClassForCategory(category),
                                }));
                            }}
                        >
                            {Object.values(EClassCategory).map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className=" block text-sm text-gray-500">
                        职业
                        <select
                            className=" app-select mt-2"
                            value={editForm.className}
                            onChange={(event) =>
                                setEditForm(prev => ({
                                    ...prev,
                                    className: event.target.value as EAllClass,
                                }))
                            }
                        >
                            {categoryToClasses[editForm.classCategory].map(className => (
                                <option key={className} value={className}>
                                    {className}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className=" block text-sm text-gray-500">
                        等级
                        <input
                            type="number"
                            min={MIN_LEVEL}
                            max={MAX_LEVEL}
                            className=" app-input mt-2"
                            value={editForm.level}
                            onChange={(event) =>
                                setEditForm(prev => ({
                                    ...prev,
                                    level: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label className=" block text-sm text-gray-500">
                        备注
                        <textarea
                            className=" app-input mt-2"
                            rows={3}
                            value={editForm.note}
                            onChange={(event) =>
                                setEditForm(prev => ({
                                    ...prev,
                                    note: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <button
                        className=" app-btn-primary w-full"
                        onClick={handleSubmitEdit}
                    >
                        保存
                    </button>
                </div>
            </Modal>
        </div>
    );
};
