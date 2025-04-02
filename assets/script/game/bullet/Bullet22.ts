import { _decorator } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';;

const { ccclass, property } = _decorator;

@ccclass('Bullet22')
export class Bullet22 extends BaseBullet {
    m_attackTime = 0;
    m_timerId = null;
    m_position1:any = null;
    m_position2:any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (this.m_status == 1) {
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
                if (code) {
                    /*
                    sendMessage(code, { target: this.node, range: this.m_info.range, max: this.m_info.maxHit }, (list) => {
                        if (list && list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                const monster = list[i];
                                if (this.CheckTargetAlive(monster)) {
                                    oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                                    //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                                }
                            }
                        }
                    });*/
                    //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                    oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                        if (list && list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                const monster = list[i];
                                if (this.CheckTargetAlive(monster)) {
                                    oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                                    //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
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

        if (this.m_skeletons.length > 1) {
            if (!this.m_position1) this.m_position1 = this.m_skeletons[0].node.getPosition();
            if (!this.m_position2) this.m_position2 = this.m_skeletons[1].node.getPosition();
        }
        this.m_status = 1;
        this.SetEuler();
        const targetWorldPosX = this.m_target.getWorldPosition().x;
        const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
        this.node.setWorldPosition(targetWorldPosX, targetWorldPosY, 0); // 设置子弹位置
        if (this.m_skeletons.length > 1) {
            const worldPosition1 = this.m_skeletons[0].node.getWorldPosition();
            const worldPosition2 = this.m_skeletons[1].node.getWorldPosition();
            //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POSBG.toString(),(posBg:any) => {
                this.m_skeletons[0].node.setParent(posBg);
                this.m_skeletons[0].node.setWorldPosition(worldPosition1);
                this.m_skeletons[1].node.setParent(posBg);
                this.m_skeletons[1].node.setWorldPosition(worldPosition2);
                this.m_skeletons[0].setAnimation(0, "animation", true);
                this.m_skeletons[1].setAnimation(0, "animation", true);
                this.m_skeletons[0].node.active = true;
                this.m_skeletons[1].node.active = true;
                },null);            

            /*
            sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POSBG, null, (posBg:any) => {
                this.m_skeletons[0].node.setParent(posBg);
                this.m_skeletons[0].node.setWorldPosition(worldPosition1);
                this.m_skeletons[1].node.setParent(posBg);
                this.m_skeletons[1].node.setWorldPosition(worldPosition2);
                this.m_skeletons[0].setAnimation(0, "animation", true);
                this.m_skeletons[1].setAnimation(0, "animation", true);
                this.m_skeletons[0].node.active = true;
                this.m_skeletons[1].node.active = true;
            });
            */
        }

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
        if (this.m_timerId) {
            clearTimeout(this.m_timerId);
            this.m_timerId = null;
        }
        if (this.m_skeletons && this.m_skeletons.length > 1) {
            this.m_skeletons[0].node.setParent(this.node);
            if (this.m_position1) this.m_skeletons[0].node.setPosition(this.m_position1);
            this.m_skeletons[1].node.setParent(this.node);
            if (this.m_position2) this.m_skeletons[1].node.setPosition(this.m_position2);
            this.m_skeletons[0].node.active = false;
            this.m_skeletons[1].node.active = false;
        }
    }
}


