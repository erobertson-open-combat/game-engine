/*
    INFO: This file is used to route logs to their propper targets
    Use this file instead of console.log to make sure logs are all in one spot
*/

import * as T from './Types'

// Log Targets
let targetClientInGame = ( msg : string ) => {} 
let targetInfo = ( msg : string ) => {} 
let targetServerConsole = ( msg : string ) => {} 

export function setClientInGame ( target : ( msg : string ) => void ) {
    targetClientInGame = target;
}
export function setInfo ( target : ( msg : string ) => void ) {
    targetInfo = target;
}
export function setServerConsole ( target : ( msg : string ) => void ) {
    targetServerConsole = target;
}

// Logging 
export function client ( msg : string ) {
    targetClientInGame( msg )
}
export function info ( msg : string ) {
    targetInfo( msg )
}
export function server ( msg : string ) {
    targetServerConsole( msg )
}

// Logging with prefixes
export function generateLogger ( prefix : string ) : T.LoggerObject {
    return {
        client : ( msg : string ) => {
            client(`[${prefix}] ${msg}`)
        },
        info : ( msg : string ) => {
            info(`[${prefix}] ${msg}`)
        },
        server : ( msg : string ) => {
            server(`[${prefix}] ${msg}`)
        }
    }
}
