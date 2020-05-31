import * as Root from './types_root.js'
import * as Physics from './types_physics'
import * as Client from './types_client'

// + Player

export interface PlayerFacing {
    x : number, y : number
}

export interface PlayerBodyPosition {
    facing : PlayerFacing
}

export interface InitialPlayerState {
    id : Root.id,
    position : Physics.DynamicObjectSync,
    body : PlayerBodyPosition
}
