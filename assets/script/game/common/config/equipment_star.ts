import { baseConfig } from "./baseConfig";

class EquipmentStarConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/equipment_star";
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
    getConfigLevel(belong:any, quality:any) {
        for (const key in this.m_config) {
            if (this.m_config[key].quality == quality && this.m_config[key].belong == belong) {
                return this.m_config[key];
            }
        }
        return null;
    }

    getBelongMaxStar(belong:any) {
        let list = []
        for (const key in this.m_config) {
            if (this.m_config[key].belong == belong) {
                list.push(this.m_config[key]);
            }
        }
        list.sort((a, b) => b.quality - a.quality)
        return list[0].quality;
    }
}

const equipmentStarConfig = new EquipmentStarConfig();
export { equipmentStarConfig };




