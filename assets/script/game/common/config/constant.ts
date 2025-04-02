import { baseConfig } from "./baseConfig";

class ConstantConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/constant";
        return this.m_file;
    }
}

const constantConfig = new ConstantConfig();
export { constantConfig };




