import {log} from "../../../common/utils";

let pokeEngine: any = null

type PokeHandler = (id: string, isGroup: boolean)=>void

let pokeRecords: Record<string, number> = {}
export function registerPokeHandler(handler: PokeHandler){
    if(!pokeEngine){
        try {
            pokeEngine = require("./ccpoke/poke-win32-x64.node")
            pokeEngine.performHooks();
        }catch (e) {
            log("戳一戳引擎加载失败", e)
            return
        }
    }
    pokeEngine.setHandlerForPokeHook((id: string, isGroup: boolean)=>{
        let existTime = pokeRecords[id]
        if (existTime){
            if (Date.now() - existTime < 1500){
                return
            }
        }
        pokeRecords[id] = Date.now()
        handler(id, isGroup);
    })
}