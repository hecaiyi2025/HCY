import { _decorator, sp, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet37')
export class Bullet37 extends BaseBullet {
    m_timerId:any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == 1) {
            const targetWorldPosX = this.m_target.getWorldPosition().x;
            const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
            this.node.setWorldPosition(targetWorldPosX, targetWorldPosY, 0); // 设置子弹位置
        }
    }

    StartMove() {
        this.m_status = 1;
        const targetWorldPosX = this.m_target.getWorldPosition().x;
        const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
        this.node.setWorldPosition(targetWorldPosX, targetWorldPosY, 0); // 设置子弹位置
        this.m_timerId = setTimeout(() => { // 延迟1秒后执行
            oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: this.m_target, attack: this.m_attack })
            //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack });// 子弹击中目标
            this.ClearTimeoutId();
            this.removeSelf();
        }, 250 / smc.account.AccountModel.getGameRate());
        this.ClearTimeoutId();
        this.m_liveId = setTimeout(() => {
            this.m_status = 2;
            this.removeSelf();
        }, this.m_maxLive * 1000); // 子弹存活时间
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }
}


