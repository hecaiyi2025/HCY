import { UITransform, Vec3, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
//import { getAngle, postMessage, sendMessage } from '../../public/publicFunctions';
//import { MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE } from '../../global/global';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet1')
export class Bullet1 extends BaseBullet {

    m_touchPoint:{[key:string|number]:any}|any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (!this.CheckOutArea()) return;
        if (this.m_status == 1) {
            if (this.m_touchPoint && this.m_camp != PVP_TEAM_CAMP.ENEMY) {//玩家控制子弹
                this.Move(deltaTime); // 移动
                this.HitTarget(true, false); // 击中目标
                this.checkBottom();
            } else {//子弹自动寻路
                this.AutoMove(deltaTime); // 移动
            }
        }
    }
    SetTouchEuler() {
        let euler = this.node.eulerAngles.z;
        if (this.m_touchPoint) {
            euler = getAngle(this.node.getWorldPosition(), new Vec3(this.m_touchPoint.x, this.m_touchPoint.y, 0));// 设置子弹角度
        }
        this.node.setRotationFromEuler(0, 0, euler); // 设置子弹角度
    }

    StartMove() {
        super.StartMove();
        if (this.m_fromType = NODE_TYPE.ROLE) {
            const roleScript = this.m_from.getComponent(BaseRole);
            if (roleScript.GetType() == ROLE_TYPE.MAIN) {
                //主角才能控制弹道
                this.m_touchPoint = roleScript.GetTouchPoint();// 获取触摸点
                if (this.m_touchPoint) {
                    this.SetTouchEuler();
                    const targetWorldPosX = this.m_touchPoint.x;
                    const targetWorldPosY = this.m_touchPoint.y;
                    const myWorldPosX = this.node.getWorldPosition().x;
                    const myWorldPosY = this.node.getWorldPosition().y;
                    this.m_lastDisX = targetWorldPosX - myWorldPosX;
                    this.m_lastDisY = targetWorldPosY - myWorldPosY;
                }
            }
        }
    }
}


