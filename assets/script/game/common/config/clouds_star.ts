import { baseConfig } from "./baseConfig";

class CloudsStarConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/clouds_star";
        return this.m_file;
    }

    getConfigByStar(star:any) {
        console.log(this.m_config, star, 'ccccc');

        for (const id in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, id)) {
                const config = this.m_config[id];
                if (config.starLevel == star) {
                    return config;
                }
            }
        }
        return null;
    }

    //获取宠物最大星级
    getCloudsMaxStar() {
        let maxStar = 0;
        for (const key in this.m_config) {
            // if (this.m_config[key].belong == belong) {
            if (this.m_config[key].starLevel > maxStar) {
                maxStar = this.m_config[key].starLevel;
            }
            // }
        }
        return maxStar;
    }

    //获取下一星级
    getNextStar(starId:any) {
        let nextConfig = null;
        let config = this.getConfigByID(starId);
        let list = []
        for (const key in this.m_config) {
            list.push(this.m_config[key])
        }
        list.sort((a, b) => {
            return a.starLevel - b.starLevel;
        })
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.starLevel > config.starLevel) {
                nextConfig = element;
                break;
            }
        }
        return nextConfig;
    }
}

const cloudsStarConfig = new CloudsStarConfig();
export { cloudsStarConfig };




