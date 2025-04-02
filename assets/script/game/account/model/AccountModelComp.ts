

/*
 * @Author: dgflash
 * @Date: 2021-11-12 10:02:31
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:03:45
 */
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Logger } from "../../../../../extensions/oops-plugin-framework/assets/core/common/log/Logger";

import { UserInfo } from "./Userinfo";
import { Prefab, resources } from "cc";
import { roleConfig } from "../../common/config/roleConfig";
import { DEFAULT_ROLE_TYPE, GAME_TYPE } from "../../common/global";

import { cloudsConfig } from "../../common/config/clouds";
import { equipmentConfig } from "../../common/config/equipment";
import { skillConfig } from "../../common/config/skill";
import { monsterConfig } from "../../common/config/monsterConfig";
import { friendConfig } from "../../common/config/friend";
import { degreeConfig } from "../../common/config/degree";
import { petConfig } from "../../common/config/petConfig";
/** 
 * 游戏账号数据 
 */
@ecs.register('AccountModel')
export class AccountModelComp extends ecs.Comp {//AccountModelComp对应GlobalData的功能，方法也放这里吧,也许不合适
    /** 账号名 */
    m_isLoadconfig:boolean=false;
    //AccountName: string = null!;

    reset() {
        //this.AccountName = null!;
    }
    m_apkVersion = null;
    setApkVersion(data:any) {
        this.m_apkVersion = data;
        console.log("setApkVersion:", data);
    }
    getApkVersion() {
        return this.m_apkVersion;
    }

    m_gameRate = 1.5; //游戏速率
    m_gameRateList = [1.5, 2, 3]; //游戏速率列表
    m_gameRateIndex = 0; //游戏速率索引
    getGameRate() {
        return this.m_gameRate;
    }
    setGameRate(data:any) {
        this.m_gameRate = data;
    }

    resetGameRate() {
        this.m_gameRate = this.m_gameRateList[this.m_gameRateIndex];
    }

    getGameRateList() {
        return this.m_gameRateList;
    }

    getGameRateIndex(index:number) {
        return this.m_gameRateList[index];
    }

    setGameRateIndex(index:number) {
        this.m_gameRateIndex = index;
    }

    nextGameRate() {
        this.m_gameRateIndex++;
        if (this.m_gameRateIndex >= this.m_gameRateList.length) {
            this.m_gameRateIndex = 0;
        }
        this.m_gameRate = this.m_gameRateList[this.m_gameRateIndex];
    }

    m_userInfo: UserInfo = new UserInfo();
    getUserInfo() {
        return this.m_userInfo;
    }

    InitUserInfo() {
        if (this.m_userInfo.isInit()) {
            return;
        }
        let roleInfo = roleConfig.getConfigByType(DEFAULT_ROLE_TYPE);
        if (!roleInfo) {
            const roleList :any= roleConfig.getConfig();
            for (const id in roleList) {
                if (Object.prototype.hasOwnProperty.call(roleList, id)) {
                    const role = roleList[id];
                    roleInfo = role;
                    break;
                }
            }
        }
        const newRoleInfo = JSON.parse(JSON.stringify(roleInfo));//深拷贝
        this.m_userInfo.InitUserInfo(newRoleInfo); //初始化用户信息
    }

    initRoleList(data:any) {
        this.m_userInfo.initRoleList(data); //初始化用户信息
    }

    //预加载
    m_rolePrefabs:{[key:string]:any} = {};
    m_cloudPrefabs :{[key:string]:any}= {};
    m_equipmentPrefabs:{[key:string]:any} = {};
    m_bulletPrefabs :{[key:string]:any}= {};
    m_bombPrefabs :{[key:string]:any}= {};
    m_monsterPrefabs :{[key:string]:any}= {};
    m_backgroundPrefabs:{[key:string]:any} = {};
    m_petPrefabs:{[key:string]:any} = {};

    async preLoadAllRes(callback:((finished: number, total: number, item:any) => void) | null,onComplete: any) {
        const dataList = [
            {
                config: roleConfig,
                prefabs: this.m_rolePrefabs,
                res: ["res"],
            },
            {
                config: friendConfig,
                prefabs: this.m_rolePrefabs,
                res: ["res"],
            },
            {
                config: cloudsConfig,
                prefabs: this.m_cloudPrefabs,
                res: ["res1", "res2"],
            },
            {
                config: skillConfig,
                prefabs: this.m_bulletPrefabs,
                res: ["res"],
            },
            {
                config: skillConfig,
                prefabs: this.m_bombPrefabs,
                res: ["bomb"],
            },
            {
                config: monsterConfig,
                prefabs: this.m_monsterPrefabs,
                res: ["res"],
            },
            {
                config: degreeConfig,
                prefabs: this.m_backgroundPrefabs,
                res: ["res"],
            },
            {
                config: petConfig,
                prefabs: this.m_petPrefabs,
                res: ["res"],
            }
        ];
        let needNum = 0;
        let completeNum = 0;
        for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];
            const configs :any= data.config.getConfig();
            for (const key in configs) {
                if (Object.prototype.hasOwnProperty.call(configs, key)) {
                    const configInfo = configs[key];
                    for (let j = 0; j < data.res.length; j++) {
                        const resName = data.res[j];
                        const path = configInfo[resName];
                        if (path == null || path == '0') {
                            continue;
                        }
                        needNum++;
                    }
                }
            }
        }
        for (let i = 0; i < dataList.length; i++) {
            const data:any = dataList[i];
            const configs:any = data.config.getConfig();
            for (const key in configs) {
                if (Object.prototype.hasOwnProperty.call(configs, key)) {
                    const configInfo = configs[key];
                    for (let j = 0; j < data.res.length; j++) {
                        const resName = data.res[j];
                        const path = configInfo[resName];
                        if (path == null || path == '0') {
                            continue;
                        }
                        /*
                        await oops.res.load(path,Prefab,null,(success:boolean,prefab:Prefab)=>{
                            if(success){
                                //Logger.instance.logConfig("qqq000");
                                //Logger.instance.logView("加载gird成功");
                                console.log(`预加载资源prefab成功【${path}】`);
                                //this.gridPrefab=prefab;
                                data.prefabs[path] = prefab;
                            }
                            else{
                                //console.log("qqq000");
                                //Logger.instance.logView("加载gird错误");
                                console.log(`预加载资源prefab失败【${path}】`);
                                return
                            }
                            completeNum++;
                            callback!(completeNum, needNum,null);
                        })
                        */
                       await oops.res.loadAsync(path,Prefab).then((prefab:Prefab)=>{
                        console.log(`预加载资源prefab成功【${path}】`);
                        data.prefabs[path] = prefab;
                        completeNum++;
                        callback!(completeNum, needNum,null);

                       },()=>{
                        console.log(`预加载资源prefab失败【${path}】`);
                        completeNum++;
                        callback!(completeNum, needNum,null);

                       })
                        /*
                        resources.load(path, Prefab,()=> async (err: Error, prefab: Prefab) => {
                            if (err) {
                                console.log("加载[" + path + "]资源失败:", err);
                                return;
                            } else {
                                data.prefabs[path] = prefab;
                            }
                            completeNum++;
                            callback(completeNum, needNum);
                        });*/
                    }
                }
            }
        }
        onComplete();
    }

    //游戏类型
    m_gameType = GAME_TYPE.NONE;
    setGameType(type:number) {
        this.m_gameType = type;
    }
    getGameType() {
        return this.m_gameType;
    }
    
}