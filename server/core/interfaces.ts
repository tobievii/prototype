import { Core } from "../core/core";

export interface Package {
    name: string;
    version: string;
    description: string;
    main: string;
}

export interface LogEvent {
    message: string;
    data?: object;
    level: "error" | "warn" | "info" | "verbose" | "debug" | "silly";
}


export interface CorePacket {
    id: string;
    data: any;
    apikey?: string;
    [index: string]: any;
}

export interface DBchange {
    operationType: "insert" | "replace";
    clusterTime: any;
    fullDocument: CorePacket;
    ns: { db: string, coll: string }
    documentKey: any
}

export interface User {
    email?: string;
}
