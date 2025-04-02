import { baseConfig } from "./baseConfig";

class PetBuffConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/Pet_buff";
        return this.m_file;
    }
}

const petBuffConfig = new PetBuffConfig();
export { petBuffConfig };




