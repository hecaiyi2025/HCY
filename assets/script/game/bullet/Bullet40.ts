import { _decorator, Node, sp, UITransform, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet40')
export class Bullet40 extends BaseBullet {
    @property(Node)
    m_node: Node|any = null;

    m_timerId = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == 1) {
            if (this.m_node) {
                const posY = this.m_node.getPosition().y;
                let newPosY = posY + deltaTime * 1000;
                if (newPosY >= 0) {
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
                                    postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[i], attack: this.m_attack });// 子弹击中目标
                                }
                            }
                        });*/
                        //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                    oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                        if (list && list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),{ from: this.node, to: list[i], attack: this.m_attack })
                                //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[i], attack: this.m_attack });// 子弹击中目标
                            }
                        }
                    },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });
                        this.m_status = 2;
                    }
                    newPosY = 0;
                }
                this.m_node.setPosition(new Vec3(0, newPosY, 0));
            }
        }
    }


    StartMove() {
        this.m_maxLive = 1.5 / smc.account.AccountModel.getGameRate();

        const screenwith = view.getVisibleSize().width;
        /*
        sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
            const to = list[1];
            this.node.setWorldPosition(screenwith * 0.35, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        });*/
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list:any[]) => {
            const to = list[1];
            this.node.setWorldPosition(screenwith * 0.35, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        },null);

        if (this.m_node) {
            this.m_node.setPosition(new Vec3(0, -this.m_node.getComponent(UITransform)!.height, 0));
        }
        if (this.m_skeletons.length > 0) {
            this.m_skeletons[0].timeScale = 1 * smc.account.AccountModel.getGameRate();
            this.m_skeletons[0].setAnimation(0, 'play', false);
        }
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }
}


