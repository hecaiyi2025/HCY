import { baseConfig } from "./baseConfig";

class CloudsConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/clouds";
        return this.m_file;
    }

    getConfigByType(type:any) {
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.type == type) {
                    return config;
                }
            }
        }
        return null;
    }
}

const cloudsConfig = new CloudsConfig();
export { cloudsConfig };




