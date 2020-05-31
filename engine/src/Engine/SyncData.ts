import * as T from '../Types/types.js'

let events : T.Networking.ServerSyncData[] = []

export function sync ( name : string, data : any ) {
    events.push({ name, data })
}

export function exportSyncData ( ): T.Networking.ServerSyncData[] {
    let exportData = events
    events = []
    return exportData
}

export function clearSyncData () {
    events = [] 
}