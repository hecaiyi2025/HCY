/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 18:25:56
 */
import { _decorator, profiler } from 'cc';
import { DEBUG } from 'cc/env';
import { oops } from '../../extensions/oops-plugin-framework/assets/core/Oops';
import { Root } from '../../extensions/oops-plugin-framework/assets/core/Root';
import { ecs } from '../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { Account } from './game/account/Account';
import { smc } from './game/common/SingletonModuleComp';
import { UIConfigData } from './game/common/config/GameUIConfig';
import { Initialize } from './game/initialize/Initialize';

import { GameNetNode } from './GameNetNode';
import { WebSock } from '../../extensions/oops-plugin-framework/assets/libs/network/WebSock';
import { NetProtocolGame } from './NetProtocolGame';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected run() {
        var net = new GameNetNode();
        var ws = new WebSock();        // WebSocket 网络连接对象
        var gp = new NetProtocolGame();   // 网络通讯协议对象
        //var gt = new NetGameTips()     // 网络提示对象
        net.init(ws, gp, null);
        oops.tcp.setNetNode(net,0);
        
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
        smc.account = ecs.getEntity<Account>(Account);
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
    }

    // protected initEcsSystem() {
    //     oops.ecs.add(new EcsInitializeSystem());
    // }
}
