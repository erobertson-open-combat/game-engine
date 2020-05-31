import * as GraphicsManager from "../../engine/graphicsManager.js";
import * as Scene from './scene.js'
import * as T from '../../types/types.js'

export default function initialize () {

    GraphicsManager.setCallback('player', (id : T.Root.id, data : T.Physics.Position) => {
        console.log('player created')
        let item = Scene.create_cube({...data, w:1,h:2,d:1 })

        return ( update : any ) => {
            let { position } = update

            if ( position ){
                item.position.set( position.x, position.y, position.z )
            }
        }
    })
}
