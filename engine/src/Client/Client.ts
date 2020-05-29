/*
    INFO: Client that runs the client copy of the engine locally
    This creates an instance of the engine that connects to and syncs with the server engine
    Client will relay user input to the server
    Client will render to a threeJS canvas


*/

import * as T from '../types.js'
import Logger from '../Logging.js'
import GraphicsManager from "./GraphicsManager.js"
import InputManager from "./InputManager.js"
import Engine from '../Engine/Engine.js'

export default class Client {

    inputManager: InputManager
    graphicsManager : GraphicsManager

    log : T.LoggerObject

    engine : Engine
    server
    localPlayer : T.id

    constructor ( threeJS : any, networkingTarget : T.NetworkConnectionTarget ) {

        this.inputManager = new InputManager()
        this.graphicsManager = new GraphicsManager( threeJS )

        this.log = Logger.generateLogger('Client')

        this.connectToServer( networkingTarget );
    }

    // + Server Communication

    connectToServer ( { socketIO, ip, id } : T.NetworkConnectionTarget ) {

        this.server = socketIO ( ip )
        
        this.log.client('Logging into game-lobby...')
        this.server.emit('login', id )

        this.server.on( 'inital-sync',  (data : T.SyncInitial) => {

            this.log.client('Recieving inital game sync...')
            this.log.client(`Recieved data about ${data.players.length} total players`)

            // Take the id as the id of this client and its corisponding player
            this.localPlayer = data.id

            // Set up the engine to start on a specific game tick
            this.engine = new Engine( data.totalGameTicks )

            // Sync the players
            data.players.forEach( this.engine.set_newPlayer )

            // Start the game loop making sure to syncronize it with the server
            this.startGameLoop( data.firstGameTickMs )

        })
        this.server.on('update-sync', (data : T.SyncEvent[] ) => {
            data.forEach( d => {

                if ( d.name === 'join-player' )
                    this.engine.set_newPlayer( d.data )
                if ( d.name === 'leave-player')
                    this.engine.set_playerDisconnected( d.data )

            })
        })
    }

    // + Game loop

    startGameLoop ( firstGameTickMs : number) {

        let last = this.engine.gameTick * 20 + firstGameTickMs

        setInterval( () => { 
            
            let currentTime = +Date.now()

            if ( currentTime - last > 10 ){
                this.gameLoop ()
                last = this.engine.gameTick * 20 + firstGameTickMs
            }

        }, 10)
        
    }

    gameLoop () {

        // Update local inputs & data, then send data to server for processing
        let keys = this.inputManager.getKeyUpdates()
        let facing = this.inputManager.getLocalPlayerFacing()
        this.inputManager.registerGameTick()
        this.engine.set_playerBody( { facing }, this.localPlayer )
        this.server.emit('input-sync', keys )

        // Do game tick
        this.engine.doGameTick()
        
        // Do Rendering
        let renderPerspective = this.engine.get_playerRenderPerspective( this.localPlayer )
        //TODO link this to graphics
        //let renderState = this.engine.getRenderState()
        this.graphicsManager.render( renderPerspective )
    }

}