import Dexie, { Table } from "dexie";

export interface ICharacter {
    id?: number;
    subId: number;
    name: string;
    class?: string;
    level: number;
    jobRank?: string;
    note?: string;
    cardTime?: string;
    index?: number;
}

export interface ISubAccount {
    id?: number;
    mainId: number;
    name: string;
    note?: string;
}

export interface IMainAccount {
    id?: number;
    account: string;
}

export interface ITagColorSet {
    background: string;
    border: string;
    text: string;
}

export interface ITag {
    id?: number;
    label: string;
    amount?: number;
    colorSet?: ITagColorSet;
}

export interface ICharacterTag {
    id?: number;
    charId: number;
    tagId: number;
}

export class GameDB extends Dexie {
    characters!: Table<ICharacter>;
    subAccounts!: Table<ISubAccount>;
    mainAccounts!: Table<IMainAccount>;
    tags!: Table<ITag>;
    characterTags!: Table<ICharacterTag>;

    constructor() {
        super("GameAccountManagerDB");
        this.version(1).stores({
            mainAccounts: "++id, account",
            subAccounts: "++id, mainId, name, note",
            characters: "++id, subId, name, class, level, jobRank, note, cardTime, index",
            tags: "++id, label, amount",
            characterTags: "++id, charId, tagId, [charId+tagId]"
        });
    }
}

export const db = new GameDB();
