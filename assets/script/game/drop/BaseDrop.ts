import { _decorator, Component, Node } from 'cc';
import { MoveBy } from '../common/MoveBy';
import { MoveTo } from '../common/MoveTo';
import { ScaleTo } from '../common/ScaleTo';
//import { postMessage } from '../../public/publicFunctions';
import { MESSAGE_DEFINES } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
const { ccclass, property } = _decorator;

@ccclass('BaseDrop')
export class BaseDrop extends Component {

    m_status = 0;//0-未开始 1-动画中 2-结束
    m_type = 0;//
    m_value = 0;
    m_id:any = null;
    start() {

    }

    update(deltaTime: number) {

    }

    SetType(type:any) {
        this.m_type = type;
    }
    GetType() {
        return this.m_type;
    }
    SetValue(value:any) {
        this.m_value = value;
    }
    GetValue() {
        return this.m_value;
    }

    StartDrop(fromPos:any, toPos:any, timeout:any) {
        if (this.m_status == 2) {
            oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_ADD_DROP.toString(), { type: this.m_type, value: this.m_value })
            //ostMessage(MESSAGE_DEFINES.GAME_ADD_DROP, { type: this.m_type, value: this.m_value });
            this.removeSelf();
            return;
        }
        if (!timeout) {
            timeout = 0;
        }
        //console.log("StartDrop AddDrop")
        this.m_id = setTimeout(() => {
            const moveBy1 = this.addComponent(MoveBy);
            const moveBy2 = this.addComponent(MoveBy);
            if (moveBy1 && moveBy2) {
                moveBy1.moveBy(0, Math.random() * 20, 0.3);
                moveBy2.moveBy(1, Math.random() * 20, 0.3, () => {
                    const moveTo = this.addComponent(MoveTo);
                    const scaleTo = this.addComponent(ScaleTo);
                    if (moveTo && scaleTo) {
                        scaleTo.setFrom(1);
                        scaleTo.setTo(0.3);
                        scaleTo.scaleTo(0.3);
                        moveTo.setFromPos(fromPos);
                        moveTo.setToPos(toPos);
                        moveTo.moveTo(0.3, () => {
                            if (this.m_status == 2) return;
                            oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_ADD_DROP.toString(), { type: this.m_type, value: this.m_value })////添加掉落
                            //postMessage(MESSAGE_DEFINES.GAME_ADD_DROP, { type: this.m_type, value: this.m_value });
                            this.removeSelf();
                        });
                    }
                });
            }
            this.m_id = null;
        }, timeout);
    }

    StopDrop() {
        oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_ADD_DROP.toString(), { type: this.m_type, value: this.m_value })
        //postMessage(MESSAGE_DEFINES.GAME_ADD_DROP, { type: this.m_type, value: this.m_value });
        this.removeSelf();
        this.m_status = 2;
    }

    protected onDisable(): void {
        if (this.m_id) {
            clearTimeout(this.m_id);
            this.m_id = null;
        }
    }

    removeSelf() {
        this.node.removeFromParent();
    }
}


