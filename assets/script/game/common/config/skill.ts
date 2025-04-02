import { baseConfig } from "./baseConfig";

class SkillConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/skill";
        return this.m_file;
    }
}

const skillConfig = new SkillConfig();
export { skillConfig };




