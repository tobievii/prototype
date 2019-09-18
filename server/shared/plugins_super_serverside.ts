import { DocumentStore } from "../core/data";
import { Core } from "../core/core";
import { Webserver } from "../core/webserver";

/** This is the class all serverside plugins need to import and extend */
interface PluginSuperServersideProps {
    core: Core
    documentstore: DocumentStore
    webserver: Webserver
}

export class PluginSuperServerside {
    core: Core;
    documentstore: DocumentStore;
    webserver: Webserver;

    constructor(props: PluginSuperServersideProps) {
        this.core = props.core
        this.documentstore = props.documentstore
        this.webserver = props.webserver
    }
};

