import { baseConfig } from "./baseConfig";

class MallConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/mall";
        return this.m_file;
    }

    getConfigType(type) {
        let list = []
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.mallType == type) {
                    list.push(config);
                }
            }
        }
        return list;
    }
}

const mallConfig = new MallConfig();
export { mallConfig };




