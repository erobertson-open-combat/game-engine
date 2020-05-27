/*
    Main File for the client, an instance of this is run locally
*/

import * as T from '../types.js'
import Renderer from "./Renderer/renderer.js"
import InputManager from "./InputManager.js"


export default class Client {

    inputManager: InputManager
    serverConnection
    renderer : Renderer

    // Initialize client managers

    constructor ( threeJS : any, networkingTarget : T.NetworkingTarget ) {

        this.inputManager = new InputManager()
        this.renderer = new Renderer( threeJS )

        this.connectToServer( networkingTarget );
    }

    connectToServer ( { socketIO, targetIP, gameKey } : T.NetworkingTarget ) {

        this.serverConnection = socketIO ( targetIP )
        this.serverConnection.emit('login', gameKey )
        this.serverConnection.on( 'inital-sync',  (data : T.InitalClientSync) => {

            this.startGameLoop( data.firstGameTickMs, data.totalGameTicks )

        })
    }

    // Game loop itself

    startGameLoop ( firstGameTickMs : number, totalGameTicks : number ) {
        let currentGameTick = totalGameTicks;
        let nextUpdate = firstGameTickMs + ( 50 * totalGameTicks )  // 20 game ticks per seccond @ 50ms each
        setInterval( () => { 
            this.gameLoop ();
        }, 50)
    }

    gameLoop () {

        this.inputManager.registerGameTick()


        //this.renderer.render( )
    }



}