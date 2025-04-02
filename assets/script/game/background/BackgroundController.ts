import { _decorator, Component, instantiate, Node, Prefab, resources } from 'cc';
import { BackgroundView } from './BackgroundView';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { MESSAGE_DEFINES } from '../common/global';
import { degreeConfig } from '../common/config/degree';
const { ccclass, property } = _decorator;

@ccclass('BackgroundController')
export class BackgroundController extends Component {
    m_background: BackgroundView|any = null;

    m_shakeNum = 0;
    m_shakeInterval = 0.03;//震动间隔
    m_shakeValue = 0;

    m_backgroundPrefabs:{[key:string]:any} = {};
    start() {
        oops.message.on(MESSAGE_DEFINES.GAME_SCREEN_SHAKE.toString(),(...arg:any) => {
            this.Shake();
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_SCREEN_SHAKE, () => {
            this.Shake();
        });*/
        oops.message.on(MESSAGE_DEFINES.GET_GROUND_SPEED.toString(),(...arg:any) => {
            //console.log("111GetGroundSpeed",this.GetGroundSpeed())
            return this.GetGroundSpeed();
            
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.GET_GROUND_SPEED, () => {
            return this.GetGroundSpeed();
        });*/

        this.m_backgroundPrefabs = smc.account.AccountModel.m_backgroundPrefabs;
        this.RefreshBackground();
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_shakeNum > 0) {
            this.m_shakeValue += deltaTime;//震动
            if (this.m_shakeValue > this.m_shakeInterval) {
                this.m_shakeValue = 0;
                this.m_shakeNum--;
                if (this.m_shakeNum <= 0) {
                    this.node.parent!.setPosition(0, 0, 0);
                } else {
                    const value = Math.random() * 20 - 10;
                    const value2 = Math.random() * 20 - 10;
                    this.node.parent!.setPosition(value, value2, 0);
                }
            }
        }
    }

    RefreshBackground() {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        if (userInfo && userInfo.degree) {
            const degreeInfo = degreeConfig.getConfigByID(userInfo.degree);
            if (degreeInfo && degreeInfo.res) {
                let prefab = this.m_backgroundPrefabs[degreeInfo.res];
                if (prefab) {
                    this.SetBackGround(prefab);
                } else {/*
                    resources.load(degreeInfo.res, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.SetBackGround(prefab);
                    });*/
                    oops.res.load(degreeInfo.res, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        this.SetBackGround(prefab);
                    });
                }
            }
        }
    }

    Shake() {
        this.m_shakeNum = 30;
    }

    StartMove() {
        if (this.m_background) {
            this.m_background.StartMove();
        }
    }

    SetBackGround(prefab:any) {
        if (this.m_background) {
            this.m_background.node.removeFromParent();
            this.m_background = null;
        }
        this.node.removeAllChildren();
        const node = instantiate(prefab);
        this.m_background = node.getComponent(BackgroundView);
        this.node.addChild(node);
    }

    SetSpeedRate(rate:any) {
        if (this.m_background) {
            this.m_background.SetSpeedRate(rate);
        }
    }

    StopMove() {
        if (this.m_background) {
            this.m_background.StopMove();
        }
    }

    GetGroundSpeed() {
        if (this.m_background) {
            return this.m_background.GetGroundSpeed();
        }
    }
}


