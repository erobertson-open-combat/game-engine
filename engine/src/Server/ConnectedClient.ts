/*
    INFO: This class handles storage of the data about a single connected client
    A new instance of this is created for every new connection that is made
    
    IMPORTANT: The server handles connection, login, and disconnection
    The server will verify the gamekey BEFORE creating this instnace
    The server will kill this instance on disconnect
*/

import * as U from '../utils.js'
import * as T from '../types.js'

import InputRecorder from './InputRecorder.js'

export default class ConnectedClient {

    id : T.id
    inputRecord : InputRecorder

    constructor ( public client : any ) {

        this.id = U.nextId()
        this.inputRecord = new InputRecorder()

        client.on('input-sync', this.inputSync )
    
    }

    // + Socket Connections

    inputSync = ( data : T.SyncInput[] ) => {
        data.forEach( i => {
            if ( i.down )
                this.inputRecord.eventStart(i.input)
            else
                this.inputRecord.eventStop(i.input)
        })
    }

    // + Server Updates

    registerGameTick () {
        this.inputRecord.registerGameTick()
    }

    getInputStates () {

    }

    recieveUpdateSync ( data : T.SyncEvent[] ) {
        this.client.emit ( 'update-sync', data )
    }
    
}