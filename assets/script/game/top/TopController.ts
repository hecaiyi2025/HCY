import { _decorator, Component, instantiate, Label, Node, ProgressBar, UITransform } from 'cc';
//import { globalData } from '../../data/globalData';
//import { addMessageListener } from '../../public/publicFunctions';
import { DROP_TYPE, MESSAGE_DEFINES } from '../common/global';
import { degreeConfig } from '../common/config/degree';

import { CCVMParentComp } from "../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { smc } from '../common/SingletonModuleComp';
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
const { ccclass, property } = _decorator;

@ccclass('TopController')
@ecs.register('TopController', false)
export class TopController extends CCVMParentComp {
    @property(Node)
    m_stop: Node|null = null;
    @property(Node)
    m_first: Node|null = null;
    @property(Node)
    m_double: Node|null = null;
    @property(Node)
    m_triple: Node|null = null;
    @property(ProgressBar)
    m_gameProgress: ProgressBar|null = null;
    @property(Label)
    m_moneyLabel: Label|null = null;
    @property(Node)
    m_icon: Node|null = null;
    //@property(Label)
    //m_title: Label|null = null;

    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        m_title:"",
        /** 加载资源进度比例值 */
        money:"0",
    };

    reset(): void { 

    }
    start() {
        this.enter();
    }

    enter() {
        this.bindEvent();
        //this.loadRes();
    }
    bindEvent() {
        oops.message.on(MESSAGE_DEFINES.GAME_SHOW_PROGRESS.toString(),(...arg:any) => {
            if (arg[1]) {
                this.setProgress(arg[1].index, arg[1].progress);
            }
        },this);/*
        addMessageListener(MESSAGE_DEFINES.GAME_SHOW_PROGRESS, (data) => {
            if (data) {
                this.setProgress(data.index, data.progress);
            }
        });*/
        oops.message.on(MESSAGE_DEFINES.GAME_GET_DROP_POS.toString(),(...arg:any) => {
            //console.log("topcontroller.getdrop node",arg[1])
            if (arg[1] == DROP_TYPE.MONEY) {
                if (this.m_moneyLabel) {
                    return [this.m_moneyLabel.node];
                }
            }
            return null;
        },this);/*
        addMessageListener(MESSAGE_DEFINES.GAME_GET_DROP_POS, (type) => {
            if (type == DROP_TYPE.MONEY) {
                if (this.m_moneyLabel) {
                    return this.m_moneyLabel.node;
                }
            }
            return null;
        });*/
        oops.message.on(MESSAGE_DEFINES.GAME_GET_ACCELERATE.toString(),(...arg:any) => {
            this.ShowGameRate()
        },this);/*
        addMessageListener(MESSAGE_DEFINES.GAME_GET_ACCELERATE, (type) => {
            this.ShowGameRate()
        });*/
    }

    m_config :any[]= []

    update(deltaTime: number) {

    }

    ShowTitle(param = null) {
        console.log("topcontroller.showTitle");
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        if (userInfo && userInfo.degree) {
            const degreeInfo = degreeConfig.getConfigByID(userInfo.degree);
            if (degreeInfo && degreeInfo.name ) {
                this.data.m_title = degreeInfo.name;
            }
        }
    }

    ShowGameRate() {
        const gameRateList = smc.account.AccountModel.getGameRateList();
        if (smc.account.AccountModel.getGameRate() == 0) {
            if (this.m_stop) this.m_stop.active = true;
            if (this.m_first) this.m_first.active = false;
            if (this.m_double) this.m_double.active = false;
            if (this.m_triple) this.m_triple.active = false;
        } else {
            if (this.m_stop) this.m_stop.active = false;
            if (gameRateList.length > 0) {
                if (this.m_first) this.m_first.active = true;
            }
            if (gameRateList.length > 1) {
                if (this.m_double) this.m_double.active = smc.account.AccountModel.getGameRate() >= gameRateList[1];
            }
            if (gameRateList.length > 2) {
                if (this.m_triple) this.m_triple.active = smc.account.AccountModel.getGameRate() >= gameRateList[2];
            }
        }
    }

    ShowConfig(num:any) {
        if (num > 0) {
            this.m_config = [];
            const width = this.m_gameProgress!.node.getComponent(UITransform)!.width;
            const iconWidth = this.m_icon!.getComponent(UITransform)!.width;
            const start = 45;
            const length = (width - start) / num;
            for (let i = 0; i < num; i++) {
                if (i == 0) {
                    this.m_config.push({
                        id: i,
                        base: start,
                        width: length,
                    });
                } else {
                    const newIocon = instantiate(this.m_icon);
                    newIocon!.active = true;
                    this.m_gameProgress!.node.addChild(newIocon!);
                    const base = start + i * length;
                    newIocon!.setPosition(base - width / 2, 0, 0);
                    this.m_config.push({
                        id: i,
                        base: base,
                        width: length,
                    });
                }
            }
        }
        this.setProgress(0, 0);
    }

    setProgress(id:any, progress:any) {
        if (this.m_gameProgress) {
            let config = null;
            for (let i = 0; i < this.m_config.length; i++) {
                const data = this.m_config[i];
                if (data.id == id) {
                    config = data;
                    break;
                }
            }
            if (config) {
                const rate = (config.base + config.width * progress) / this.m_gameProgress.node.getComponent(UITransform)!.contentSize.width;
                this.m_gameProgress.progress = rate;
                // console.log("rate:", rate);
            }
        }
    }

    ShowMoney(money:string) {
        //console.log("topcontroller.ShowMoney");
        this.data.money=money
    }
}


