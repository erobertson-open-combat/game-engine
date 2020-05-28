/*
    INFO: As much as possible, all types are defined here
    This is done because it provides a cleaner way to aggrogate all the types used actoss the game
    In addion, it allows many functions to pass a single object refrence rather than many values
    
    IMPORTANT: Do not import other objects into this file
    If you find yourself creating a type that includes classes as subtypes, make a class 
    Make classes if you really need to contain other class refrences
    Only use base types here
*/

// + General

// Any generic id is a number
export type id = number

// A key like 'a' or a button like 'leftMouse'
export type input = string

// An ip, used for connections and sockets
export type ip = string

// An update event sent from the engine to anothe engine
// stuff like 'player-join'
export type syncEvent = string

// + Spacial

export interface SpacialPosition {
    x : number
    y : number
    z : number
}
export interface SpacialCube { 
    x : number
    y : number
    z : number
    w : number
    h : number
    d : number
}


// + ThreeJS & Rendering

export interface ThreeRenderPerspective {
    position : SpacialPosition
    pitch : number
    yaw : number
}

export interface ThreeCamera {
    camera : any
    yawObject : any
    pitchObject : any 
}


// + Client & Server Communication

export interface NetworkConnectionTarget {
    socketIO : any,
    ip : ip,
    id : id
}

export interface SyncInitial {
    firstGameTickMs : number
    totalGameTicks : number
    id : id 
    players : SyncInitialPlayer[]
}
export interface SyncInitialPlayer {
    id : id
}

export interface SyncEvent {
    name : syncEvent,
    data : any
}
export interface SyncInput {
    input : input
    down : boolean 
}

// + Logger

export interface LoggerObject {
    client : (msg : string) => void
    server : (msg : string) => void
    both : (msg : string) => void
}