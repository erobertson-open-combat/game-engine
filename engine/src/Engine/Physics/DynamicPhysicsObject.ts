/*




import * as T from '../../Types.js'
import PhysicsManager from '../PhysicsManager.js';

export default class DynamicPysicsObject {

    id : T.id
    position : T.SpacialCube
    velocity : T.SpacialVelocity

    constructor ( id : T.id, position : T.SpacialCube, renderPosition : any, public physicsRef : PhysicsManager  ) {
        
        this.velocity = { dx : 0, dy : 0, dz : 0 }
        this.id = id
        this.position = position

    }

    // + Update data 

    update () {

        let velocity = this.velocity;
        let physics = this.physicsRef

        if ( Math.abs( velocity.dx ) < 0.03 ) velocity.dx = 0 
        if ( Math.abs( velocity.dz ) < 0.03 ) velocity.dz = 0 
        
        let [ hitX, limitX ] = physics.doMovementOnAxis( this.id, 0, velocity.dx )
        let [ hitY, limitY ] = physics.doMovementOnAxis( this.id, 1, velocity.dy )
        let [ hitZ, limitZ ] = physics.doMovementOnAxis( this.id, 2, velocity.dz )

        if ( limitX != velocity.dx ) this.velocity.dx = 0
        if ( limitY != velocity.dy ) this.velocity.dy = 0
        if ( limitZ != velocity.dz ) this.velocity.dz = 0


    }




}*/