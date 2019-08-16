export interface Package {
    name: string;
    version : string;
    description : string;
    main : string;
}



export interface LogEvent {
    message: string;
    data?: object;
    level : "error"|"warn"|"info"|"verbose"|"debug"|"silly";
}