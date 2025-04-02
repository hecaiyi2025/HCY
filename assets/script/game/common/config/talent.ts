import { baseConfig } from "./baseConfig";

class TalentConfig extends baseConfig {
    getConfigFile() {
        this.m_file = "config/talent";
        return this.m_file;
    }
    //获取当前id下一个天赋
    getNextTalent(id: number) {
        let data = this.getConfigByID(id)
        return this.getTalentByPos(data.talentBranch, +data.talentSequence + 1);
    }

    //获取对应顺序天赋
    getTalentByPos(type, talentSequence) {
        let data = this.getConfig();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const element = data[key];
                if (element.talentBranch == type && element.talentSequence == talentSequence) {
                    return element;
                }
            }
        }
        return null
    }
}

const talentConfig = new TalentConfig();
export { talentConfig };




