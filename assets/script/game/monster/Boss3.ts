import { ParticleSystem2D, Vec3, _decorator, sp } from 'cc';
import { BaseMonster } from '../battle/BaseMonster';
import { GAME_TYPE, MESSAGE_DEFINES, MONSTER_STATUS } from '../common/global';
//import { playSoundByName, postMessage, sendMessage } from '../../public/publicFunctions';
//import { globalData } from '../../data/globalData';
import { skillConfig } from '../common/config/skill';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
const { ccclass, property } = _decorator;

@ccclass('Boss3')
export class Boss3 extends BaseMonster {
    @property(sp.Skeleton)
    m_bomb: sp.Skeleton|any = null;

    m_timeOutId :any = null;
    m_intervalId :any= null;
    m_bossDrop = 1; // 1点伤害掉落1枚铜币
    m_damage = 0;
    m_allDamage = 0;
    start() {
        super.start();
        this.m_deadInterval = 3000;
        // setInterval(() => {
        //     // this.ShowHit();
        //     this.Jump(500);
        // }, 3000);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    SetInfo(info:any) {
        super.SetInfo(info);
        const skills = JSON.parse(info.skill);
        if (skills.length > 0) {
            this.m_skills = [];
            for (let i = 0; i < skills.length; i++) {
                const skillInfo = skillConfig.getConfigByID(Number(skills[i]));
                this.m_skills.push({ id: Number(skills[i]), cd: Number(skillInfo.interval) });
            }
            this.m_skills = this.m_skills.sort((a, b) => {//优先主动技能
                const skillInfoA = skillConfig.getConfigByID(a.id);
                const skillInfoB = skillConfig.getConfigByID(b.id);
                return skillInfoB.type - skillInfoA.type;
            });
        }
    }

    GetAttackableRoles(skillInfo:any, targetList:any) {
        if (targetList.length == 0) {
            return [];
        }
        const roleList = [];
        const indexes = [];
        for (let i = 0; i < targetList.length; i++) {
            indexes.push(i);
        }
        const maxHit = Number(skillInfo.maxHit);
        for (let i = 0; i < maxHit; i++) {
            if (indexes.length == 0) {
                break;
            }
            let rand = Math.floor(Math.random() * indexes.length);
            if (indexes[rand] == undefined || indexes[rand] == null) {
                rand = 0;
            }
            roleList.push(targetList[indexes[rand]]);
            indexes.splice(rand, 1);
        }
        return roleList;
    }

    UseSkill(skillInfo:any) {
        if (skillInfo.id == 6017) {
            this.m_timeOutId = setTimeout(() => {
                this.m_timeOutId = null;
                oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_ROLE_LIST.toString(), (targetList: Node[]) => {
                    let roleList = this.GetAttackableRoles(skillInfo, targetList);
                    if (roleList && roleList.length > 0) {
                        if (roleList.length > Number(skillInfo.maxHit)) {
                            roleList.splice(Number(skillInfo.maxHit), roleList.length - Number(skillInfo.maxHit));
                        }
                        const num = Math.floor(Number(skillInfo.bullet) / roleList.length);
                        let index = num;
                        if (index > 5) index = 5;
                        this.m_intervalId = setInterval(() => {
                            index--;
                            for (let i = 0; i < roleList.length; i++) {
                                const role = roleList[i];
                                oops.message.dispatchEvent(MESSAGE_DEFINES.MONSTER_ATTACK.toString(),  { attack: this.m_attack, from: this, target: role, skill: skillInfo })
                                //postMessage(MESSAGE_DEFINES.MONSTER_ATTACK, { attack: this.m_attack, from: this, target: role, skill: skillInfo }); // 发送攻击消息
                            }
                            if (index <= 0) {
                                clearInterval(this.m_intervalId);
                                this.m_intervalId = null;
                            }
                        }, 200 / smc.account.AccountModel.getGameRate());

                    }
                },null)
                /*
                sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, null, (targetList: Node[]) => {
                    let roleList = this.GetAttackableRoles(skillInfo, targetList);
                    if (roleList && roleList.length > 0) {
                        if (roleList.length > Number(skillInfo.maxHit)) {
                            roleList.splice(Number(skillInfo.maxHit), roleList.length - Number(skillInfo.maxHit));
                        }
                        const num = Math.floor(Number(skillInfo.bullet) / roleList.length);
                        let index = num;
                        if (index > 5) index = 5;
                        this.m_intervalId = setInterval(() => {
                            index--;
                            for (let i = 0; i < roleList.length; i++) {
                                const role = roleList[i];
                                postMessage(MESSAGE_DEFINES.MONSTER_ATTACK, { attack: this.m_attack, from: this, target: role, skill: skillInfo }); // 发送攻击消息
                            }
                            if (index <= 0) {
                                clearInterval(this.m_intervalId);
                                this.m_intervalId = null;
                            }
                        }, 200 / globalData.getGameRate());

                    }
                });*/
            }, 1500 / smc.account.AccountModel.getGameRate());
        } else if (skillInfo.id == 6018) {
            for (let i = 0; i < 5; i++) {
                oops.message.dispatchEvent(MESSAGE_DEFINES.SKILL_ADD_MONSTER.toString(),  16045)
                //postMessage(MESSAGE_DEFINES.SKILL_ADD_MONSTER, 16045);
            }
        }
    }

    ShowDamage(damage:any) {
        super.ShowDamage(damage);
        this.m_allDamage += damage; // 总伤害
        this.m_damage += damage;
        if (smc.account.AccountModel.getGameType() == GAME_TYPE.BOSS) {
            if (this.m_damage >= this.m_bossDrop) {
                const num = Math.floor(this.m_damage / this.m_bossDrop);
                this.m_damage = this.m_damage % this.m_bossDrop;
                const pos = new Vec3(this.node.getWorldPosition().x, this.node.getWorldPosition().y + this.GetSelfHeight(), 0);
                oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SHOW_DROP.toString(),  { id: 1, num, fromPos: pos })
                //postMessage(MESSAGE_DEFINES.GAME_SHOW_DROP, { id: 1, num, fromPos: pos });
            }
        }
        oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_BOSS_ALL_DAMAGE.toString(),this.m_allDamage)
       // postMessage(MESSAGE_DEFINES.GAME_BOSS_ALL_DAMAGE, this.m_allDamage);
    }

    GetSelfHeight() {
        return 0;
    }

    protected onDisable(): void {
        super.onDisable();
        if (this.m_timeOutId) {
            clearTimeout(this.m_timeOutId);
            this.m_timeOutId = null;
        }
        if (this.m_intervalId) {
            clearInterval(this.m_intervalId);
            this.m_intervalId = null;
        }
    }
}


