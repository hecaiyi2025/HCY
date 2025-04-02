import { baseConfig } from "./baseConfig";

class MonsterOrderConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/monster_order";
        return this.m_file;
    }
}

const monsterOrderConfig = new MonsterOrderConfig();
export { monsterOrderConfig };