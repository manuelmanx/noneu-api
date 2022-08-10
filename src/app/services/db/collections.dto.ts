
export enum $CollectionsKeysType{
    "user"="user",
    "refreshToken"="refreshToken"
}
export type $CollectionsInterface={
    [key in $CollectionsKeysType]:$GenericCollectionInterface|undefined;
}

export interface $GenericCollectionInterface{
    create:(data:any) => Promise<any>;
    find: (query:any) => Promise<any>;
    filter:(query:any) => Promise<any[]>;
    delete:(query:any) => Promise<string>;
    update:(query:any, data:any)=> Promise<boolean>;
}