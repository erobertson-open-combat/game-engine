import express from 'express'
import http from 'http'
import socketIO from 'socket.io'

import { Server } from './engine/build/index.js'

// Setup Web-Server
let app = express () 
let server = http.createServer( app )
let io = socketIO(server)

// Setup GameEngine Server
let openServer = new Server ( { gamekey : 'debug' } )
io.on('connection', openServer.clientConnects );

// Setup Client Files
app.use('/engine', express.static('engine/build'));
app.use('/', express.static('public'));

// Start
server.listen(3000, () => console.log('Server online at port 3000'))