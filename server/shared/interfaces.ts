export interface Package {
    name: string;
    version: string;
    description: string;
    main: string;
}

export interface LogEvent {
    message: string;
    data?: any;
    level: "error" | "warn" | "info" | "verbose" | "debug" | "silly";
    group?: string;
}


export interface CorePacket {
    id?: string;
    data?: any;
    apikey?: string;
    alarm?: boolean;
    warning?: boolean;
    shared?: boolean;
    public?: boolean;
    workflowCode?: string;
    key?: string; // todo: is this secret?
    [index: string]: any;
    err: string;
}

export interface DBchange {
    operationType: "insert" | "replace";
    clusterTime: any;
    fullDocument: CorePacket;
    ns: { db: string, coll: string }
    documentKey: any
}

export interface User {
    email: string;
    username: string;
    apikey: string;
    publickey: string;
    level: number;
}
