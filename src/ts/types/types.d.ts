
declare type RatSelect_Selector = string | HTMLSelectElement | HTMLSelectElement[] | HTMLCollection | NodeList;

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

// Rollup
declare module 'consts:*' {
    const constant: any;
    export default constant;
}