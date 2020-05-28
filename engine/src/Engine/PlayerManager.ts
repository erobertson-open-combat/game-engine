/*
    INFO: Manages a player connected to the engine
    Will be called with player data when a player joins or leaves
    This data will be part of the dataSync for the next tick

*/

import * as T from '../types'

import Player from './Player/Player.js';
import SyncDataManager from './SyncDataManager';
import Logger from '../Logging.js'

interface PlayerLookup { [key : number] : Player}

export default class PlayerManager {

    playerLookup : PlayerLookup = {}
    playerList : Player[] = []

    private log : T.LoggerObject

    constructor ( public syncData : SyncDataManager ) {
        this.log = Logger.generateLogger('Player')
    }

    // + Set Data

    set_newPlayer ( data : T.SyncInitialPlayer ) {
        let id = data.id
        if ( this.playerLookup[id] ) return;
        let newPlayer = new Player ( data )

        this.playerLookup[id] = newPlayer;
        this.playerList.push( newPlayer )

        this.syncData.set_dataSync( 'join-player', newPlayer.get_playerInitalSync() )
        this.log.both(`New Player with id #${id} joined the game`)
    }
    set_playerDisconnected ( id : T.id ) {
        let player = this.playerLookup[id]

        delete this.playerLookup[id]
        this.playerList = this.playerList.filter( p => p.id != id )

        this.syncData.set_dataSync( 'leave-player', player.id )
        this.log.both(`Player with id #${id} left the game`)
    }

    // + Get Data

    get_playerRenderPerspective ( id : T.id ) : T.ThreeRenderPerspective { 
        return this.playerLookup[id].get_renderPerspective()
    } 
    get_playersInitalSync () : T.SyncInitialPlayer[] {
        return this.playerList.map( p => p.get_playerInitalSync() )
    }

    // + Update

    update () {
        this.playerList.forEach( p => p.update() )
    }

}