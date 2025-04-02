import { _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet35')
export class Bullet35 extends BaseBullet {
    m_currentSpeed = 35;
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
                const x = myWorldPosX;
                const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_currentSpeed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
                this.node.setWorldPosition(x, y, 0); // 设置子弹位置
                if (this.m_currentSpeed >= this.m_speed) {
                    this.m_currentSpeed == this.m_speed
                } else {
                    this.m_currentSpeed = Math.pow(this.m_currentSpeed, 1.01);
                }
            }
            if (this.m_target) {
                const targetWorldPosY = this.m_target.getWorldPosition().y;
                if (myWorldPosY < targetWorldPosY) {
                    oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: this.m_target, attack: this.m_attack })
                    //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack });// 子弹击中目标
                    this.m_status = 2;
                    this.ClearTimeoutId();
                    this.removeSelf();
                    this.m_target = null;
                }
            }
        }
    }
    StartMove() {/*
        sendMessage(MESSAGE_DEFINES.GAME_GET_SKILL_POS, null, (skillPos) => {
            const from = skillPos.getChildByName("skill10From");
            const to = skillPos.getChildByName("skill10To");
            if (from && to) {
                const screenwith = view.getVisibleSize().width;
                const myWorldPosX = screenwith / 2;
                const myWorldPosY = from.getWorldPosition().y;
                this.node.setWorldPosition(myWorldPosX, myWorldPosY, 0);
                this.SetTarget(to);
                super.StartMove();
                this.SetEuler();
                const targetWorldPosX = this.m_target.getWorldPosition().x;
                const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
                this.m_lastDisX = targetWorldPosX - myWorldPosX;
                this.m_lastDisY = targetWorldPosY - myWorldPosY;
            }
        });*/
        //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_SKILL_POS.toString(),(skillPos:any) => {
            const from = skillPos.getChildByName("skill10From");
            const to = skillPos.getChildByName("skill10To");
            if (from && to) {
                const screenwith = view.getVisibleSize().width;
                const myWorldPosX = screenwith / 2;
                const myWorldPosY = from.getWorldPosition().y;
                this.node.setWorldPosition(myWorldPosX, myWorldPosY, 0);
                this.SetTarget(to);
                super.StartMove();
                this.SetEuler();
                const targetWorldPosX = this.m_target.getWorldPosition().x;
                const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
                this.m_lastDisX = targetWorldPosX - myWorldPosX;
                this.m_lastDisY = targetWorldPosY - myWorldPosY;
            }
        },null);
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }

    Reset() {
        super.Reset();
        this.m_currentSpeed = 35;
    }
}


