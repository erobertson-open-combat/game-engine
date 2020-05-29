import express from 'express'
import http from 'http'
import socketIO from 'socket.io'

import { Log, Server } from './engine/build/index.js'

// Setup Web-Server
let app = express () 
let server = http.createServer( app )
let io = socketIO(server)

// Logging
Log.setServerConsole( msg => {
    let hours = (''+(new Date().getHours())).padStart(2,'0')
    let mins = (''+(new Date().getMinutes())).padStart(2,'0')
    let secs = (''+(new Date().getSeconds())).padStart(2,'0')
    let time = `[${hours}:${mins}:${secs}]  `
    console.log ( time + msg )
})
Log.setInfo ( msg => {
    console.log ('INFO:', msg )
})

// Setup GameEngine Server
let openServer = new Server ( 123 )
io.on('connection', openServer.clientConnects );

// Setup Client Files
app.use('/engine', express.static('engine/build'));
app.use('/', express.static('public'));

// Start
server.listen(3000, () => console.log('Server online at port 3000'))