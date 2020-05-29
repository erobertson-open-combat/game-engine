/*
    INFO: Global utils file for generally repeated functions throughout codebase
*/

import * as T from './Types'

// Many things need UIDS, they are all assigned here
// As much as possible, all ids are unique integers

let lastId : T.id = 0 ;
export function nextId () : T.id { return ++ lastId }