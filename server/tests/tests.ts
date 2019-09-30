import { describe, it } from "mocha";
import { generateDifficult } from "../utils/utils"
import { Prototype } from "../utils/api"

import { webapi_v3 } from "./webapiv3/webapi_v3_tests"
import { webapi_v4 } from "./webapiv4/webapi_v4_tests"

import { test_websockets } from "./webapiv4/webapi_v4_websockets"

// uncomment to run old tests
webapi_v3()
//webapi_v4()

//test_websockets();