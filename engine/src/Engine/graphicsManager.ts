import * as T from '../Types/types.js'

// Callback storage for creation events
interface CallbackLookup { [key : string] : (id : T.Root.id, data : any) => (update : any) => void }
let creationCallbacks : CallbackLookup = {}

// Setup a new callback
export function setCallback ( event : string, callback : (id : T.Root.id, data : any ) => (update : any) => void ) {
    creationCallbacks[ event ] = callback;
}

// Creat a player
export function create_item ( item: string, id : T.Root.id, data : any  ) : (update : any) => void {
    let callback = creationCallbacks[item]
    if ( callback )
        return callback(id, data) 
    else 
        return () => { }
}