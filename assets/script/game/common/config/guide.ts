import { baseConfig } from "./baseConfig";

class GuideConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/guide";
        return this.m_file;
    }

    //获取当前顺序config
    getConfigByIndex(order:any) {
        let config = this.getConfig();
        let list = [];
        for (let i = 0; i < config.length; i++) {
            if (config[i].order == order) {
                list.push(config[i]);
            }
        }
        return list;
    }
}

const guideConfig = new GuideConfig();
export { guideConfig };




