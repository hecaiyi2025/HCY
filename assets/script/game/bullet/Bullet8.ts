import { UITransform, _decorator } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet8')
export class Bullet8 extends BaseBullet {
    m_sword1:any = null;
    m_sword2 :any= null;
    m_currentSpeed = 20;
    m_swordType = 0;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == 1) {
            const myWorldPosX = this.node.getWorldPosition().x;
            const myWorldPosY = this.node.getWorldPosition().y;
            this.node.setWorldPosition(myWorldPosX, myWorldPosY - this.m_currentSpeed * deltaTime, 0); // 设置子弹位置
            if (this.m_currentSpeed >= this.m_speed) {
                this.m_currentSpeed == this.m_speed
            } else {
                this.m_currentSpeed = Math.pow(this.m_currentSpeed, 1.2);
            }
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
                        this.m_status = 2;
                        postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[0], attack: this.m_attack });// 子弹击中目标
                        this.ClearTimeoutId();
                        this.removeSelf();
                        return;
                    }
                });
                */
                oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                    if (list && list.length > 0) {
                        this.m_status = 2;
                        oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),{ from: this.node, to: list[0], attack: this.m_attack })
                        //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[0], attack: this.m_attack });// 子弹击中目标
                        this.ClearTimeoutId();
                        this.removeSelf();
                        return;
                    }
                },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });
            }
            if (this.m_target) {
                const targetWorldPosY = this.m_target.getWorldPosition().y;
                if (myWorldPosY < targetWorldPosY) {
                    this.m_status = 2;
                    this.node.setWorldPosition(myWorldPosX, this.m_target.getWorldPosition().y, 0);
                    oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),{ from: this.node, to: this.m_target, attack: this.m_attack, params: this.m_swordType })
                    //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack, params: this.m_swordType });// 子弹击中目标
                    this.ClearTimeoutId();
                    this.removeSelf();
                    return;
                }
            }
        }
    }

    StartMove() {
        super.StartMove();
        this.m_sword1 = this.node.getChildByName("sword1");
        this.m_sword2 = this.node.getChildByName("sword2");
        if (Math.random() > 0.5) {
            this.m_sword1.active = true;
            this.m_sword2.active = false;
            this.m_swordType = 1;
        } else {
            this.m_sword1.active = false;
            this.m_sword2.active = true;
            this.m_swordType = 2;
        }
    }

    SetEuler() {

    }
}


