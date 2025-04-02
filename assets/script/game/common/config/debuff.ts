import { baseConfig } from "./baseConfig";

class DebuffConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/debuff";
        return this.m_file;
    }
}

const debuffConfig = new DebuffConfig();
export { debuffConfig };




