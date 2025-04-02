import { baseConfig } from "./baseConfig";

class StarConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/star";
        return this.m_file;
    }
}

const starConfig = new StarConfig();
export { starConfig };




