/*
    INFO: Tracks local clients key and mouse movements to send to the server
*/

import * as T from '../types.js'
interface InputLookup { [key : string ] : number }

export default class Input {

    // Represents each key you are tracking and how many ticks it has been held down
    keyLog : InputLookup = {}
    eventSyncLog : T.SyncInput[] = []

    constructor ( ) {

        document.addEventListener("keydown", this.keyDown.bind(this) )
        document.addEventListener("keyup", this.keyUp.bind(this) )
        document.addEventListener("mousedown", this.mouseDown.bind(this))
        document.addEventListener("mouseup", this.mouseUp.bind(this))

        document.addEventListener('contextmenu', e =>  e.preventDefault() )

    }

    // Events

    keyDown ( e : KeyboardEvent ) {
        this.keyLog[e.key] = 0
        this.eventSyncLog.push({ input: e.key, down : true })
    }
    keyUp ( e : KeyboardEvent ) {
        delete this.keyLog[e.key]
        this.eventSyncLog.push({ input: e.key, down : false })
    }
    mouseDown ( e : MouseEvent ){
        let name = e.button == 0 ? 'leftClick' : 'rightClick'
        this.keyLog[name] = 0
        this.eventSyncLog.push({ input: name, down : true })
    }
    mouseUp ( e : MouseEvent ){
        let name = e.button == 0 ? 'leftClick' : 'rightClick'
        delete this.keyLog[name]
        this.eventSyncLog.push({ input: name, down : false })
    }

    // Register game tick

    registerGameTick () {
        let allKeys = Object.keys( this.keyLog )
        allKeys.forEach( k => this.keyLog[k] += 1 )
        
    }

    getKeyUpdates () : T.SyncInput[] {
        let keyStates = this.eventSyncLog;
        this.eventSyncLog = []
        return keyStates;
    }

    // Get key states

    getKeyState ( key : string ) {
        return this.keyLog[key] || 0
    }

}