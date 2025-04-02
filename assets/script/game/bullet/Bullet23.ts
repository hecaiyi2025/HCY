import { UITransform, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet23')
export class Bullet23 extends BaseBullet {
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
                    this.m_lastDisY = targetWorldPosY - myWorldPosY;
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
                        const targetWorldPosY = this.m_targetParent.getWorldPosition().y;
                        // console.log("myWorldPosY:", myWorldPosY, "|targetWorldPosY:", targetWorldPosY);
                        if (myWorldPosY < targetWorldPosY) {
                            // console.log("destroy bullet");
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
}


