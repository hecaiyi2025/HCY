import { UITransform, Vec3, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';

const { ccclass, property } = _decorator;

@ccclass('Bullet21')
export class Bullet21 extends BaseBullet {

    m_timerId:any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (this.m_status == 1) {
            if (this.m_target) {
                const targetWorldPosX = this.m_target.getWorldPosition().x;
                const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
                this.node.setWorldPosition(targetWorldPosX, targetWorldPosY, 0); // 设置子弹位置
            }
        }
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }

    StartMove() {
        super.StartMove();
        if (this.m_timerId) {
            clearTimeout(this.m_timerId);
            this.m_timerId = null;
        }
        this.m_timerId = setTimeout(() => {
            this.m_status = 2;
            oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),{ from: this.node, to: this.m_target, attack: this.m_attack })
            //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack });// 子弹击中目标
            this.ClearTimeoutId();
            this.removeSelf();
        }, 500 / smc.account.AccountModel.getGameRate());
    }

    protected onDisable(): void {
        super.onDisable();
        if (this.m_timerId) {
            clearTimeout(this.m_timerId);
            this.m_timerId = null;
        }
    }
}


