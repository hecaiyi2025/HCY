import { baseConfig } from "./baseConfig";

class BossGameConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/bossgame";
        return this.m_file;
    }
}

const bossGameConfig = new BossGameConfig();
export { bossGameConfig };




