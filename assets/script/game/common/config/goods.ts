import { Sprite, SpriteFrame } from "cc";
import { getResources, getResourcesAsync } from "../publicFunctions";

import { baseConfig } from "./baseConfig";

class GoodsConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/goods";
        return this.m_file;
    }
    
    //根据id获取对应icon
    setIconByIDAsync(icon: Sprite, id:any) {
        let config = this.getConfigByID(id);
        if(config.hasOwnProperty("icon")){
            config.icon
        }
        //oops.res.loadAsync(config.icon,SpriteFrame).then((spriteFrame: SpriteFrame)=>{icon.spriteFrame = spriteFrame as SpriteFrame;});
        
        getResourcesAsync(config.icon, (success:boolean, spriteFrame: SpriteFrame) => {
            if (success) {
                icon.spriteFrame = spriteFrame as SpriteFrame;
            }
        });
        
    }

    //根据id获取对应icon
    async getIconByID(id:any) {
        let config = this.getConfigByID(id)
        return await getResources(config.icon)
       
    }
    getConfigType(type:any) {
        let list = []
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.type == type) {
                    list.push(config);
                }
            }
        }
        return list;
    }
}

const goodsConfig = new GoodsConfig();
export { goodsConfig };




