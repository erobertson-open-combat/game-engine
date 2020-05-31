import * as T from '../types/types.js'
import * as U from '../Utils.js'

import PlayerActionStates from './playerActionStates.js'
import Player from '../engine/Player/player.js'
import * as PlayerManager from '../engine/playerManager.js'

export default class ConnectedClient {

    public id : T.Root.id
    private socket : any
    private playerActionState : PlayerActionStates
    private player : Player

    constructor ( socket : any ) {

        this.id = U.randomId()
        this.socket = socket
        this.playerActionState = new PlayerActionStates()
        this.player = PlayerManager.set_newPlayer({ 
            id : this.id,
            position : { 
                position : { x : 0, y : 0, z : 0 }, 
                velocity : { dx : 0, dy : 0, dz : 0 } 
            },
            body : { facing : { x : 0, y : 0}}
        })

        socket.on(T.Networking.ioevent_ClientSync, this.clientSync )
        socket.on(T.Networking.ioevent_Disconnect, this.disconnect)

        setTimeout ( () => {
            socket.emit( T.Networking.ioevent_InitialGameStateSync, ({
                id : this.id,
                players : PlayerManager.get_initialSync()
            } as T.Networking.InitialGameStateData ))
        }, 100 );

    }

    // + Socket Communication to server

    clientSync = ( data : T.Networking.ClientSyncData ) => {
        let { body, position } = data

        this.player.set_playerBody( body )
        this.player.set_physicsObject( position )

        data.actions.forEach( action => {
            let { type, active } = action
            if ( action ) this.playerActionState.eventStart( type )
            else this.playerActionState.eventStop( type )
        })
    }

    disconnect = () => {
        PlayerManager.set_playerDisconnected( this.id )
    }

    // + Get Data

    getPlayerPositioning () : T.Physics.DynamicObjectSync {
        return this.player.physicsObject.get_sync()
    }

    // + Register Game Tick

    registerGameTick () {
        this.playerActionState.registerGameTick()
        this.player.update()
    }

    syncServerData ( data : T.Networking.ServerSyncData[] ) {
        
        this.socket.emit( T.Networking.ioevent_ServerSyncEvent, data )
    }

}