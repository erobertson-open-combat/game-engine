/*
    INFO: This class handles storage of the data about a single connected client
    A new instance of this is created for every new connection that is made
    
    IMPORTANT: The server handles connection, login, and disconnection
    The server will verify the gamekey BEFORE creating this instnace
    The server will kill this instance on disconnect
*/

import * as U from '../Utils.js'
import * as T from '../Types.js'

import InputRecorder from './InputRecorder.js'
import * as PlayerManager from '../Engine/PlayerManager.js'
import * as Engine from '../Engine/Engine.js'
import Player from '../Engine/Player/Player.js'

export default class ConnectedClient {

    id : T.id
    inputRecord : InputRecorder
    player : Player

    constructor ( public client : any, gameLoopSync : T.SyncGameLoop ) {

        this.id = U.nextId()
        this.inputRecord = new InputRecorder()

        this.player = PlayerManager.set_newPlayer( 
            { id : this.id, body : { facing : { dx : 0, dy : 0 }} } 
        )

        client.on('input-sync', this.inputSync )
        client.on('disconnect', this.disconnect)

        client.emit( 'initial-sync', {
            id : this.id,
            players : PlayerManager.get_initialSync(),
            gameLoop : gameLoopSync

        })
        
    }

    // + Socket Connections

    inputSync = ( data : T.InputState ) => {
        data.events.forEach( i => {
            if ( i.down )
                this.inputRecord.eventStart(i.input)
            else
                this.inputRecord.eventStop(i.input)
        })
    }

    disconnect = () => {
        PlayerManager.set_playerDisconnected( this.id )
    }

    // + Server Updates

    registerGameTick () {
        this.inputRecord.registerGameTick()
    }

    
}