/*
    INFO: Networking Types for server-client communication
*/

import * as Root from './types_root.js'
import * as Physics from './types_physics.js'
import * as Engine from './types_engine'

// + Client Login 

export let ioevent_ClientLogin = 'client-login'
export interface ClientLoginData {
    gamekey : Root.id
}


// + Login Failed

export let ioevent_LoginFailed = 'login-failed'
export type LoginFailedData = void


// + Game Loop Syncronization

export let ioevent_GameLoopSync = 'game-loop-sync'
export interface GameLoopSyncData {
    currentTick : number
    firstTick : number
}

// + Initial Game State 

export let ioevent_InitialGameStateSync = 'initial-game-state'
export interface InitialGameStateData {
    id : Root.id,
    players : Engine.InitialPlayerState[]
}

// + Disconnected 

export let ioevent_Disconnect = 'disconnect'

// + Client Sync 

export let ioevent_ClientSync = 'client-sync'
export type ClientSyncData = {
    actions : ClientAction[] ,
    body : Engine.PlayerBodyPosition,
    position : Physics.DynamicObjectSync
}
export interface ClientAction {
    // 'jump'|'forward'|'left'|'back'|'right'|'abil_1'|'abil_2'|'abil_3'|'leftClick'|'rightClick'
    type : string
    active : boolean
}

// + Client Connection to Server Target 

export interface NetworkConnectionTarget {
    socketIO : any
    ip : Root.id
    gamekey : Root.id
}

// + Server sync to clients

export let ioevent_ServerSyncEvent = 'sync-event'
export interface ServerSyncData {
    name : string,
    data : any 
}