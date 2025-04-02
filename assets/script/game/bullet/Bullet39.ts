import { _decorator, Node, sp, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet39')
export class Bullet39 extends BaseBullet {
    @property(Node)
    m_skeletonNode: Node|any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == 1) {
            const scale = this.m_skeletonNode.getScale();
            if (scale.x < 1) {
                const newScale = scale.x + deltaTime * 2;
                this.m_skeletonNode.setScale(new Vec3(newScale, newScale, newScale));
            } else {
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
                    });
                    */
                    oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                        if (list && list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: list[i], attack: this.m_attack })
                                //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[i], attack: this.m_attack });// 子弹击中目标
                            }
                        }
                    },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });

                    this.m_skeletonNode.active = false;
                    if (this.m_skeletons.length > 1) {
                        this.m_skeletons[0].node.active = true;
                        this.m_skeletons[0].setAnimation(0, 'play', false);
                        this.m_skeletons[1].node.active = true;
                        this.m_skeletons[1].setAnimation(0, 'play', false);
                    }
                    this.m_status = 2;
                }
            }
        }
    }


    StartMove() {
        this.m_maxLive = 4 / smc.account.AccountModel.getGameRate();
        if (this.m_skeletonNode) {
            this.m_skeletonNode.active = true;
            this.m_skeletonNode.setScale(new Vec3(0, 0, 0));
        }
        if (this.m_skeletons.length > 1) {
            this.m_skeletons[0].node.active = false;
            this.m_skeletons[1].node.active = false;
        }

        const screenwith = view.getVisibleSize().width;
        /*
        sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
            const to = list[1];
            this.node.setWorldPosition(screenwith * 0.6, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        });
        */
       //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
       oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list:any[]) => {
        const to = list[1];
            this.node.setWorldPosition(screenwith * 0.6, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        },null);
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }

    Reset(): void {
        super.Reset();
    }
}


