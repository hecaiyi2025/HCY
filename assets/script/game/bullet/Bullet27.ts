import { UITransform, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet27')
export class Bullet27 extends BaseBullet {

    m_timerId:any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
    }

    StartMove() {
        super.StartMove();
        const targetWorldPosX = this.m_target.getWorldPosition().x;
        const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
        this.node.setWorldPosition(targetWorldPosX, targetWorldPosY, 0); // 设置子弹位置
        this.m_maxLive = 2;

        if (this.m_skeletons.length > 0) {
            this.m_skeletons[0].timeScale = 2 * smc.account.AccountModel.getGameRate();
        }

        clearTimeout(this.m_timerId);
        this.m_timerId = setTimeout(() => {
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
                            postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[i], attack: this.m_attack });// 子弹击中目标
                        }
                    }
                });*/
                //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                    if (list && list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[i], attack: this.m_attack });// 子弹击中目标
                            oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),  { from: this.node, to: list[i], attack: this.m_attack })
                        }
                    }
                },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });
            }
        }, 1 * 1000 / smc.account.AccountModel.getGameRate());
        this.ClearTimeoutId();
        this.m_liveId = setTimeout(() => {
            this.m_status = 2;
            this.ClearTimeoutId();
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
            clearTimeout(this.m_timerId);
        }
    }
}


