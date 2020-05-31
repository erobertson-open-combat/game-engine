import * as T from '../Types/types.js'
import * as SyncData from "./SyncData.js";

import { SortSweepCollider } from "./Physics/sortSweepColider.js";
import DynamicPhysicsObject from './Physics/DynamicPhysicsObject.js'

// + Initialize

// Physics Objects
interface DynamicObjectLookup { [key : string ] : { item : DynamicPhysicsObject, id : number} }

let nextPhysicsId = 0
let get_nextId = () => ++ nextPhysicsId;
let dynamicObjectLookup : DynamicObjectLookup = {}
let physics = new SortSweepCollider ( 3 )

export function initialize () {

}

// + New Physics Items

export function new_staticObject ( data : T.Physics.Cube, id : T.Root.id){
    let physicsId = get_nextId()
    physics.insertBlock( physicsId,
        data.x - data.w/2, data.y - data.h/2, data.z - data.d/2 ,
        data.x + data.w/2, data.y + data.h/2, data.z + data.d/2 
    )
}

export function new_dynamicObject ( data : T.Physics.Cube, id : T.Root.id ) {
    let physicsId = get_nextId()
    physics.insertBlock( physicsId,
        data.x - data.w/2, data.y - data.h/2, data.z - data.d/2 ,
        data.x + data.w/2, data.y + data.h/2, data.z + data.d/2 
    )
    let dynamicObject = new DynamicPhysicsObject ( id, data )
    dynamicObjectLookup[ id ] = { item : dynamicObject, id : physicsId }
    return dynamicObject
}

// + Physics updates

export function doMovementOnAxis ( id : T.Root.id, axis : number, amount : number ){

    let [hit, limit] = physics.checkAndDoMovement(dynamicObjectLookup[id].id, axis, amount)
    return [ hit, limit ]

}

export function doTeleport( id : T.Root.id, position : T.Physics.Position ){
    let target = dynamicObjectLookup[id].item
    let deltas = { 
        x : position.x - target.position.x ,
        y : position.y - target.position.y ,
        z : position.z - target.position.z ,
    }
    doMovementOnAxis( id, 0, deltas.x )
    doMovementOnAxis( id, 1, deltas.y )
    doMovementOnAxis( id, 2, deltas.z )

}