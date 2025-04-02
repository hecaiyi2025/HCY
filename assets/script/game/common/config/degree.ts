import { baseConfig } from "./baseConfig";

class DegreeConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/degree";
        return this.m_file;
    }
}

const degreeConfig = new DegreeConfig();
export { degreeConfig };




