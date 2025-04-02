import { assetManager } from "cc";

export class baseConfig {
    m_file = "";
    m_config: { [key: string]: any } = {};
    m_load = false;
    m_indexStr = "id";
    m_orgin = false;//是否不需要数据加工，源数据传入setConfig
    m_asset = null;
    getConfigFile() {
        return this.m_file;
    }
    getAsset() {
        return this.m_asset;
    }
    setAsset(asset:any) {
        this.m_asset = asset;
    }
    setConfig(data:any) {
        // console.log('setConfig:', data);
        this.m_config = data;
        this.m_load = true;
    }
    getConfig() {
        return this.m_config;
    }

    clearConfig() {
        if (this.m_asset) {
            assetManager.releaseAsset(this.m_asset);
        }
        this.m_config = {};
        this.m_load = false;
    }

    getConfigByID(id:any) {
        if(this.m_config==null) return {};
        return this.m_config[id];
    }
    isLoad() {
        return this.m_load;
    }
    getIndexStr() {
        return this.m_indexStr;
    }
    getOrgin() {
        return this.m_orgin;
    }
}