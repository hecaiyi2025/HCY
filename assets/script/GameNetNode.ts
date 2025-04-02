import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { NetNode } from '../../extensions/oops-plugin-framework/assets/libs/network/NetNode';

//type ExecuterFunc = (callback: CallbackObject, buffer: NetData) => void;
type CheckFunc = (checkedFunc: VoidFunc) => void;
type VoidFunc = () => void;
type BoolFunc = () => boolean;
@ccclass('GameNetNode')
export class GameNetNode extends NetNode {

    setconnectedCallback(callback:CheckFunc | null){
        //console.log("setconnectedCallback finish ");
        this._connectedCallback=callback;
    }
    /** 网络连接成功 */
    /*
    protected onConnected(event: any) {
            
        super.onConnected(event)
        //Logger.instance.logNet(`网络已连接当前状态为【${NetNodeStateStrs[this._state]}】`);
        console.log("可以在此处发送初始数据到服务器");
        if(this._connectedCallback)
            this._connectedCallback(()=>{});
            // 可以在此处发送初始数据到服务器
    }
    */

}


