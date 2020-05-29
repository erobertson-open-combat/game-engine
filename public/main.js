import { Log, Client } from '/engine/index.js'

// Both of these variables are defined glovally by the two inports from './libs/*' above
// Renaming them for clarity

let socketIO = io;
let threeJS = THREE;

let networkingTarget = { 
    socketIO, 
    ip : "localhost:3000",
    id : 123
}

let ingameConsole = document.getElementById('chat')
Log.setClientInGame ( log => {
    ingameConsole.innerHTML += `<div>${log}</div>`
})

// Initalize instance of the client

let client = new Client( threeJS, networkingTarget )
