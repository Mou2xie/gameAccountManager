import { EAllClass } from "./Class";
import { EJobRank } from "./JobRank";
import { ITag } from "./Tag";


export interface ICharacter {
    name: string;
    level: number;
    class: EAllClass;
    jobRank: EJobRank;
    items: ITag[];
    note: string;
}