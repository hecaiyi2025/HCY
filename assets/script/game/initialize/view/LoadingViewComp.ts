/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: bansomin
 * @LastEditTime: 2024-03-31 01:17:02
 */
import { _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { ModuleUtil } from "../../../../../extensions/oops-plugin-framework/assets/module/common/ModuleUtil";
import { DemoViewComp } from "../../account/view/DemoViewComp";
import { smc } from "../../common/SingletonModuleComp";
import { UIID } from "../../common/config/GameUIConfig";
import { GAME_TYPE, LOGIN_URL, NETWORKING, REGISTER_URL } from '../../common/global';
import { NET_DEFINES, WEBSOCKET_URL } from '../../common/global';
import { clearConfigs, IsLoadConfigs, LoadConfigs } from '../../common/config/config';
import { GameNetNode } from "../../../GameNetNode";
const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCVMParentComp {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "0",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    private progress: number = 0;
    xhr:XMLHttpRequest|null=null;
    start() {
        this.enter();
    }

    enter() {
        this.loadRes();
    }

    /** 加载资源 */
    private async loadRes() {
        this.data.progress = 0;
        await this.loadCustom();
        //await this.loadGameRes();
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadCustom() {
        // 加载游戏本地JSON数据的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_json");
        clearConfigs();
        //加载配置
        this.data.prompt="加载配置文件";
        this.data.progress=0;
        //smc.account.AccountModel.m_isLoadconfig=false;
        //console.log("load config finished",IsLoadConfigs());
        
        if (!IsLoadConfigs()) {//这里要改进到全局变量中
            //console.log("load config finished2");
            LoadConfigs(this.onProgressCallback.bind(this),() => {
                //加载完成
                //globalData.InitUserInfo();
                smc.account.AccountModel.InitUserInfo();
                //this.OnChangeToHall();
                
                if (NETWORKING) {
                    this.OnRegister()
                } else {
                    this.loadGameRes();
                }
                });
        }
    }
    //export type ProgressCallback = ((finished: number, total: number, item: AssetManager.RequestItem) => void) | null;
    /** 加载初始游戏内容资源 */
    private loadGameRes() {
        console.log("loadGameRes");
        this.data.prompt="加载游戏资源";
        //this.data.prompt = oops.language.getLangByID("loading_load_game");
        this.data.progress=0;
        smc.account.AccountModel.preLoadAllRes(this.onProgressCallback.bind(this),this.onCompleteCallback.bind(this))
            //this.onProgressCallback(finished,total,null);
        //});
        // 加载初始游戏内容资源的多语言提示文本
        //this.data.prompt = oops.language.getLangByID("loading_load_game");

        //oops.res.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        
        this.data.finished = finished;
        this.data.total = total;

        var progress = finished / total;
        //this.data.progress=progress;
        //console.log("progress=",progress);
        //if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2).toString()+"%";
        //}
        //console.log("onProgressCallback----",progress);
    }

    /** 加载完成事件 */
    private async onCompleteCallback() {
        // 获取用户信息的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_player");

        oops.gui.openAsync(UIID.Loading2).then((node)=>{
            oops.gui.openAsync(UIID.Demo).then(()=>{
                oops.gui.remove(UIID.Loading2);
            }) 
            oops.gui.remove(UIID.Loading);      
       })

        /*
        await ModuleUtil.addViewUiAsync(smc.account, DemoViewComp, UIID.Demo);
        ModuleUtil.removeViewUi(this.ent, LoadingViewComp, UIID.Loading);
        */
    }

    reset(): void { }
     //注册
     OnRegister() {
        if (localStorage.getItem('Immortality')) {
            this.OnLogin(localStorage.getItem('Immortality'))
            return
        }
        let _this = this;
        this.xhr = new XMLHttpRequest();
        this.xhr.onreadystatechange = function () {
            if (_this.xhr&&_this.xhr.readyState == 4) {
                var response = _this.xhr.responseText;
                if (response) {
                    console.log("response:", response);
                    _this.OnLogin(JSON.parse(response).data)
                    localStorage.setItem('Immortality', JSON.parse(response).data)
                } else {
                    /*
                    showMessageBox("提示", "服务器连接失败!", () => {

                        return;
                    });*/
                    oops.gui.open(UIID.Alert,() => {

                        return;
                    });
                }
            }
        };
        this.xhr.onerror = function (evt) {
            console.log("ERROR:", evt);
        }
        this.xhr.open("POST", REGISTER_URL);
        this.xhr.setRequestHeader("Content-Type", "application/json");
        this.xhr.send(`user/registerGuest`);
    }

    //登录
    OnLogin(id:any) {
        let _this = this;
        this.xhr = new XMLHttpRequest();
        this.xhr.onreadystatechange = function () {
            if (_this.xhr&&_this.xhr.readyState == 4) {
                var response = _this.xhr.responseText;
                console.log("loginResponse:", response);
                if (response) {
                    let res = JSON.parse(response);
                    // if (res.error) {
                    //     showMessageBox("错误", res.error, () => {
                    //         localStorage.clear()
                    //         director.loadScene('login');
                    //     }, null, false, 1, null, true, ["创建新账号"]);
                    //     return;
                    // }
                    if (res.error == 'ServiceMaintenance') {/*
                        showMessageBox("错误", '服务维护中', () => {
                            director.loadScene('login');
                        }, null, false, 1, null, true, ["重试"]);*/
                        oops.gui.open(UIID.Alert,() => {

                            return;
                        });
                        return;
                    } else if (res.error == 'UsernameNotFound') {/*
                        showMessageBox("错误", '用户不存在', () => {
                            localStorage.clear()
                            director.loadScene('login');
                        }, null, false, 1, null, true, ["创建新账号"]);*/
                        oops.gui.open(UIID.Alert,() => {

                            return;
                        });
                        return;
                    }
                    if (res.access_token && res.user_info) {
                        localStorage.setItem('token', res.access_token)//////有待改进
                        localStorage.setItem('userId', res.user_info.id)
                        console.log("userId:", res.user_info.id);

                        (oops.tcp.getNetNode() as GameNetNode ).setconnectedCallback((_callback:()=>void)=>{
                                     // 可以在此处发送初始数据到服务器
                                     //if (data.cmdCode != NET_DEFINES.CMDCODE_HEART) {
                                        //data.cmdCode = NET_DEFINES.CMDCODE_LOGIC;
                                    //}
                                    //console.log("send authorization msgsetconnectedCallback finish ");
                                     let str = JSON.stringify({"netCode": NET_DEFINES.NETCODE_BINDING,"cmdCode": NET_DEFINES.CMDCODE_LOGIC,"authorization": res.access_token});
                                     oops.tcp.getNetNode().send(str);
                                     _callback();
                                     _this.loadGameRes();
                        })
                        oops.tcp.getNetNode().connect({url:WEBSOCKET_URL})
                        
                    } else {
                        if (res.msg && res.msg.indexOf('SERVICE_UNAVAILABLE') != -1) {
                            /*
                            showMessageBox("提示", "服务器维护中!", () => {
                                director.loadScene('login');
                            }, null, false, 1, null, true, ["重试"]);*/
                            oops.gui.open(UIID.Alert,() => {

                                return;
                            });
                        } else {/*
                            showMessageBox("错误", res.error, () => {
                                director.loadScene('login');
                            }, null, false, 1, null, true, ["重试"]);*/
                            oops.gui.open(UIID.Alert,() => {

                                return;
                            });
                        }
                    }
                } else {
                    /*
                    showMessageBox("提示", "服务器连接失败!", () => {
                        director.loadScene('login');
                    }, null, false, 1, null, true, ["重试"]);
                    */
                    oops.gui.open(UIID.Alert,() => {

                        return;
                    });

                }
            }
        };
        this.xhr.onerror = function (evt) {
            console.log("ERROR:", evt);
        }
        this.xhr.open("POST", LOGIN_URL);
        this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        this.xhr.setRequestHeader("Authorization", "Basic dXNlcl9kZXRhaWxzOnVzZXJfZGV0YWlscw==");
        this.xhr.send(`guestId=${id}&grant_type=guest`);
    }

    protected onDisable(): void {
        //removeAllMessageListener();
        oops.message.clear();
        //removeAllSocketListener();
        oops.tcp.getNetNode().cleanListeners();
        //if (this.m_loadId) {
           // clearTimeout(this.m_loadId);
            //this.m_loadId = null;
        //}
    }
}