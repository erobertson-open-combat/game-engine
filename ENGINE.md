# What this engine is soposed to be 

- One dir that is the local player version
- One dir that is the server version 
- One dir that is the main engine

### Local player

- **Implements** a local copy of the engine

- takes in input from `WASD`, `Jump`, `Looking around`, and `Ability selection`
- sends data to the server about these updates
- uses movement to update local engine
- overwrites local data with the data from the server as it recieves it

### Server version

- **Implements** a local copy of the engine
- **Implements** `socket.io` and tracks players
- **Implements** an ability management system?

- Takes input from the client in the engine simulation
- processes server updates
- Syncs data back to the clients

### Main Engine

- Physics
- Rendering ( only when on client )
- Projectiles
- Players
- Terrain
- Particles
- Effects ( Some type of custom placeable items )

