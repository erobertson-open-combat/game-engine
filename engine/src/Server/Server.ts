/* 
    INFO: This class is the server-side code for the engine 
    It implements an instnace of `engine` and handles the socket connections
    It routes data to the engine and to other clients to everyone is in sync

*/

import * as T from '../types.js'
import * as U from '../utils.js'

import Engine from '../Engine/Engine.js'
import InputRecorder from './InputRecorder.js'
import ConnectedClient from './ConnectedClient.js'
import { Logger } from '../index.js'

export default class Server {

    gameKey : T.id
    connectedClients : ConnectedClient[] = []

    log : T.LoggerObject

    firstGameTickMs : number
    engine : Engine 

    constructor ( gameKey : T.id ) {
        this.gameKey = gameKey;

        this.log = Logger.generateLogger('Server')
        this.startEngine()
        this.startGameLoop()
    }

    startEngine () {
        this.engine = new Engine( 0 )
    }

    // + Client connections

    clientConnects = ( client : any ) => {

        client.on('login', (gameKey : T.id ) => {
            
            this.log.server(`Login atempted with ${gameKey}`)
            // Check Login

            if ( gameKey != this.gameKey) {
                //TODO give some message to client that login failed 
                client.disconnect(); 
                return 
            }

            // Register new client 

            let newClient = new ConnectedClient( client )
            this.connectedClients.push( newClient )
            // TODO give the player a more dynamic spawn position & information
            this.engine.set_newPlayer({
                id : newClient.id, 
                body : { facing : { dx : 0, dy : 0 }} 
            })

            // Sync with client

            client.emit('inital-sync', { 
                firstGameTickMs : this.firstGameTickMs, 
                totalGameTicks :  this.engine.gameTick,
                id : newClient.id,
                players : this.engine.get_playersInitalSync()
            } as T.SyncInitial )

            // Setup diconnect route

            client.on('disconnect', () => {
                this.engine.set_playerDisconnected( newClient.id )
                this.connectedClients = this.connectedClients.filter( c => c.id != newClient.id )
            })
            
        })

    }


    // + Game Loop

    startGameLoop () {
        
        this.firstGameTickMs = +Date.now()
        let last = +Date.now()
    
        setInterval( () => { 
            
            let currentTime = +Date.now()

            if ( currentTime - last > 10 ){
                this.gameLoop ()
                last = this.engine.gameTick * 20 + this.firstGameTickMs
            }

        }, 10)
    }

    gameLoop () {

        this.connectedClients.forEach( 
            c => c.registerGameTick() )

        this.engine.doGameTick()
        
        let syncData = this.engine.get_tickSyncData()

        this.connectedClients.forEach( 
            c => c.recieveUpdateSync( syncData ))

    }

}