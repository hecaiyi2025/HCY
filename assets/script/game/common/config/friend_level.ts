import { baseConfig } from "./baseConfig";

class FriendLevelConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/friend_level";
        return this.m_file;
    }

    getConfigByTypeAndLevel(type: number, level: number) {
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.type == type && config.level == level) {
                    return config;
                }
            }
        }
        return null;
    }
}

const friendLevelConfig = new FriendLevelConfig();
export { friendLevelConfig };




