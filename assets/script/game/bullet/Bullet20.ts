import { UITransform, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';

import { MoveTo } from '../common/MoveTo';
import { ScaleTo } from '../common/ScaleTo';
const { ccclass, property } = _decorator;

@ccclass('Bullet20')
export class Bullet20 extends BaseBullet {

    m_moving = true;
    m_attackTime = 0;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (this.m_status == 1) {
            const myWorldPosX = this.node.getWorldPosition().x;
            const myWorldPosY = this.node.getWorldPosition().y;
            if (this.m_moving) {
                if (this.m_target) {
                    const targetWorldPosX = this.m_target.getWorldPosition().x;
                    const targetWorldPosY = this.m_target.getWorldPosition().y + this.m_target.getComponent(UITransform).height / 2;
                    if (this.CheckTargetAlive()) {
                        this.m_lastDisX = targetWorldPosX - myWorldPosX;
                        this.m_lastDisY = targetWorldPosY - myWorldPosY;
                        const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
                        const width = this.node.getComponent(UITransform)!.width;
                        if (distance <= width) {
                            this.m_target = null;
                        } else {
                            const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
                            const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
                            this.node.setWorldPosition(x, y, 0); // 设置子弹位置
                        }
                    } else {
                        this.m_target = null;
                    }
                } else {
                    if (this.m_lastDisX != 0 || this.m_lastDisY != 0) {
                        const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
                        const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
                        const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
                        this.node.setWorldPosition(x, y, 0); // 设置子弹位置
                    }
                    if (this.m_targetParent) {
                        const targetWorldPosY = this.m_targetParent.getWorldPosition().y;
                        const height = this.node.getComponent(UITransform)!.height;
                        if (myWorldPosY < (targetWorldPosY + height / 2)) {
                            this.m_moving = false;
                        }
                    }
                }
            }

            this.m_attackTime += deltaTime;
            if (this.m_attackTime >= this.m_attackInterval) {
                this.m_attackTime = 0;
                //造成伤害
                let code = null;
                if (this.m_camp == PVP_TEAM_CAMP.NONE) {//非PVP
                    code = MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET;
                } else {
                    code = MESSAGE_DEFINES.PVP_MULTI_TARGET;
                }
                if (code) {/*
                    sendMessage(code, { target: this.node, range: this.m_info.range, max: this.m_info.maxHit }, (list) => {
                        if (list && list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                const monster = list[i];
                                if (this.CheckTargetAlive(monster)) {
                                    postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                                }
                            }
                        }
                    });
                    */
                   //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                   oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                    if (list && list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            const monster = list[i];
                            if (this.CheckTargetAlive(monster)) {
                                //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                                oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                            }
                        }
                    }
                },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });
                }
            }
        }
    }

    StartMove() {
        if (this.m_fromType == NODE_TYPE.ROLE) {
            const roleScript = this.m_from.getComponent(BaseRole);
            const info = roleScript.GetInfo();
            const type = roleScript.GetType();
            let interval = null;
            if (type == ROLE_TYPE.MAIN) {
                interval = Number(info.interval);
            } else if (type == ROLE_TYPE.FRIEND) {
                interval = Number(info.friendInfo.interval);
            }
            if (interval && interval > 1) {
                this.m_maxLive = interval / smc.account.AccountModel.getGameRate();
            }
            console.log("this.m_maxLive:", this.m_maxLive);
        }

        this.m_status = 1;
        this.SetEuler();
        const targetWorldPosX = this.m_target.getWorldPosition().x;
        const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
        const myWorldPosX = this.node.getWorldPosition().x;
        const myWorldPosY = this.node.getWorldPosition().y;
        this.m_lastDisX = targetWorldPosX - myWorldPosX;
        this.m_lastDisY = targetWorldPosY - myWorldPosY;

        this.ClearTimeoutId();
        this.m_liveId = setTimeout(() => {
            this.m_status = 2;
            this.removeSelf();
        }, this.m_maxLive * 1000); // 子弹存活时间
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }

    protected onDisable(): void {
        if (this.m_liveId) {
            clearTimeout(this.m_liveId);
            this.m_liveId = null;
        }
        this.m_moving = true;
        this.m_attackTime = 0;
    }

    Reset() {
        super.Reset();
        this.m_moving = true;
        this.m_attackTime = 0;
    }
}


