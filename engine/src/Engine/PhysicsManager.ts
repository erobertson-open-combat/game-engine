/*
    INFO: Manages physics throughout the game in the form of axis aligned bounding boxes
    Ids are assigned elsewhere and used internally, do not assign ids in this class
    This is done so you can sync ids across the network

    TODO: Figure out how to link the objects physics with their render

*/

import { SortSweepCollider } from "./Physics/sortSweepColider.js";
import DynamicPhysicsObject from './Physics/DynamicPhysicsObject.js'
import * as T from '../types'
import { Logger } from "../index.js";

interface DynamicObjectLookup { [key : number ] : DynamicPhysicsObject }

export default class PhysicsManager {

    private log : T.LoggerObject
    physics : SortSweepCollider
    dynamicObjectLookup : DynamicObjectLookup = {}

    constructor () {
        this.physics = new SortSweepCollider ( 3 )
        this.log = Logger.generateLogger('Physics')
    }

    // + Creation of Physics Objects


    new_staticObject ( data : T.SpacialCube, id : T.id ){
        this.physics.insertBlock( id,
            data.x - data.w/2, data.y - data.h/2, data.z - data.d/2 ,
            data.x + data.w/2, data.y + data.h/2, data.z + data.d/2 
        )
        this.log.server (`Registered static physics object with id ${id}`)
    }

    new_dynamicObject ( data : T.SpacialCube, id : T.id ) {

    }

}