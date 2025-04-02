import { UITransform, _decorator } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet7')
export class Bullet7 extends BaseBullet {
    m_startPos = null;
    m_endPos = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == 1) {
            const myWorldPosX = this.node.getWorldPosition().x;
            const myWorldPosY = this.node.getWorldPosition().y;
            if (this.m_lastDisX != 0 || this.m_lastDisY != 0) {
                const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
                const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
                const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
                this.node.setWorldPosition(x, y, 0); // 设置子弹位置
            }
            if (this.m_target) {
                const targetWorldPosY = this.m_target.getWorldPosition().y;
                if (myWorldPosY < targetWorldPosY) {
                    this.m_status = 2;
                    oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),{ from: this.node, to: this.m_target, attack: this.m_attack })
                    //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack });// 子弹击中目标
                    this.ClearTimeoutId();
                    this.removeSelf();
                    return;
                }
            }
        }
    }
    StartMove() {
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_SKILL_POS.toString(),(skillPos:any) => {
            const from = skillPos.getChildByName("skill7From");
            const to = skillPos.getChildByName("skill7To");
            if (from && to) {
                this.node.setWorldPosition(from.getWorldPosition());
                this.SetTarget(to);
                super.StartMove();
                this.SetEuler();
                const targetWorldPosX = this.m_target.getWorldPosition().x;
                const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
                const myWorldPosX = from.getWorldPosition().x;
                const myWorldPosY = from.getWorldPosition().y;
                this.m_lastDisX = targetWorldPosX - myWorldPosX;
                this.m_lastDisY = targetWorldPosY - myWorldPosY;
            }
        },null);
        /*
        sendMessage(MESSAGE_DEFINES.GAME_GET_SKILL_POS, null, (skillPos) => {
            const from = skillPos.getChildByName("skill7From");
            const to = skillPos.getChildByName("skill7To");
            if (from && to) {
                this.node.setWorldPosition(from.getWorldPosition());
                this.SetTarget(to);
                super.StartMove();
                this.SetEuler();
                const targetWorldPosX = this.m_target.getWorldPosition().x;
                const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
                const myWorldPosX = from.getWorldPosition().x;
                const myWorldPosY = from.getWorldPosition().y;
                this.m_lastDisX = targetWorldPosX - myWorldPosX;
                this.m_lastDisY = targetWorldPosY - myWorldPosY;
            }
        });*/
    }
}


