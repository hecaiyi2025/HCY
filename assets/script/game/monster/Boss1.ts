import { Vec3, _decorator, sp } from 'cc';
import { BaseMonster } from '../battle/BaseMonster';
import { GAME_TYPE, MESSAGE_DEFINES, MONSTER_STATUS } from '../common/global';
//import { postMessage } from '../../public/publicFunctions';
//import { globalData } from '../../data/globalData';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
const { ccclass, property } = _decorator;

@ccclass('Boss1')
export class Boss1 extends BaseMonster {
    @property(sp.Skeleton)
    m_bomb: sp.Skeleton|any = null;

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

    UseSkill(skillInfo:any) {
        this.m_speed = 600;
        setTimeout(() => {
            this.m_speed = 100;
            oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SCREEN_SHAKE.toString(), 0)
            //postMessage(MESSAGE_DEFINES.GAME_SCREEN_SHAKE, 0);
            this.m_bomb.node.active = true;
            this.m_bomb.setAnimation(0, "play", false);
            oops.message.dispatchEvent(MESSAGE_DEFINES.MONSTER_ATTACK.toString(), { attack: this.m_attack, from: this, target: this.m_target, skill: skillInfo })
            //postMessage(MESSAGE_DEFINES.MONSTER_ATTACK, { attack: this.m_attack, from: this, target: this.m_target, skill: skillInfo }); // 发送攻击消息
        }, 900 / smc.account.AccountModel.getGameRate());
        this.m_ySpeed = 2600;
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
                oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SHOW_DROP.toString(), { id: 1, num, fromPos: pos })
                //postMessage(MESSAGE_DEFINES.GAME_SHOW_DROP, { id: 1, num, fromPos: pos });
            }
        }
        oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_BOSS_ALL_DAMAGE.toString(),this.m_allDamage)
        //postMessage(MESSAGE_DEFINES.GAME_BOSS_ALL_DAMAGE, this.m_allDamage);
    }

    PlayAnimation(status:any, loop:any, attackAnimation:any) {
        // if (status != MONSTER_STATUS.ATTACK) {
        super.PlayAnimation(status, loop, attackAnimation);
        // }
        // if (this.m_skeleton) {
        //     this.m_skeleton.timeScale = globalData.getGameRate();
        //     this.m_skeleton.setAnimation(0, attackAnimation, false);
        // }
    }
}


