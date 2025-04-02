import { baseConfig } from "./baseConfig";

class CloudsLevelConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/clouds_level";
        return this.m_file;
    }

    getConfigByTypeAndLevel(type:any, level:any) {
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

const cloudsLevelConfig = new CloudsLevelConfig();
export { cloudsLevelConfig };




