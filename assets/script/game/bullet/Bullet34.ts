import { _decorator, sp, view } from 'cc';
import { BaseBullet } from './BaseBullet';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseRole } from '../battle/BaseRole';
const { ccclass, property } = _decorator;

@ccclass('Bullet34')
export class Bullet34 extends BaseBullet {

    m_timerId:any = null;
    start() {
        super.start();
    }

    update(deltaTime: number) {

    }

    StartMove() {
        this.m_maxLive = 4 / smc.account.AccountModel.getGameRate();
        if (this.m_skeletons.length > 1) {
            this.m_skeletons[0].timeScale = 1 * smc.account.AccountModel.getGameRate();
            this.m_skeletons[1].timeScale = 1 * smc.account.AccountModel.getGameRate();
        }

        const screenwith = view.getVisibleSize().width;
        /*
        sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
            const to = list[1];
            this.node.setWorldPosition(screenwith / 2, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        });*/
        //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list:any[]) => {
            const to = list[1];
            this.node.setWorldPosition(screenwith / 2, to.getWorldPosition().y, 0);
            this.SetTarget(to);
            super.StartMove();
            this.SetEuler();
        },null);

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
                //oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                oops.message.dispatchEventcallback(code.toString(),(list:any[]) => {
                    if (list && list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: list[i], attack: this.m_attack });// 子弹击中目标
                            oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: list[i], attack: this.m_attack })
                        }
                    }
                },{ target: this.node, range: this.m_info.range, max: this.m_info.maxHit });
            }
        }, 2500 / smc.account.AccountModel.getGameRate());
    }

    SetEuler() {
        this.node.setRotationFromEuler(0, 0, 0); // 设置子弹角度
    }
}


