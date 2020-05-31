import * as T from '../types/types.js'

let doChat : T.Client.ingameChat = () => {}
let doDebug : T.Client.ingameDebug = () => {} 

export function initialize ( display : T.Client.IngameDisplay ) {
    let { chat, debug } = display
    doChat = chat
    doDebug = debug
}

export function writeClient ( msg : string ) {
    doChat ( msg )
}

export function writeDebug ( item : string, value : any ) {
    doDebug( item, value )
}