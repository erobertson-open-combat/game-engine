/*
    INFO: Records events througout the engine that is then relayed to othe engine
    Events that determine object positions should be recorded through here
    Events of object creation or deletion aswell

    IMPORTANT: Reset is called after get_syncData to clear events for next tick

*/

import * as T from '../types'

export default class SyncDataManager {

    events : T.SyncEvent[] = []

    set_dataSync = ( name : T.syncEvent, data : any ) => {
        this.events.push( {name, data} )
    }

    get_syncData = () : T.SyncEvent[] => {
        return this.events
    }

    reset () {
        this.events = []
    }

}