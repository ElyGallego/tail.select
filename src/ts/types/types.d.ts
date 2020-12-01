
declare type RatSelect_SelectSelector = string | HTMLSelectElement | HTMLSelectElement[] | HTMLCollectionOf<HTMLSelectElement> | NodeListOf<HTMLSelectElement>;

declare type RatSelect_OptionSelector = HTMLOptionElement | HTMLOptionElement[] | HTMLCollectionOf<HTMLOptionElement> | NodeListOf<HTMLOptionElement>;

declare type RatSelect_ItemBasic = {
    [key: string]: string;
}

declare type RatSelect_ItemExtended = {
    title: string;
    group?: string;
    position?: number;
    selected?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    description?: string;
}

declare type RatSelect_Item = RatSelect_ItemBasic | RatSelect_ItemExtended;

declare type RatSelect_Events = {
    [key: string]: Function;
}

declare type RatSelect_OptionStates = {
    disabled?: boolean,
    selected?: boolean,
    hidden?: boolean
}

// Rollup
declare module 'consts:*' {
    const constant: any;
    export default constant;
}