# Socketio Communication Events


## From Server to Client

`initial-sync` - Data of **SyncInitial**
- Sends inital game state to the newly connected client

`update-sync` - Data of **SyncEvent[]**
- Sends updates on game states every tick ( 50ms )

## From Client to Server

`login` - Data of **id**
- On inital connection, send the gameKey to login to the server

`disconnect` - No Data
- Triggered when client disconnects

# Update Sync Data
Data sent through the `update-sync` socketio connection

## Player

`join-player` - Data of **SyncInitialPlayer**
- Recorded when a new player joins the engine

`leave-player` - Data of **id**
- Records the id of a player that has left