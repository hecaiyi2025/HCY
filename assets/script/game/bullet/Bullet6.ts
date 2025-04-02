import { UITransform, Vec3, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet6')
export class Bullet6 extends BaseBullet {
    m_hitList :any[]= [];//每个怪只伤害一次

    m_maxDistance = 600; //子弹最大飞行距离
    m_currentSpeed = 0; //当前速度
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (this.m_status == 1) {
            const myWorldPosX = this.node.getWorldPosition().x;
            const myWorldPosY = this.node.getWorldPosition().y;
            if (this.m_lastDisX != 0 || this.m_lastDisY != 0) {
                this.m_currentSpeed += this.m_speed * 5 * deltaTime;
                const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
                const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_currentSpeed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
                const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_currentSpeed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
                this.m_maxDistance -= Math.sqrt((x - myWorldPosX) * (x - myWorldPosX) + (y - myWorldPosY) * (y - myWorldPosY));
                if (this.m_maxDistance <= 0) {
                    this.m_status = 2;
                    this.ClearTimeoutId();
                    this.removeSelf();
                    return;
                }
                this.node.setWorldPosition(x, y, 0); // 设置子弹位置
            }
            let code = null;
            if (this.m_camp == PVP_TEAM_CAMP.NONE) {//非PVP
                code = MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET;
            } else {
                code = MESSAGE_DEFINES.PVP_MULTI_TARGET;
            }
            if (code) {/*
                sendMessage(code, { target: this.node, range: this.m_info.range, max: this.m_info.maxHit }, (list) => {
                    if (list && list.length > 0) {
                        const finalList = list.filter((item) => {
                            const has = this.m_hitList.indexOf(item) != -1;
                            return this.CheckTargetAlive() && !has;
                        });
                        if (finalList.length > 0) {
                            this.m_hitList = this.m_hitList.concat(finalList);
                            for (let i = 0; i < finalList.length; i++) {
                                const monster = finalList[i];
                                postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                            }
                        }
                    }
                });*/
                oops.message.dispatchEventcallback(code.toString(),(list:Node[]) => {
                    if (list && list.length > 0) {
                        const finalList = list.filter((item) => {
                            const has = this.m_hitList.indexOf(item) != -1;
                            return this.CheckTargetAlive() && !has;
                        });
                        if (finalList.length > 0) {
                            this.m_hitList = this.m_hitList.concat(finalList);
                            for (let i = 0; i < finalList.length; i++) {
                                const monster = finalList[i];
                                oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                                //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                            }
                        }
                    }
                },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });
            }
        }
    }
    StartMove() {
        super.StartMove();
        this.SetEuler();
        const targetWorldPosX = this.m_target.getWorldPosition().x;
        const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
        const myWorldPosX = this.node.getWorldPosition().x;
        const myWorldPosY = this.node.getWorldPosition().y;
        this.m_lastDisX = targetWorldPosX - myWorldPosX;
        this.m_lastDisY = targetWorldPosY - myWorldPosY;
    }


    SetCamp(camp:any) {
        super.SetCamp(camp);
        if (camp == PVP_TEAM_CAMP.SELF) {
            this.node.scale = new Vec3(1, 1, 1);
        } else if (camp == PVP_TEAM_CAMP.ENEMY) {
            this.node.scale = new Vec3(1, -1, 1);
        }
    }

    OnAnimationEnd() {
        this.m_status = 2;//子弹消失
        this.ClearTimeoutId();
        this.removeSelf();
    }

    Reset(): void {
        super.Reset();
        this.m_hitList = [];
        this.m_maxDistance = 600; //子弹最大飞行距离
        this.m_currentSpeed = 0; //当前速度
    }
}


