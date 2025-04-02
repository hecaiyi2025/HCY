import { Vec3, _decorator, Node, UITransform } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet5')
export class Bullet5 extends BaseBullet {
    @property(Node)
    m_center: Node|null = null;

    m_hit = false;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        super.update(deltaTime);
        if (this.m_status == 1 && this.m_hit) {
            let myWorldPosY = this.node.getWorldPosition().y;
            if (this.m_center) {
                myWorldPosY = this.m_center.getWorldPosition().y;
            }
            if (this.m_targetParent) {
                const targetWorldPosY = this.m_targetParent.getWorldPosition().y;
                let height = 0;
                if (this.m_center) {
                    height = this.GetTargetHeight();
                }
                if (myWorldPosY < (targetWorldPosY + height)) {
                    this.m_status = 2;
                    oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),{ from: this.node, to: null, attack: this.m_attack })
                    //ostMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: null, attack: this.m_attack });// 子弹击中目标
                    this.ClearTimeoutId();
                    this.removeSelf();
                    return;
                }
            }
        }
    }

    SetCamp(camp:any) {
        super.SetCamp(camp);
        if (camp == PVP_TEAM_CAMP.SELF) {
            this.node.scale = new Vec3(1, 1, 1);
        } else if (camp == PVP_TEAM_CAMP.ENEMY) {
            this.node.scale = new Vec3(-1, 1, 1);
        }
    }

    OnAnimationEnd() {
        this.m_status = 2;//子弹消失
        // postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: this.m_target, attack: this.m_attack });// 子弹击中目标
        this.ClearTimeoutId();
        this.removeSelf();
    }

    OnStartHit() {
        this.m_hit = true;
    }

    GetCenterPosition() {
        if (this.m_center) {
            return this.m_center.getWorldPosition();
        }
        return this.node.getWorldPosition();
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }

    Reset() {
        super.Reset();
        this.m_hit = false;
    }
}


