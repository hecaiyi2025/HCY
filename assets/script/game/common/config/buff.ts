import { baseConfig } from "./baseConfig";

class BuffConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/buff";
        return this.m_file;
    }
}

const buffConfig = new BuffConfig();
export { buffConfig };




