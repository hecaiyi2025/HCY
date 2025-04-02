import { baseConfig } from "./baseConfig";

class FetterConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/fetters";
        return this.m_file;
    }
}

const fetterConfig = new FetterConfig();
export { fetterConfig };




