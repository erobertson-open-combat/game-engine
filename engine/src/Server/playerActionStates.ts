/*
    INFO: Server Tracking of inputs being pressed
*/

interface InputLookup { [key : string ] : number }

export default class PlayerActionStates {

    keyLog : InputLookup = {}

    eventStart ( name : string ) { 
        this.keyLog[name] = 0
    }
    eventStop ( name : string ) {
        delete this.keyLog[name]
    }

    registerGameTick () {
        let allKeys = Object.keys( this.keyLog )
        allKeys.forEach( k => this.keyLog[k] += 1 )
    }

    getKeyState ( key : string ) {
        return this.keyLog[key] || 0
    }

}