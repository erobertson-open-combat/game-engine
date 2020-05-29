import SyncDataManager from "./SyncDataManager";
import * as T from '../types.js'

export default class TerrainManager {

    constructor ( public syncData : SyncDataManager ) {}

    // + Update

    update (){

    }

    // + Render Data

    get_RenderState () : T.RenderStateTerrain {
        return {}
    }

    
}