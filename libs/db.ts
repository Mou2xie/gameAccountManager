import Dexie from "dexie";

export const db = new Dexie("GameAccountManagerDB");

// 定义表结构
const tables = {
    mainAccounts: "++id, account", // 主账号表
    subAccounts: "++id, mainId, name, note", // 子账号表
    characters: "++id, subId, name, class, level, jobRank, note, cardTime, index", // 角色表
    tags: "++id, label, amount", // 标签表
    characterTags: "++id, charId, tagId, [charId+tagId]" // 角色标签关联表
};

db.version(1).stores(tables);