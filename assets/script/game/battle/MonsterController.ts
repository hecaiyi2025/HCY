import { _decorator, Component, instantiate, Node, Prefab, resources, UITransform, Vec3, view } from 'cc';
import { BaseMonster } from './BaseMonster';
//import { addMessageListener, postMessage, sendMessage } from '../../public/publicFunctions';
import { MESSAGE_DEFINES, MONSTER_TYPE, ROLE_TYPE } from '../common/global';
//import { globalData } from '../../data/globalData';
import { monsterConfig } from '../common/config/monsterConfig';
import { BaseRole } from './BaseRole';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
//import { BasePool } from '../pool/BasePool';
const { ccclass, property } = _decorator;

@ccclass('MonsterController')
export class MonsterController extends Component {
    @property(Node)
    pos1: Node|any = null;
    @property(Node)
    pos2: Node|any  = null;
    @property(Node)
    pos3: Node|any  = null;
    @property(Node)
    posfly1: Node |any = null;
    @property(Node)
    posBoss1: Node |any = null;
    @property(Node)
    posBg: Node|any  = null;

    m_status = 0; //0:未开始 1:开始 2:结束
    m_time = 0;//持续时间，用来做出怪计时的
    m_index = 0;//怪物生成顺序，用来做id
    m_posIntervals = [0, 0, 0];//怪物生成间隔
    m_startTimmer = [0, 0, 0];//怪物开始生成计时器
    m_posflyIntervals = [0];//飞行怪物生成间隔
    m_startflyTimmer = [0];//飞行怪物开始生成计时器
    m_posTimer = [0, 0, 0];//怪物生成计时器
    m_posflyTimer = [0];//飞行怪物生成计时器
    m_orderConfig :any= null;//小关阶段出怪配置
    m_bossConfig :any= null;//boss阶段配置
    m_currentLevelIndex = -1;//当前小关的索引
    m_currentBossIndex = -1;//当前boss的索引
    m_leftTime = 0;//当前小关剩余时间
    m_elite = false;//是否出现传送阵
    m_eliteTimer = 0;//传送阵生成计时器
    m_monsterPrefabs :{[key:string]:any}= {};

    //m_monsterPool: BasePool = null;
    start() {
        /*
        if (!this.m_monsterPool) {
            this.m_monsterPool = new BasePool();
        }*/

        oops.message.on(MESSAGE_DEFINES.MONSTER_DEAD.toString(),(...arg:any)=>{//体现了管理者身份
                //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
                //console.log("MESSAGE_DEFINES.MONSTER_DEAD",arg[1])
                let deadMonster = arg[1];
            if (deadMonster) {
                const deadMonsterScript = deadMonster.getComponent(BaseMonster);
                let deadInterval = 1000;
                if (deadMonsterScript && typeof deadMonsterScript.GetDeadInterval() === "number" && deadMonsterScript.GetDeadInterval() > 0) {
                    deadInterval = deadMonsterScript.GetDeadInterval() * 1000;
                }
                setTimeout(() => {
                    if (deadMonsterScript) {
                        deadMonsterScript.RemoveSelf();
                    }
                    if (deadMonster) {
                        deadMonster.active = false;
                    }
                }, deadInterval);
            }
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.MONSTER_DEAD, (data) => {
            let deadMonster = data;
            if (deadMonster) {
                const deadMonsterScript = deadMonster.getComponent(BaseMonster);
                let deadInterval = 1000;
                if (deadMonsterScript && typeof deadMonsterScript.GetDeadInterval() === "number" && deadMonsterScript.GetDeadInterval() > 0) {
                    deadInterval = deadMonsterScript.GetDeadInterval() * 1000;
                }
                setTimeout(() => {
                    if (deadMonsterScript) {
                        deadMonsterScript.RemoveSelf();
                    }
                    if (deadMonster) {
                        deadMonster.active = false;
                    }
                }, deadInterval);
            }
        });*/
        /*
function example(...args: any[]) {
  // args 是一个数组，包含所有传入的参数
  console.log(args); // 输出所有参数组成的数组
  console.log(args[0]); // 访问第一个参数
  console.log(args[1]); // 访问第二个参数
}

example(1, "hello", { key: "value" });
// 输出：
// [1, "hello", { key: "value" }]
// 1
// "hello"
        */

        oops.message.on(MESSAGE_DEFINES.GET_MONSTER_TARGET.toString(),(...arg:any)=>{//data 是...arg,也就是数组
            
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            //let data=arg;
            const num = arg[1].num;
            const from = arg[1].from;
            const distance = arg[1].distance;
            
            const allList = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
            //console.log("monstercontroller recv BaseRole.PlayAttackAnimation",arg)
            const list = [];
            for (let i = 0; i < allList.length; i++) {
                const children1 = allList[i];
                const monsterScript = children1.getComponent(BaseMonster);
                let inDistance = true;
                if (distance >= 0) {
                    const distance1 = Math.sqrt(Math.pow(from.getWorldPosition().x - children1.getWorldPosition().x, 2) + Math.pow(from.getWorldPosition().y - children1.getWorldPosition().y, 2));
                    //console.log("monstercontroller recv BaseRole.PlayAttackAnimation",arg,num,from,distance,distance1)
                    inDistance = distance1 <= distance;
                } else {//-1表示无限距离
                    inDistance = true;
                }
                if (monsterScript && monsterScript.IsAlive() && inDistance && list.length < num) {
                    const posX = children1.getWorldPosition().x;
                    const width = children1.getComponent(UITransform).width;
                    let screenWidth = view.getVisibleSize().width;
                    if (monsterScript.GetInfo().type != MONSTER_TYPE.ELITE && posX - width / 2 > screenWidth) {//未进入屏幕的怪不能被锁定
                        continue;
                    }
                    list.push(children1);
                }
            }
            //console.log("monstercontroller recv BaseRole.PlayAttackAnimation",list.length)
            return list;
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GET_MONSTER_TARGET, (data) => {
            const num = data.num;
            const from = data.from;
            const distance = data.distance;
            const allList = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
            const list = [];
            for (let i = 0; i < allList.length; i++) {
                const children1 = allList[i];
                const monsterScript = children1.getComponent(BaseMonster);
                let inDistance = true;
                if (distance >= 0) {
                    const distance1 = Math.sqrt(Math.pow(from.getWorldPosition().x - children1.getWorldPosition().x, 2) + Math.pow(from.getWorldPosition().y - children1.getWorldPosition().y, 2));
                    inDistance = distance1 <= distance;
                } else {//-1表示无限距离
                    inDistance = true;
                }
                if (monsterScript && monsterScript.IsAlive() && inDistance && list.length < num) {
                    const posX = children1.getWorldPosition().x;
                    const width = children1.getComponent(UITransform).width;
                    let screenWidth = view.getVisibleSize().width;
                    if (monsterScript.GetInfo().type != MONSTER_TYPE.ELITE && posX - width / 2 > screenWidth) {//未进入屏幕的怪不能被锁定
                        continue;
                    }
                    list.push(children1);
                }
            }
            return list;
        });*/

        oops.message.on(MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET.toString(),(...arg:any)=>{//体现了管理者身份
            const target = arg[1].target;
            const range = Number(arg[1].range);
            const max = arg[1].max;
            const list = [];
            const allList = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
            for (let i = 0; i < allList.length; i++) {
                const child = allList[i];
                const monsterScript = child.getComponent(BaseMonster);
                if (monsterScript && monsterScript.IsAlive()) {
                    const height = (0.5 - child.getComponent(UITransform).anchorPoint.y) * child.getComponent(UITransform).height / 2;
                    const distance = Math.sqrt(Math.pow(target.getWorldPosition().x - child.getWorldPosition().x, 2) + Math.pow(target.getWorldPosition().y - (child.getWorldPosition().y + height), 2));
                    if (distance <= range) {
                        list.push(child);
                        if (list.length >= max) {
                            return list;
                        }
                    }
                }
            }
            return list;

        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET, (data) => {
            const target = data.target;
            const range = Number(data.range);
            const max = data.max;
            const list = [];
            const allList = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
            for (let i = 0; i < allList.length; i++) {
                const child = allList[i];
                const monsterScript = child.getComponent(BaseMonster);
                if (monsterScript && monsterScript.IsAlive()) {
                    const height = (0.5 - child.getComponent(UITransform).anchorPoint.y) * child.getComponent(UITransform).height / 2;
                    const distance = Math.sqrt(Math.pow(target.getWorldPosition().x - child.getWorldPosition().x, 2) + Math.pow(target.getWorldPosition().y - (child.getWorldPosition().y + height), 2));
                    if (distance <= range) {
                        list.push(child);
                        if (list.length >= max) {
                            return list;
                        }
                    }
                }
            }
            return list;
        });*/
        oops.message.on(MESSAGE_DEFINES.GAME_ELITE_DEAD.toString(),(...arg:any)=>{//体现了管理者身份
            this.m_status = 2;
            const allList = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
            for (let i = 0; i < allList.length; i++) {
                const child = allList[i];
                const monsterScript = child.getComponent(BaseMonster);
                if (monsterScript && monsterScript.IsAlive()) {
                    monsterScript.Dead();
                }
            }

        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_ELITE_DEAD, () => {////传送阵死亡
            this.m_status = 2;
            const allList = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
            for (let i = 0; i < allList.length; i++) {
                const child = allList[i];
                const monsterScript = child.getComponent(BaseMonster);
                if (monsterScript && monsterScript.IsAlive()) {
                    monsterScript.Dead();
                }
            }

        });
        */
        oops.message.on(MESSAGE_DEFINES.GAME_NEXT_LEVEL.toString(),(...arg:any)=>{//体现了管理者身份
            this.m_status = 1;
            this.NextLevel();
            this.m_elite = false;
            this.m_eliteTimer = 0;

        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_NEXT_LEVEL, () => {
            this.m_status = 1;
            this.NextLevel();
            this.m_elite = false;
            this.m_eliteTimer = 0;
        });*/


        oops.message.on(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(...arg:any)=>{////获取怪物初始点
            return [this.pos1, this.pos2, this.pos3, this.posfly1, ...this.posBoss1.children, ...this.posBoss1.children];

        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, () => {
            return [this.pos1, this.pos2, this.pos3, this.posfly1, ...this.posBoss1.children, ...this.posBoss1.children];
        })*/

        oops.message.on(MESSAGE_DEFINES.SKILL_ADD_MONSTER.toString(),(...arg:any)=>{//////技能增加怪物
            const monsterInfo = monsterConfig.getConfigByID(arg[1].monsterId);
            if (monsterInfo) {
                let monsterPath = monsterInfo.res;
                let monsterPrefab = this.m_monsterPrefabs[monsterInfo.res];
                if (monsterPrefab) {//已经有
                    this.AddMonsterNode(this.posfly1, monsterPrefab, monsterInfo);
                } else {
                    oops.res.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        //console.log("ShowModel---33",prefab,cloudPath);
                        this.AddMonsterNode(this.posfly1, prefab, monsterInfo);
                    });
                    /*
                    resources.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.AddMonsterNode(this.posfly1, prefab, monsterInfo);
                    });*/
                }
            }
    
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.SKILL_ADD_MONSTER, (monsterId) => {
            const monsterInfo = monsterConfig.getConfigByID(monsterId);
            if (monsterInfo) {
                let monsterPath = monsterInfo.res;
                let monsterPrefab = this.m_monsterPrefabs[monsterInfo.res];
                if (monsterPrefab) {
                    this.AddMonsterNode(this.posfly1, monsterPrefab, monsterInfo);
                } else {
                    resources.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.AddMonsterNode(this.posfly1, prefab, monsterInfo);
                    });
                }
            }
        })*/

        oops.message.on(MESSAGE_DEFINES.GAME_GET_MONSTER_POSBG.toString(),(...arg:any)=>{////获取怪物初始点
            return this.posBg;
            },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_GET_MONSTER_POSBG, () => {
            return this.posBg;
        })*/

        this.m_monsterPrefabs = smc.account.AccountModel.m_monsterPrefabs;
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == 1) {
            //添加怪物
            this.CheckLevelMonster(deltaTime);
            //出传送阵后计时器
            if (this.m_elite) {
                this.m_eliteTimer += deltaTime * 0.05;
            } else if (this.m_eliteTimer > 0) {
                this.m_eliteTimer = 0;
            }
        }
    }

    InitConfig(levelConfig:any, bossConfig:any) {
        this.m_orderConfig = levelConfig;
        this.m_bossConfig = bossConfig;
        //console.log("levelConfig:", levelConfig);
        //console.log("bossConfig:", bossConfig);
        for (let i = 0; i < this.m_orderConfig!.length; i++) {
            const levelConfig = this.m_orderConfig![i];
            if (levelConfig) {
                if (typeof levelConfig.time == 'string') { levelConfig.time = Number(levelConfig.time) };
            }
        }
        this.NextLevel();//开始出怪
    }

    //判断出怪逻辑
    CheckLevelMonster(deltaTime:any) {
        //console.log("111CheckLevelMonster",this.m_currentLevelIndex,this.m_orderConfig.length);
        if (this.m_orderConfig && this.m_currentLevelIndex >= 0 && this.m_currentLevelIndex < this.m_orderConfig.length) {
            const levelConfig = this.m_orderConfig[this.m_currentLevelIndex];
            //console.log("222CheckLevelMonster",this.m_currentLevelIndex,this.m_orderConfig.length);
            this.m_leftTime -= deltaTime;
            if (this.m_leftTime <= 0) {
                this.m_leftTime = 0;
                if (!this.m_elite) {
                    this.m_elite = true;
                    //出传送阵
                    console.log("CheckLevelMonste 出传送阵")
                    this.CreateEliteMonster();
                }
            }
            oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SHOW_PROGRESS.toString(), { index: this.m_currentLevelIndex, progress: (levelConfig.time - this.m_leftTime) / levelConfig.time })
            //postMessage(MESSAGE_DEFINES.GAME_SHOW_PROGRESS, { index: this.m_currentLevelIndex, progress: (levelConfig.time - this.m_leftTime) / levelConfig.time });
            for (let i = 0; i < this.m_startTimmer.length; i++) {
                if (this.m_startTimmer[i] > 0) {
                    this.m_startTimmer[i] -= deltaTime;
                }
                if (this.m_startTimmer[i] <= 0) {
                    this.m_startTimmer[i] = 0;
                    this.m_posTimer[i] += deltaTime;
                    if (this.m_posTimer[i] >= this.m_posIntervals[i] + this.m_eliteTimer) {
                        this.m_posTimer[i] = 0;
                        if (levelConfig && levelConfig.pos && levelConfig.pos.monster) {
                            const monsterList = levelConfig.pos.monster;
                            const propertyRate = levelConfig.property;
                            //console.log("CheckLevelMonste AddMonster")
                            this.AddMonster(i, monsterList, propertyRate);
                            const posMonster = levelConfig.pos;
                            if (posMonster) {
                                this.ResetMonsterIntervals(0, posMonster, false);
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < this.m_startflyTimmer.length; i++) {
                if (this.m_startflyTimmer[i] > 0) {
                    this.m_startflyTimmer[i] -= deltaTime;
                }
                if (this.m_startflyTimmer[i] <= 0) {
                    this.m_startflyTimmer[i] = 0;
                    this.m_posflyTimer[i] += deltaTime;
                    if (this.m_posflyTimer[i] >= this.m_posflyIntervals[i] + this.m_eliteTimer) {
                        this.m_posflyTimer[i] = 0;
                        if (levelConfig && levelConfig.flyPos && levelConfig.flyPos.monster) {
                            const monsterList = levelConfig.flyPos.monster;
                            const propertyRate = levelConfig.property;
                            this.AddMonster(i, monsterList, propertyRate);
                            const posfly = levelConfig.flyPos;
                            if (posfly) {
                                this.ResetFlyMonsterIntervals(0, posfly, false);
                            }
                        }
                    }
                }
            }
        }
        //boss阶段
        if (this.m_bossConfig && this.m_currentBossIndex >= 0 && this.m_currentBossIndex < this.m_bossConfig.length) {
            const bossConfig = this.m_bossConfig[this.m_currentBossIndex];
            //console.log("CheckLevelMonste 出传boss",this.m_currentBossIndex,this.m_bossConfig.length)
            for (let i = 0; i < this.m_startTimmer.length; i++) {
                if (this.m_startTimmer[i] > 0) {
                    this.m_startTimmer[i] -= deltaTime;
                }
                if (this.m_startTimmer[i] <= 0) {
                    this.m_startTimmer[i] = 0;
                    this.m_posTimer[i] += deltaTime;
                    if (this.m_posTimer[i] >= this.m_posIntervals[i]) {
                        this.m_posTimer[i] = 0;
                        if (bossConfig && bossConfig.pos && bossConfig.pos.monster) {
                            const monsterList = bossConfig.pos.monster;
                            const propertyRate = bossConfig.property;
                            //console.log("CheckLevelMonste AddMonster",i)
                            this.AddMonster(i, monsterList, propertyRate);
                            const posMonster = bossConfig.pos;
                            if (posMonster) {
                                this.ResetMonsterIntervals(0, posMonster, true);
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < this.m_startflyTimmer.length; i++) {
                if (this.m_startflyTimmer[i] > 0) {
                    this.m_startflyTimmer[i] -= deltaTime;
                }
                if (this.m_startflyTimmer[i] <= 0) {
                    this.m_startflyTimmer[i] = 0;
                    this.m_posflyTimer[i] += deltaTime;
                    if (this.m_posflyTimer[i] >= this.m_posflyIntervals[i]) {
                        this.m_posflyTimer[i] = 0;
                        if (bossConfig && bossConfig.flyPos && bossConfig.flyPos.monster) {
                            let monsterList = bossConfig.flyPos.monster;
                            const propertyRate = bossConfig.property;
                            this.AddMonster(i, monsterList, propertyRate);
                            const posfly = bossConfig.flyPos;
                            if (posfly) {
                                this.ResetFlyMonsterIntervals(0, posfly, false);
                            }
                        }
                    }
                }
            }
        }
    }

    NextLevel() {
        //console.log("monstercontroller.nextlevel")
        this.m_currentLevelIndex++;
        if (this.m_currentLevelIndex < this.m_orderConfig.length) {
            const levelConfig = this.m_orderConfig[this.m_currentLevelIndex];
            if (levelConfig) {
                this.m_leftTime = levelConfig.time;
                const pos1Monster = levelConfig.pos;
                const pos2Monster = levelConfig.pos;
                const pos3Monster = levelConfig.pos;
                this.ResetMonsterIntervals(0, pos1Monster, true);
                this.ResetMonsterIntervals(1, pos2Monster, true);
                this.ResetMonsterIntervals(2, pos3Monster, true);
                const pos1FlyMonster = levelConfig.flyPos;
                this.ResetFlyMonsterIntervals(0, pos1FlyMonster, true);
            }
        } else {
            // 出boss
            console.log("出Boss");
            setTimeout(() => {
                oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_BG_STOP.toString());
                //postMessage(MESSAGE_DEFINES.GAME_BG_STOP);
            }, 3000);
            this.m_currentBossIndex++;
            this.CreateBoss();
            if (this.m_currentBossIndex < this.m_bossConfig.length) {
                const bossConfig = this.m_bossConfig[this.m_currentBossIndex];
                if (bossConfig) {
                    this.m_leftTime = bossConfig.time;
                    const pos1Monster = bossConfig.pos;
                    const pos2Monster = bossConfig.pos;
                    const pos3Monster = bossConfig.pos;
                    this.ResetMonsterIntervals(0, pos1Monster, true);
                    this.ResetMonsterIntervals(1, pos2Monster, true);
                    this.ResetMonsterIntervals(2, pos3Monster, true);
                    const pos1FlyMonster = bossConfig.flyPos;
                    this.ResetFlyMonsterIntervals(0, pos1FlyMonster, true);
                }
            }
        }
    }

    //出一次怪后重新计算出怪时间间隔,当first时是初始化，生成start时间，生成monster间隔时间，当first为false时，只生成monster间隔时间
    ResetMonsterIntervals(index:any, posMonster:any, first: boolean) {
        if (posMonster && posMonster.start && posMonster.min && posMonster.max && Number(posMonster.max) - Number(posMonster.min) > 0) {
            if (first) {
                this.m_startTimmer[index] = Number(posMonster.start);
            }
            this.m_posIntervals[index] = Number(posMonster.min) + Math.random() * (Number(posMonster.max) - Number(posMonster.min));
        }
    }

    ResetFlyMonsterIntervals(index:any, posMonster:any, first: boolean) {
        if (posMonster && posMonster.start && posMonster.min && posMonster.max && Number(posMonster.max) - Number(posMonster.min) > 0) {
            if (first) {
                this.m_startflyTimmer[index] = Number(posMonster.start);
            }
            this.m_posflyIntervals[index] = Number(posMonster.min) + Math.random() * (Number(posMonster.max) - Number(posMonster.min));
        }
    }

    CreateEliteMonster() {
        const levelConfig = this.m_orderConfig[this.m_currentLevelIndex];
        if (levelConfig) {
            const eliteId = levelConfig.elite;
            const propertyRate = levelConfig.property;
            const monsterInfo = monsterConfig.getConfigByID(eliteId);
            let monsterPath = monsterInfo.res;
            
            let monsterPrefab = this.m_monsterPrefabs[monsterInfo.res];
            console.log("monsterPath==",monsterPath,monsterPrefab)
            if (monsterPrefab) {
                this.AddMonsterNode(this.posBoss1, monsterPrefab, monsterInfo, propertyRate, true);
            } else {
                oops.res.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    //console.log("ShowModel---33",prefab,cloudPath);
                    this.AddMonsterNode(this.posBoss1, prefab, monsterInfo, propertyRate, true);
                });
                /*
                resources.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.AddMonsterNode(this.posBoss1, prefab, monsterInfo, propertyRate, true);
                });*/
            }
        }
    }

    CreateBoss() {
        const bosssConfig = this.m_bossConfig[this.m_currentBossIndex];
        if (bosssConfig) {
            const id = bosssConfig.bossId;
            const propertyRate = bosssConfig.property;
            const monsterInfo = monsterConfig.getConfigByID(id);
            if (monsterInfo) {
                let monsterPath = monsterInfo.res;
                let monsterPrefab = this.m_monsterPrefabs[monsterInfo.res];
                if (monsterPrefab) {
                    this.AddMonsterNode(this.posBoss1, monsterPrefab, monsterInfo, propertyRate, true);
                } else {
                    /*
                    resources.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.AddMonsterNode(this.posBoss1, prefab, monsterInfo, propertyRate, true);
                    });*/
                    oops.res.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        //console.log("ShowModel---33",prefab,cloudPath);
                        this.AddMonsterNode(this.posBoss1, prefab, monsterInfo, propertyRate, true);
                    });
                }
            }
        }
    }

    AddMonster(index:any, monsterList:any, propertyRate = 1) {//propertyRate属性倍率
        if (monsterList && monsterList.length > 0) {
            const random = Math.random();
            let rate = 0;
            let monsterInfo = null;
            let monsterPrefab = null;
            let monsterPath = null;
            for (let i = 0; i < monsterList.length; i++) {
                const info = monsterList[i];
                rate += Number(info.rate);
                if (random <= rate) {
                    monsterInfo = monsterConfig.getConfigByID(info.id);
                    monsterPrefab = this.m_monsterPrefabs[monsterInfo.res];
                    monsterPath = monsterInfo.res;
                    break;
                }
            }
            let pos = this.pos1;
            if (index == 0) {
                pos = this.pos1;
            } else if (index == 1) {
                pos = this.pos2;
            } else if (index == 2) {
                pos = this.pos3;
            }
            if (monsterInfo && monsterInfo.fly == 1) {
                pos = this.posfly1;
            }
            if (monsterPrefab) {
                this.AddMonsterNode(pos, monsterPrefab, monsterInfo, propertyRate, false);
            } else {
                /*
                resources.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.AddMonsterNode(pos, prefab, monsterInfo, propertyRate, false);
                });*/
                oops.res.load(monsterPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    //console.log("ShowModel---33",prefab,cloudPath);
                    this.AddMonsterNode(pos, prefab, monsterInfo, propertyRate, false);
                });
            }
        }
    }

    AddMonsterNode(pos:any, prefab:any, info:any, propertyRate = 1, isBoss = false) {
        const monsterNumber = this.GetMonsterNumber();
        if (!isBoss && monsterNumber >= 50) {//boss和传送阵管他场上有多少怪，都得出
            console.log("当前场上怪物数量超过50:", monsterNumber);
            return;
        }
        console.log("AddMonsterNode...",prefab, info.id);
        const newMonster = this.getAvailableMonster(prefab, info.id);
        newMonster.active = true;

        newMonster.layer=pos.layer
        for (const child of newMonster.children) {

            child.layer=pos.layer
        }
        
        newMonster.setPosition(new Vec3(newMonster.getComponent(UITransform).width / 2, 0, 0));
        newMonster.setParent(pos);
        if (info && info.fly == 1) {
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_ROLE_LIST.toString(),(targetList: Node[]) => {
                if (targetList && targetList.length > 0) {
                    let target = null;
                    if (targetList.length > 2) {
                        const randomIndex = Math.floor(Math.random() * (targetList.length - 2));
                        target = targetList[randomIndex];
                    } else {
                        for (let i = 0; i < targetList.length; i++) {
                            const role = targetList[i];
                            const roleScript = role.getComponent(BaseRole);
                            if (roleScript) {
                                if (roleScript.GetType() == ROLE_TYPE.MAIN) {
                                    target = role;
                                    break;
                                }
                            }
                        }
                    }
                    if (!target) {
                        target = targetList[0];
                    }
                    let posY = target.getWorldPosition().y;
                    if (posY < 500) {
                        posY = 500;
                    }
                    newMonster.setWorldPosition(new Vec3(pos.getWorldPosition().x, posY, 0));
                    if (info.type == MONSTER_TYPE.BOSS) {
                        newMonster.setWorldPosition(new Vec3(this.posfly1.getWorldPosition().x, this.posfly1.getWorldPosition().y, 0));
                    }
                }
            },true);
            /*
            sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, true, (targetList: Node[]) => {
                if (targetList && targetList.length > 0) {
                    let target = null;
                    if (targetList.length > 2) {
                        const randomIndex = Math.floor(Math.random() * (targetList.length - 2));
                        target = targetList[randomIndex];
                    } else {
                        for (let i = 0; i < targetList.length; i++) {
                            const role = targetList[i];
                            const roleScript = role.getComponent(BaseRole);
                            if (roleScript) {
                                if (roleScript.GetType() == ROLE_TYPE.MAIN) {
                                    target = role;
                                    break;
                                }
                            }
                        }
                    }
                    if (!target) {
                        target = targetList[0];
                    }
                    let posY = target.getWorldPosition().y;
                    if (posY < 500) {
                        posY = 500;
                    }
                    newMonster.setWorldPosition(new Vec3(pos.getWorldPosition().x, posY, 0));
                    if (info.type == MONSTER_TYPE.BOSS) {
                        newMonster.setWorldPosition(new Vec3(this.posfly1.getWorldPosition().x, this.posfly1.getWorldPosition().y, 0));
                    }
                }
            });*/
        }
        const monsterScript = newMonster.getComponent(BaseMonster);
        if (monsterScript) {
            monsterScript.Reset();
            monsterScript.SetId(++this.m_index);
            monsterScript.SetInfo(info, propertyRate);
            monsterScript.SetStatus(1);
            monsterScript.SetPos(pos);
            monsterScript.setPosBg(this.posBg);
        }
    }

    CheckMonsterJump(childs:any) {
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            const childSript = child.getComponent(BaseMonster);
            if (!childSript.IsJump() && !childSript.IsBack() && !childSript.GetUp() && childSript.GetLayer() == 0) {
                for (let j = 0; j < childs.length; j++) {
                    const child2 = childs[j];
                    const childSript2 = child2.getComponent(BaseMonster);
                    const width = child.getComponent(UITransform).width;
                    if (child != child2 && !childSript2.IsJump() && !childSript2.IsBack()) {
                        const distance = Math.sqrt(Math.pow(child.getPosition().x - child2.getPosition().x, 2) + Math.pow(child.getPosition().y - child2.getPosition().y, 2));
                        if (Math.abs(distance) <= width / 2) {
                            childSript.SetLayerHeight(childSript2.GetLayerHeight() + child2.getComponent(UITransform).height);
                            childSript.Jump(1400);
                            if (!childSript2.GetUp()) {
                                childSript.SetLayer(childSript2.GetLayer() + 1);
                                childSript2.SetUp(child);
                            }
                        }
                    }
                }
            }
        }
    }
    /*
    GetUpest(child:any) {
        if (child) {
            const childSript = child.getComponent(BaseMonster);
            if (childSript.GetUp()) {
                return this.GetUpest(childSript.GetUp());
            } else {
                return child;
            }
        } else {
            return null;
        }
    }
    */

    StartMonster() {
        if (this.m_status == 0) {
            this.m_status = 1;
        }
    }

    GameOver() {
        this.m_status = 2;
        const children = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
        let count = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const childSript = child.getComponent(BaseMonster);
            if (childSript) {
                childSript.GameOver();
            }
        }
    }

    getAvailableMonster(prefab:any, monsterId:any) {
        /*
        if (this.m_monsterPool) {
            return this.m_monsterPool.getAvailableNode(prefab, (monster: Node) => {
                const monsterScript = monster.getComponent(BaseMonster);
                return monsterScript && !monsterScript.IsAlive() && monsterScript.GetInfo().id == monsterId && monster.active == false;
            });
        } else {
            return instantiate(prefab);
        }*/
        return instantiate(prefab);
    }

    GetMonsterNumber() {
        return this.pos1.children.length + this.pos2.children.length + this.pos3.children.length + this.posfly1.children.length;
    }

    OnGameRateChange() {
        const allList = [...this.pos1.children, ...this.pos2.children, ...this.pos3.children, ...this.posfly1.children, ...this.posBoss1.children];
        for (let i = 0; i < allList.length; i++) {
            const monsterScript = allList[i].getComponent(BaseMonster);
            if (monsterScript) {
                monsterScript.OnGameRateChange();
            }
        }
    }
}


