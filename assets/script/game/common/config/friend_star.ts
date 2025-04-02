import { baseConfig } from "./baseConfig";

class FriendStarConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/friend_star";
        return this.m_file;
    }

    getConfigByStar(type:any, star:any) {
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.starLevel == star && config.type == type) {
                    return config;
                }
            }
        }
        return null;
    }

    //获取最高星级
    getMaxStar(type:any) {
        let max = 0;
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.type == type && +config.starLevel > +max) {
                    max = config.starLevel;
                }
            }
        }
        return max;
    }
}

const friendStarConfig = new FriendStarConfig();
export { friendStarConfig };




