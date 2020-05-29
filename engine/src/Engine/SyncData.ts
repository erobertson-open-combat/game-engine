/*
    INFO: Records events througout the engine that is then relayed to othe engine
    Events that determine object positions should be recorded through here
    Events of object creation or deletion aswell

*/

import * as T from '../Types.js'

let events : T.SyncEvent[] = []

export function sync ( name : T.syncEvent, data : any ) {
    events.push({ name, data })
}

export function exportSyncData ( ): T.SyncEvent[] {
    let exportData = events
    events = []
    return exportData
}