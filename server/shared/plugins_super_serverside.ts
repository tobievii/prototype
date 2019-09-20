import { DocumentStore } from "../core/data";
import { Core } from "../core/core";
import { Webserver } from "../core/webserver";
import { EventEmitter } from "events";

/** This is the class all serverside plugins need to import and extend */
interface PluginSuperServersideProps {
    core: Core
    documentstore: DocumentStore
    webserver: Webserver
}

export class PluginSuperServerside extends EventEmitter {
    core: Core;
    documentstore: DocumentStore;
    webserver: Webserver;

    constructor(props: PluginSuperServersideProps) {
        super();
        this.core = props.core
        this.documentstore = props.documentstore
        this.webserver = props.webserver
    }
};

