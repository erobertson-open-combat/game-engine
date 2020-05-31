import * as Physics from './types_physics'

// + Grapics

export interface Camera {
    camera : any
    yawObject : any
    pitchObject : any 
}

export interface RenderPerspective {
    position : Physics.Position
    pitch : number
    yaw : number
}

// + Logging

export type ingameChat = ( msg : string ) => void
export type ingameDebug = ( item : string, value : any ) => void 
export interface IngameDisplay {
    chat : ingameChat
    debug: ingameDebug
}