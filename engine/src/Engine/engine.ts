import * as PlayerManager from './playerManager.js'

export function initialize ( startingGameLoop : number = 0 ) {
    
}

export function do_gameTick () {
    PlayerManager.update()
}