import { _decorator, Color, Component, Label, Node, sp } from 'cc';
import { skillConfig } from '../game/common/config/skill';
//import { globalData } from '../../data/globalData';
import { DEFAULT_CLOUD_TYPE, formatNum,  MESSAGE_DEFINES, PET_STATUS, PVP_TEAM_CAMP } from '../game/common/global';
//import { postMessage, sendMessage } from '../../public/publicFunctions';
import { petsStarConfig } from '../game/common/config/pets_star';
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { smc } from "../game/common/SingletonModuleComp";
const { ccclass, property } = _decorator;

@ccclass('BasePet')
export class BasePet extends Component {
    @property(sp.Skeleton)
    m_skeleton: sp.Skeleton|any = null;
    @property(sp.Skeleton)
    m_collet: sp.Skeleton|any = null;
    @property(Label)
    m_nameLabel: Label|any = null;

    m_parent = null;
    m_id = 0; // 宠物id
    m_info :any= null;//宠物配置
    m_status = PET_STATUS.IDLE;//角色状态
    m_camp = PVP_TEAM_CAMP.NONE; //阵营(用于PVP)

    m_attack = 10; // 攻击力
    m_attackInterval = 1; // 攻击间隔
    m_skill = null; // 技能类型
    m_skillInterval = 0; // 起手到生成弹道的时间
    m_attackValue = 0; // 攻击蓄力
    m_bulletOffset = { x: 0, y: 0 };//子弹偏移

    m_buff_attack = 0; // buff攻击力
    m_buff_interval = 1; //buff攻速

    m_attackIds :any= [];//攻击动画id
    start() {

    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == PET_STATUS.ATTACK && this.m_attackInterval > 0) {
            if (this.m_attackValue < this.m_attackInterval * this.m_buff_interval) {
                this.m_attackValue += deltaTime;
            }
            if (this.m_attackValue >= this.m_attackInterval * this.m_buff_interval) {
                this.m_attackValue = 0;
                this.Attack();
            }
        }
    }

    SetParent(parent:any) {
        this.m_parent = parent;
    }

    GetParent() {
        return this.m_parent;
    }

    SetId(id:any) {
        this.m_id = id;
    }

    GetId() {
        return this.m_id;
    }

    SetCamp(camp:any) {
        this.m_camp = camp;
    }

    GetCamp() {
        return this.m_camp;
    }

    SetInfo(info:any) {
        this.m_info = info;
        this.m_bulletOffset = info.bulletOffset;
        if (info.star) {
            let data = petsStarConfig.getConfigByID(info.star);
            if (data) {
                this.m_attack = Number(data.attack);
                this.m_attackInterval = Number(data.interval);
                this.m_skill = data.skill;
                const skillInfo = skillConfig.getConfigByID(this.m_skill);
                if (skillInfo) {
                    this.m_skillInterval = Number(skillInfo.interval);
                }
            }
        }
    }

    GetInfo() {
        return this.m_info;
    }

    GetSkill() {
        return this.m_skill;
    }

    GetBody() {
        return this.node;
    }

    StartAttack() {
        this.m_status = PET_STATUS.ATTACK;
        if (this.m_info && this.m_info.star) {
            let data = petsStarConfig.getConfigByID(this.m_info.star);
            if (data) {
                this.m_attackValue = Number(data.interval); // 第一次攻击蓄力
            }
        }
    }

    GetAttack() {
        return this.m_attack + this.m_buff_attack;
    }

    GetBulletOffset() {
        return this.m_bulletOffset;
    }

    Attack() {
        const skillInfo = skillConfig.getConfigByID(this.m_skill);
        let num = 1;
        let distance = 0;
        if (skillInfo) {
            num = skillInfo.bullet;
            distance = skillInfo.distance;
        }
        if (this.m_camp == PVP_TEAM_CAMP.NONE) {//非PVP
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_MONSTER_TARGET.toString(), (list: []) => {
                if (list.length > 0) {
                    this.PlayAttackAnimation();
                    const id= setTimeout(() => {
                        if (list.length < num) {
                            for (let i = 0; i < list.length; i++) {
                                const target = list[i];
                                oops.message.dispatchEvent(MESSAGE_DEFINES.PET_ATTACK.toString(), { from: this.node, target, attack: this.m_attack + this.m_buff_attack });
                                //postMessage(MESSAGE_DEFINES.PET_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack });
                            }
                        } else {
                            for (let i = 0; i < num; i++) {
                                const target = list[i];
                                oops.message.dispatchEvent(MESSAGE_DEFINES.PET_ATTACK.toString(),{ from: this.node, target, attack: this.m_attack + this.m_buff_attack });
                                //postMessage(MESSAGE_DEFINES.PET_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack });
                            }
                        }
                        // playSoundByFile("attack");
                    }, Number(this.m_skillInterval) * 1000 / smc.account.AccountModel.getGameRate());
                    this.m_attackIds.push(id);
                } else {
                    if (this.m_info.star) {
                        let data = petsStarConfig.getConfigByID(this.m_info.star);
                        if (data) {
                            this.m_attackValue = Number(data.interval); // 第一次攻击蓄力
                        }
                    }
                }
            },[{ num, from: this.node, distance }]);
            /*
            sendMessage(MESSAGE_DEFINES.GET_MONSTER_TARGET, { num, from: this.node, distance }, (list: []) => {
                if (list.length > 0) {
                    this.PlayAttackAnimation();
                    const id = setTimeout(() => {
                        if (list.length < num) {
                            for (let i = 0; i < list.length; i++) {
                                const target = list[i];
                                postMessage(MESSAGE_DEFINES.PET_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack });
                            }
                        } else {
                            for (let i = 0; i < num; i++) {
                                const target = list[i];
                                postMessage(MESSAGE_DEFINES.PET_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack });
                            }
                        }
                        // playSoundByFile("attack");
                    }, Number(this.m_skillInterval) * 1000 / globalData.getGameRate());
                    this.m_attackIds.push(id);
                } else {
                    if (this.m_info.star) {
                        let data = petsStarConfig.getConfigByID(this.m_info.star);
                        if (data) {
                            this.m_attackValue = Number(data.interval); // 第一次攻击蓄力
                        }
                    }
                }
            });*/
        } else {//PVP
            let code1 = null;
            if (this.m_camp == PVP_TEAM_CAMP.SELF) {
                code1 = MESSAGE_DEFINES.PVP_GET_ENEMY_TARGET;
            } else if (this.m_camp == PVP_TEAM_CAMP.ENEMY) {
                code1 = MESSAGE_DEFINES.PVP_GET_SELF_TARGET;
            }
            if (code1) {
                /*
                sendMessage(code1, { num, from: this.node, distance, camp: this.m_camp }, (list: []) => {
                    if (list.length > 0) {
                        this.PlayAttackAnimation();
                        const id = setTimeout(() => {
                            let code2 = null;
                            if (this.m_camp == PVP_TEAM_CAMP.SELF) {
                                code2 = MESSAGE_DEFINES.PVP_SELF_ATTACK;
                            } else if (this.m_camp == PVP_TEAM_CAMP.ENEMY) {
                                code2 = MESSAGE_DEFINES.PVP_ENEMY_ATTACK;
                            }
                            if (code2) {
                                if (list.length < num) {
                                    for (let i = 0; i < list.length; i++) {
                                        const target = list[i];
                                        postMessage(code2, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, camp: this.m_camp });
                                    }
                                } else {
                                    for (let i = 0; i < num; i++) {
                                        const target = list[i];
                                        postMessage(code2, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, camp: this.m_camp });
                                    }
                                }
                            }
                        }, Number(this.m_skillInterval) * 1000 / globalData.getGameRate());
                        this.m_attackIds.push(id);
                    } else {
                        if (this.m_info.star) {
                            let data = petsStarConfig.getConfigByID(this.m_info.star);
                            if (data) {
                                this.m_attackValue = Number(data.interval); // 第一次攻击蓄力
                            }
                        }
                    }
                });*/
                oops.message.dispatchEventcallback(code1.toString(), (list: []) => {
                    if (list.length > 0) {
                        this.PlayAttackAnimation();
                        const id = setTimeout(() => {
                            let code2 = null;
                            if (this.m_camp == PVP_TEAM_CAMP.SELF) {
                                code2 = MESSAGE_DEFINES.PVP_SELF_ATTACK;
                            } else if (this.m_camp == PVP_TEAM_CAMP.ENEMY) {
                                code2 = MESSAGE_DEFINES.PVP_ENEMY_ATTACK;
                            }
                            if (code2) {
                                if (list.length < num) {
                                    for (let i = 0; i < list.length; i++) {
                                        const target = list[i];
                                        oops.message.dispatchEvent(code2.toString(), { from: this.node, target, attack: this.m_attack + this.m_buff_attack, camp: this.m_camp });
                                        //postMessage(code2, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, camp: this.m_camp });
                                    }
                                } else {
                                    for (let i = 0; i < num; i++) {
                                        const target = list[i];
                                        oops.message.dispatchEvent(code2.toString(), { from: this.node, target, attack: this.m_attack + this.m_buff_attack, camp: this.m_camp });
                                        //postMessage(code2, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, camp: this.m_camp });
                                    }
                                }
                            }
                        }, Number(this.m_skillInterval) * 1000 / smc.account.AccountModel.getGameRate());
                        this.m_attackIds.push(id);
                    } else {
                        if (this.m_info.star) {
                            let data = petsStarConfig.getConfigByID(this.m_info.star);
                            if (data) {
                                this.m_attackValue = Number(data.interval); // 第一次攻击蓄力
                            }
                        }
                    }
                }, [{ num, from: this.node, distance, camp: this.m_camp }]);
            }
        }
    }

    PlayAttackAnimation() {
        if (this.m_collet) {
            this.m_collet.node.active = true;
            this.m_collet.setAnimation(0, "play", false);
        }
    }

    PlayRunningAnimation() {
        if (this.m_skeleton) {
            this.m_skeleton.setAnimation(0, 'run', true);
        }
    }

    ShowName(name:any) {
        if (this.m_nameLabel) {
            this.m_nameLabel.node.active = true;
            this.m_nameLabel.string = name;
        }
    }

    ShowEnable(enable:any) {
        if (this.m_skeleton) {
            this.m_skeleton.getComponent(sp.Skeleton).color = enable ? new Color(255, 255, 255, 255) : new Color(125, 125, 125, 255);
        }
        if (this.m_nameLabel) {
            if (!enable) {
                this.m_nameLabel.string += "(未解锁)";
            }
            this.m_nameLabel.color = enable ? new Color(255, 255, 255, 255) : new Color(125, 125, 125, 255);
        }
    }

    protected onDisable(): void {
        if (this.m_attackIds && this.m_attackIds.length > 0) {
            for (let i = 0; i < this.m_attackIds.length; i++) {
                clearInterval(this.m_attackIds[i]);
            }
            this.m_attackIds = [];
        }
    }

}


