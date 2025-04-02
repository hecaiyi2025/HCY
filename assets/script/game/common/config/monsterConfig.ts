import { baseConfig } from "./baseConfig";

class MonsterConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/monster";
        return this.m_file;
    }
}

const monsterConfig = new MonsterConfig();
export { monsterConfig };




