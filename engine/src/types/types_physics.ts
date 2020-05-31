// + Spacial Data

export interface Position {
    x : number
    y : number
    z : number
}
export interface Velocity {
    dx : number
    dy : number
    dz : number
}
export interface Cube {
    x : number
    y : number
    z : number
    w : number
    h : number
    d : number
}


// + Dynamic object data

export interface DynamicObjectSync {
    position : Position,
    velocity : Velocity
}
