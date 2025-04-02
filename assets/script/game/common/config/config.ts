import { JsonAsset, assetManager, resources } from "cc";
import { monsterConfig } from "./monsterConfig";
import { roleConfig } from "./roleConfig";
import { skillConfig } from "./skill";
import { cloudsConfig } from "./clouds";
import { degreeConfig } from "./degree";
import { cloudsLevelConfig } from "./clouds_level";
import { friendConfig } from "./friend";
import { friendLevelConfig } from "./friend_level";
import { constantConfig } from "./constant";
import { starConfig } from "./star";
import { buffConfig } from "./buff";
import { equipmentConfig } from "./equipment";
import { equipmentStarConfig } from "./equipment_star";
import { petConfig } from "./petConfig";
import { bossGameConfig } from "./bossGameConfig";
import { talentConfig } from "./talent";
import { mallConfig } from "./mallConfig";
import { taskConfig } from "./taskConfig";
import { petBuffConfig } from "./Pet_buff";
import { cloudsStarConfig } from "./clouds_star";
import { petsStarConfig } from "./pets_star";
import { friendStarConfig } from "./friend_star";
import { fetterConfig } from "./fetters";
import { practiceConfig } from "./practice";
import { goodsConfig } from "./goods";
import { skillStarConfig } from "./skill_star";
import { debuffConfig } from "./debuff";
import { guideConfig } from "./guide";
import { monsterOrderConfig } from "./monster_order";

import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { smc } from "../../common/SingletonModuleComp";

const m_configs = [
    monsterConfig,
    roleConfig,
    skillConfig,
    degreeConfig,
    cloudsConfig,
    friendConfig,
    cloudsLevelConfig,
    cloudsStarConfig,
    friendLevelConfig,
    friendStarConfig,
    starConfig,
    constantConfig,
    buffConfig,
    equipmentConfig,
    equipmentStarConfig,
    petConfig,
    bossGameConfig,
    talentConfig,
    mallConfig,
    taskConfig,
    petsStarConfig,
    petBuffConfig,
    fetterConfig,
    practiceConfig,
    goodsConfig,
    skillStarConfig,
    debuffConfig,
    guideConfig,
    monsterOrderConfig,
];

let m_configsLoadId:any = null;//读配置超时计时器id
//let m_isLoad = false;

function getToFixedNum(formatNum:any) {
    let fixNum = 2;
    if (formatNum * 100 % 100 == 0) {
        fixNum = 0;
    } else if (formatNum * 10 % 10 == 0) {
        fixNum = 1;
    } else {
        fixNum = 2;
    }
    return fixNum;
}

function formatNum(num:any, fixed = null) {
    let returnNum = num;
    if (num >= 100000000) {
        const fixedNum = getToFixedNum(Number((Number(num) / 100000000).toFixed(2)));
        returnNum = (num / 100000000).toFixed(fixedNum) + '亿';
    } else if (num >= 10000 && fixed != 3) {
        const fixedNum = getToFixedNum(Number((Number(num) / 10000).toFixed(2)));
        returnNum = (num / 10000).toFixed(fixedNum) + '万';
    } else if (num >= 1000 && (fixed != 2 && fixed != 3)) {
        const fixedNum = getToFixedNum(Number((Number(num) / 1000).toFixed(2)));
        returnNum = (num / 1000).toFixed(fixedNum) + '千';
    }
    return returnNum;
}

async function LoadConfigs(callback:((finished: number, total: number, item:any) => void) | null,completedCallback:Function) {
    
    let index = m_configs.length;
    if (m_configsLoadId) {
        clearTimeout(m_configsLoadId);
        m_configsLoadId = null;
    }
    m_configsLoadId = setTimeout(() => {
        m_configsLoadId = null;
        LoadConfigsCompleted();
    }, 3000);
    for (let i = 0; i < m_configs.length; i++) {
        const config = m_configs[i];

        /*
        resources.load(config.getConfigFile(), JsonAsset, (err, asset) => {
            if (!err) {
                let configData = asset.json;
                config.setAsset(asset);
                let map :{ [key: string|number]: any } = {};
                if (configData && typeof configData == 'object') {
                    if (config.getOrgin()) {
                        config.setConfig(configData);
                    } else {
                        let indexStr = config.getIndexStr();
                        for (const key in configData) {
                            if (Object.prototype.hasOwnProperty.call(configData, key)) {
                                const data = configData[key];
                                if (data[indexStr]) {
                                    let idx=data[indexStr];
                                    map[idx] = data;
                                }
                            }
                        }
                        config.setConfig(map);
                    }
                }
                // console.log(map, 'map');
            } else {
                console.log('err:', err);
            }
            index--;
            if (index == 0) {
                if (m_configsLoadId) {
                    clearTimeout(m_configsLoadId);
                    m_configsLoadId = null;
                }
                m_isLoad = true;
                LoadConfigsCompleted();
                for (let i = 0; i < m_configs.length; i++) {
                    const config = m_configs[i];
                    console.log("加载配置:", config.getConfigFile());
                    console.log(config.getConfig());
                }
                if (completedCallback) {
                    completedCallback();
                }
            }
        });
        */
        callback!(i,m_configs.length,null);
        await oops.res.load(config.getConfigFile(), JsonAsset, (err:Error|null, asset:JsonAsset) => {
            if (!err) {
                let configData = asset.json;
                config.setAsset(asset);
                let map :{ [key: string|number]: any } = {};
                if (configData && typeof configData == 'object') {
                    if (config.getOrgin()) {
                        config.setConfig(configData);
                    } else {
                        let indexStr = config.getIndexStr();
                        for (const key in configData) {
                            if (Object.prototype.hasOwnProperty.call(configData, key)) {
                                const data = configData[key];
                                if (data[indexStr]) {
                                    let idx=data[indexStr];
                                    map[idx] = data;
                                }
                            }
                        }
                        config.setConfig(map);
                    }
                }
                // console.log(map, 'map');
            } else {
                console.log('err:', err);
            }
            index--;
            if (index == 0) {
                if (m_configsLoadId) {
                    clearTimeout(m_configsLoadId);
                    m_configsLoadId = null;
                }
                //m_isLoad = true;
                smc.account.AccountModel.m_isLoadconfig=true;
                LoadConfigsCompleted();
                for (let i = 0; i < m_configs.length; i++) {
                    const config = m_configs[i];
                    console.log("加载配置:", config.getAsset());
                    //console.log(config.getConfig());
                }
                if (completedCallback) {
                    completedCallback();
                }
            }  
        })
        
    }
}

//获取括号内字符串
function getBracketContents(str:string) {
    const regex = /\{\{(.+?)\}\}/g;
     return str.match(regex);
}

function LoadConfigsCompleted() {
    //读取完所有配置后，对配置内的所有字符串进行处理：1-中文uri解码 2-{}尖括号替换
    for (let i = 0; i < m_configs.length; i++) {
        const config = m_configs[i];
        const configData = config.getConfig();
        for (const id in configData) {
            if (Object.prototype.hasOwnProperty.call(configData, id)) {
                const data = configData[id];
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        let value = data[key];
                        if (typeof value == 'string') {
                            if (value.indexOf('%') !== -1) {//中文解码
                                data[key] = decodeURI(value);
                                value = data[key];
                            }
                            if (value.indexOf('{{') !== -1 && value.indexOf('}}') !== -1) {
                                let contents = getBracketContents(value);
                                if(contents==null) return;
                                for (let j = 0; j < contents.length; j++) {
                                    let content = contents[j];
                                    content = content.substring(2, content.length - 2);//去掉{{}}
                                    if (content.indexOf('{{') !== -1) {//嵌套调用
                                        const param1 = content.substring(0, content.indexOf('{{'));
                                        const thisStr = data[param1];
                                        const thisParam = JSON.parse(thisStr);
                                        let thisId = null;
                                        if (thisParam.length && thisParam.length > 0) {
                                            for (const key2 in thisParam[0]) {
                                                if (key2.indexOf('id') !== -1 || key2.indexOf('Id') !== -1 || key2.indexOf('ID') !== -1) {
                                                    thisId = thisParam[0][key2];
                                                }
                                            }
                                        }
                                        const param2 = content.substring(content.indexOf('{{') + 2, content.length);
                                        if (param2.indexOf('#') !== -1) {
                                            const list = param2.split('#');
                                            if (list.length == 3) {
                                                const otherFileName = list[1];
                                                const otherFileParam = list[2];
                                                for (let k = 0; k < m_configs.length; k++) {
                                                    const otherConfig = m_configs[k];
                                                    if (otherConfig.getConfigFile().indexOf(otherFileName) !== -1 && thisId) {
                                                        const otherConfigData = otherConfig.getConfigByID(thisId);
                                                        data[key] = value.replace("{{" + content + "}}}}", otherConfigData[otherFileParam]);
                                                        value = data[key];
                                                        // console.log('data[key]', data[key]);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        const isNum = Number(data[content]) != null;
                                        data[key] = value.replace("{{" + content + "}}", isNum ? formatNum(data[content]) : data[content]);
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function IsLoadConfigs() {
    return smc.account.AccountModel.m_isLoadconfig;//m_isLoad;
}

function clearConfigs() {
    for (let i = 0; i < m_configs.length; i++) {
        const config = m_configs[i];
        config.clearConfig();
    }
    //m_isLoad = false;
    smc.account.AccountModel.m_isLoadconfig=false;
    m_configsLoadId = null;
}

export { LoadConfigs, IsLoadConfigs, clearConfigs };