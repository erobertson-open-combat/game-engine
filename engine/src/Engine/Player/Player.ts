import * as T from '../../types'

export default class Player {

    id : number

    constructor ( initalPlayerObjSync : T.SyncInitialPlayer ){
        this.id = initalPlayerObjSync.id
    }

    // Set Data

    // Get Data

    get_renderPerspective () : T.ThreeRenderPerspective {
        return {
            position : { x : 0, y : 0 , z : 0 },
            pitch : 0,
            yaw : 0,
        }
    }

    get_playerInitalSync () : T.SyncInitialPlayer {
        return { 
            id : this.id
        }
    }

    // Update

    update () {
        
    }

}