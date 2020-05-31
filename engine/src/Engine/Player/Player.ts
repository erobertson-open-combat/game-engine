import * as T from '../../types/types.js'
import * as SyncData from '../SyncData.js'
import * as GraphicsManager from '../graphicsManager.js'
import * as PhysicsManager from '../physicsManager.js'
import DynamicPysicsObject from '../Physics/DynamicPhysicsObject.js'

export default class Player {

    public id : T.Root.id
    public body : T.Engine.PlayerBodyPosition
    public physicsObject : DynamicPysicsObject
    private graphicsObjectUpdate : ( data : any ) => void

    constructor ( data : T.Engine.InitialPlayerState  ){
        let { id, body } = data

        this.id = id
        this.body = body
        this.physicsObject = PhysicsManager.new_dynamicObject({ ... data.position.position, w : 1, h : 2, d : 1}, id)
        this.graphicsObjectUpdate = GraphicsManager.create_item('player', id, data.position.position)
    }

    // + Set Data

    set_playerBody ( body : T.Engine.PlayerBodyPosition ) {
        this.body = body
    }
    set_physicsObject ( pos : T.Physics.DynamicObjectSync ) {
        this.physicsObject.velocity = pos.velocity
        PhysicsManager.doTeleport( this.physicsObject.id, pos.position )
    }
    set_facing ( facing : T.Engine.PlayerFacing ){
        this.body.facing = facing
    }

    // + Get Data

    get_renderPerspective () : T.Client.RenderPerspective {
        return {
            position : this.physicsObject.position,
            pitch : this.body.facing.y,
            yaw : this.body.facing.x,
        }
    }

    get_playerInitalSync () : T.Engine.InitialPlayerState {
        return { 
            id : this.id,
            body : this.body,
            position : this.physicsObject
        }
    }

    // + Update

    update () {

        // Frictin and gravity for player
        this.physicsObject.velocity.dx *= 0.9
        this.physicsObject.velocity.dz *= 0.9

        //TODO something
        // Update physics
        this.physicsObject.update()
        
        // Update rendering
        this.graphicsObjectUpdate({ position : this.physicsObject.position })
    }

    disconnect () {
        SyncData.sync('leave-player', this.id )
    }

}