import { default as iotnxt } from './iotnxt/iotnxt_server'
export { default as iotnxt } from './iotnxt/iotnxt_server'

import { default as myplugin } from './myplugin/myplugin_server'
export { default as myplugin } from './myplugin/myplugin_server'

import { default as admin } from './admin/admin_server'
export { default as admin } from './admin/admin_server'

import { default as cluster } from './cluster/cluster_server'
export { default as cluster } from './cluster/cluster_server'

export interface plugins {
    iotnxt: iotnxt,
    myplugin: myplugin,
    admin: admin,
    cluster: cluster
}