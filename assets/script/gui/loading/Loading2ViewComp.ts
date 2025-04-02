/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: bansomin
 * @LastEditTime: 2024-03-31 01:17:02
 */
import { _decorator } from "cc";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
/*
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";

import { ModuleUtil } from "../../../../../extensions/oops-plugin-framework/assets/module/common/ModuleUtil";
import { DemoViewComp } from "../../account/view/DemoViewComp";
import { smc } from "../../common/SingletonModuleComp";
import { UIID } from "../../common/config/GameUIConfig";
import { GAME_TYPE, LOGIN_URL, NETWORKING, REGISTER_URL } from '../../common/global';
import { NET_DEFINES, WEBSOCKET_URL } from '../../common/global';
import { clearConfigs, IsLoadConfigs, LoadConfigs } from '../../common/config/config';
import { GameNetNode } from "../../../GameNetNode";
*/
const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('Loading2ViewComp')
@ecs.register('Loading2View', false)
export class Loading2ViewComp extends CCVMParentComp {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 5,
        /** 加载资源最大进度 */
        total: 10,
        /** 加载资源进度比例值 */
        progress: "0",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    //private progress: number = 0;
    //xhr:XMLHttpRequest|null=null;
    start() {
        this.enter();
    }

    enter() {
        this.loadRes();
    }

    /** 加载资源 */
    private async loadRes() {
        this.data.progress = 0.5;
        this.data.prompt="努力加载场景..."
        await this.loadCustom();
        //await this.loadGameRes();
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadCustom() {
       
    }


    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        
    }

    /** 加载完成事件 */
    private async onCompleteCallback() {
        // 获取用户信息的多语言提示文本

        /*
        await ModuleUtil.addViewUiAsync(smc.account, DemoViewComp, UIID.Demo);
        ModuleUtil.removeViewUi(this.ent, LoadingViewComp, UIID.Loading);
        */
    }

    reset(): void { }
     

    protected onDisable(): void {
      
    }
}