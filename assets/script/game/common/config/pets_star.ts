import { baseConfig } from "./baseConfig";

class PetsStarConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/pets_star";
        return this.m_file;
    }
    getConfigLevel(belong, starLevel) {
        for (const key in this.m_config) {
            if (this.m_config[key].starLevel == starLevel && this.m_config[key].belong == belong) {
                return this.m_config[key];
            }
        }
        return null;
    }

    //获取宠物最大星级
    getPetMaxStar(belong) {
        let maxStar = 0;
        for (const key in this.m_config) {
            if (this.m_config[key].belong == belong) {
                if (this.m_config[key].starLevel > maxStar) {
                    maxStar = this.m_config[key].starLevel;
                }
            }
        }
        return maxStar;
    }
}

const petsStarConfig = new PetsStarConfig();
export { petsStarConfig };




