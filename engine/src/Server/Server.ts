import * as T from '../types/types.js'
import * as Engine from '../engine/engine.js'
import ConnectedClient from './connectedClient.js'
import * as SyncData from '../engine/SyncData.js'

export default class Server {

    // Client communication
    private gamekey : T.Root.id
    private connectedClients : ConnectedClient[]

    // Game loop processing
    private firstGameTickMs : number
    private currentGameTick : number

    constructor ( data : T.Server.ServerInitializationData ) {
        let { gamekey } = data

        this.gamekey = gamekey
        this.connectedClients = []

        this.startGameLoop()
    }

    clientConnects = ( clientSocket : any ) => {

        clientSocket.on( T.Networking.ioevent_ClientLogin, ( data : T.Networking.ClientLoginData ) => {
            let { gamekey } = data;

            if ( this.gamekey != gamekey ) {
                console.log(`Client tried joining with invalid gamekey ${gamekey}`)
                clientSocket.emit( T.Networking.ioevent_LoginFailed, null as T.Networking.LoginFailedData)
                clientSocket.disconnect()
            }

            else {
                console.log(`Client logged in successfully`)
                clientSocket.emit( T.Networking.ioevent_GameLoopSync, ({
                    currentTick : this.currentGameTick,
                    firstTick : this.firstGameTickMs
                } as T.Networking.GameLoopSyncData ))
                this.connectedClients.push( new ConnectedClient ( clientSocket ))
            }

        })

    }

    // + Game Loop

    startGameLoop () {

        let ticksPerSec = 40
        let tickSyncRate = 2

        let tickSpeed = 1000 / ticksPerSec 
        let lastUpdate = +Date.now()
        this.firstGameTickMs = lastUpdate
        this.currentGameTick = 0

        Engine.initialize() 

        setInterval( () => { 
            
            let currentTime = +Date.now()

            if ( currentTime - lastUpdate > tickSpeed - 10 ){
                Engine.do_gameTick()
                lastUpdate += tickSpeed
                this.currentGameTick += 1
                if ( this.currentGameTick % tickSyncRate )
                    this.syncClients()
            }

        }, 8)

    }
    // + Sync Data to clients

    syncClients () {
        let data : T.Networking.ServerSyncData[] = SyncData.exportSyncData()
        data = data.concat(
            this.connectedClients.map( c => ({ name : 'sync-player', data : {...c.getPlayerPositioning(), id :c.id }}) )
        )
        this.connectedClients.forEach( c => c.syncServerData( data ))

    }
}