import { baseConfig } from "./baseConfig";

class PetConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/pets";
        return this.m_file;
    }
}

const petConfig = new PetConfig();
export { petConfig };




