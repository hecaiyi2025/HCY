import { UITransform, _decorator, sp } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet31')
export class Bullet31 extends BaseBullet {
    m_startId:any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }

    StartMove() {
        this.m_status = 1;
        this.ClearTimeoutId();
        this.m_liveId = setTimeout(() => {
            this.m_status = 2;
            this.removeSelf();
        }, this.m_maxLive * 1000000); // 子弹存活时间
        this.SetEuler();
        if (this.m_from) {
            this.node.setWorldPosition(this.m_from.getWorldPosition().x, this.m_from.getWorldPosition().y, 0); // 设置子弹位置
        }
        this.m_startId = setTimeout(() => {/*
            sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, true, (targetList: Node[]) => {
                if (targetList && targetList.length > 0) {
                    for (let i = 0; i < targetList.length; i++) {
                        const target = targetList[i];
                        postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: target, attack: this.m_attack });// 子弹击中目标
                    }
                }
                this.ClearTimeoutId();
                this.removeSelf();
            });
            */
           //oops.message.dispatchEvent(MESSAGE_DEFINES.GET_ROLE_LIST.toString(), { from: this.node, to: monster, attack: this.m_attack })
           oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_ROLE_LIST.toString(),(targetList:any[]) => {
            if (targetList && targetList.length > 0) {
                for (let i = 0; i < targetList.length; i++) {
                    const target = targetList[i];
                    oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: target, attack: this.m_attack })
                    //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: target, attack: this.m_attack });// 子弹击中目标
                }
            }
            this.ClearTimeoutId();
            this.removeSelf();
        },true);
        }, 1000);
    }
    protected onDisable(): void {
        if (this.m_startId) {
            clearTimeout(this.m_startId);
            this.m_startId = null;
        }
        super.onDisable();
    }
}


