import * as T from '../types/types'
import Player from './Player/player.js';
import * as SyncData from './SyncData.js'

// + Initialize

// Player Data
interface PlayerLookup { [key : string] : Player}
let playerLookup : PlayerLookup = {}
let playerList : Player[] = []

export function Initialize () {

}

// + Set Data

export function set_newPlayer ( data : T.Engine.InitialPlayerState ) : Player {
    let { id } = data 
    if ( playerLookup[id] ) return
    let newPlayer = new Player ( data )

    playerLookup[id] = newPlayer
    playerList.push( newPlayer )

    SyncData.sync( 'join-player', data )
    return newPlayer
}

export function set_playerDisconnected ( id : T.Root.id ) {
    let player = playerLookup[id]
    player.disconnect()
    playerList = playerList.filter( p => p.id != id )
    delete playerLookup[id]
}

// + Get Data

export function get_player ( id : T.Root.id ) {
    return playerLookup[id]
}

export function get_initialSync () : T.Engine.InitialPlayerState[] {
    return playerList.map( p => p.get_playerInitalSync() )
}


// + Update

export function update () {
    playerList.forEach( p => p.update() )
}