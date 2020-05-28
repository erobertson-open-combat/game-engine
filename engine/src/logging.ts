/*
    INFO: This file is used to route logs to their propper targets
    Use this file instead of console.log to make sure logs are all in one spot
*/

import * as T from './types'

type LogCallback = ( msg : string ) => void
interface LogCallbackLookup { [target:string] : LogCallback }

let logCallbackLookup : LogCallbackLookup = {}

function log ( message : string, target : string  ){
    if ( ! logCallbackLookup [target] ) return;
    logCallbackLookup [target] ( message )
}

function addLogTarget ( target : string, callback : LogCallback ) { 
    logCallbackLookup [ target ] = callback 
}

function generateLogger ( prefix : string ) : T.LoggerObject {
    return {
        client : ( message : string ) => {
            log(`[${prefix}] ${message}`, 'client')
        },
        server : ( message : string ) => {
            log(`[${prefix}] ${message}`, 'server')
        },
        both : ( message : string ) => {
            log(`[${prefix}] ${message}`, 'server')
            log(`[${prefix}] ${message}`, 'client')
        },
    }
}

export default { addLogTarget, generateLogger }