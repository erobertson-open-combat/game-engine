/*
    INFO: Tracks local clients key and mouse movements to send to the server
*/

import * as T from '../Types/types.js'

interface InputLookup { [key : string ] : number }

// Represents each key you are tracking and how many ticks it has been held down
let keyLog : InputLookup = {}
let eventSyncLog : T.Networking.ClientAction[] = []
let clientFacing : T.Engine.PlayerFacing

// Accepted Key Mappings
let keyMapping = {
    space : 'jump',
    w : 'forward', a : 'left', s : 'back', d : 'right',
    1 : 'abil_1', 2 : 'abil_2', 3 : 'abil_3'
}

export function initialize ( ) {

    clientFacing  = { x : 0, y : 0}

    document.addEventListener("keydown", keyDown.bind(this) )
    document.addEventListener("keyup", keyUp.bind(this) )
    document.addEventListener("mousedown", mouseDown.bind(this))
    document.addEventListener("mouseup", mouseUp.bind(this))
    document.addEventListener("mousemove", mouseMove.bind(this))
    document.addEventListener( 'click', onMouseClick ) ;

    document.addEventListener('contextmenu', e =>  e.preventDefault() )

}

// Events

function keyDown ( e : KeyboardEvent ) {
    let event = keyMapping[e.key]
    if ( ! event ) return
    if ( keyLog[event] ) return
    keyLog[event] = 0
    eventSyncLog.push({ type: event, active : true })
}
function keyUp ( e : KeyboardEvent ) {
    let event = keyMapping[e.key]
    if ( ! event ) return
    if ( ! keyLog[event] ) return
    delete keyLog[event]
    eventSyncLog.push({ type: event, active : false })
}
function mouseDown ( e : MouseEvent ){
    let name = e.button == 0 ? 'leftClick' : 'rightClick'
    keyLog[name] = 0
    eventSyncLog.push({ type: name, active : true })
}
function mouseUp ( e : MouseEvent ){
    let name = e.button == 0 ? 'leftClick' : 'rightClick'
    delete keyLog[name]
    eventSyncLog.push({ type: name, active : false })
}
function mouseMove ( e : MouseEvent ) {
    clientFacing.x -= e.movementX * 0.002;
    clientFacing.y -= e.movementY * 0.002;
}
let onMouseClick = (event) => { document.body.requestPointerLock() }

// Register game tick

export function registerGameTick () {
    let allKeys = Object.keys( keyLog )
    allKeys.forEach( k => keyLog[k] += 1 )
    
}

export function getKeyUpdates () : T.Networking.ClientAction[] {
    let keyStates = eventSyncLog;
    eventSyncLog = []
    return keyStates
}

export function getLocalPlayerFacing () : T.Engine.PlayerFacing {
    return clientFacing
}

// Get key states

export function getKeyState ( key : string ) {
    return keyLog[key] || 0
}
