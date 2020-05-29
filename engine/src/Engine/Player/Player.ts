import * as T from '../../Types.js'
import * as SyncData from '../SyncData.js'

export default class Player {

    id : T.id
    body : T.SyncPlayerBody

    constructor ( data : T.SyncInitialPlayer ){
        let { id, body } = data
        this.id = id
        this.body = body

        SyncData.sync('join-player', data )
    }

    // + Set Data

    set_playerBody ( body : T.SyncPlayerBody ) {
        this.body = body
    }

    // + Get Data

    get_renderPerspective () : T.ThreeRenderPerspective {
        return {
            position : { x : 0, y : 0 , z : 0 },
            pitch : this.body.facing.dy,
            yaw : this.body.facing.dx,
        }
    }

    get_renderState () : T.RenderStatePlayer {
        return {
            pos : { x:0, y:0, z:0 }
        }
    }

    get_playerInitalSync () : T.SyncInitialPlayer {
        return { 
            id : this.id,
            body : this.body
        }
    }

    // + Update

    update () {
        
    }

    disconnect () {
        SyncData.sync('leave-player', this.id )
    }

}