import { UITransform, _decorator, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet29')
export class Bullet29 extends BaseBullet {

    m_timerId:any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {

    }

    StartMove() {
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list:any[]) => {
            const to = list[1];
            this.node.setWorldPosition(500, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        },null);
        /*
        sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
            const to = list[1];
            this.node.setWorldPosition(500, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        });*/

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
                oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                    if (list && list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),{ from: this.node, to: list[i], attack: this.m_attack })
                           // postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[i], attack: this.m_attack });// 子弹击中目标
                        }
                    }
                },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });
            }
        }, 700 / smc.account.AccountModel.getGameRate());

        if (this.m_skeletons.length > 1) {
            const worldPosition = this.m_skeletons[1].node.getWorldPosition();
            /*
            sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POSBG, null, (posBg) => {
                this.m_skeletons[1].node.setParent(posBg);
                this.m_skeletons[1].node.setWorldPosition(worldPosition);
            });*/
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POSBG.toString(),(posBg:any) => {
                this.m_skeletons[1].node.setParent(posBg);
                this.m_skeletons[1].node.setWorldPosition(worldPosition);
            },null);
        }
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }

    Reset() {
        super.Reset();
        if (this.m_skeletons.length > 1) {
            const worldPosition = this.m_skeletons[1].node.getWorldPosition();
            this.m_skeletons[1].node.setParent(this.node);
            this.m_skeletons[1].node.setWorldPosition(worldPosition);
        }
    }
}


