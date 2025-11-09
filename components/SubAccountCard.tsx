import { useCallback, useEffect, useMemo, useState } from "react";
import type { ICharacter, ISubAccount } from "@/libs/db";
import {
    EAllClass,
    EClassCategory,
    ECombatClass,
    ECraftingClass,
    EStorageClass,
} from "@/models/Class";
import { Pencil, Trash2 } from "lucide-react";
import { CharaterCard } from "./CharaterCard";
import { Modal } from "./Modal";
import { characterService } from "@/services/characterService";
import { subAccountService } from "@/services/subAccountService";

const MAX_CHARACTERS_PER_SUB_ACCOUNT = 2;
const CHARACTER_INDEX_SLOTS = [0, 2];
const DEFAULT_CARD_TIME = "0";

const fetchCharacters = async (subAccountId: number): Promise<ICharacter[]> => {
    try {
        return await characterService.getCharactersBySubAccountId(subAccountId);
    } catch (error) {
        console.error(error);
        return [];
    }
};

type CharacterListItem = ICharacter & { subAccountId: number };

const categoryToClasses: Record<EClassCategory, EAllClass[]> = {
    [EClassCategory.Combat]: Object.values(ECombatClass) as unknown as EAllClass[],
    [EClassCategory.Crafting]: Object.values(ECraftingClass) as unknown as EAllClass[],
    [EClassCategory.Storage]: Object.values(EStorageClass) as unknown as EAllClass[],
};

type CreateCharacterForm = {
    name: string;
    classCategory: EClassCategory;
    className: EAllClass;
    level: string;
    jobRank: string;
    note: string;
};

const getDefaultClassForCategory = (category: EClassCategory): EAllClass =>
    categoryToClasses[category][0];

const INITIAL_FORM: CreateCharacterForm = {
    name: "",
    classCategory: EClassCategory.Combat,
    className: getDefaultClassForCategory(EClassCategory.Combat),
    level: "1",
    jobRank: "",
    note: "",
};

type SubAccountCardProps = {
    subAccount: ISubAccount;
    onSubAccountMutate?: () => Promise<void> | void;
};

export const SubAccountCard = ({ subAccount, onSubAccountMutate }: SubAccountCardProps) => {

    const [rawCharacters, setRawCharacters] = useState<ICharacter[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [targetIndex, setTargetIndex] = useState<number | null>(null);
    const [newCharacter, setNewCharacter] = useState<CreateCharacterForm>(INITIAL_FORM);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdatingSubAccount, setIsUpdatingSubAccount] = useState(false);
    const [isDeletingSubAccount, setIsDeletingSubAccount] = useState(false);
    const [editForm, setEditForm] = useState({
        name: subAccount.name ?? "",
        note: subAccount.note ?? "",
    });

    const refreshCharacters = useCallback(async () => {
        if (!subAccount.id) {
            setRawCharacters([]);
            return;
        }
        const characters = await fetchCharacters(subAccount.id);
        setRawCharacters(characters);
    }, [subAccount.id]);

    useEffect(() => {
        refreshCharacters();
    }, [refreshCharacters]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const handleAutoUpdate = () => {
            void refreshCharacters();
        };
        window.addEventListener("gam:card-time-auto-updated", handleAutoUpdate);
        return () => {
            window.removeEventListener("gam:card-time-auto-updated", handleAutoUpdate);
        };
    }, [refreshCharacters]);

    useEffect(() => {
        setEditForm({
            name: subAccount.name ?? "",
            note: subAccount.note ?? "",
        });
    }, [subAccount]);

    const characterList = useMemo<CharacterListItem[]>(
        () =>
            rawCharacters
                .slice()
                .sort(
                    (a, b) =>
                        (a.index ?? Number.MAX_SAFE_INTEGER) -
                        (b.index ?? Number.MAX_SAFE_INTEGER),
                )
                .map(character => ({
                    ...character,
                    subAccountId: character.subId,
                })),
        [rawCharacters],
    );

    const slotEntries = useMemo(
        () => {
            const assigned = new Map<number, CharacterListItem>();
            const unindexed: CharacterListItem[] = [];

            characterList.forEach(character => {
                if (character.index === undefined) {
                    unindexed.push(character);
                    return;
                }
                assigned.set(character.index, character);
            });

            CHARACTER_INDEX_SLOTS.forEach(slotIndex => {
                if (!assigned.has(slotIndex) && unindexed.length > 0) {
                    assigned.set(slotIndex, unindexed.shift()!);
                }
            });

            return CHARACTER_INDEX_SLOTS.map(slotIndex => ({
                slotIndex,
                character: assigned.get(slotIndex),
            }));
        },
        [characterList],
    );

    const resetCreateForm = () => {
        setNewCharacter(INITIAL_FORM);
        setTargetIndex(null);
    };

    const resetEditForm = () => {
        setEditForm({
            name: subAccount.name ?? "",
            note: subAccount.note ?? "",
        });
    };

    const notifyParentOfChange = async () => {
        if (onSubAccountMutate) {
            await onSubAccountMutate();
        }
    };

    const handleCreateCharacter = async () => {
        if (
            !subAccount.id ||
            targetIndex === null
        ) {
            return;
        }

        const trimmedName = newCharacter.name.trim();
        if (!trimmedName) {
            alert("请输入角色名称");
            return;
        }

        const parsedLevel = Number(newCharacter.level);
        if (
            Number.isNaN(parsedLevel) ||
            parsedLevel < 1 ||
            parsedLevel > 120
        ) {
            alert("请输入 1 到 120 之间的等级");
            return;
        }

        try {
            setIsCreating(true);
            await characterService.createCharacter({
                subId: subAccount.id,
                name: trimmedName,
                class: newCharacter.className,
                level: parsedLevel,
                jobRank: newCharacter.jobRank.trim(),
                cardTime: DEFAULT_CARD_TIME,
                note: newCharacter.note.trim() || undefined,
                index: targetIndex,
            });

            await refreshCharacters();
            setIsCreateModalOpen(false);
            resetCreateForm();
        } catch (error) {
            console.error(error);
            alert("添加角色失败，请稍后重试");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteSubAccount = async () => {
        if (!subAccount.id || isDeletingSubAccount) {
            return;
        }

        const confirmed = window.confirm(`确定删除子账号「${subAccount.name}」吗？删除后将无法恢复。`);
        if (!confirmed) {
            return;
        }

        try {
            setIsDeletingSubAccount(true);
            await subAccountService.deleteSubAccount(subAccount.id);
            await notifyParentOfChange();
        } catch (error) {
            console.error(error);
            alert("删除子账号失败，请稍后重试");
        } finally {
            setIsDeletingSubAccount(false);
        }
    };

    const handleUpdateSubAccount = async () => {
        if (!subAccount.id || isUpdatingSubAccount) {
            return;
        }

        const trimmedName = editForm.name.trim();
        if (!trimmedName) {
            alert("请输入子账号名称");
            return;
        }

        try {
            setIsUpdatingSubAccount(true);
            await subAccountService.updateSubAccount(subAccount.id, {
                name: trimmedName,
                note: editForm.note.trim(),
            });
            await notifyParentOfChange();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("更新子账号失败，请稍后重试");
        } finally {
            setIsUpdatingSubAccount(false);
        }
    };

    return (
        <div className=" app-panel space-y-6 border-2 border-[var(--color-border-soft)] bg-[var(--color-surface-card)] p-4 sm:p-6">
            <div className=" flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
                <p className=" text-xl font-semibold text-[var(--color-text)] break-words">{subAccount?.name}</p>
                <div className=" flex flex-wrap gap-3 sm:gap-4 md:justify-end">
                    <button
                        className=" icon-button"
                        onClick={() => setIsEditModalOpen(true)}
                        title="编辑子账号"
                    >
                        <Pencil className=" w-4 h-4" />
                    </button>
                    <button
                        className=" icon-button hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]"
                        disabled={isDeletingSubAccount}
                        onClick={handleDeleteSubAccount}
                        title="删除子账号"
                    >
                        {isDeletingSubAccount ? (
                            "…"
                        ) : (
                            <Trash2 className=" w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
                {slotEntries.map(({ slotIndex, character }) =>
                    character ? (
                        <CharaterCard
                            key={character.id ?? `${subAccount.id}-${slotIndex}`}
                            character={character}
                            onCharacterMutate={refreshCharacters}
                        />
                    ) : (
                        <button
                            key={`${subAccount.id}-${slotIndex}`}
                            className=" flex h-full min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-panel)] text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            onClick={() => {
                                if (!subAccount.id) return;
                                setTargetIndex(slotIndex);
                                setIsCreateModalOpen(true);
                            }}
                        >
                            添加{slotIndex === 0 ? "左" : "右"}角色
                        </button>
                    ),
                )}
            </div>
            <Modal
                isShow={isCreateModalOpen}
                setModalShow={(show) => {
                    if (!show) {
                        resetCreateForm();
                    }
                    setIsCreateModalOpen(show);
                }}
            >
                <p className=" text-[var(--color-text)] font-semibold">
                    添加{targetIndex === 0 ? "左侧" : targetIndex === 2 ? "右侧" : ""}角色
                </p>
                <div className=" space-y-4 mt-4">
                    <label className=" block text-sm text-[var(--color-text-muted)]">
                        角色名称
                        <input
                            type="text"
                            className=" app-input mt-2"
                            value={newCharacter.name}
                            onChange={(event) =>
                                setNewCharacter(prev => ({
                                    ...prev,
                                    name: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label className=" block text-sm text-[var(--color-text-muted)]">
                        职业类型
                        <select
                            className=" app-select mt-2"
                            value={newCharacter.classCategory}
                            onChange={(event) => {
                                const category = event.target.value as EClassCategory;
                                const defaultClass = getDefaultClassForCategory(category);
                                setNewCharacter(prev => ({
                                    ...prev,
                                    classCategory: category,
                                    className: defaultClass,
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
                    <label className=" block text-sm text-[var(--color-text-muted)]">
                        职业
                        <select
                            className=" app-select mt-2"
                            value={newCharacter.className}
                            onChange={(event) =>
                                setNewCharacter(prev => ({
                                    ...prev,
                                    className: event.target.value as EAllClass,
                                }))
                            }
                        >
                            {categoryToClasses[newCharacter.classCategory].map(className => (
                                <option key={className} value={className}>
                                    {className}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className=" block text-sm text-[var(--color-text-muted)]">
                        等级
                        <input
                            type="number"
                            min={1}
                            max={120}
                            className=" app-input mt-2"
                            value={newCharacter.level}
                            onChange={(event) =>
                                setNewCharacter(prev => ({
                                    ...prev,
                                    level: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <label className=" block text-sm text-[var(--color-text-muted)]">
                        备注
                        <textarea
                            className=" app-input mt-2"
                            rows={3}
                            value={newCharacter.note}
                            onChange={(event) =>
                                setNewCharacter(prev => ({
                                    ...prev,
                                    note: event.target.value,
                                }))
                            }
                        />
                    </label>
                    <button
                        className=" app-btn-primary w-full"
                        onClick={handleCreateCharacter}
                        disabled={isCreating}
                    >
                        {isCreating ? "创建中..." : "确认创建"}
                    </button>
                </div>
            </Modal>
            <Modal
                isShow={isEditModalOpen}
                setModalShow={(show) => {
                    if (!show) {
                        resetEditForm();
                    }
                    setIsEditModalOpen(show);
                }}
            >
                <p className=" text-gray-900 font-semibold">编辑子账号</p>
                <div className=" space-y-4 mt-4">
                    <label className=" block text-sm text-gray-500">
                        子账号名称
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
                        onClick={handleUpdateSubAccount}
                        disabled={isUpdatingSubAccount}
                    >
                        {isUpdatingSubAccount ? "保存中..." : "保存"}
                    </button>
                </div>
            </Modal>
        </div>
    )
}
