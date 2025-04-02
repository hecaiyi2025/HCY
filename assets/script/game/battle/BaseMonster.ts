import { _decorator, Component, sp, Node, Vec3, Animation, ProgressBar, UITransform, instantiate, Label, UIOpacity, resources, Prefab, color } from 'cc';
//import { playSoundByName, postMessage, sendMessage } from '../../public/publicFunctions';
import { DAMAGE_TYPE, MESSAGE_DEFINES, MONSTER_STATUS, MONSTER_TYPE, NODE_TYPE, SKILL_TYPE } from '../common/global';
//import { globalData } from '../../data/globalData';
import { skillConfig } from '../common/config/skill';
import { debuffConfig } from '../common/config/debuff';
import { BaseDebuff } from './BaseDebuff';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";

const { ccclass, property } = _decorator;

@ccclass('BaseMonster')
export class BaseMonster extends Component {
    @property(sp.Skeleton)
    m_skeleton: sp.Skeleton|any = null;
    @property(ProgressBar)
    m_bloodProgressBar: ProgressBar|any  = null;
    @property(Node)
    m_hitEffect: Node|any  = null;

    m_id = 0; // 怪物id
    m_info :any = null;//怪物配置
    m_target: Node|any  = null;
    m_type = 0; // 怪物类型
    m_attack = 10; // 攻击力
    m_blood = 100; // 血量
    m_maxBlood = 100; // 最大血量
    m_defence = 0; //防御力
    m_speed = 100;
    m_backgroundSpeed = 0; //背景速度

    m_status = MONSTER_STATUS.IDLE; // 0: 待机，1: 移动，2: 攻击，3: 受击，4: 击退， 5: 死亡 6: 结束
    m_pos :any= null; //所在路线
    m_posBg :any= null;//路线背景，用于放阴影、背景图层之类
    m_hitNum = 0; // 受击掉血值后播放动画
    m_hitId :any= null;//受击动画id
    m_attackIds :any[]= [];//攻击动画id
    m_attackValue = 0; // 攻击蓄力
    m_attackInterval = 1; // 攻击间隔
    m_bulletOffset = { x: 0, y: 0 };//子弹偏移
    m_ySpeed = 0; // y轴速度
    m_layer = 0; //层次
    m_layerHeight = 0; //层高
    m_up :any= null;
    m_jumping = false; //是否在跳跃
    m_backInterval = -1; // 回退间隔
    m_backDistance = 0; // 回退距离
    m_backSpeed = 3; // 回退速度
    m_deadInterval = 1; // 死亡动画时间
    m_skills :any[]= []; //技能
    m_debuffList :any[]= []; // debuff列表
    start() {
        if (!this.m_skeleton) {
            this.m_skeleton = this.node.getComponent(sp.Skeleton);
        }
        if (!this.m_bloodProgressBar && this.node.getChildByName("blood")) {
            this.m_bloodProgressBar = this.node.getChildByName("blood")!.getComponent(ProgressBar);
        }
    }

    SetId(id:any) {
        this.m_id = id;
    }

    GetId() {
        return this.m_id;
    }

    SetInfo(info:any, propertyRate = 1) {
        this.m_info = info;
        this.m_blood = Number(info.blood) * Number(propertyRate);
        this.m_maxBlood = Number(info.blood) * Number(propertyRate);
        this.m_attack = Number(info.attack) * Number(propertyRate);
        this.m_defence = Number(info.defence) * Number(propertyRate);
        this.m_speed = Number(info.speed);
        this.m_type = Number(info.type);
        this.m_attackInterval = Number(info.interval);
        this.m_attackValue = this.m_attackInterval;
        this.m_bulletOffset = info.bulletOffset;
        const skills = JSON.parse(info.skill);
        if (skills.length > 0) {
            this.m_skills = [];
            for (let i = 0; i < skills.length; i++) {
                this.m_skills.push({ id: Number(skills[i]), cd: 0 });
            }
            this.m_skills = this.m_skills.sort((a, b) => {//优先主动技能
                const skillInfoA = skillConfig.getConfigByID(a.id);
                const skillInfoB = skillConfig.getConfigByID(b.id);
                return skillInfoB.type - skillInfoA.type;
            });
        }
        this.SetStatus(this.m_status);
        this.ShowBlood(this.m_blood / this.m_maxBlood);
    }

    GetInfo() {
        return this.m_info;
    }

    SetAttackInterval(interval:any) {
        this.m_attackInterval = interval;
    }
    GetAttackInterval() {
        return this.m_attackInterval;
    }

    SetSpeed(speed:any) {
        this.m_speed = Number(speed);
    }

    GetSpeed() {
        return this.m_speed;
    }

    SetTarget(target: Node) {
        this.m_target = target;
    }

    GetBulletOffset() {
        return this.m_bulletOffset;
    }
    GetBody() {
        return this.node;
    }

    SetDefence(defence:any) {
        if (defence != null && defence != undefined) {
            this.m_defence = Number(defence);
        }
    }

    GetDefence() {
        return this.m_defence;
    }

    SetMaxBlood(blood:any) {
        this.m_maxBlood = Number(blood); 
    }
    
    GetMaxBlood() {
        return this.m_maxBlood;
    }

    update(deltaTime: number) {
        const oldeDeltaTime = deltaTime;
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == MONSTER_STATUS.IDLE) {

        } else if (this.m_status == MONSTER_STATUS.RUN || this.m_status == MONSTER_STATUS.HIT || this.m_status == MONSTER_STATUS.ATTACK) {
            let skillInfo = null;
            let skillIndex = null;
            for (let i = 0; i < this.m_skills.length; i++) {
                const item = this.m_skills[i];
                if (item.cd > 0) {
                    item.cd -= deltaTime;
                    if (item.cd < 0) {
                        item.cd = 0;
                        skillInfo = skillConfig.getConfigByID(item.id);
                        skillIndex = i;
                        break;
                    }
                } else {
                    skillInfo = skillConfig.getConfigByID(item.id);
                    skillIndex = i;
                    break;
                }
            }
            if (skillInfo) {
                oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_ROLE_LIST.toString(),(targetList: Node[]) => {
                    if (targetList && targetList.length > 0) {
                        let width1 = 0;
                        if (this.node && this.node.getComponent) {
                            width1 = this.node.getComponent(UITransform)!.width;
                        }
                        let minTarget = -1;
                        let target = null;
                        for (let j = 0; j < targetList.length; j++) {
                            const role = targetList[j];
                            if (role) {
                                let distance = this.GetDistanceX(role, this.node);
                                if (minTarget == -1) {
                                    minTarget = distance;
                                    target = role;
                                } else if (minTarget > distance) {
                                    minTarget = distance;
                                    target = role;
                                }
                            }
                        }
                        if (!target) {
                            target = targetList[0];
                        }
                        const mindistance = skillInfo.distance;
                        let distance = this.GetDistanceX(target, this.node);
                        let width2 = 0;
                        this.m_target = target;
                        if (target && target.getComponent && target.getWorldPosition) {
                            width2 = target.getComponent(UITransform)!.width;
                            if (distance <= ((width1 + width2) / 2 + Number(mindistance))) {
                                //靠近目标，开始攻击
                                this.m_attackValue += deltaTime;
                                if (this.m_attackValue > this.m_attackInterval) {//攻击间隔
                                    this.m_attackValue = 0;
                                    this.SetStatus(MONSTER_STATUS.ATTACK);
                                    this.Attack(skillInfo);
                                    if (skillIndex! < this.m_skills.length && skillInfo.type == SKILL_TYPE.BOSS) {
                                        this.m_skills[skillIndex!].cd = skillInfo.interval;
                                    }
                                }
                            } else {
                                const x = this.node.getWorldPosition().x + this.m_speed * deltaTime * (target.getWorldPosition().x - this.node.getWorldPosition().x > 0 ? 1 : -1); // 向目标移动
                                this.node.setWorldPosition(new Vec3(x, this.node.getWorldPosition().y, this.node.getWorldPosition().z));
                            }
                        }
                    }
                },null);
                /*
                sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, null, (targetList: Node[]) => {
                    if (targetList && targetList.length > 0) {
                        let width1 = 0;
                        if (this.node && this.node.getComponent) {
                            width1 = this.node.getComponent(UITransform).width;
                        }
                        let minTarget = -1;
                        let target = null;
                        for (let j = 0; j < targetList.length; j++) {
                            const role = targetList[j];
                            if (role) {
                                let distance = this.GetDistanceX(role, this.node);
                                if (minTarget == -1) {
                                    minTarget = distance;
                                    target = role;
                                } else if (minTarget > distance) {
                                    minTarget = distance;
                                    target = role;
                                }
                            }
                        }
                        if (!target) {
                            target = targetList[0];
                        }
                        const mindistance = skillInfo.distance;
                        let distance = this.GetDistanceX(target, this.node);
                        let width2 = 0;
                        this.m_target = target;
                        if (target && target.getComponent && target.getWorldPosition) {
                            width2 = target.getComponent(UITransform).width;
                            if (distance <= ((width1 + width2) / 2 + Number(mindistance))) {
                                //靠近目标，开始攻击
                                this.m_attackValue += deltaTime;
                                if (this.m_attackValue > this.m_attackInterval) {//攻击间隔
                                    this.m_attackValue = 0;
                                    this.SetStatus(MONSTER_STATUS.ATTACK);
                                    this.Attack(skillInfo);
                                    if (skillIndex < this.m_skills.length && skillInfo.type == SKILL_TYPE.BOSS) {
                                        this.m_skills[skillIndex].cd = skillInfo.interval;
                                    }
                                }
                            } else {
                                const x = this.node.getWorldPosition().x + this.m_speed * deltaTime * (target.getWorldPosition().x - this.node.getWorldPosition().x > 0 ? 1 : -1); // 向目标移动
                                this.node.setWorldPosition(new Vec3(x, this.node.getWorldPosition().y, this.node.getWorldPosition().z));
                            }
                        }
                    }
                });
            }*/
        } else if (this.m_status == MONSTER_STATUS.BACK) {
            const disX = this.m_backDistance * this.m_backSpeed * deltaTime;
            this.m_backDistance -= disX;
            // console.log("this.m_backDistance:", this.m_backDistance);
            this.node.setWorldPosition(new Vec3(this.node.getWorldPosition().x + disX, this.node.getWorldPosition().y, this.node.getWorldPosition().z));
            if (this.m_backDistance <= 1 && this.m_status != MONSTER_STATUS.DEATH) {
                this.SetStatus(MONSTER_STATUS.RUN);
            }
        }
        if (this.m_info && this.m_info.fly == 1 && this.m_status != MONSTER_STATUS.DEATH) {

        } else {
            //y轴移动不受状态影响
            let y = this.node.getPosition().y;
            const g = 98 * smc.account.AccountModel.getGameRate();
            if (this.m_ySpeed > 0 || this.node.getPosition().y > 0) {
                this.m_ySpeed -= g;
                const disY = this.m_ySpeed * deltaTime - g * deltaTime;
                y = this.node.getPosition().y + disY;
                if (disY < 0 && y < this.m_layerHeight) {
                    y = this.m_layerHeight;
                    if (this.m_jumping) {
                        this.m_jumping = false;
                    }
                }
            }
            if (this.m_status != MONSTER_STATUS.IDLE) {
                oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_GROUND_SPEED.toString(),(speed:any) => {
                    //console.log("222GetGroundSpeed",speed)
                    let addingX = speed;
                    let distance = this.GetDistanceX(this.m_target, this.node);
                    let width2 = 0
                    if (this.m_target && this.m_target.getComponent) {
                        width2 = this.m_target.getComponent(UITransform).width;
                    }
                    const width1 = this.node.getComponent(UITransform)!.width;
                    if (distance <= ((width1 + width2) / 2)) {
                        addingX = 0;
                    }
                    this.node.setPosition(new Vec3(this.node.getPosition().x + addingX * oldeDeltaTime, y, this.node.getPosition().z));
                },null)
                /*
                sendMessage(MESSAGE_DEFINES.GET_GROUND_SPEED, null, (speed) => {
                    let addingX = speed;
                    let distance = this.GetDistanceX(this.m_target, this.node);
                    let width2 = 0
                    if (this.m_target && this.m_target.getComponent) {
                        width2 = this.m_target.getComponent(UITransform).width;
                    }
                    const width1 = this.node.getComponent(UITransform)!.width;
                    if (distance <= ((width1 + width2) / 2)) {
                        addingX = 0;
                    }
                    this.node.setPosition(new Vec3(this.node.getPosition().x + addingX * oldeDeltaTime, y, this.node.getPosition().z));
                });*/
            }
        }
        //判定回退
        if (this.m_status != MONSTER_STATUS.DEATH) {
            if (this.m_up && this.m_layer == 0 && this.m_backInterval == -1) {
                this.m_backInterval = 3;
                this.m_backDistance = this.node.getComponent(UITransform)!.width;
            }
            if (this.m_backInterval > 0) {
                this.m_backInterval -= deltaTime;
                if (this.m_backInterval < 0) {
                    this.m_backInterval = 0;
                }
            } else if (this.m_backInterval == 0) {
                this.m_backInterval = -1;
                if (this.m_up && this.m_up.getComponent(BaseMonster)) {
                    this.m_up.getComponent(BaseMonster).DropDown(this.node.getComponent(UITransform)!.height);
                }
                this.m_up = null;
                this.SetStatus(MONSTER_STATUS.BACK);
            }
        }
        //受击计时
        if (this.m_hitNum > 0) {
            this.m_hitNum -= deltaTime;
            if (this.m_hitNum <= 0) {
                this.m_hitNum = 0;
                this.m_skeleton.color = color(255, 255, 255, 255);
            }
        }
        // //技能冷却
        // if (this.m_status != MONSTER_STATUS.DEATH || this.m_status != MONSTER_STATUS.OVER) {
        //     for (let i = 0; i < this.m_skills.length; i++) {
        //         const item = this.m_skills[i];
        //         if (item.cd > 0) {
        //             item.cd -= deltaTime;
        //             if (item.cd < 0) item.cd = 0;
        //         }
        //     }
        // }
    }
}

    GetDistance(from:any, to:any) {
        if (!from || !to) {
            return 0;
        }
        return Math.sqrt(Math.pow(from.getWorldPosition().x - to.getWorldPosition().x, 2) + Math.pow(from.getWorldPosition().y - to.getWorldPosition().y, 2));
    }


    GetDistanceX(from:any, to:any) {
        if (!from || !to) {
            return 0;
        }
        return Math.abs(from.getWorldPosition().x - to.getWorldPosition().x);
    }

    PlayAnimation(status:any, loop:any, attackAnimation:any) {
        // console.log("PlayAnimation:", status, loop, attackAnimation);
        if (this.m_skeleton) {
            this.m_skeleton.timeScale = this.m_speed * smc.account.AccountModel.getGameRate() / Number(this.m_info.aniSpeed);
            if (status == MONSTER_STATUS.IDLE) {
                this.m_skeleton.setAnimation(0, "run", loop);
            } else if (status == MONSTER_STATUS.RUN) {
                this.m_skeleton.setAnimation(0, "run", loop);
            } else if (status == MONSTER_STATUS.ATTACK) {
                this.m_skeleton.setAnimation(0, attackAnimation, loop);
            } else if (status == MONSTER_STATUS.HIT) {
                if (this.m_hitNum == 0) {
                    this.m_hitNum = 0.2;
                    this.m_skeleton.color = color(255, 0, 0, 255);
                }
            } else if (status == MONSTER_STATUS.DEATH) {
                this.m_skeleton.timeScale = 2 * smc.account.AccountModel.getGameRate();
                this.m_skeleton.setAnimation(0, "dead", loop);
            } else if (status == MONSTER_STATUS.OVER) {
                this.m_skeleton.clearAnimations();
            }
        }
    }

    SetStatus(status:any) {
        if (!this.IsAlive()) {
            return;
        }
        if (status == MONSTER_STATUS.BACK && this.m_type != MONSTER_TYPE.NORMAL) {//boss默认有霸体
            return;
        }
        this.m_status = status;
        if (this.m_skeleton) {
            let loop = null;
            if (this.m_status == MONSTER_STATUS.IDLE) {
                loop = true;
            } else if (this.m_status == MONSTER_STATUS.RUN) {
                loop = true;
            } else if (this.m_status == MONSTER_STATUS.DEATH) {
                loop = false;
            } else if (this.m_status == MONSTER_STATUS.HIT) {
                loop = false;
            } else if (this.m_status == MONSTER_STATUS.OVER) {
                loop = false;
                if (this.m_hitId) {
                    clearInterval(this.m_hitId);
                    this.m_hitId = null;
                }
            }
            if (loop != null) {
                this.PlayAnimation(this.m_status, loop, null);
            }
        }
        // console.log("SetStatus:", this.m_status);
    }

    SetPos(pos:any) {
        this.m_pos = pos;
    }

    GetPos() {
        return this.m_pos;
    }

    setPosBg(posBg:any) {
        this.m_posBg = posBg;
    }

    getPosBg() {
        return this.m_posBg;
    }

    GetType() {
        return this.m_type;
    }

    ShowHit(attack:any, repel:any, type = DAMAGE_TYPE.NORMAL) {
        if (!this.IsAlive()) {
            return;
        }
        if (attack <= 0) {
            return;
        }
        let damage = attack - this.m_defence;
        if (damage <= 0) {
            damage = 1;
            this.ShowDamage(damage, type);
            return;
        }
        // console.log(this.m_id, "怪物受伤:", damage, "/", this.m_blood, "/", this.m_maxBlood);
        this.ShowDamage(damage, type);
        this.m_blood -= damage;
        if (this.m_blood <= this.m_maxBlood) {
            this.ShowBlood(this.m_blood / this.m_maxBlood);
        }
        if (this.m_blood <= 0) {
            this.m_blood = 0;
            this.Dead();
            return;
        }
        if (repel) {
            this.m_backDistance = this.node.getComponent(UITransform)!.width;
            this.SetStatus(MONSTER_STATUS.BACK);
        } else {
            this.SetStatus(MONSTER_STATUS.HIT);
        }
        if (this.m_hitEffect) {
            if (false == this.m_hitEffect.active) {
                this.m_hitEffect.active = true;
                const animation = this.m_hitEffect.getComponent(Animation);
                if (animation) {
                    animation.play();
                }
                this.m_hitId = setInterval(() => {
                    if (this.m_hitEffect) {
                        this.m_hitEffect.active = false;
                    }
                }, 500 / smc.account.AccountModel.getGameRate());
            }
        }
    }

    Attack(skillInfo:any) {
        if (this.m_status == MONSTER_STATUS.DEATH || this.m_status == MONSTER_STATUS.OVER) {
            return;
        }
        // 攻击
        if (skillInfo.type == SKILL_TYPE.BOSS) {
            this.UseSkill(skillInfo); // 使用技能
            this.PlayAnimation(MONSTER_STATUS.ATTACK, false, skillInfo.attackAnimation);
        } else {
            this.PlayAnimation(MONSTER_STATUS.ATTACK, false, skillInfo.attackAnimation);
            const id = setTimeout(() => {
                oops.message.dispatchEvent(MESSAGE_DEFINES.MONSTER_ATTACK.toString(), { attack: this.m_attack, from: this, target: this.m_target, skill: skillInfo })
                //postMessage(MESSAGE_DEFINES.MONSTER_ATTACK, { attack: this.m_attack, from: this, target: this.m_target, skill: skillInfo }); // 发送攻击消息
                //playSoundByName("monster_attack");
            }, 700 / smc.account.AccountModel.getGameRate());
            this.m_attackIds.push(id);
        }
    }

    ShowBlood(rate:any) {
        this.m_bloodProgressBar.node.active = true;
        this.m_bloodProgressBar.progress = rate;
    }

    ShowDamage(damage:any, type = DAMAGE_TYPE.NORMAL) {
        //postMessage(MESSAGE_DEFINES.GAME_SHOW_DAMAGE, { from: this.node, damage, type });
        oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SHOW_DAMAGE.toString(), [{ from: this.node, damage, type }])
    }

    Jump(speed:any) {
        // 跳跃
        console.log("Jupm:", speed);
        this.m_ySpeed = speed / smc.account.AccountModel.getGameRate();
        this.m_jumping = true;
    }

    IsJump() {
        return this.m_jumping;
    }

    IsBack() {
        return this.m_status == MONSTER_STATUS.BACK; // 是否后退
    }

    IsAttack() {
        return this.m_status == MONSTER_STATUS.ATTACK; // 是否攻击
    }

    SetLayer(layer:any) {
        this.m_layer = layer;
    }

    GetLayer() {
        return this.m_layer;
    }

    SetLayerHeight(height:any) {
        this.m_layerHeight = height;
    }

    GetLayerHeight() {
        return this.m_layerHeight;
    }

    SetUp(up:any) {
        this.m_up = up;
    }

    GetUp() {
        return this.m_up;
    }

    DropDown(height:any) {
        if (this.m_layer > 0) {
            this.m_layer -= 1;
            this.m_layerHeight -= height;
        }
        if (this.m_up && this.m_up.getComponent(BaseMonster)) {
            this.m_up.getComponent(BaseMonster).DropDown(height);
        }
    }

    Dead() {
        if (this.m_status != MONSTER_STATUS.DEATH) {
            this.SetStatus(MONSTER_STATUS.DEATH);
            if (this.m_layer > 0) {
                this.m_layer = 1;
                this.m_layerHeight = 0;
            }
            if (this.m_up && this.m_up.getComponent(BaseMonster)) {
                this.m_up.getComponent(BaseMonster).DropDown(this.node.getComponent(UITransform)!.height);
            }
            oops.message.dispatchEvent(MESSAGE_DEFINES.MONSTER_DEAD.toString(), this.node)
            //postMessage(MESSAGE_DEFINES.MONSTER_DEAD, this.node);
            if (this.m_type == MONSTER_TYPE.ELITE) {
                oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_ELITE_DEAD.toString(), this.node)
                //postMessage(MESSAGE_DEFINES.GAME_ELITE_DEAD, this.node);
            } else if (this.m_type == MONSTER_TYPE.BOSS) {
                oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_BOSS_DEAD.toString(), this.node)
                oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SUCCESS.toString(), this.node)
                //postMessage(MESSAGE_DEFINES.GAME_BOSS_DEAD, this.node);
                //postMessage(MESSAGE_DEFINES.GAME_SUCCESS, this.node);
            }
        }
    }

    IsAlive() {
        return this.m_status != MONSTER_STATUS.DEATH && this.m_status != MONSTER_STATUS.OVER;
    }

    GameOver() {
        this.SetStatus(MONSTER_STATUS.OVER);
    }

    GetDeadInterval() {
        return this.m_deadInterval;
    }

    UseSkill(skillInfo:any) {//由子类重写
        const id = setTimeout(() => {
            oops.message.dispatchEvent(MESSAGE_DEFINES.MONSTER_ATTACK.toString(), { attack: this.m_attack, from: this, target: this.m_target, skill: skillInfo })
            //postMessage(MESSAGE_DEFINES.MONSTER_ATTACK, { attack: this.m_attack, from: this, target: this.m_target, skill: skillInfo }); // 发送攻击消息
            //playSoundByName("monster_attack");
        }, 1000 / smc.account.AccountModel.getGameRate());
        this.m_attackIds.push(id);
    }

    GetAttackableRoles(skillInfo:any, targetList:any[]) {
        console.log("GetAttackableRoles",targetList);
        if (targetList.length == 0) {
            return [];
        }
        if (targetList.length == 1) {
            return targetList[1];
        }
        const roleList = [];
        targetList = targetList.sort((a:any, b:any) => {
            let distanceA = Math.sqrt(Math.pow(a.getWorldPosition().x - this.node.getWorldPosition().x, 2) + Math.pow(a.getWorldPosition().y - this.node.getWorldPosition().y, 2));
            let distanceB = Math.sqrt(Math.pow(b.getWorldPosition().x - this.node.getWorldPosition().x, 2) + Math.pow(b.getWorldPosition().y - this.node.getWorldPosition().y, 2));
            return distanceA - distanceB;
        });
        for (let j = 0; j < targetList.length; j++) {
            const role = targetList[j];
            if (role) {
                if (roleList.length < Number(skillInfo.maxHit)) {
                    roleList.push(role);
                }
            }
        }
        return roleList;
    }

    GetSelfHeight() {
        return (0.5 - this.node.getComponent(UITransform)!.anchorPoint.y) * this.node.getComponent(UITransform)!.height / 2;
    }

    ShowDebuff(debuffId:any, attack:any) {
        let oldDebuff = null;
        for (let i = 0; i < this.m_debuffList.length; i++) {
            const item = this.m_debuffList[i];
            if (item.id == debuffId) {
                oldDebuff = item;
                break;
            }
        }
        if (oldDebuff) {//如果存在相同buff，cd重置，伤害高的覆盖伤害低的
            const debuff = debuffConfig.getConfigByID(oldDebuff.id);
            if (oldDebuff.attack < attack) {
                oldDebuff.attack = attack;
            }
            let debuffScript = oldDebuff.node.getComponent(BaseDebuff);
            if (debuffScript) {
                debuffScript.SetInfo(debuff);
                if (oldDebuff.attack < attack) {
                    debuffScript.SetAttack(attack);
                }
                debuffScript.SetCD(debuff.cd);
            }
        } else {
            const debuff = debuffConfig.getConfigByID(debuffId);
            if (debuff) {
                if (debuff.res) {
                    oops.res.load(debuff.res, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        const node = instantiate(prefab);
                        if (node) {
                            node.active = true;
                            node.setParent(this.node);
                            node.setPosition(new Vec3(0, this.GetSelfHeight(), 0));
                            let debuffScript = node.getComponent(BaseDebuff);
                            if (!debuffScript) {
                                debuffScript = node.addComponent(BaseDebuff);
                            }
                            if (debuffScript) {
                                debuffScript.SetInfo(debuff);
                                debuffScript.SetCD(debuff.cd);
                                debuffScript.SetParent(this.node, NODE_TYPE.MONSTER);
                                debuffScript.SetAttack(attack);
                                debuffScript.SetDestroyCallback(() => {
                                    for (let i = 0; i < this.m_debuffList.length; i++) {
                                        const item = this.m_debuffList[i];
                                        if (item.id == debuffId) {
                                            this.m_debuffList.splice(i, 1);
                                            break;
                                        }
                                    }
                                });
                                debuffScript.StartDebuff();
                            }
                        }
                        const debuffInfo = { id: debuffId, node: node, attack: attack };
                        this.m_debuffList.push(debuffInfo);
                    });
                    /*
                    resources.load(debuff.res, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        const node = instantiate(prefab);
                        if (node) {
                            node.active = true;
                            node.setParent(this.node);
                            node.setPosition(new Vec3(0, this.GetSelfHeight(), 0));
                            let debuffScript = node.getComponent(BaseDebuff);
                            if (!debuffScript) {
                                debuffScript = node.addComponent(BaseDebuff);
                            }
                            if (debuffScript) {
                                debuffScript.SetInfo(debuff);
                                debuffScript.SetCD(debuff.cd);
                                debuffScript.SetParent(this.node, NODE_TYPE.MONSTER);
                                debuffScript.SetAttack(attack);
                                debuffScript.SetDestroyCallback(() => {
                                    for (let i = 0; i < this.m_debuffList.length; i++) {
                                        const item = this.m_debuffList[i];
                                        if (item.id == debuffId) {
                                            this.m_debuffList.splice(i, 1);
                                            break;
                                        }
                                    }
                                });
                                debuffScript.StartDebuff();
                            }
                        }
                        const debuffInfo = { id: debuffId, node: node, attack: attack };
                        this.m_debuffList.push(debuffInfo);
                    });*/

                }
            }
        }
    }

    SetBuff(buff:any, value = null) {

    }

    OnGameRateChange() {
        this.SetStatus(this.m_status);
    }

    protected onDisable(): void {
        if (this.m_hitId) {
            clearInterval(this.m_hitId);
            this.m_hitId = null;
        }
        if (this.m_attackIds && this.m_attackIds.length > 0) {
            for (let i = 0; i < this.m_attackIds.length; i++) {
                clearInterval(this.m_attackIds[i]);
            }
            this.m_attackIds = [];
        }
        if (this.m_debuffList && this.m_debuffList.length > 0) {
            for (let i = 0; i < this.m_debuffList.length; i++) {
                const item = this.m_debuffList[i];
                if (item.node) {
                    item.node.removeFromParent();
                }
            }
            this.m_debuffList = [];
        }
    }

    RemoveSelf() {
        this.onDisable();
    }

    Reset() {
        this.m_id = 0; // 怪物id
        this.m_target = null;
        this.m_type = 0; // 怪物类型
        this.m_attack = 10; // 攻击力
        this.m_blood = 100; // 血量
        this.m_maxBlood = 100; // 最大血量
        this.m_defence = 0; //防御力
        this.m_speed = 100;
        this.m_backgroundSpeed = 0; //背景速度

        this.m_status = MONSTER_STATUS.IDLE; // 0: 待机，1: 移动，2: 攻击，3: 受击，4: 击退， 5: 死亡 6: 结束
        this.m_pos = null; //所在路线
        this.m_posBg = null;//路线背景，用于放阴影、背景图层之类
        this.m_hitNum = 0; // 受击掉血值后播放动画
        this.m_hitId = null;//受击动画id
        this.m_attackIds = [];//攻击动画id
        this.m_attackValue = 0; // 攻击蓄力
        this.m_attackInterval = 1; // 攻击间隔
        this.m_bulletOffset = { x: 0, y: 0 };//子弹偏移
        this.m_ySpeed = 0; // y轴速度
        this.m_layer = 0; //层次
        this.m_layerHeight = 0; //层高
        this.m_up = null;
        this.m_jumping = false; //是否在跳跃
        this.m_backInterval = -1; // 回退间隔
        this.m_backDistance = 0; // 回退距离
        this.m_backSpeed = 3; // 回退速度
        this.m_deadInterval = 1; // 死亡动画时间
        this.m_skills = []; //技能
        this.m_debuffList = []; // debuff列表
    }
}


