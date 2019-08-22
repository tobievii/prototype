
import * as vm2 from "vm2"

if (state.workflowCode) {
    // WORKFLOW EXISTS ON THIS DEVICE

    var sandbox: any = {
        http: require("http"),
        https: require("https"),
        state: state,
        states: states,
        statesObj: statesObj,
        packet: packet,
        callback: (packetDone: any) => {
            //if (alreadyExitScript == false) { 
            packetDone.err = "";
            alreadyExitScript = true;
            cb(undefined, packetDone);
            //}

        }
    }

    var options = {
        apikey: state.apikey,
        devid: state.devid,
        app: undefined,
        db: db,
        eventHub: eventHub
    }

    for (var plugin of plugins) {
        if (plugin.workflow) {
            var workflow = plugin.workflow;
            sandbox[plugin.name] = new workflow(options);
        }
    }

    var alreadyExitScript = false;

    const vm = new VM({
        timeout: 1000,
        sandbox: sandbox
    });

    // Sync
    try {
        vm.run(state.workflowCode);
    } catch (err) {
        //console.error('Failed to execute script.', err);

        //if (alreadyExitScript == false) { 
        log("VM WORKFLOW ERROR!")
        //console.error(err);
        alreadyExitScript = true;
        packet.err = err.toString();
        cb(undefined, packet);
        //}        
    }
} else {
    // NO WORKFLOW ON THIS DEVICE
    cb(undefined, packet);
}