/*
    INFO: The Engine that makes up the backbone of the whole system
    This file is a static singleton that manages other static singletons

    IMPORTANT: Logging is done through the Logger
    Make sure that the data is logged to the right output location

*/

import * as Log from '../Log.js'
import * as T from '../Types.js'
import * as U from '../Utils.js'

import * as TerrainManager from "./TerrainManager.js";
import * as PlayerManager from "./PlayerManager.js";
import * as SyncData from "./SyncData.js";

// + Initialize

let log : T.LoggerObject = Log.generateLogger('Engine')
let gameTick : number = 0

export function initialize ( startGameTick : number = 0 ) {
    log.server('Engine Started')
    gameTick = startGameTick

    TerrainManager.initialize()
}  

// + Set Data

// + Get Data

export function get_sycnData () : T.SyncEvent[] {
    return SyncData.exportSyncData()
}
export function get_gameTick () : number {
    return gameTick
}

// + Do Actions

export function do_gameTick (){
    gameTick += 1

    PlayerManager.update()
    TerrainManager.update()
}

