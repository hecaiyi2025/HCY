import { baseConfig } from "./baseConfig";

class RoleConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/role";
        return this.m_file;
    }

    getConfigByType(type) {
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

const roleConfig = new RoleConfig();
export { roleConfig };




