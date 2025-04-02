import { baseConfig } from "./baseConfig";

class TaskConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/task";
        return this.m_file;
    }

    getConfigType(type) {
        let list = []
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.mall_type == type) {
                    list.push(config);
                }
            }
        }
        return list;
    }
}

const taskConfig = new TaskConfig();
export { taskConfig };




