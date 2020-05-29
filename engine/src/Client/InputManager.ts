/*
    INFO: Tracks local clients key and mouse movements to send to the server
*/

import * as T from '../Types.js'

interface InputLookup { [key : string ] : number }

export default class Input {

    // Represents each key you are tracking and how many ticks it has been held down
    keyLog : InputLookup = {}
    eventSyncLog : T.InputKeyState[] = []
    clientFacing : T.InputMouseFacing

    // Accepted Key Mappings
    keyMapping = {
        a : 'left', w : 'up', s : 'down', d : 'right'
    }

    constructor ( ) {

        this.clientFacing  = { dx : 0, dy : 0}

        document.addEventListener("keydown", this.keyDown.bind(this) )
        document.addEventListener("keyup", this.keyUp.bind(this) )
        document.addEventListener("mousedown", this.mouseDown.bind(this))
        document.addEventListener("mouseup", this.mouseUp.bind(this))
        document.addEventListener("mousemove", this.mouseMove.bind(this))
        document.addEventListener( 'click', this.onMouseClick ) ;

        document.addEventListener('contextmenu', e =>  e.preventDefault() )

    }

    // Events

    keyDown ( e : KeyboardEvent ) {
        let event = this.keyMapping[e.key]
        if ( ! event ) return
        if ( this.keyLog[event] ) return
        this.keyLog[event] = 0
        this.eventSyncLog.push({ input: event, down : true })
    }
    keyUp ( e : KeyboardEvent ) {
        let event = this.keyMapping[e.key]
        if ( ! event ) return
        if ( ! this.keyLog[event] ) return
        delete this.keyLog[event]
        this.eventSyncLog.push({ input: event, down : false })
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
    mouseMove ( e : MouseEvent ) {
        this.clientFacing.dx -= e.movementX * 0.002;
        this.clientFacing.dy -= e.movementY * 0.002;
    }
    onMouseClick = (event) => { document.body.requestPointerLock() }

    // Register game tick

    registerGameTick () {
        let allKeys = Object.keys( this.keyLog )
        allKeys.forEach( k => this.keyLog[k] += 1 )
        
    }

    getKeyUpdates () : T.InputState {
        let keyStates = this.eventSyncLog;
        this.eventSyncLog = []
        return {
            mouse : this.clientFacing,
            events : keyStates
        };
    }

    getLocalPlayerFacing () : T.InputMouseFacing {
        return this.clientFacing
    }

    // Get key states

    getKeyState ( key : string ) {
        return this.keyLog[key] || 0
    }

}