/*
    INFO: Manages a player connected to the engine
    Will be called with player data when a player joins or leaves
    This data will be part of the dataSync for the next tick


*/

import * as T from '../Types'
import * as U from '../Utils.js'
import * as Log from '../Log.js'

import Player from './Player/Player.js';
import * as SyncData from './SyncData.js';

// + Initialize

// Logging
let log : T.LoggerObject = Log.generateLogger('Player-Manager')

// Player Data
interface PlayerLookup { [key : number] : Player}
let playerLookup : PlayerLookup = {}
let playerList : Player[] = []

export function Initialize () {

}

// + Set Data

export function set_newPlayer ( data : T.SyncInitialPlayer ) : Player {
    let { id } = data 

    if ( playerLookup[id] ) {
        log.info('New player tried to join with invalid id')
        return undefined
    }
    else {
        // The player itself will handle the syncing of its data
        let newPlayer = new Player ( data )
        // Add the player to the data-structures
        playerLookup[id] = newPlayer
        playerList.push( newPlayer )
        log.server(`Player Joined with ID : ${id}`)
        log.client(`Player Joined with ID : ${id}`)
        return newPlayer
    }
}

export function set_playerDisconnected ( id : T.id ) {
    let player = playerLookup[id]
    if ( ! player ) {
        log.info('Tried to disconnect player with invalid id')
    }
    else {
        // The player will handle disconnect data syncing
        player.disconnect()
        // Remove the player from the data structures
        playerList = playerList.filter( p => p.id != id )
        delete playerLookup[id]
        log.server(`Player Disconnected with ID : ${id}`)
        log.client(`Player Disconnected with ID : ${id}`)
    }

}

// + Get Data

export function get_player ( id : T.id ) {
    return playerLookup[id]
}

export function get_renderState () : T.RenderStatePlayer[] {
    return playerList.map( p => p.get_renderState() )
}
export function get_initialSync () : T.SyncInitialPlayer[] {
    return playerList.map( p => p.get_playerInitalSync() )
}


// + Update

export function update () {
    playerList.forEach( p => p.update() )
}