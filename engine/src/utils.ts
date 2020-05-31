/*
    INFO: Global utils file for generally repeated functions throughout codebase
*/

import * as T from './types/types.js'

// Many things need UIDS, they are all assigned here
// As much as possible, all ids are unique integers

export function randomId () : T.Root.id { 
    return (Math.floor(Math.random()*10000000000)).toString(32)

}
