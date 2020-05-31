import * as T from '../../types/types.js'
import * as PhysicsManager from '../physicsManager.js';

export default class DynamicPysicsObject {

    id : T.Root.id
    position : T.Physics.Position
    velocity : T.Physics.Velocity

    constructor ( id : T.Root.id, bounding : T.Physics.Cube ) {
        
        this.id = id
        this.velocity = { dx : 0, dy : 0, dz : 0 }
        this.position = bounding

    }

    // + get

    get_sync () : T.Physics.DynamicObjectSync {
        return {
            position : this.position,
            velocity : this.velocity
        }
    }

    // + Update data 

    update () {

        let velocity = this.velocity

        let absX = Math.abs( velocity.dx ) 
        let absZ = Math.abs( velocity.dz )
        if ( absX * absX + absZ * absZ < 0.005 ) {
            velocity.dx = 0
            velocity.dy = 0
        }
        
        let [ hitX, limitX ] = PhysicsManager.doMovementOnAxis( this.id, 0, velocity.dx )
        let [ hitY, limitY ] = PhysicsManager.doMovementOnAxis( this.id, 1, velocity.dy )
        let [ hitZ, limitZ ] = PhysicsManager.doMovementOnAxis( this.id, 2, velocity.dz )

        if ( limitX != velocity.dx ) this.velocity.dx = 0
        if ( limitY != velocity.dy ) this.velocity.dy = 0
        if ( limitZ != velocity.dz ) this.velocity.dz = 0

        this.position.x += limitX
        this.position.y += limitY
        this.position.z += limitZ
    }




}