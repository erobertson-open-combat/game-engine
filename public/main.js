import { Client } from '/engine/index.js'

// Both of these variables are defined glovally by the two inports from './libs/*' above
// Renaming them for clarity

let socketIO = io;
let threeJS = THREE;

let networkingTarget = { 
    socketIO, 
    ip : "localhost:3000",
    gamekey : 'debug'
}

// Ingame values displayed
let ingameConsole = document.getElementById('chat')
function chat ( msg ) {
    ingameConsole.innerHTML += `<div>${msg}</div>`
}

let ingameDebug = document.getElementById('debug')
let values = {}
function debug ( item, value ) {
    values[item] = value
    let text = ''
    for ( const key in values ) {
        text += `<div>${key}: ${values[key]}</div>`
    }
    ingameDebug.innerHTML = text
}

// Initalize instance of the client

let client = new Client( threeJS, networkingTarget, { chat, debug } )
