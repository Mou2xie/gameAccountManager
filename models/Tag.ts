
export interface ITagColorSet {
    background: string;
    border: string;
    text: string;
}

export interface ITag {
    label: string;
    amount: number;
    colorSet?: ITagColorSet;
}
