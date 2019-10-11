import { default as mqtt } from './mqtt/mqtt_test'
import { default as teltonika } from './teltonika/teltonika_test'
import { default as iotnxt } from './iotnxt/iotnxt_test'


export var pluginTests: any = { mqtt, teltonika, iotnxt }