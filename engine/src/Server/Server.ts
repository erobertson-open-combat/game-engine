/* 
    INFO: This class is the server-side code for the engine 
    It implements an instnace of `engine` and handles the socket connections
    It routes data to the engine and to other clients to everyone is in sync

*/

import * as T from '../Types.js'
import * as U from '../Utils.js'
import { Log } from '../Index.js'

import * as Engine from '../Engine/Engine.js'
import InputRecorder from './InputRecorder.js'
import ConnectedClient from './ConnectedClient.js'

export default class Server {

    // Game information
    private gameKey : T.id
    private firstGameTickMs : number
    private log : T.LoggerObject

    // Clients
    private connectedClients : ConnectedClient[] = []
 
    // + Initialization

    constructor ( gameKey : T.id ) {
        this.gameKey = gameKey;

        this.log = Log.generateLogger('Server')
        this.log.server( 'Server Starting')

        Engine.initialize( 0 )
        this.startGameLoop()
    }

    // + Client connections

    clientConnects = ( client : any ) => {
        client.on('login', ( login : T.id) => {
            if ( login != this.gameKey) { 
                this.log.server(`New client login failed with '${login}'`)
                client.disconnect(); 
            } 
            else {
                // The connected client class will handle syncing of data to the client
                // As well as disconnection and other information
                this.log.server(`New client logged in`)
                this.connectedClients.push( new ConnectedClient( client, {
                    firstGameTickMS : this.firstGameTickMs,
                    totalGameTicks : Engine.get_gameTick()
                }) )
            }
        })
    }


    // + Game Loop

    startGameLoop () {
        
        let last = +Date.now()
        let tickSpeed = 20  // Number of ms per tick ( 50 per sec )
        this.firstGameTickMs = last
    
        setInterval( () => { 
            
            let currentTime = +Date.now()

            if ( currentTime - last > tickSpeed - 10 ){
                this.gameLoop ()
                last += tickSpeed
            }

        }, 10)
    }

    gameLoop () {

        // Do Engine Updates
        Engine.do_gameTick()
        
        // Sync Data back to clients
        let syncData = Engine.get_sycnData()
        this.connectedClients.forEach( c => {
            c.client.emit( 'update-sync', syncData )
            c.registerGameTick () 
        })

    }

}