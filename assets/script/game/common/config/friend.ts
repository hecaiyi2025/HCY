import { baseConfig } from "./baseConfig";

class FriendConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/friend";
        return this.m_file;
    }

    getConfigByType(type:any) {
        const configList = this.getConfig();
        for (const id in configList) {
            if (Object.prototype.hasOwnProperty.call(configList, id)) {
                const config = configList[id];
                if (config.type == type) {
                    return config;
                }
            }
        }
        return null;
    }
}

const friendConfig = new FriendConfig();
export { friendConfig };




