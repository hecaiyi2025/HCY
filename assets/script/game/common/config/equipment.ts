import { getResources } from "../publicFunctions";
import { baseConfig } from "./baseConfig";

class EquipmentConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/equipment";
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
    //根据id获取对应icon
    async getIconByID(id:any) {
        let config = this.getConfigByID(id);
        return await getResources(config.icon)
    }
}

const equipmentConfig = new EquipmentConfig();
export { equipmentConfig };




