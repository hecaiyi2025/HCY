import { UITransform, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';

import { BaseMonster } from '../battle/BaseMonster';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet13')
export class Bullet13 extends BaseBullet {

    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (this.m_status == 1) {

            const myWorldPosX = this.node.getWorldPosition().x;
            const myWorldPosY = this.node.getWorldPosition().y;
            let screenWidth = view.getVisibleSize().width;
            let screenHeight = view.getVisibleSize().height;
            if (myWorldPosX < 0 || myWorldPosY < 0 || myWorldPosX > screenWidth || myWorldPosY > screenHeight) {
                this.m_status = 2;
                this.ClearTimeoutId();
                this.removeSelf();
                return;
            }
            if (this.m_target) {
                const targetWorldPosX = this.m_target.getWorldPosition().x;
                const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
                if (this.CheckTargetAlive()) {
                    this.SetEuler(); // 设置子弹角度
                    this.m_lastDisX = targetWorldPosX - myWorldPosX;
                    this.m_lastDisY = targetWorldPosY - this.GetTargetHeight() * 4 - myWorldPosY;
                    const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
                    const width = this.node.getComponent(UITransform)!.width;
                    if (distance <= width) {
                        this.m_status = 2;
                        oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: this.m_target, attack: this.m_attack })
                        //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack });// 子弹击中目标
                        this.ClearTimeoutId();
                        this.removeSelf();
                        return;
                    } else {
                        const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
                        const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
                        this.node.setWorldPosition(x, y, 0); // 设置子弹位置
                    }
                } else {
                    if (this.m_lastDisX != 0 || this.m_lastDisY != 0) {
                        const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
                        const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
                        const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
                        this.node.setWorldPosition(x, y, 0); // 设置子弹位置
                    }
                    if (this.m_targetParent) {
                        const targetWorldPosY = this.m_targetParent.getWorldPosition().y + this.node.getComponent(UITransform)!.height / 2;
                        if (myWorldPosY < targetWorldPosY) {
                            this.m_status = 2;
                            oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: this.m_target, attack: this.m_attack })
                            //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack });// 子弹击中目标
                            this.ClearTimeoutId();
                            this.removeSelf();
                            return;
                        }
                    }
                }
            } else {
                this.m_status = 2;
                this.ClearTimeoutId();
                this.removeSelf();// 子弹消失
                return
            }
        }
    }

    SetEuler() {
        let euler = this.node.eulerAngles.z;
        if (this.m_target) {
            euler = getAngle(this.node.getWorldPosition(), this.m_target.getWorldPosition(), 0, -this.GetTargetHeight() * 4);// 设置子弹角度
        }
        this.node.setRotationFromEuler(0, 0, euler); // 设置子弹角度
    }

}


