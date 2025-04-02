import { baseConfig } from "./baseConfig";

class SkillStarConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/skill_star";
        return this.m_file;
    }

    getConfigByStar(belong, star) {
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.starLevel == star && config.belong == belong) {
                    return config;
                }
            }
        }
        return null;
    }

     //获取最高星级
     getMaxStar(belong) {
        let max = 0;
        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.belong == belong && +config.starLevel > +max) {
                    max = config.starLevel;
                }
            }
        }
        return max;
    }
}

const skillStarConfig = new SkillStarConfig();
export { skillStarConfig };




