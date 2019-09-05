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
    err?: string;
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

export interface ConfigFile {
    ssl: boolean
    sslOptions?: {
        certPath?: string
        keyPath?: string
        caPath?: string
        ca?: any
        key?: any
        cert?: any
    }
    env?: string
    httpPort: number
    httpsPort?: number
    mongoConnection: string
    version?: any;
}

export interface WidgetType {
    type: string;
    i?: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    datapath?: string;
    dataname: string;
    /** If any options have been set on this widget */
    options?: any;
}


export interface WidgetComponentProps {
    /** Settings relevant to this widget */
    widget: WidgetType
    /** This device full state */
    state: CorePacket
    /** Data value if drag and dropped from endpoint */
    value?: any
}

export interface OptionComponentProps {
    name: string
    option: any
}