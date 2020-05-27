/*
    Tracks player input on keyboard and on mouse
*/

interface InputLookup { [key : string ] : number }

export default class Input {

    // Represents each key you are tracking and how many ticks it has been held down
    keyLog : InputLookup = {}

    constructor ( ) {

        document.addEventListener("keydown", this.keyDown.bind(this) )
        document.addEventListener("keyup", this.keyUp.bind(this) )

    }

    // Events

    keyDown ( e : KeyboardEvent ) {
        this.keyLog[e.key] = 0
    }
    keyUp ( e : KeyboardEvent ) {
        delete this.keyLog[e.key]
    }

    // Register game tick

    registerGameTick () {
        let allKeys = Object.keys( this.keyLog )
        allKeys.forEach( k => this.keyLog[k] += 1 )
    }

    // Get key states

    getKeyState ( key : string ) {
        return this.keyLog[key] || 0
    }

}