import { _decorator, Component, instantiate, Node, Prefab, resources, UITransform, Vec3 } from 'cc';
import { BaseRole } from '../battle/BaseRole';
import { BaseMonster } from '../battle/BaseMonster';
import { BaseBullet } from './BaseBullet';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
//import { addMessageListener, playSoundByName, postMessage, sendMessage } from '../../public/publicFunctions';
import { BOMB_TYPE, FETTER_ATTRIBUTE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, TARGET_TYPE } from '../common/global';
import { skillConfig } from '../common/config/skill';
import { BaseBomb } from '../bomb/BaseBomb';
//import { globalData } from '../../data/globalData';
import { BasePet } from '../../hall/BasePet';
//import { BasePool } from '../pool/BasePool';
import { buffConfig } from '../common/config/buff';
import { debuffConfig } from '../common/config/debuff';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {    //bulletmanager
    @property(Node)
    skillPos: Node|any = null;

    m_bulletConfig = [
        { id: 1, type: 1, speed: 100 },
    ];

    m_bombConfig = [
        { id: 1, type: 1, range: 200, max: 5 },
    ];

    m_bulletPrefabs :{[key:string]:any} = {};
    m_bombPrefabs :{[key:string]:any} = {};
    m_skill8Id :any= null;
    m_skill9Id :any= null;
    m_buff_skill_rate = 1;//技能伤害加成

    //m_bulletPool: BasePool = null;
    // m_bombPool: BasePool = null;
    start() {
        //if (!this.m_bulletPool) {
        //    this.m_bulletPool = new BasePool();
        //}
        // 添加消息监听器，当子弹击中目标时触发
        oops.message.on(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),(...arg:any)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            // 获取子弹的发射者和目标
            //console.log("recv bullet ",arg);
            const from = arg[1].from;
            const to = arg[1].to;
            const attack = arg[1].attack;
            const params = arg[1].params;
            if (from) {// 如果有发射者
                // 获取发射者的子弹脚本
                const bulletScript = from.getComponent(BaseBullet);
                if (bulletScript) {// 如果有子弹脚本
                    // 获取子弹的技能信息
                    const skillInfo = bulletScript.GetInfo();
                    if (skillInfo) {// 如果有技能信息
                        const target = skillInfo.target;
                        // 如果目标是敌方
                        if (target == TARGET_TYPE.ENEMY) {
                            const bombType = skillInfo.bombType;
                            let monsterScript = null;
                            let roleScript = null;
                            if (to) {
                                monsterScript = to.getComponent(BaseMonster);
                                roleScript = to.getComponent(BaseRole);
                            }
                            if (bombType != BOMB_TYPE.NONE) {
                                if (monsterScript) {
                                    this.CreateBomb(from, to, bulletScript, attack, params);
                                } else if (roleScript) {
                                    this.CreateMonsterBomb(from, to, bulletScript, attack, params);
                                } else {
                                    this.CreateBomb(from, to, bulletScript, attack, params);
                                }
                            } else {
                                if (monsterScript) {
                                    const repel = skillInfo.repel != 0;
                                    monsterScript.ShowHit(attack, repel);
                                }
                                if (roleScript) {
                                    roleScript.ShowHit(attack);
                                }
                            }
                            if (skillInfo.debuff && skillInfo.debuff != 0) {//技能伤害加成
                                if (monsterScript) {
                                    monsterScript.ShowDebuff(skillInfo.debuff, attack);
                                }
                                if (roleScript) {
                                    roleScript.ShowDebuff(skillInfo.debuff, attack);
                                }
                            }
                            const fetterInfo = bulletScript.GetFetterInfo();
                            if (fetterInfo) {//羁绊伤害加成
                                if (fetterInfo.attribute == FETTER_ATTRIBUTE.NONE) {//不触发羁绊
                                } else if (fetterInfo.attribute == FETTER_ATTRIBUTE.ATTACK) {//按攻击频率触发,攻击一次就移除
                                    if (fetterInfo.param.buff) {//增益羁绊
                                        const buffInfo = buffConfig.getConfigByID(fetterInfo.param.buff);
                                        if (buffInfo) {
                                            const buffParam = JSON.parse(buffInfo.param);
                                            if (from) {
                                                const bulletScript = from.getComponent(BaseBullet);
                                                if (bulletScript) {
                                                    const fromInfo = bulletScript.GetFromInfo();
                                                    const fromMonsterScript = fromInfo.getComponent(BaseMonster);
                                                    const fromRoleScript = fromInfo.getComponent(BaseRole);
                                                    if (fromMonsterScript) {
                                                        fromMonsterScript.SetBuff(buffParam, attack);
                                                    }
                                                    if (fromRoleScript) {
                                                        fromRoleScript.SetBuff(buffParam, attack);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (fetterInfo.param.debuff) {//减益羁绊debuff
                                        if (monsterScript) {
                                            monsterScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                        if (roleScript) {
                                            roleScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                    }
                                    bulletScript.SetFetterInfo(null);
                                } else if (fetterInfo.attribute == FETTER_ATTRIBUTE.HIT) {//按伤害频率触发
                                    if (fetterInfo.param.buff) {//增益羁绊
                                        const buffInfo = buffConfig.getConfigByID(fetterInfo.param.buff);
                                        if (buffInfo) {
                                            const buffParam = JSON.parse(buffInfo.param);
                                            if (from) {
                                                const bulletScript = from.getComponent(BaseBullet);
                                                if (bulletScript) {
                                                    const fromInfo = bulletScript.GetFromInfo();
                                                    const fromMonsterScript = fromInfo.getComponent(BaseMonster);
                                                    const fromRoleScript = fromInfo.getComponent(BaseRole);
                                                    if (fromMonsterScript) {
                                                        fromMonsterScript.SetBuff(buffParam, attack);
                                                    }
                                                    if (fromRoleScript) {
                                                        fromRoleScript.SetBuff(buffParam, attack);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (fetterInfo.param.debuff) {//减益羁绊debuff
                                        if (monsterScript) {
                                            monsterScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                        if (roleScript) {
                                            roleScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                    }
                                }
                            }
                        } else if (target == TARGET_TYPE.SELF) {
                            if (skillInfo.buff) {
                                oops.message.dispatchEvent(MESSAGE_DEFINES.ROLE_ADD_BUFF.toString(), { buffId: skillInfo.buff, from: from, to: to, attack: attack })
                                //postMessage(MESSAGE_DEFINES.ROLE_ADD_BUFF, { buffId: skillInfo.buff, from: from, to: to, attack: attack });
                            }
                        }
                    }
                }
            }
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.BULLET_HIT_TARGET, (data) => {
            // 获取子弹的发射者和目标
            const from = data.from;
            const to = data.to;
            const attack = data.attack;
            const params = data.params;
            if (from) {// 如果有发射者
                // 获取发射者的子弹脚本
                const bulletScript = from.getComponent(BaseBullet);
                if (bulletScript) {// 如果有子弹脚本
                    // 获取子弹的技能信息
                    const skillInfo = bulletScript.GetInfo();
                    if (skillInfo) {// 如果有技能信息
                        const target = skillInfo.target;
                        // 如果目标是敌方
                        if (target == TARGET_TYPE.ENEMY) {
                            const bombType = skillInfo.bombType;
                            let monsterScript = null;
                            let roleScript = null;
                            if (to) {
                                monsterScript = to.getComponent(BaseMonster);
                                roleScript = to.getComponent(BaseRole);
                            }
                            if (bombType != BOMB_TYPE.NONE) {
                                if (monsterScript) {
                                    this.CreateBomb(from, to, bulletScript, attack, params);
                                } else if (roleScript) {
                                    this.CreateMonsterBomb(from, to, bulletScript, attack, params);
                                } else {
                                    this.CreateBomb(from, to, bulletScript, attack, params);
                                }
                            } else {
                                if (monsterScript) {
                                    const repel = skillInfo.repel != 0;
                                    monsterScript.ShowHit(attack, repel);
                                }
                                if (roleScript) {
                                    roleScript.ShowHit(attack);
                                }
                            }
                            if (skillInfo.debuff && skillInfo.debuff != 0) {//技能伤害加成
                                if (monsterScript) {
                                    monsterScript.ShowDebuff(skillInfo.debuff, attack);
                                }
                                if (roleScript) {
                                    roleScript.ShowDebuff(skillInfo.debuff, attack);
                                }
                            }
                            const fetterInfo = bulletScript.GetFetterInfo();
                            if (fetterInfo) {//羁绊伤害加成
                                if (fetterInfo.attribute == FETTER_ATTRIBUTE.NONE) {//不触发羁绊
                                } else if (fetterInfo.attribute == FETTER_ATTRIBUTE.ATTACK) {//按攻击频率触发,攻击一次就移除
                                    if (fetterInfo.param.buff) {//增益羁绊
                                        const buffInfo = buffConfig.getConfigByID(fetterInfo.param.buff);
                                        if (buffInfo) {
                                            const buffParam = JSON.parse(buffInfo.param);
                                            if (from) {
                                                const bulletScript = from.getComponent(BaseBullet);
                                                if (bulletScript) {
                                                    const fromInfo = bulletScript.GetFromInfo();
                                                    const fromMonsterScript = fromInfo.getComponent(BaseMonster);
                                                    const fromRoleScript = fromInfo.getComponent(BaseRole);
                                                    if (fromMonsterScript) {
                                                        fromMonsterScript.SetBuff(buffParam, attack);
                                                    }
                                                    if (fromRoleScript) {
                                                        fromRoleScript.SetBuff(buffParam, attack);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (fetterInfo.param.debuff) {//减益羁绊debuff
                                        if (monsterScript) {
                                            monsterScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                        if (roleScript) {
                                            roleScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                    }
                                    bulletScript.SetFetterInfo(null);
                                } else if (fetterInfo.attribute == FETTER_ATTRIBUTE.HIT) {//按伤害频率触发
                                    if (fetterInfo.param.buff) {//增益羁绊
                                        const buffInfo = buffConfig.getConfigByID(fetterInfo.param.buff);
                                        if (buffInfo) {
                                            const buffParam = JSON.parse(buffInfo.param);
                                            if (from) {
                                                const bulletScript = from.getComponent(BaseBullet);
                                                if (bulletScript) {
                                                    const fromInfo = bulletScript.GetFromInfo();
                                                    const fromMonsterScript = fromInfo.getComponent(BaseMonster);
                                                    const fromRoleScript = fromInfo.getComponent(BaseRole);
                                                    if (fromMonsterScript) {
                                                        fromMonsterScript.SetBuff(buffParam, attack);
                                                    }
                                                    if (fromRoleScript) {
                                                        fromRoleScript.SetBuff(buffParam, attack);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (fetterInfo.param.debuff) {//减益羁绊debuff
                                        if (monsterScript) {
                                            monsterScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                        if (roleScript) {
                                            roleScript.ShowDebuff(fetterInfo.param.debuff, attack);
                                        }
                                    }
                                }
                            }
                        } else if (target == TARGET_TYPE.SELF) {
                            if (skillInfo.buff) {
                                postMessage(MESSAGE_DEFINES.ROLE_ADD_BUFF, { buffId: skillInfo.buff, from: from, to: to, attack: attack });
                            }
                        }
                    }
                }
            }
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_ELITE_DEAD.toString(),(...arg:any)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            //this.node.removeAllChildren();
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_ELITE_DEAD, () => {
            // this.node.removeAllChildren();
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_USE_SKILL.toString(),(...arg:any)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            if (arg[1]) {
                this.AddSkill(arg[1]);
            }
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_USE_SKILL, (data) => {
            if (data) {
                this.AddSkill(data);
            }
        });*/

        oops.message.on(MESSAGE_DEFINES.GAME_GET_SKILL_POS.toString(),(...arg:any)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            return this.skillPos;
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_GET_SKILL_POS, (data) => {
            return this.skillPos;
        });*/

        this.m_bulletPrefabs = smc.account.AccountModel.m_bulletPrefabs;
        this.m_bombPrefabs = smc.account.AccountModel.m_bombPrefabs;
    }

    update(deltaTime: number) {

    }

    CreateBullet(from:any, to:any, attack:any, fetterInfo:any) {
        const roleScript = from.getComponent(BaseRole);
        const monsterScript = to.getComponent(BaseMonster);
        if (roleScript && monsterScript) {
            const skillId = roleScript.GetSkill();
            const skillInfo = skillConfig.getConfigByID(skillId);
            if (skillInfo) {
                const skillPath = skillInfo.res;
                if (skillPath == "0") {
                    return;
                }
                if (this.m_bulletPrefabs[skillPath]) {
                    // console.log("has prefab");
                    this.AddNewBullet(this.m_bulletPrefabs[skillPath], roleScript, skillInfo, to, attack, fetterInfo);
                } else {
                    // console.log("load prefab");
                    oops.res.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bulletPrefabs[skillPath] = prefab;
                        this.AddNewBullet(prefab, roleScript, skillInfo, to, attack, fetterInfo);
                    });
                    /*
                    resources.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bulletPrefabs[skillPath] = prefab;
                        this.AddNewBullet(prefab, roleScript, skillInfo, to, attack, fetterInfo);
                    });*/
                }
                const sound = skillInfo.sound;
                if (sound != 0) {
                    //playSoundByName(sound);
                }
            }
        }
    }

    CreatePetBullet(from:any, to:any, attack:any) {
        const petScript = from.getComponent(BasePet);
        const monsterScript = to.getComponent(BaseMonster);
        if (petScript && monsterScript) {
            const skillId = petScript.GetSkill();
            const skillInfo = skillConfig.getConfigByID(skillId);
            if (skillInfo) {
                const skillPath = skillInfo.res;
                if (skillPath == "0") {
                    return;
                }
                if (this.m_bulletPrefabs[skillPath]) {
                    // console.log("has prefab");
                    this.AddNewPetBullet(this.m_bulletPrefabs[skillPath], petScript, skillInfo, to, attack);
                } else {
                    // console.log("load prefab");
                    oops.res.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bulletPrefabs[skillPath] = prefab;
                        this.AddNewPetBullet(prefab, petScript, skillInfo, to, attack);
                    });
                    /*
                    resources.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bulletPrefabs[skillPath] = prefab;
                        this.AddNewPetBullet(prefab, petScript, skillInfo, to, attack);
                    });*/
                }
                const sound = skillInfo.sound;
                if (sound != 0) {
                    //playSoundByName(sound);
                }
            }
        }
    }

    CreateMonsterBullet(from:any, to:any, attack:any, skillInfo:any) {
        const roleScript = to.getComponent(BaseRole);
        const monsterScript = from.getComponent(BaseMonster);
        if (roleScript && monsterScript && skillInfo) {
            const skillPath = skillInfo.res;
            if (skillPath == "0") {
                return false;
            }
            if (this.m_bulletPrefabs[skillPath]) {
                // console.log("has prefab");
                this.AddNewMonsterBullet(this.m_bulletPrefabs[skillPath], monsterScript, skillInfo, to, attack);
            } else {
                // console.log("load prefab");
                oops.res.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.m_bulletPrefabs[skillPath] = prefab;
                    this.AddNewMonsterBullet(prefab, monsterScript, skillInfo, to, attack);
                });
                /*
                resources.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.m_bulletPrefabs[skillPath] = prefab;
                    this.AddNewMonsterBullet(prefab, monsterScript, skillInfo, to, attack);
                });*/
            }
            const sound = skillInfo.sound;
            if (sound != 0) {
                //playSoundByName(sound);
            }
            return true;
        }
        return false;
    }


    CreatePVPBullet(from:any, to:any, attack:any, camp:any) {
        const roleScript = from.getComponent(BaseRole);
        if (roleScript) {
            const skillId = roleScript.GetSkill();
            const skillInfo = skillConfig.getConfigByID(skillId);
            if (skillInfo) {
                const skillPath = skillInfo.res;
                if (skillPath == "0") {
                    return;
                }
                if (this.m_bulletPrefabs[skillPath]) {
                    this.AddNewPVPBullet(this.m_bulletPrefabs[skillPath], roleScript, skillInfo, to, attack, camp);
                } else {
                    oops.res.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bulletPrefabs[skillPath] = prefab;
                        this.AddNewPVPBullet(prefab, roleScript, skillInfo, to, attack, camp);
                    });
                    /*
                    resources.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bulletPrefabs[skillPath] = prefab;
                        this.AddNewPVPBullet(prefab, roleScript, skillInfo, to, attack, camp);
                    });*/
                }
                const sound = skillInfo.sound;
                if (sound != 0) {
                    //playSoundByName(sound);
                }
            }
        }
    }

    AddNewBullet(prefab:any, roleScript:any, skillInfo:any, to:any, attack:any, fetterInfo:any) {
        // const bullet = instantiate(prefab);
        const bullet = this.getAvailableBullet(prefab, skillInfo.id);
        const offset = roleScript.GetBulletOffset();
        const offsetJson = JSON.parse(offset);
        const body = roleScript.GetBody();
        const bodyPos = body.getWorldPosition();
        const offsetX = Number(offsetJson.x);
        const offsetY = Number(offsetJson.y);
        const newPos = new Vec3(bodyPos.x + offsetX, bodyPos.y + offsetY, bodyPos.z);
        bullet.setWorldPosition(newPos);
        const bulletScript = bullet.getComponent(BaseBullet);
        if (bulletScript) {
            bulletScript.Reset();
            bulletScript.SetInfo(skillInfo);
            bulletScript.SetFromInfo(NODE_TYPE.ROLE, roleScript.node);
            bulletScript.SetTarget(to);
            bulletScript.SetAttack(attack * skillInfo.rate);
            bulletScript.SetFetterInfo(fetterInfo);
            bulletScript.StartMove();
        }
    }

    AddNewPetBullet(prefab:any, petScript:any, skillInfo:any, to:any, attack:any) {
        const bullet = this.getAvailableBullet(prefab, skillInfo.id);
        const offset = petScript.GetBulletOffset();
        const offsetJson = JSON.parse(offset);
        const body = petScript.GetBody();
        const bodyPos = body.getWorldPosition();
        const offsetX = Number(offsetJson.x);
        const offsetY = Number(offsetJson.y);
        const newPos = new Vec3(bodyPos.x + offsetX, bodyPos.y + offsetY, bodyPos.z);
        bullet.setWorldPosition(newPos);
        const bulletScript = bullet.getComponent(BaseBullet);
        if (bulletScript) {
            bulletScript.Reset();
            bulletScript.SetInfo(skillInfo);
            bulletScript.SetFromInfo(NODE_TYPE.PET, petScript.node);
            bulletScript.SetTarget(to);
            bulletScript.SetAttack(attack * skillInfo.rate);
            bulletScript.StartMove();
        }
    }

    AddNewMonsterBullet(prefab:any, monsterScript:any, skillInfo:any, to:any, attack:any) {
        const bullet = this.getAvailableBullet(prefab, skillInfo.id);
        bullet.active = true;
        this.node.addChild(bullet);
        const offset = monsterScript.GetBulletOffset();
        const offsetJson = JSON.parse(offset);
        const body = monsterScript.GetBody();
        const bodyPos = body.getWorldPosition();
        const offsetX = Number(offsetJson.x);
        const offsetY = Number(offsetJson.y);
        const newPos = new Vec3(bodyPos.x + offsetX, bodyPos.y + offsetY + monsterScript.GetSelfHeight(), bodyPos.z);
        bullet.setWorldPosition(newPos);
        const bulletScript = bullet.getComponent(BaseBullet);
        if (bulletScript) {
            bulletScript.Reset();
            bulletScript.SetInfo(skillInfo);
            bulletScript.SetFromInfo(NODE_TYPE.MONSTER, monsterScript.node);
            bulletScript.SetTarget(to);
            bulletScript.SetAttack(attack * skillInfo.rate);
            bulletScript.StartMove();
        }
    }

    AddNewPVPBullet(prefab:any, roleScript:any, skillInfo:any, to:any, attack:any, camp:any) {
        const bullet = instantiate(prefab);
        bullet.active = true;
        this.node.addChild(bullet);
        const offset = roleScript.GetBulletOffset();
        const offsetJson = JSON.parse(offset);
        const body = roleScript.GetBody();
        const bodyPos = body.getWorldPosition();
        let offsetX = Number(offsetJson.x);
        if (camp == PVP_TEAM_CAMP.ENEMY) {
            offsetX = -offsetX;
        }
        const offsetY = Number(offsetJson.y);
        const newPos = new Vec3(bodyPos.x + offsetX, bodyPos.y + offsetY, bodyPos.z);
        bullet.setWorldPosition(newPos);
        const bulletScript = bullet.getComponent(BaseBullet);
        if (bulletScript) {
            bulletScript.Reset();
            bulletScript.SetCamp(camp);
            bulletScript.SetInfo(skillInfo);
            bulletScript.SetFromInfo(NODE_TYPE.ROLE, roleScript.node);
            bulletScript.SetTarget(to);
            bulletScript.SetAttack(attack * skillInfo.rate);
            bulletScript.StartMove();
        }
    }

    CreateBomb(from:any, to:any, bulletScript:any, attack:any, params:any) {
        const skillInfo = bulletScript.GetInfo();
        if (skillInfo) {
            const bombType = skillInfo.bombType;
            if (bombType != BOMB_TYPE.NONE) {
                const bombPath = skillInfo.bomb;
                const range = skillInfo.range;
                const max = skillInfo.maxHit;
                const repel = skillInfo.repel != 0;
                let fromPos = from.getWorldPosition();
                if (bulletScript) {
                    fromPos = bulletScript.GetCenterPosition();
                }
                if (this.m_bombPrefabs[bombPath]) {
                    this.AddNewBomb(this.m_bombPrefabs[bombPath], bulletScript, fromPos, to, range, max, attack, repel, params);
                } else {
                    oops.res.load(bombPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bombPrefabs[bombPath] = prefab;
                        this.AddNewBomb(prefab, bulletScript, fromPos, to, range, max, attack, repel, params);
                    });
                    /*
                    resources.load(bombPath, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.m_bombPrefabs[bombPath] = prefab;
                        this.AddNewBomb(prefab, bulletScript, fromPos, to, range, max, attack, repel, params);
                    });*/
                }
                if (skillInfo.bombSound != 0) {
                    //playSoundByName(skillInfo.bombSound);
                }
            }
        }
    }
    
    AddNewBomb(prefab:any, bulletScript:any, fromPos:any, to:any, range:any, max:any, attack:any, repel:any, params:any) {
        const newBomb = instantiate(prefab);
        newBomb.active = true;
        this.node.addChild(newBomb);
        newBomb.setWorldPosition(fromPos);
        const bombScript = newBomb.getComponent(BaseBomb);
        if (bombScript) {
            bombScript.StartBomb();
            bombScript.SetParams(params);
        }
        let target = to;
        if (!to) {
            target = newBomb;
        }
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET.toString(),(targetList: Node[]) => {
            for (let i = 0; i < targetList.length; i++) {
                const monster = targetList[i];
                const monsterScript = monster.getComponent(BaseMonster);
                monsterScript!.ShowHit(attack, repel);
            }

        },{ target, range, max });
        /*
        sendMessage(MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET, { target, range, max }, (list) => {
            for (let i = 0; i < list.length; i++) {
                const monster = list[i];
                const monsterScript = monster.getComponent(BaseMonster);
                monsterScript.ShowHit(attack, repel);
            }
        });*/
    }

    CreateMonsterBomb(from:any, to:any, bulletScript:any, attack:any, params:any) {
        const skillInfo = bulletScript.GetInfo();
        if (skillInfo) {
            const bombType = skillInfo.bombType;
            if (bombType != BOMB_TYPE.NONE) {
                const bombPath = skillInfo.bomb;
                const range = skillInfo.range;
                const max = skillInfo.maxHit;
                const repel = skillInfo.repel != 0;
                this.AddNewMonsterBomb(bombPath, bulletScript, from, to, range, max, attack, repel, params);
                if (skillInfo.bombSound != 0) {
                    //playSoundByName(skillInfo.bombSound);
                }
            }
        }
    }

    AddNewMonsterBomb(bombPath:any, bulletScript:any, from:any, to:any, range:any, max:any, attack:any, repel:any, params:any) {
        let fromPos = from.getWorldPosition();
        if (bulletScript) {
            fromPos = bulletScript.GetCenterPosition();
        }
        if (this.m_bombPrefabs[bombPath]) {
            this.AddNewMonsterBomb2(this.m_bombPrefabs[bombPath], bulletScript, fromPos, to, range, max, attack, repel, params);
        } else {
            oops.res.load(bombPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.m_bombPrefabs[bombPath] = prefab;
                this.AddNewMonsterBomb2(prefab, bulletScript, fromPos, to, range, max, attack, repel, params);
            });
            /*
            resources.load(bombPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.m_bombPrefabs[bombPath] = prefab;
                this.AddNewMonsterBomb2(prefab, bulletScript, fromPos, to, range, max, attack, repel, params);
            });*/
        }
    }

    AddNewMonsterBomb2(prefab:any, bulletScript:any, fromPos:any, to:any, range:any, max:any, attack:any, repel:any, params:any) {
        const newBomb = instantiate(prefab);
        newBomb.active = true;
        this.node.addChild(newBomb);
        newBomb.setWorldPosition(fromPos);
        const bombScript = newBomb.getComponent(BaseBomb);
        if (bombScript) {
            bombScript.StartBomb();
            bombScript.SetParams(params);
        }
        const roleScript = to.getComponent(BaseRole);
        if (roleScript) {
            roleScript.ShowHit(attack);
        }
    }

    AddSkill(data:any) {
        const skillPath = data.res;
        if (skillPath == "0") {
            return;
        }
        if (this.m_bulletPrefabs[skillPath]) {
            this.AddSkillBullet(this.m_bulletPrefabs[skillPath], data);
        } else {
            // console.log("load prefab");
            oops.res.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.m_bulletPrefabs[skillPath] = prefab;
                this.AddSkillBullet(prefab, data);
            });
            /*
            resources.load(skillPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.m_bulletPrefabs[skillPath] = prefab;
                this.AddSkillBullet(prefab, data);
            });*/
        }
        if (data.sound != 0) {
            //playSoundByName(data.sound);
        }
    }

    AddSkillBullet(prefab:any, skillInfo:any) {
        if (skillInfo.id == 6008) {
            const skill8 = this.skillPos.getChildByName("skill8");
            skill8.active = true;
            if (this.m_skill8Id) {
                clearInterval(this.m_skill8Id);
                this.m_skill8Id = null;
            }
            let count = 20;
            this.m_skill8Id = setInterval(() => {
                this.AddSkill8Bullet(skill8, prefab, skillInfo, this.m_buff_skill_rate);
                count--;
                if (count <= 0) {
                    clearInterval(this.m_skill8Id);
                    this.m_skill8Id = null;
                    skill8.active = false;
                }
            }, 50);
        } else if (skillInfo.id == 6009) {
            const skill9 = this.skillPos.getChildByName("skill9");
            skill9.active = true;
            if (this.m_skill9Id) {
                clearInterval(this.m_skill9Id);
                this.m_skill9Id = null;
            }
            let count = 6;
            this.m_skill9Id = setInterval(() => {
                this.AddSkill9Bullet(skill9, prefab, skillInfo, this.m_buff_skill_rate);
                count--;
                if (count <= 0) {
                    clearInterval(this.m_skill9Id);
                    this.m_skill9Id = null;
                    skill9.active = false;
                }
            }, 200);
        } else if (skillInfo.id == 6045) {
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list: Node[]) => {
                let toList :any= [];
                for (let i = 0; i < list.length; i++) {
                    if (i < 3 && list[i] && list[i].children && list[i].children.length > 0) {
                        toList = toList.concat(list[i].children);
                    }
                }
                for (let i = 0; i < skillInfo.maxHit; i++) {
                    if (i < toList.length) {
                        const to = toList[i];
                        const bullet = this.getAvailableBullet(prefab, skillInfo.id);
                        const bulletScript = bullet.getComponent(BaseBullet);
                        if (bulletScript) {
                            bulletScript.Reset();
                            bulletScript.SetInfo(skillInfo, this.m_buff_skill_rate);
                            bulletScript.SetTarget(to);
                            bulletScript.StartMove();
                        }
                    }
                }
    
            },null);/*
            sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
                let toList = [];
                for (let i = 0; i < list.length; i++) {
                    if (i < 3 && list[i] && list[i].children && list[i].children.length > 0) {
                        toList = toList.concat(list[i].children);
                    }
                }
                for (let i = 0; i < skillInfo.maxHit; i++) {
                    if (i < toList.length) {
                        const to = toList[i];
                        const bullet = this.getAvailableBullet(prefab, skillInfo.id);
                        const bulletScript = bullet.getComponent(BaseBullet);
                        if (bulletScript) {
                            bulletScript.Reset();
                            bulletScript.SetInfo(skillInfo, this.m_buff_skill_rate);
                            bulletScript.SetTarget(to);
                            bulletScript.StartMove();
                        }
                    }
                }
            })*/
        } else {
            const bullet = this.getAvailableBullet(prefab, skillInfo.id);
            const bulletScript = bullet.getComponent(BaseBullet);
            if (bulletScript) {
                bulletScript.Reset();
                bulletScript.SetInfo(skillInfo, this.m_buff_skill_rate);
                bulletScript.StartMove();
            }
        }
    }

    AddSkill8Bullet(skillNode:any, prefab:any, skillInfo:any, buffSkillRate:any) {
        const bullet = this.getAvailableBullet(prefab, skillInfo.id);
        const skillWidth = skillNode.getComponent(UITransform).width;
        const skillHeight = skillNode.getComponent(UITransform).height;
        const bulletHeight = bullet.getComponent(UITransform).height;
        const pos = new Vec3(skillNode.getWorldPosition().x - skillWidth / 2 + Math.random() * skillWidth, skillNode.getWorldPosition().y - skillHeight / 2 - bulletHeight, skillNode.getWorldPosition().z);
        bullet.setWorldPosition(pos);
        /*
        sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
            const to = list[Math.floor(Math.random() * list.length)];
            const bulletScript = bullet.getComponent(BaseBullet);
            if (bulletScript) {
                bulletScript.Reset();
                bulletScript.SetInfo(skillInfo, buffSkillRate);
                bulletScript.SetTarget(to);
                bulletScript.StartMove();
            }
        });*/
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list: Node[]) => {
            const to = list[Math.floor(Math.random() * list.length)];
            const bulletScript = bullet.getComponent(BaseBullet);
            if (bulletScript) {
                bulletScript.Reset();
                bulletScript.SetInfo(skillInfo, buffSkillRate);
                bulletScript.SetTarget(to);
                bulletScript.StartMove();
            }

        },null);
    }

    AddSkill9Bullet(skillNode:any, prefab:any, skillInfo:any, buffSkillRate:any) {
        const skillWidth = skillNode.getComponent(UITransform).width;
        const skillHeight = skillNode.getComponent(UITransform).height;
        const num = 10;
        const grid = skillHeight / num;
        for (let i = 0; i < num; i++) {
            const bullet = this.getAvailableBullet(prefab, skillInfo.id);
            const bulletWdith = bullet.getComponent(UITransform).width;
            const pos = new Vec3(skillNode.getWorldPosition().x - skillWidth / 2 - bulletWdith, skillNode.getWorldPosition().y - skillHeight / 2 + grid * i, skillNode.getWorldPosition().z);
            bullet.setWorldPosition(pos);/*
            sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
                const to = list[Math.floor(Math.random() * list.length)];
                const bulletScript = bullet.getComponent(BaseBullet);
                if (bulletScript) {
                    bulletScript.Reset();
                    bulletScript.SetInfo(skillInfo, buffSkillRate);
                    bulletScript.SetTarget(to);
                    bulletScript.StartMove();
                }
            });*/
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list: Node[]) => {
                const to = list[Math.floor(Math.random() * list.length)];
                const bulletScript = bullet.getComponent(BaseBullet);
                if (bulletScript) {
                    bulletScript.Reset();
                    bulletScript.SetInfo(skillInfo, buffSkillRate);
                    bulletScript.SetTarget(to);
                    bulletScript.StartMove();
                }
    
            },null);
        }
    }

    AddBuff(buffId:any, buffInfo:any) {
        if (buffInfo.skill) {
            this.m_buff_skill_rate = this.m_buff_skill_rate * Number(buffInfo.skill);
        }
    }

    getAvailableBullet(prefab:any, skillId:any) {
        //if (this.m_bulletPool) {
            //const bullet = this.m_bulletPool.getAvailableNode(prefab, (bullet: Node) => {
                //const bulletScript = bullet.getComponent(BaseBullet);
                //return bulletScript && !bulletScript.IsAlive() && bulletScript.GetInfo().id == skillId && bullet.active == false;
            //});
            //bullet.active = true;
            //if (bullet.parent != this.node) {
               // bullet.setParent(this.node);
            //}
            //return bullet;
        //} else {
            const bullet = instantiate(prefab);
            bullet.active = true;
            this.node.addChild(bullet);
            return bullet;
        //}
    }

    protected onDisable(): void {
        if (this.m_skill8Id) {
            clearInterval(this.m_skill8Id);
            this.m_skill8Id = null;
        }
        if (this.m_skill9Id) {
            clearInterval(this.m_skill9Id);
            this.m_skill9Id = null;
        }
    }
}


