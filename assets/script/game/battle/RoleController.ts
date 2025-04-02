import { _decorator, Button, Component, EventHandler, instantiate, Node, UITransform, view } from 'cc';
//import { addMessageListener, postMessage } from '../../public/publicFunctions';
import { MESSAGE_DEFINES, ROLE_TYPE } from '../common/global';
import { MoveBy } from '../common/MoveBy';
import { BaseRole } from './BaseRole';
//import { globalData } from '../../data/globalData';
import { cloudsConfig } from '../common/config/clouds';
//import { BaseMonster } from '../monster/BaseMonster';
import { petConfig } from '../common/config/petConfig';
import { BasePet } from '../../hall/BasePet';
import { buffConfig } from '../common/config/buff';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
const { ccclass, property } = _decorator;

@ccclass('RoleController')
export class RoleController extends Component {  //我觉得他应该对标Rolemanager,管理生成的角色,同样有monstermanager,管理生存与信息传递
    @property(Node)
    gridPrefab: Node|any = null;
    @property(Node)
    roleLayout: Node|any = null;
    @property(Node)
    friendLayout: Node|any = null;
    @property(Node)
    bg: Node |any= null;

    m_roleList: Node[] = [];
    m_petList: Node[] = [];

    m_rolePrefabs:{[key:string]:any}  = {};
    m_cloudPrefabs:{[key:string]:any}  = {};
    m_petPrefabs:{[key:string]:any}  = {};
    timer :any[]= []

    start() {
        const height = 1920;
        let ScreenHeight = view.getVisibleSize().height;
        // console.log("ScreenHeight:", ScreenHeight);
        let scale = ScreenHeight / height;
        // console.log("scale:", scale);
        if (this.bg) {
            this.bg.setScale(scale, scale, 1);
        }

        oops.message.on(MESSAGE_DEFINES.GET_ROLE_LIST.toString(),(...arg:any)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            return this.m_roleList;
        },this)

        /*
        addMessageListener(MESSAGE_DEFINES.GET_ROLE_LIST, () => {
            return this.m_roleList;
        });
        */
        oops.message.on(MESSAGE_DEFINES.ROLE_DEAD.toString(),(...arg:any)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            let deadRole: Node|any = arg[1];
            if (deadRole) {
                setTimeout(() => {
                    const roleScript = deadRole.getComponent(BaseRole);
                    const isMainDead = roleScript.GetType() == ROLE_TYPE.MAIN;
                    deadRole.removeFromParent();
                    for (let i = 0; i < this.m_roleList.length; i++) {
                        const role = this.m_roleList[i];
                        if (role == deadRole) {
                            this.m_roleList.splice(i, 1);
                            deadRole = null;
                            break;
                        }
                    }
                    if (this.m_roleList.length == 0 || isMainDead) {
                        //postMessage(MESSAGE_DEFINES.GAME_FAILED);
                        oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_FAILED.toString());

                    } else {
                        //postMessage(MESSAGE_DEFINES.REFRESH_SKILL, this.m_roleList);
                        oops.message.dispatchEvent(MESSAGE_DEFINES.REFRESH_SKILL.toString());
                    }
                }, 500);
            }
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.ROLE_DEAD, (data: Node) => {
            let deadRole: Node = data;
            if (deadRole) {
                setTimeout(() => {
                    const roleScript = deadRole.getComponent(BaseRole);
                    const isMainDead = roleScript.GetType() == ROLE_TYPE.MAIN;
                    deadRole.removeFromParent();
                    for (let i = 0; i < this.m_roleList.length; i++) {
                        const role = this.m_roleList[i];
                        if (role == deadRole) {
                            this.m_roleList.splice(i, 1);
                            deadRole = null;
                            break;
                        }
                    }
                    if (this.m_roleList.length == 0 || isMainDead) {
                        postMessage(MESSAGE_DEFINES.GAME_FAILED);
                    } else {
                        postMessage(MESSAGE_DEFINES.REFRESH_SKILL, this.m_roleList);
                    }
                }, 500);
            }
        });
        */
        this.m_rolePrefabs = smc.account.AccountModel.m_rolePrefabs;
        this.m_cloudPrefabs = smc.account.AccountModel.m_cloudPrefabs;
        this.m_petPrefabs = smc.account.AccountModel.m_petPrefabs;
        this.InitRoles();
    }

    update(deltaTime: number) {

    }

    InitRoles() {
        console.log("RoleController.InitRoles")
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        if (userInfo) {
            const roleInfo = userInfo.role;
            //添加主角
            if (roleInfo) {
                const rolePath = roleInfo.res;
                const cloudId = roleInfo.cloudId;
                const cloudInfo = cloudsConfig.getConfigByID(cloudId);
                const cloudPath = cloudInfo["res" + roleInfo.cloudType];
                if (this.gridPrefab) {
                    const roleView = instantiate(this.gridPrefab);
                    this.roleLayout.addChild(roleView);
                    roleView.setPosition(-300, 0, 0);
                    roleView.active = true;
                    const roleScript = roleView.getComponent(BaseRole);
                    if (roleScript) {
                        roleScript.SetInfo(ROLE_TYPE.MAIN, roleInfo);
                        //console.log("roleScript.ShowModel---",cloudPath,rolePath,this.m_cloudPrefabs[cloudPath])
                        roleScript.ShowModel(this.m_cloudPrefabs[cloudPath], cloudPath, this.m_rolePrefabs[rolePath], rolePath);
                        const petId = roleInfo.petInfo ? roleInfo.petInfo.configId : null;
                        if (petId) {
                            const petInfo = petConfig.getConfigByID(petId);
                            let info = petInfo;
                            if (info) {
                                info = JSON.parse(JSON.stringify(petInfo));
                                info.star = roleInfo.petInfo.star;
                            }
                            const petPath = petInfo.res;
                            roleScript.ShowPet(this.m_petPrefabs[petPath], petPath, (pet:any) => {
                                if (pet) {
                                    this.m_petList.push(pet);
                                    const petScript = pet.getComponent(BasePet);
                                    if (petScript) {
                                        petScript.SetId(this.m_petList.length);
                                        petScript.SetInfo(info);
                                        petScript.SetParent(roleView);
                                    }
                                }
                            });
                        }
                    }
                    this.m_roleList.push(roleView);
                }
            }
            const cloudList = userInfo.cloudList;
            if (cloudList.length > 0) {
                for (let i = 0; i < cloudList.length; i++) {
                    const cloudInfo = cloudList[i];
                    this.AddCloud(cloudInfo);
                }
            }
        }
    }

    AddCloud(cloudInfo:any) {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        const cloudPath = cloudInfo["res" + userInfo.role.cloudType];
        const friendInfo = cloudInfo.friendInfo;
        let friendPath = null;
        if (friendInfo) {
            friendPath = friendInfo.res;
        }
        if (this.gridPrefab) {
            const friendView = instantiate(this.gridPrefab);
            this.friendLayout.addChild(friendView);
            friendView.setPosition(-300, 0, 0);
            friendView.active = true;
            this.m_roleList.push(friendView);
            const roleScript = friendView.getComponent(BaseRole);
            if (roleScript) {
                roleScript.SetInfo(ROLE_TYPE.FRIEND, cloudInfo);
                roleScript.ShowModel(this.m_cloudPrefabs[cloudPath], cloudPath, this.m_rolePrefabs[friendPath], friendPath);
            }
        }
    }

    PlayStartAnimation() {
        console.log("RoleController.PlayStartAnimation")
        let interval = 0;
        for (let i = 0; i < this.m_roleList.length; i++) {
            const role = this.m_roleList[i];
            const roleScript = role.getComponent(BaseRole);
            const pet = roleScript!.GetPet();
            let petScript = null;
            if (pet) {
                petScript = pet.getComponent(BasePet);
                if (petScript) {
                    petScript.PlayRunningAnimation();
                }
            }
            let timer1 = setTimeout(() => {
                let moveBy = role.getComponent(MoveBy);
                if (!moveBy) {
                    moveBy = role.addComponent(MoveBy);
                }
                if (moveBy) {
                    let rate = smc.account.AccountModel.getGameRate();
                    if (rate <= 0) {
                        rate = 1;
                    }
                    moveBy.setGameSpeed(rate);
                    moveBy.moveBy(0, 300, 0.5, ()=>{
                        let timer2 = setTimeout(() => {
                            roleScript!.StartAttack();
                            if (petScript) {
                                petScript.StartAttack();
                            }
                        }, 2000 / rate);
                        this.timer.push(timer2)
                    });

                    if (pet) {
                        let moveByPet = pet.getComponent(MoveBy);
                        if (!moveByPet) {
                            moveByPet = pet.addComponent(MoveBy);
                        }
                        if (moveByPet) {
                            moveByPet.setGameSpeed(smc.account.AccountModel.getGameRate());
                            const roleWidth = role.getComponent(UITransform)!.width;
                            const petWidth = pet.getComponent(UITransform)!.width;
                            moveByPet.moveBy(0, roleWidth / 2 + petWidth / 2, 0.5, () => {

                            });
                        }
                    }
                }
            }, interval);
            this.timer.push(timer1)
            interval += 100;
        }
    }

    protected onDisable(): void {
        for (let index = 0; index < this.timer.length; index++) {
            clearTimeout(this.timer[index]);
        }
        this.timer = [];
    }

    AddBuff(buffId:any, buffValue:any) {
        let rand = false;
        const buffInfo = buffConfig.getConfigByID(buffId);
        for (let i = 0; i < this.m_roleList.length; i++) {
            const role = this.m_roleList[i];
            const roleScript = role.getComponent(BaseRole);
            if (roleScript) {
                if (buffInfo.target == -1) {//所有人
                    roleScript.SetBuff(buffValue);
                } else if (buffInfo.target == -2) {//主角
                    if (roleScript.GetType() == ROLE_TYPE.MAIN) {
                        roleScript.SetBuff(buffValue);
                    }
                } else if (buffInfo.target == -3) {//道友
                    if (roleScript.GetType() != ROLE_TYPE.MAIN) {
                        roleScript.SetBuff(buffValue);
                    }
                } else if (buffInfo.target == 0) {//随机
                    if (!rand && Math.random() > 0.5) {
                        roleScript.SetBuff(buffValue);
                        rand = true;
                    } else if (i == this.m_roleList.length - 1) {
                        roleScript.SetBuff(buffValue);
                    }
                } else if (buffInfo.target > 0) {//指定角色
                    if (roleScript.GetInfo()!.id == buffValue.target) {
                        roleScript.SetBuff(buffValue);
                    }
                }
            }
        }
    }


    AddRoleBuff(node:any, buffId:any, buffValue:any) {
        for (let i = 0; i < this.m_roleList.length; i++) {
            const role = this.m_roleList[i];
            if (role == node) {
                const roleScript = role.getComponent(BaseRole);
                if (roleScript) {
                    roleScript.SetBuff(buffValue);
                }
                break;
            }
        }
    }

    RoleAttack(data:any) {
        const attack = data.attack;
        const role = data.target;
        if (role) {
            const roleScript = role.getComponent(BaseRole);
            roleScript.ShowHit(attack);
        }
    }

    GameOver() {
        for (let i = 0; i < this.m_roleList.length; i++) {
            const role = this.m_roleList[i];
            const roleScript = role.getComponent(BaseRole);
            if (roleScript) {
                roleScript.GameOver();
            }
        }
    }

}


