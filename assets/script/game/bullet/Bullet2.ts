import { _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet2')
export class Bullet2 extends BaseBullet {

    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (!this.CheckOutArea()) return;
        if (this.m_status == 1) {
            // const myWorldPosX = this.node.getWorldPosition().x;
            // const myWorldPosY = this.node.getWorldPosition().y;
            // if (this.m_lastDisX != 0 || this.m_lastDisY != 0) {
            //     const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
            //     const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
            //     const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
            //     this.node.setWorldPosition(x, y, 0); // 设置子弹位置
            // }
            // let code = null;
            // if (this.m_camp == PVP_TEAM_CAMP.NONE) {//非PVP
            //     code = MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET;
            // } else {
            //     code = MESSAGE_DEFINES.PVP_MULTI_TARGET;
            // }
            // if (code) {
            //     sendMessage(code, { target: this.node, range: this.m_info.range, max: this.m_info.maxHit }, (list) => {
            //         if (list && list.length > 0) {
            //             const finalList = list.filter((item) => {
            //                 const has = this.m_hitList.indexOf(item) != -1;
            //                 return this.CheckTargetAlive() && !has;
            //             });
            //             if (finalList.length > 0) {
            //                 this.m_hitList = this.m_hitList.concat(finalList);
            //                 for (let i = 0; i < finalList.length; i++) {
            //                     const monster = finalList[i];
            //                     postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
            //                 }
            //             }
            //         }
            //     });
            // }
            this.AutoMove(deltaTime); // 移动
        }
    }

    OnAnimationEnd() {
        this.m_status = 2;//子弹消失
        this.ClearTimeoutId();
        this.removeSelf();
    }
}


