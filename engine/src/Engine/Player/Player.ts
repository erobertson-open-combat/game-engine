import * as T from '../../types'

export default class Player {

    id : T.id
    body : T.SyncPlayerBody

    constructor ( initalPlayerObjSync : T.SyncInitialPlayer ){
        this.id = initalPlayerObjSync.id
        this.body = initalPlayerObjSync.body
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

    // Update

    update () {
        
    }



}