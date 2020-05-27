/* ================================================================
    Spacial and Positional Types
================================================================ */

export interface Position {
    x : number
    y : number
    z : number
}

export interface Cube { 
    x : number
    y : number
    z : number
    w : number
    h : number
    d : number
}


/* ================================================================
    Rendering and ThreeJS Types
================================================================ */

export interface CameraPositioning {
    position : Position
    pitch : number
    yaw : number
}

export interface CameraObject {
    camera : any
    yawObject : any
    pitchObject : any 
}



/* ================================================================
    CLient Server Communication Types
================================================================ */

export interface NetworkingTarget {
    socketIO : any,
    targetIP : string,
    gameKey : string
}
export interface InitalClientSync {
    firstGameTickMs : number
    totalGameTicks : number
}