import * as fs from 'fs';


export var version = { 
    "version": "5.0.34", 
    "description": "prototype" 
}

export var configGen : any = () => {

    try {
        var mainconfig = JSON.parse( fs.readFileSync('../../../iotconfig.json').toString() );
        mainconfig.version = version
        mainconfig.mongoCollections = ['packets', 'users', 'states']

        if (mainconfig.ssl == true) {
            mainconfig.sslOptions.cert = fs.readFileSync(mainconfig.sslOptions.certPath)
            mainconfig.sslOptions.key = fs.readFileSync(mainconfig.sslOptions.keyPath)
            if (mainconfig.sslOptions.caPath) {
                mainconfig.sslOptions.ca = fs.readFileSync(mainconfig.sslOptions.caPath)
            }
            
        }

        return mainconfig
    } catch(err) {
        console.log("MAIN CONFIG MISSING. USING DEFAULTS")
        //DEFAULTS
        var defaultconfig = {
            "ssl": false,
            "httpPort": 8080,
            "mongoConnection": "prototype",
            "iotnxtV3Queue" : {
                "gateways" : []
            },
            version : version
        }
        return defaultconfig
    }

}