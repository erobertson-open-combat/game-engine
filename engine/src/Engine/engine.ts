/*
    INFO: The Engine that makes up the backbone of the whole system
    Both the client and the server make instances of this that they manage for syncing

    IMPORTANT: Logging is done through the Logger
    Make sure that the data is logged to the right output location

*/

import PlayerManager from "./PlayerManager.js";
import TerrainManager from "./TerrainManager.js";
import SyncDataManager from "./SyncDataManager.js";

import Logger from '../Logging.js'
import * as T from '../types.js'

export default class Engine {

    private playerManager : PlayerManager
    private terrainManager : TerrainManager
    private syncDataManager : SyncDataManager

    private log : T.LoggerObject
    gameTick : number;

    constructor ( startGameTick : number = 0 ) {
        
        this.gameTick = startGameTick
        this.log = Logger.generateLogger('Engine')

        this.syncDataManager = new SyncDataManager()
        this.playerManager = new PlayerManager( this.syncDataManager)
        this.terrainManager = new TerrainManager( this.syncDataManager)

        this.log.both('Engine Initialized')
    }

    // + Set Data

    set_newPlayer = ( initalPlayerObjSync : T.SyncInitialPlayer) => {
        this.playerManager.set_newPlayer( initalPlayerObjSync )
    }
    set_playerDisconnected = ( id : T.id ) => {
        this.playerManager.set_playerDisconnected( id )
    }


    // + Get Data

    get_playerRenderPerspective = ( id : T.id ) : T.ThreeRenderPerspective => {
        return this.playerManager.get_playerRenderPerspective( id )
    }
    get_playersInitalSync = ( ) : T.SyncInitialPlayer[] => {
        return this.playerManager.get_playersInitalSync();
    }

    get_tickSyncData = () : T.SyncEvent[] => {
        let returnData = this.syncDataManager.get_syncData()
        this.syncDataManager.reset()
        return returnData
    }

    // + Update
 
    doGameTick ( ) {
        this.gameTick += 1

        this.playerManager.update()
        this.terrainManager.update()
    }

}