import { baseConfig } from "./baseConfig";

class PracticeConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/practice";
        return this.m_file;
    }
    getConfigLevel(type,level) {
        for (const key in this.m_config) {
            if (this.m_config[key].level == level&&this.m_config[key].type==type) {
                return this.m_config[key];
            }
        }
        return null;
    }
}

const practiceConfig = new PracticeConfig();
export { practiceConfig };




