import { PluginSuperServerside } from "../../server/shared/plugins_super_serverside"
import { Core } from "../../server/core/core";
import { Webserver } from "../../server/core/webserver";
import { DocumentStore } from "../../server/core/data";


export default class Iotnxt extends PluginSuperServerside {
    name = "iotnxt";

    constructor(props: { core: Core, documentstore: DocumentStore, webserver: Webserver }) {
        super(props);
    }



};

