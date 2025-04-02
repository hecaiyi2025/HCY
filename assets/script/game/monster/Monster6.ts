import { UITransform, Node, _decorator, Vec3 } from 'cc';

import { MoveBy } from '../common/MoveBy';

import { BaseMonster } from '../battle/BaseMonster';
import { GAME_TYPE, MESSAGE_DEFINES, MONSTER_STATUS } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
const { ccclass, property } = _decorator;

@ccclass('Monster6')
export class Monster6 extends BaseMonster {
    @property(Node)
    m_background: Node|any = null;
    @property(Node)
    m_foreground: Node|any = null;

    // m_moveBy = null;
    m_targetPosX = 0;
    start() {


    }

    update(deltaTime: number) {
        const oldeDeltaTime = deltaTime;
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_background && this.m_foreground) {
            this.m_background.setWorldPosition(this.m_foreground.worldPosition);
        }
        if (this.m_status != MONSTER_STATUS.IDLE && this.m_status != MONSTER_STATUS.DEATH && this.m_status != MONSTER_STATUS.OVER) {
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_GROUND_SPEED.toString(), (speed:any) => {
                let x = this.node.getWorldPosition().x + this.m_speed * deltaTime * (this.m_targetPosX - this.node.getWorldPosition().x > 0 ? 1 : -1); // 向目标移动
                x += speed * oldeDeltaTime;
                //console.log("monster6 move speed",x,speed);
                if (x < this.m_targetPosX) {
                    x = this.m_targetPosX;
                    oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_BG_STOP.toString())
                    //postMessage(MESSAGE_DEFINES.GAME_BG_STOP);
                }
                this.node.setWorldPosition(new Vec3(x, this.node.getWorldPosition().y, this.node.getWorldPosition().z));


            },[null]);
            /*
            sendMessage(MESSAGE_DEFINES.GET_GROUND_SPEED, null, (speed) => {
                let x = this.node.getWorldPosition().x + this.m_speed * deltaTime * (this.m_targetPosX - this.node.getWorldPosition().x > 0 ? 1 : -1); // 向目标移动
                x += speed * oldeDeltaTime;
                if (x < this.m_targetPosX) {
                    x = this.m_targetPosX;
                    postMessage(MESSAGE_DEFINES.GAME_BG_STOP);
                }
                this.node.setWorldPosition(new Vec3(x, this.node.getWorldPosition().y, this.node.getWorldPosition().z));
            });*/
        }

    }

    PlayAnimation(status:any, loop:any) {
        if (this.m_skeleton) {
            // this.m_skeleton.setAnimation(0, "animation", loop);
        }
    }

    SetInfo(info:any) {
        super.SetInfo(info);
        const width = this.node.getComponent(UITransform)!.width;
        this.node.setWorldPosition(this.node.getWorldPosition().x + width / 2, this.node.getWorldPosition().y, 0);
        this.m_targetPosX = this.node.getWorldPosition().x - width * 1.5;
    }

    setPosBg(posBg:any) {
        super.setPosBg(posBg);
        if (this.m_background) {
            posBg.addChild(this.m_background);
        }
    }

    protected onDisable(): void {
        super.onDisable();
        if (this.m_background) {
            this.m_background.setParent(this.node);
        }
    }

    Reset(): void {
        super.Reset();
        if (this.m_background) {
            this.m_background.setParent(this.node);
        }
    }
}


