/*
    INFO: Client that runs the client copy of the engine locally
    This creates an instance of the engine that connects to and syncs with the server engine
    Client will relay user input to the server
    Client will render to a threeJS canvas

*/

import * as T from '../Types.js'
import * as Log from '../Log.js'

import GraphicsManager from "./GraphicsManager.js"
import InputManager from "./InputManager.js"
import * as Engine from '../Engine/Engine.js'
import * as PlayerManager from '../Engine/PlayerManager.js'
import Player from '../Engine/Player/Player.js'

export default class Client {

    inputManager: InputManager
    graphicsManager : GraphicsManager

    log : T.LoggerObject
    localPlayer : Player

    server : any 

    constructor ( threeJS : any, networkingTarget : T.NetworkConnectionTarget ) {

        this.inputManager = new InputManager()
        this.graphicsManager = new GraphicsManager( threeJS )

        this.log = Log.generateLogger('Client')

        this.connectToServer( networkingTarget );
    }

    // + Server Communication

    connectToServer ( { socketIO, ip, id } : T.NetworkConnectionTarget ) {

        this.server = socketIO ( ip )
        
        this.log.client('Logging into game-lobby...')
        this.server.emit('login', id )

        this.server.on( 'initial-sync',  (data : T.SyncInitial) => {

            this.log.client('Recieving inital game sync...')
            this.log.client(`Recieved data about ${data.players.length} total players`)

            // Set up the engine to start on a specific game tick
            Engine.initialize( data.gameLoop.totalGameTicks )

            // Sync the players
            data.players.forEach( PlayerManager.set_newPlayer )

            // Take the id as the id of this client and its corisponding player
            this.localPlayer = PlayerManager.get_player(data.id)

            // Start the game loop making sure to syncronize it with the server
            this.startGameLoop( data.gameLoop )

        })
        this.server.on('update-sync', (data : T.SyncEvent[] ) => {
            data.forEach( d => {

                if ( d.name === 'join-player' )
                    PlayerManager.set_newPlayer( d.data )
                if ( d.name === 'leave-player')
                    PlayerManager.set_playerDisconnected( d.data )

            })
        })
    }

    // + Game loop

    startGameLoop ( data : T.SyncGameLoop) {

        let tickSpeed = 20  // Number of ms per tick ( 50 per sec )
        let last = data.totalGameTicks * tickSpeed + data.firstGameTickMS

        setInterval( () => { 
            
            let currentTime = +Date.now()

            if ( currentTime - last > tickSpeed - 10 ){
                this.gameLoop ()
                last += tickSpeed
            }

        }, 10)
        
    }

    gameLoop () {

        // Update local player facing 
        let facing = this.inputManager.getLocalPlayerFacing()
        this.localPlayer.set_playerBody({ facing })

        // Update local inputs & data, then send data to server for processing
        let keys = this.inputManager.getKeyUpdates()
        this.inputManager.registerGameTick()
        this.server.emit('input-sync', keys )

        // Do game tick
        Engine.do_gameTick()
        
        // Do Rendering
        let renderPerspective = this.localPlayer.get_renderPerspective()
        this.graphicsManager.render( renderPerspective )
    }

}