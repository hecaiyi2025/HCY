import { _decorator, Component, director, JsonAsset, Label, Node, resources } from 'cc';
//import { StartView } from './startView/StartView';
import { MonsterController } from './MonsterController';
import { RoleController } from './RoleController';
import { BulletController } from '../bullet/BulletController';
import { BaseMonster } from './BaseMonster';
import { GAME_STEP, MESSAGE_DEFINES, NET_DEFINES,GAME_TYPE,NETWORKING,DEFAULT_DEGREE,LEVEL_PASS_TYPE ,DROP_TYPE} from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { TopController } from '../top/TopController';
//import { globalData } from '../data/globalData';
import { GameFailedView } from '../../end/GameFailedView';
import { GameSuccessView } from '../../end/GameSuccessView';
//import { GameTouchController } from './touch/GameTouchController';
//import { SkillController } from './skill/SkillController';
import { GameBuffView } from '../../gui/buff/GameBuffView';
import { buffConfig } from '../common/config/buff';
import { BackgroundController } from '../background/BackgroundController';
import { degreeConfig } from '../common/config/degree';
import { DropController } from '../drop/DropController';
//import { DamageController } from './damage/DamageController';
import { monsterOrderConfig } from '../common/config/monster_order';
import { TIMEOUT } from 'dns';
import { UIID } from "../common/config/GameUIConfig";
//import { FetterView } from '../hall/fetter/FetterView';
//import { guideController } from '../hall/guide/guideController';
const { ccclass, property } = _decorator;

@ccclass('BaseGameController')
export class BaseGameController extends Component {

    //@property(StartView)
    //startView: StartView = null;
    @property(RoleController)
    roleController: RoleController|any = null;
    @property(MonsterController)
    monsterController: MonsterController|any = null;

    @property(BulletController)
    bulletController: BulletController|null = null;

    @property(DropController)
    dropController: DropController|null = null;
    @property(TopController)
    topController: TopController|null = null;

    @property(BackgroundController)
    backgroundController: BackgroundController|null = null;


/*    



    @property(GameFailedView)
    gameFailedView: GameFailedView = null;
    @property(GameSuccessView)
    gameSuccessView: GameSuccessView = null;
    @property(GameTouchController)
    gameTouchController: GameTouchController = null;
    @property(SkillController)
    skillController: SkillController = null;
    @property(GameBuffView)
    gameBuffView: GameBuffView = null;
 
    @property(DamageController)
    damageController: DamageController = null;
    @property(FetterView)
    fetterView: FetterView = null;
    @property(guideController)
    m_guideController: guideController = null;
*/
    //@property(Node)
    //loadingNode: Node|any = null;
    //@property(Label)
    //progressLabel: Label|any = null;
    //游戏步骤
    m_step = GAME_STEP.GAME_READY;
    //关卡配置
    m_orderConfig = null;
    m_bossConfig = null;

    m_buffs :any[]= [];
    m_buffId :any= null;
    m_money = 0;

    //游戏统计
    m_deadMonsterNum = 0;
    m_deadMonsterList :any[]= [];
    m_dropList :any[]=[];


    GameOver(status:any) {
        this.m_step = GAME_STEP.GAME_OVER;
        if (NETWORKING) {
            const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
            const data = {
                monstersNum: this.m_deadMonsterNum,//怪物数量
                monstersDetails: JSON.stringify(this.m_deadMonsterList),//怪物详情
                levelId: userInfo ? userInfo.degree : DEFAULT_DEGREE,//关卡id
                isPass: status,//是否通过
                goodsList: this.m_dropList//掉落列表
            }
            let str = JSON.stringify({"netCode": NET_DEFINES.GAME_LEVEL_SETTLEMENT,data,"cmdCode": 1});
            oops.tcp.getNetNode().send(str);
            //sendWebSocketData({ netCode: NET_DEFINES.GAME_LEVEL_SETTLEMENT, data });
        } else {
            /*
            setTimeout(() => {
                if (this.dropController) {
                    this.dropController.GameOver();
                }
                if (status == LEVEL_PASS_TYPE.FAIL) {
                    if (this.gameFailedView) {
                        this.gameFailedView.node.active = true;
                        this.gameFailedView.Show(this.m_money, null);
                    }
                } else {
                    if (this.gameSuccessView) {
                        this.gameSuccessView.node.active = true;
                        this.gameSuccessView.Show(this.m_money, null);
                    }
                    smc.account.AccountModel.getUserInfo().NextDegree();
                }
                smc.account.AccountModel.getUserInfo().getUserInfo().money += this.m_money;
                smc.account.AccountModel.getUserInfo().saveInfo();

                let degree = degreeConfig.getConfigByID(smc.account.AccountModel.getUserInfo().getUserInfo().degree);
                if (degree.levels == 1) {
                    let step = localStorage.getItem("step");
                    if (+step == 2) {
                        localStorage.setItem("step", '3');
                    }
                }
            }, 1000);*/
        }
        if (this.roleController) {
            this.roleController.GameOver();
        }
        if (this.monsterController) {
            this.monsterController.GameOver();
        }
        //if (this.gameTouchController) {
        //    this.gameTouchController.StopTouch();
        //}
        //if (this.skillController) {
        //    this.skillController.EndSkill();
        //}
        if (this.backgroundController) {
            this.backgroundController.StopMove();
        }
    }

    OnAdDoubleFail() {
        //showAD(AD_TYPE.GAME_FAIL, this.gameFailedView.m_money);
    }

    //protected onDisable(): void {
        //super.onDisable();
    //}

    start() {//注册了这么多事件，在什么时候off呢？

        //console.log("this.m_deadMonsterList=",this.m_deadMonsterList.length);
        oops.message.on(MESSAGE_DEFINES.ROLE_ATTACK.toString(),(...arg:any) => {
            this.bulletController!.CreateBullet(arg[1].from, arg[1].target, arg[1].attack, arg[1].fetterInfo);
            
        },this);

        /*
        addMessageListener(MESSAGE_DEFINES.ROLE_ATTACK, (data) => {
            this.bulletController.CreateBullet(data.from, data.target, data.attack, data.fetterInfo);
        });*/

        oops.message.on(MESSAGE_DEFINES.PET_ATTACK.toString(),(...arg:any) => {
            this.bulletController!.CreatePetBullet(arg[1].from, arg[1].target, arg[1].attack);
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.PET_ATTACK, (data) => {
            this.bulletController.CreatePetBullet(data.from, data.target, data.attack);
        });*/

        oops.message.on(MESSAGE_DEFINES.MONSTER_ATTACK.toString(),(...arg:any) => {
            const monsterScript = arg[1].from.getComponent(BaseMonster);
            if (monsterScript) {
                const skillInfo = arg[1].skill;
                if (skillInfo) {
                    const skillPath = skillInfo.res;
                    if (skillPath && skillPath != "0") {
                        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_ROLE_LIST.toString(),(targetList: Node[]) => {
                            const roleList = monsterScript.GetAttackableRoles(skillInfo, targetList);
                            if (roleList) {
                                for (let i = 0; i < roleList.length; i++) {
                                    this.bulletController!.CreateMonsterBullet(arg[1].from, roleList[i], arg[1].attack, skillInfo);
                                }
                            }
                        });
                        /*
                        sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, null, (targetList: Node[]) => {
                            const roleList = monsterScript.GetAttackableRoles(skillInfo, targetList);
                            if (roleList) {
                                for (let i = 0; i < roleList.length; i++) {
                                    this.bulletController.CreateMonsterBullet(arg[1].from, roleList[i], arg[1].attack, skillInfo);
                                }
                            }
                        });*/
                        return;
                    }
                    const bombPath = skillInfo.bomb;
                    if (bombPath && bombPath != "0") {
                        const range = skillInfo.range;
                        const max = skillInfo.maxHit;
                        const repel = skillInfo.repel != 0;
                        this.bulletController!.AddNewMonsterBomb(bombPath, null, arg[1].from.node, arg[1].target, range, max, arg[1].attack * skillInfo.rate, repel, null);
                        return;
                    }
                }
                oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_ROLE_LIST.toString(),(targetList: Node[]) => {
                    const roleList = monsterScript.GetAttackableRoles(skillInfo, targetList);
                    if (roleList) {
                        for (let i = 0; i < roleList.length; i++) {
                            const role = roleList[i];
                            const param = {
                                target: role,
                                attack: arg[1].attack * skillInfo.rate, //伤害
                            }
                            this.roleController.RoleAttack(param);// 直接伤害
                        }
                    }
                });
                /*
                sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, null, (targetList: Node[]) => {
                    const roleList = monsterScript.GetAttackableRoles(skillInfo, targetList);
                    if (roleList) {
                        for (let i = 0; i < roleList.length; i++) {
                            const role = roleList[i];
                            const param = {
                                target: role,
                                attack: data.attack * skillInfo.rate, //伤害
                            }
                            this.roleController.RoleAttack(param);// 直接伤害
                        }
                    }
                });*/
            }
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.MONSTER_ATTACK, (data) => {
            const monsterScript = data.from.getComponent(BaseMonster);
            if (monsterScript) {
                const skillInfo = data.skill;
                if (skillInfo) {
                    const skillPath = skillInfo.res;
                    if (skillPath && skillPath != "0") {
                        sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, null, (targetList: Node[]) => {
                            const roleList = monsterScript.GetAttackableRoles(skillInfo, targetList);
                            if (roleList) {
                                for (let i = 0; i < roleList.length; i++) {
                                    this.bulletController.CreateMonsterBullet(data.from, roleList[i], data.attack, skillInfo);
                                }
                            }
                        });
                        return;
                    }
                    const bombPath = skillInfo.bomb;
                    if (bombPath && bombPath != "0") {
                        const range = skillInfo.range;
                        const max = skillInfo.maxHit;
                        const repel = skillInfo.repel != 0;
                        this.bulletController.AddNewMonsterBomb(bombPath, null, data.from.node, data.target, range, max, data.attack * skillInfo.rate, repel, null);
                        return;
                    }
                }
                sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, null, (targetList: Node[]) => {
                    const roleList = monsterScript.GetAttackableRoles(skillInfo, targetList);
                    if (roleList) {
                        for (let i = 0; i < roleList.length; i++) {
                            const role = roleList[i];
                            const param = {
                                target: role,
                                attack: data.attack * skillInfo.rate, //伤害
                            }
                            this.roleController.RoleAttack(param);// 直接伤害
                        }
                    }
                });
            }
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_FAILED.toString(),(...arg:any) => {
            console.log("游戏失败");
            this.GameOver(LEVEL_PASS_TYPE.FAIL);
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_FAILED, () => {
            console.log("游戏失败");
            this.GameOver(LEVEL_PASS_TYPE.FAIL);
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_SUCCESS.toString(),(...arg:any) => {
            console.log("游戏通关");
            this.GameOver(LEVEL_PASS_TYPE.SUCCESS);
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_SUCCESS, () => {
            console.log("游戏通关");
            this.GameOver(LEVEL_PASS_TYPE.SUCCESS);
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_ELITE_DEAD.toString(),(...arg:any) => {
            if (this.m_buffId) {
                clearTimeout(this.m_buffId);
                this.m_buffId = null;
            }
            oops.gui.openAsync(UIID.GameBuffView).then((node)=>{
                node?.getComponent(GameBuffView)!.ShowBuff();

            })
            this.m_buffId = setTimeout(() => {
                //oops.gui.open(UIID.GameBuffView);
                /*
                if (this.gameBuffView) {
                    this.gameBuffView.node.active = true;
                    this.gameBuffView.ShowBuff();
                }*/
            }, 1500);
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_ELITE_DEAD, () => {
            if (this.m_buffId) {
                clearTimeout(this.m_buffId);
                this.m_buffId = null;
            }
            this.m_buffId = setTimeout(() => {
                if (this.gameBuffView) {
                    this.gameBuffView.node.active = true;
                    this.gameBuffView.ShowBuff();
                }
            }, 1500);
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_NEXT_LEVEL.toString(),(...arg:any) => {
            if (arg[1].buffId) {
                this.m_buffs.push(arg[1].buffId);
                const buffInfo = buffConfig.getConfigByID(arg[1].buffId);
                const buffParam = JSON.parse(buffInfo.param);
                this.roleController.AddBuff(arg[1].buffId, buffParam);
                //this.skillController.AddBuff(arg[1].buffId, buffParam);
                this.bulletController!.AddBuff(arg[1].buffId, buffParam);
                //console.log(".nextlevel Basegamecontroller.addbuff",arg[1].buffId, buffParam)
            }
            this.backgroundController!.StartMove();
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_NEXT_LEVEL, (data) => {
            if (data.buffId) {
                this.m_buffs.push(data.buffId);
                const buffInfo = buffConfig.getConfigByID(data.buffId);
                const buffParam = JSON.parse(buffInfo.param);
                this.roleController.AddBuff(data.buffId, buffParam);
                this.skillController.AddBuff(data.buffId, buffParam);
                this.bulletController.AddBuff(data.buffId, buffParam);
            }
            this.backgroundController.StartMove();
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_BG_STOP.toString(),(...arg:any) => {
            this.backgroundController!.StopMove();
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_BG_STOP, () => {
            this.backgroundController.StopMove();
        });
        */

        oops.message.on(MESSAGE_DEFINES.GAME_ADD_DROP.toString(),(...arg:any) => {
            if (arg[1].type == DROP_TYPE.MONEY) {
                this.m_money += arg[1].value;
                //console.log("basegamecontroller.adddrop",this.m_money,this.topController)
                if (this.topController) {
                    this.topController.ShowMoney(this.m_money.toString());
                }
            }
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_ADD_DROP, (data) => {
            if (data.type == DROP_TYPE.MONEY) {
                this.m_money += data.value;
                if (this.topController) {
                    this.topController.ShowMoney(this.m_money);
                }
            }
        });*/

        oops.message.on(MESSAGE_DEFINES.HALL_ADD_CLOUD.toString(),(...arg:any) => {
            if (arg[1]) {
                this.m_deadMonsterNum = arg[1];
            }
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_SET_DEAD_NUM, (data) => {
            if (data) {
                this.m_deadMonsterNum = data;
            }
        });*/

        oops.message.on(MESSAGE_DEFINES.MONSTER_DEAD.toString(),(...arg:any) => {
            this.m_deadMonsterNum++;
            let deadMonster = arg[1];
            if (deadMonster) {
                const deadMonsterScript = deadMonster.getComponent(BaseMonster);
                const monsterInfo = deadMonsterScript.GetInfo();
                if (monsterInfo) {
                    let has = false;
                    for (let i = 0; i < this.m_deadMonsterList.length; i++) {
                        const item = this.m_deadMonsterList[i];
                        if (item.id = monsterInfo.id) {
                            has = true;
                            item.num++;
                            break;
                        }
                    }
                    if (!has) {
                        this.m_deadMonsterList.push({
                            id: monsterInfo.id,
                            num: 1,
                        });
                    }

                    const str = monsterInfo.drop;
                    const drops = JSON.parse(str);
                    has = false;
                    if (drops) {
                        for (let i = 0; i < drops.length; i++) {
                            const drop = drops[i];
                            drop["fromPos"] = deadMonster.getWorldPosition();
                            oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SHOW_DROP.toString(), drop)
                            //postMessage(MESSAGE_DEFINES.GAME_SHOW_DROP, drop);
                            for (let j = 0; j < this.m_dropList.length; j++) {
                                const item = this.m_dropList[j];
                                if (item.id == drop.id) {
                                    item.num += Number(drop.num);
                                    has = true;
                                    break;
                                }
                            }
                            if (!has) {
                                this.m_dropList.push({
                                    id: drop.id,
                                    num: Number(drop.num),
                                });
                            }
                        }
                    }
                }
            }
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.MONSTER_DEAD, (data) => {
            this.m_deadMonsterNum++;
            let deadMonster = data;
            if (deadMonster) {
                const deadMonsterScript = deadMonster.getComponent(BaseMonster);
                const monsterInfo = deadMonsterScript.GetInfo();
                if (monsterInfo) {
                    let has = false;
                    for (let i = 0; i < this.m_deadMonsterList.length; i++) {
                        const item = this.m_deadMonsterList[i];
                        if (item.id = monsterInfo.id) {
                            has = true;
                            item.num++;
                            break;
                        }
                    }
                    if (!has) {
                        this.m_deadMonsterList.push({
                            id: monsterInfo.id,
                            num: 1,
                        });
                    }

                    const str = monsterInfo.drop;
                    const drops = JSON.parse(str);
                    has = false;
                    if (drops) {
                        for (let i = 0; i < drops.length; i++) {
                            const drop = drops[i];
                            drop["fromPos"] = deadMonster.getWorldPosition();
                            postMessage(MESSAGE_DEFINES.GAME_SHOW_DROP, drop);
                            for (let j = 0; j < this.m_dropList.length; j++) {
                                const item = this.m_dropList[j];
                                if (item.id == drop.id) {
                                    item.num += Number(drop.num);
                                    has = true;
                                    break;
                                }
                            }
                            if (!has) {
                                this.m_dropList.push({
                                    id: drop.id,
                                    num: Number(drop.num),
                                });
                            }
                        }
                    }
                }
            }
        });*/

        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.GAME_LEVEL_SETTLEMENT.toString(),(res)=>{//普通关卡结算
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            if (res.data) {
                const data = JSON.parse(res.data);
                const monsterDropList = data.monsterDropList;
                const rewardList = data.rewardList;
                let degree = degreeConfig.getConfigByID(smc.account.AccountModel.getUserInfo().getUserInfo().degree);
                if (degree.levels == 1) {
                    let step = localStorage.getItem("step");
                    if (+step! == 2) {
                        localStorage.setItem("step", '3');
                    }
                }
                let sumMoney = 0;
                if (monsterDropList) {
                    for (let i = 0; i < monsterDropList.length; i++) {
                        const drop = monsterDropList[i];
                        if (drop.id == 1) {//先做金币
                            sumMoney += drop.num;
                        }
                    }
                }
                if (rewardList) {
                    for (let i = 0; i < rewardList.length; i++) {
                        const drop = rewardList[i];
                        if (drop.id == 1) {//先做金币
                            sumMoney += drop.num;
                        }
                    }
                }
                if (data.isPass == LEVEL_PASS_TYPE.SUCCESS) {
                    oops.gui.openAsync(UIID.success).then((node)=>{
                        node?.getComponent(GameFailedView)!.Show(sumMoney, rewardList);
        
                    })
                    //if (this.gameSuccessView) {
                    //    this.gameSuccessView.node.active = true;
                    //    this.gameSuccessView.Show(sumMoney, rewardList);
                    //}
                } else {
                    oops.gui.openAsync(UIID.fail).then((node)=>{
                        node?.getComponent(GameSuccessView)!.Show(sumMoney, rewardList)
                    })
                    //if (this.gameFailedView) {
                    //    this.gameFailedView.node.active = true;
                    //    this.gameFailedView.Show(sumMoney, rewardList);
                    }
                }
            });
        /*
        addSocketListener(NET_DEFINES.GAME_LEVEL_SETTLEMENT, (res) => {
            if (res.data) {
                const data = JSON.parse(res.data);
                const monsterDropList = data.monsterDropList;
                const rewardList = data.rewardList;
                let degree = degreeConfig.getConfigByID(globalData.getUserInfo().getUserInfo().degree);
                if (degree.levels == 1) {
                    let step = localStorage.getItem("step");
                    if (+step == 2) {
                        localStorage.setItem("step", '3');
                    }
                }
                let sumMoney = 0;
                if (monsterDropList) {
                    for (let i = 0; i < monsterDropList.length; i++) {
                        const drop = monsterDropList[i];
                        if (drop.id == 1) {//先做金币
                            sumMoney += drop.num;
                        }
                    }
                }
                if (rewardList) {
                    for (let i = 0; i < rewardList.length; i++) {
                        const drop = rewardList[i];
                        if (drop.id == 1) {//先做金币
                            sumMoney += drop.num;
                        }
                    }
                }
                if (data.isPass == LEVEL_PASS_TYPE.SUCCESS) {
                    if (this.gameSuccessView) {
                        this.gameSuccessView.node.active = true;
                        this.gameSuccessView.Show(sumMoney, rewardList);
                    }
                } else {
                    if (this.gameFailedView) {
                        this.gameFailedView.node.active = true;
                        this.gameFailedView.Show(sumMoney, rewardList);
                    }
                }
            }
        });*/

        smc.account.AccountModel.resetGameRate();
        this.ShowGameRate();
        smc.account.AccountModel.setGameType(GAME_TYPE.NORMAL);

        oops.message.on(MESSAGE_DEFINES.ROLE_ADD_BUFF.toString(),(...arg:any)=>{
                            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
                            if (arg[1].buffId) {
                                const buffInfo = buffConfig.getConfigByID(arg[1].buffId);
                                const buffParam = JSON.parse(buffInfo.param);
                                if (buffParam.skill_health) {
                                    buffParam.skill_health = Number(buffParam.skill_health) * Number(arg[1].attack);
                                }
                                if (buffParam.skill_shield) {
                                    buffParam.skill_shield = Number(buffParam.skill_shield) * Number(arg[1].attack);
                                }
                                const roleNode = arg[1].to;
                                this.roleController.AddRoleBuff(roleNode, arg[1].buffId, buffParam);
                            }
        
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.ROLE_ADD_BUFF, (data) => {
            if (data.buffId) {
                const buffInfo = buffConfig.getConfigByID(data.buffId);
                const buffParam = JSON.parse(buffInfo.param);
                if (buffParam.skill_health) {
                    buffParam.skill_health = Number(buffParam.skill_health) * Number(data.attack);
                }
                if (buffParam.skill_shield) {
                    buffParam.skill_shield = Number(buffParam.skill_shield) * Number(data.attack);
                }
                const roleNode = data.to;
                this.roleController.AddRoleBuff(roleNode, data.buffId, buffParam);
            }
        });
        */
        oops.message.on(MESSAGE_DEFINES.EXIT_GAME.toString(),() => {
            //this.OnChangeToHall()  
            },this);
        /*
        addMessageListener(MESSAGE_DEFINES.EXIT_GAME, () => {
            this.OnChangeToHall()
        });
        */
        oops.message.on(MESSAGE_DEFINES.CHANGED_GAME_RATE.toString(),() => {
            this.ShowGameRate();  
            },this);
        /*
        addMessageListener(MESSAGE_DEFINES.CHANGED_GAME_RATE, () => {
            this.ShowGameRate();
        });*/

        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.BUY_ITEM_SUCCESS.toString(),(res)=>{
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            let data = JSON.parse(res.data);
            //this.showReward2(data)

        })
        /*
        addSocketListener(NET_DEFINES.BUY_ITEM_SUCCESS, (res) => {
            let data = JSON.parse(res.data);
            showReward2(data)
        });*/
        this.LoadConfig(()=>{
            this.GameStart();
        })
    }

    update(deltaTime: number) {

    }

    LoadConfig(callback:any) {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        if (userInfo && userInfo.degree) {
            const degreeInfo = degreeConfig.getConfigByID(userInfo.degree);
            if (degreeInfo) {
                const monsterOrderId = degreeInfo.monsterId;
                const orderInfo = monsterOrderConfig.getConfigByID(monsterOrderId);
                if (orderInfo) {
                    this.m_orderConfig = JSON.parse(orderInfo.monster);
                    this.m_bossConfig = JSON.parse(orderInfo.boss);
                    if (this.monsterController) {
                        this.monsterController.InitConfig(this.m_orderConfig, this.m_bossConfig);
                    }
                    if (this.topController) {
                        this.topController.ShowConfig(orderInfo.paragraph);
                        this.topController.ShowTitle();
                    }
                    if (callback) {
                        callback(true);
                    }
                    return
                }
            }
        }
        if (callback) {
            callback(false);
        }
    }

    GameStart() {
        if (this.m_step == GAME_STEP.GAME_READY) {
            this.m_step = GAME_STEP.GAME_START;
            setTimeout(() => {
                this.m_step = GAME_STEP.GAME_RUN;
                this.roleController.PlayStartAnimation();
                this.monsterController.StartMonster();
                this.backgroundController!.StartMove();
            }, 1000);
            //this.startView.node.active = true;
            /*
            this.startView.PlayAnimation(() => {
                this.m_step = GAME_STEP.GAME_RUN;
                this.startView.node.active = false;
                this.roleController.PlayStartAnimation();
                this.backgroundController.StartMove();
                this.gameTouchController.StartTouch();
                this.skillController.StartSkill();
                this.monsterController.StartMonster();
                this.fetterView.RefreshFetter();
                if (this.m_guideController) {
                    this.m_guideController.InitGuide();
                }
            });
            */
            //playSoundByName("start");
        } else {
            console.log("GameStart error");
        }
    }


    ChangeGameRate() {
        smc.account.AccountModel.nextGameRate();
        this.ShowGameRate();
    }

    ShowGameRate() {
        
        if (this.topController) {
            this.topController.ShowGameRate();
        }
        //if (this.backgroundController) {
        //    this.backgroundController.SetSpeedRate(globalData.getGameRate());
        //}
        
        if (this.monsterController) {
            this.monsterController.OnGameRateChange();
        }
    }


   

    destroy(): boolean {
        
        this.m_buffs =[];
        this.m_buffId= null;
        this.m_money = 0;
    
        //游戏统计
        this.m_deadMonsterNum = 0;
        this.m_deadMonsterList = [];
        this.m_dropList=[];
        oops.message.off(MESSAGE_DEFINES.MONSTER_DEAD.toString(),(...arg:any)=>{},this);
        super.destroy();
        return true;
    }


    OnAdDoubleWin() {

    }

    protected onDisable(): void {
        if (this.m_buffId) {
            clearTimeout(this.m_buffId);
            this.m_buffId = null;
        }
    }
}


