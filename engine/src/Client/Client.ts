import * as T from '../types/types.js'
import * as Engine from '../engine/engine.js'
import * as Scene from './Graphics/scene.js'
import * as Logging from './logging.js'
import * as InputManager from './InputManager.js'
import * as PlayerManager from '../engine/playerManager.js'
import * as PhysicsManager from '../engine/physicsManager.js'
import * as SyncData from '../engine/SyncData.js'
import Player from '../engine/Player/player.js'

let walkSpeed = 0.1

export default class Client {

    private serverSocket : any 
    private localPlayerId : T.Root.id
    private localPlayer : Player


    constructor ( threeJS : any, networkTarget : T.Networking.NetworkConnectionTarget, display : T.Client.IngameDisplay) {
        let { socketIO, ip, gamekey } = networkTarget
        
        Scene.initialize( threeJS )
        Logging.initialize ( display )
        InputManager.initialize()

        this.serverSocket = socketIO( ip )
        this.serverSocket.emit ( T.Networking.ioevent_ClientLogin, { gamekey } )
        this.serverSocket.on( T.Networking.ioevent_GameLoopSync, this.startGameLoop )
        this.serverSocket.on( T.Networking.ioevent_InitialGameStateSync, this.connectToServer )
        this.serverSocket.on( T.Networking.ioevent_ServerSyncEvent, this.recieveSyncFromServer )

    }

    // + Networking

    connectToServer = ( gameState : T.Networking.InitialGameStateData ) => {
        let { id, players} = gameState

        console.log('Recieving Game Data')
        console.log(`Local client id set as ${id}`)
        console.log(`Loading ${players.length} new players`)
    
        players.forEach( PlayerManager.set_newPlayer)
    
        this.localPlayerId = id
        this.localPlayer = PlayerManager.get_player( id )
        Logging.writeDebug('Player ID', id)
        
    }

    recieveSyncFromServer = ( serverData : T.Networking.ServerSyncData[] ) => {
        serverData.forEach( ({ name , data }) => {
            if ( name == 'leave-player') {
                PlayerManager.set_playerDisconnected( data )
                Logging.writeClient( `Player id# ${data} left`)
            }
            else if ( name == 'join-player'){
                if ( data.id != this.localPlayerId){
                    PlayerManager.set_newPlayer( data )
                    Logging.writeClient( `Welcome player id# ${data.id} to the game`)
                }
            }
            else if ( name == 'sync-player'){
                let player = PlayerManager.get_player( data.id )
                if ( player ) player.set_physicsObject( data )
            }
        })
    }

    // + GameLoop

    startGameLoop = ( gameLoopData : T.Networking.GameLoopSyncData )=> {
        let { currentTick, firstTick } = gameLoopData

        console.log('Logged into server successfully')
        console.log('Recieved game loop initialization data')

        let ticksPerSec = 40

        let tickSpeed = 1000 / ticksPerSec 
        let lastUpdate = firstTick + (currentTick * tickSpeed)

        setInterval( () => { 
            
            if ( ! this.localPlayer ) return;
            
            let currentTime = +Date.now()
            if ( currentTime - lastUpdate > tickSpeed - 10 ){

                InputManager.registerGameTick()
                this.do_movement()
                Engine.do_gameTick()
                Scene.render( this.localPlayer.get_renderPerspective() )
                this.syncToServer()
                
                lastUpdate += tickSpeed
                currentTick += 1

                if ( currentTick % 20 == 0 )
                    Logging.writeDebug('Tick #', currentTick)
            }

        }, 8)

    }

    // + Do Client actions

    action_move ( theta : number ) {
        let { x, z } = { x : -Math.sin( theta ), z : -Math.cos( theta )}
        this.localPlayer.physicsObject.velocity.dx += x * walkSpeed
        this.localPlayer.physicsObject.velocity.dz += z * walkSpeed
    }

    do_movement () {
        this.localPlayer.set_facing( InputManager.getLocalPlayerFacing() )
        if ( InputManager.getKeyState('left') > 0 )
            this.action_move( this.localPlayer.body.facing.x + Math.PI/2 )
        if ( InputManager.getKeyState('forward') > 0 )
            this.action_move( this.localPlayer.body.facing.x )
        if ( InputManager.getKeyState('right')> 0 )
            this.action_move( this.localPlayer.body.facing.x - Math.PI/2 )
        if ( InputManager.getKeyState('back')> 0 )
            this.action_move( this.localPlayer.body.facing.x + Math.PI )
    }

    // + Sync to server

    syncToServer () {
        let playerData = this.localPlayer.get_playerInitalSync() 
        let action = InputManager.getKeyUpdates()
        let data : T.Networking.ClientSyncData = {
            actions : action,
            body: playerData.body,
            position : playerData.position 
        }
        this.serverSocket.emit( T.Networking.ioevent_ClientSync, data)
        SyncData.clearSyncData()
    }

}