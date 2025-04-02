import { _decorator } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { smc } from "../../common/SingletonModuleComp";
import { clearConfigs, IsLoadConfigs, LoadConfigs } from '../../common/config/config';
import { AD_TYPE, FONT_NAME, GAME_TYPE, MESSAGE_DEFINES, NET_DEFINES, NETWORKING} from '../../common/global';
import {  WEBSOCKET_URL } from '../../common/global';
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { degreeConfig } from '../../common/config/degree';
import { BackgroundController } from '../../background/BackgroundController';
import { Role } from '../../Role/Role';
import { UIID } from "../../common/config/GameUIConfig";




const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('DemoViewComp')
@ecs.register('DemoView', false)
export class DemoViewComp extends CCComp {

    @property(Node)
    public roleController:Node|any=null;

    @property(BackgroundController)
    m_backgroundController: BackgroundController|any = null;
    //缓存角色列表
    m_roleList = []
    timer:any = null
    timer1 :any = null

    onLoad () {
        this.roleController = this.node.getComponentInChildren('HallRoleController');
    }

    start() {
        //加载配置
        if (!smc.account.AccountModel.m_isLoadconfig) {
            LoadConfigs(()=>{},() => {
                //globalData.InitUserInfo();
                smc.account.AccountModel.InitUserInfo();
//                this.m_topController.ShowTop();
                //加载完成
                oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.ARRANGE_LIST.toString(),(res)=>{
                    //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
                    console.log("receive "+NET_DEFINES.ARRANGE_LIST.toString(),res);
                    let data = []
                    if (res.data) {
                        data = JSON.parse(res.data);
                    }
                    data.sort((a:any, b:any) => (a.orderNum - b.orderNum))
                    this.m_roleList = data;
                    smc.account.AccountModel.initRoleList(data);
                    

                    
                    console.log("this.roleController.InitRoles()");
                    this.roleController.InitRoles();
                    this.roleController.InitFriends();
//                  this.m_roleController.InitFriends();
                    let str = JSON.stringify({"netCode": NET_DEFINES.NETCODE_INFORMATION,"cmdCode": 1});
                    oops.tcp.getNetNode().send(str);
                    //sendWebSocketData({ netCode: NET_DEFINES.NETCODE_INFORMATION });
                    oops.message.dispatchEvent(MESSAGE_DEFINES.EXIT_EDIT_SUCCESS.toString());
                    //postMessage(MESSAGE_DEFINES.EXIT_EDIT_SUCCESS);

                })
                /*
                addSocketListener(NET_DEFINES.ARRANGE_LIST, (res) => {
                    let data = []
                    if (res.data) {
                        data = JSON.parse(res.data);
                    }
                    data.sort((a, b) => (a.orderNum - b.orderNum))
                    this.m_roleList = data;
                    globalData.initRoleList(data);
                    this.m_roleController.InitRoles();
                    this.m_roleController.InitFriends();
                    sendWebSocketData({ netCode: NET_DEFINES.NETCODE_INFORMATION });
                    postMessage(MESSAGE_DEFINES.EXIT_EDIT_SUCCESS);
                    // sendWebSocketData({ netCode: NET_DEFINES.POWER_REFRESH, data: { type: 1, scene: 1 } });
                });
                */
                let str = JSON.stringify({"netCode": NET_DEFINES.ARRANGE_LIST,"cmdCode": 1});
                oops.tcp.getNetNode().send(str);
                //sendWebSocketData({ netCode: NET_DEFINES.ARRANGE_LIST });
                if (!NETWORKING) {
                    //smc.role = ecs.getEntity<Role>(Role);
                    this.roleController.InitRoles();
                    this.roleController.InitFriends();
                }
            });
        } else {
                smc.account.AccountModel.InitUserInfo();
//            this.m_topController.ShowTop();
                oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.ARRANGE_LIST.toString(),(res)=>{
                    //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
                    console.log("receive "+NET_DEFINES.ARRANGE_LIST.toString(),res);//1061
                    let data = []
                    if (res.data) {
                        data = JSON.parse(res.data);
                    }
                    data.sort((a:any, b:any) => (a.orderNum - b.orderNum))
                    this.m_roleList = data;
                    smc.account.AccountModel.initRoleList(data);
                    //smc.role = ecs.getEntity<Role>(Role);

                    console.log("this.roleController.InitRoles()");
                    this.roleController.InitRoles();
                    this.roleController.InitFriends();
//                    this.m_roleController.InitRoles();
//                    this.m_roleController.InitFriends();
                    let str = JSON.stringify({"netCode": NET_DEFINES.NETCODE_INFORMATION,"cmdCode": 1});
                    oops.tcp.getNetNode().send(str);
                    //sendWebSocketData({ netCode: NET_DEFINES.NETCODE_INFORMATION });
                    oops.message.dispatchEvent(MESSAGE_DEFINES.EXIT_EDIT_SUCCESS.toString());
                    //postMessage(MESSAGE_DEFINES.EXIT_EDIT_SUCCESS);

                })
                let str = JSON.stringify({"netCode": NET_DEFINES.ARRANGE_LIST,"cmdCode": 1});
                oops.tcp.getNetNode().send(str);
                //sendWebSocketData({ netCode: NET_DEFINES.ARRANGE_LIST });
                if (!NETWORKING) {
                    //smc.role = ecs.getEntity<Role>(Role);
//                    this.m_roleController.InitRoles();
//                    this.m_roleController.InitFriends();
                }
        }
//        changeFont(this.m_main, FONT_NAME);
        oops.message.on(MESSAGE_DEFINES.HALL_TO_BOSSGAME.toString(),() => {
            this.OnChangeToBossGame();
        },this)
        //addMessageListener(MESSAGE_DEFINES.HALL_TO_BOSSGAME, () => {
            //this.OnChangeToBossGame();
        //});

        //addMessageListener(MESSAGE_DEFINES.HALL_TO_PVP, () => {
            //this.OnChangeToPVPGame();
        //});
        oops.message.on(MESSAGE_DEFINES.HALL_TO_PVP.toString(),() => {
            this.OnChangeToBossGame();
        },this)

        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.NETCODE_INFORMATION.toString(),(res)=>{
            let data = JSON.parse(res.data);
            console.log("个人信息:", data);
            localStorage.setItem('LoginMethod', data.loginMethod)                                      //待改进
            const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
            if (userInfo && userInfo.degree) {
                const degreeInfo = degreeConfig.getConfigByID(userInfo.degree);
                console.log("之前的等级：", userInfo.degree);
                console.log("当前的等级：", data.levelsConfig);
                const degreeInfo2 = degreeConfig.getConfigByID(data.levelsConfig);
                if (degreeInfo && degreeInfo2 && degreeInfo2.levels > degreeInfo.levels) {
                    console.log("恭喜您过关了：第" + userInfo.degree + "关 -> 第" + data.levelsConfig + "关");
//                    if (this.m_controller) {
//                        this.m_controller.ShowUpDegree(userInfo.degree, data.levelsConfig);
//                    }
                }
            }
            smc.account.AccountModel.getUserInfo().setUserInfo(data);
//            this.m_topController.ShowTop();
//            this.m_roleController.RefreshAddEuqipmentPrice();
//            this.m_roleController.RefreshFetter();
//            this.m_fetterView.RefreshFetter();
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_UP_FRIEND.toString());
            oops.message.dispatchEvent(MESSAGE_DEFINES.GUIDE_CONTROLLER.toString());
            //postMessage(MESSAGE_DEFINES.HALL_UP_FRIEND);
            //postMessage(MESSAGE_DEFINES.GUIDE_CONTROLLER);
            if (this.m_backgroundController) {
                this.m_backgroundController.RefreshBackground();
            }

        })
        /*
        addSocketListener(NET_DEFINES.NETCODE_INFORMATION, (res) => {
            let data = JSON.parse(res.data);
            console.log("个人信息:", data);
            localStorage.setItem('LoginMethod', data.loginMethod)
            const userInfo = globalData.getUserInfo().getUserInfo();
            if (userInfo && userInfo.degree) {
                const degreeInfo = degreeConfig.getConfigByID(userInfo.degree);
                console.log("之前的等级：", userInfo.degree);
                console.log("当前的等级：", data.levelsConfig);
                const degreeInfo2 = degreeConfig.getConfigByID(data.levelsConfig);
                if (degreeInfo && degreeInfo2 && degreeInfo2.levels > degreeInfo.levels) {
                    console.log("恭喜您过关了：第" + userInfo.degree + "关 -> 第" + data.levelsConfig + "关");
                    if (this.m_controller) {
                        this.m_controller.ShowUpDegree(userInfo.degree, data.levelsConfig);
                    }
                }
            }
            globalData.getUserInfo().setUserInfo(data);
            this.m_topController.ShowTop();
            this.m_roleController.RefreshAddEuqipmentPrice();
            this.m_roleController.RefreshFetter();
            this.m_fetterView.RefreshFetter();
            postMessage(MESSAGE_DEFINES.HALL_UP_FRIEND);
            postMessage(MESSAGE_DEFINES.GUIDE_CONTROLLER);
            if (this.m_backgroundController) {
                this.m_backgroundController.RefreshBackground();
            }
        });
        */
        this.timer = setTimeout(() => {
            let str = JSON.stringify({"netCode": NET_DEFINES.NETCODE_INFORMATION,"cmdCode": 1});
            oops.tcp.getNetNode().send(str);
            //sendWebSocketData({ netCode: NET_DEFINES.NETCODE_INFORMATION });
            clearInterval(this.timer)
            this.timer = null
        }, 100);


        oops.message.on(MESSAGE_DEFINES.EXIT_EDIT_TIMEOUT.toString(),() => {
            this.RefreshRoles();
        },this)
        //阵容编辑超时操作
 //       addMessageListener(MESSAGE_DEFINES.EXIT_EDIT_TIMEOUT, () => {
 //           this.RefreshRoles()
 //       });

        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.FRIEND_ADD.toString(),(res)=>{
            if (this.timer1) {
                clearTimeout(this.timer1)
                this.timer1 = null
            }
            let str1 = JSON.stringify({"netCode": NET_DEFINES.ARRANGE_LIST,"cmdCode": 1});
            oops.tcp.getNetNode().send(str1);
            let str2 = JSON.stringify({"netCode": NET_DEFINES.POWER_REFRESH,"cmdCode": 1});
            oops.tcp.getNetNode().send(str2);


        });
        /*
        addSocketListener(NET_DEFINES.FRIEND_ADD, (res) => {
            if (this.timer1) {
                clearTimeout(this.timer1)
                this.timer1 = null
            }
            sendWebSocketData({ netCode: NET_DEFINES.ARRANGE_LIST });
            sendWebSocketData({ netCode: NET_DEFINES.POWER_REFRESH, data: { type: 0, scene: 1 } });
        });*/
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.SIGN_UPGRADE.toString(),(res)=>{

            let str1 = JSON.stringify({"netCode": NET_DEFINES.ARRANGE_LIST,"cmdCode": 1});
            oops.tcp.getNetNode().send(str1);
            let str2 = JSON.stringify({"netCode": NET_DEFINES.POWER_REFRESH,"cmdCode": 1});
            oops.tcp.getNetNode().send(str2);
        });
        /*
        addSocketListener(NET_DEFINES.SIGN_UPGRADE, (res) => {
            sendWebSocketData({ netCode: NET_DEFINES.ARRANGE_LIST });
            sendWebSocketData({ netCode: NET_DEFINES.POWER_REFRESH, data: { type: 0, scene: 1 } });
        });
        */
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.MESSAGE_ADD_ITEM.toString(),(res)=>{

            let str1 = JSON.stringify({"netCode": NET_DEFINES.ARRANGE_LIST,"cmdCode": 1});
            oops.tcp.getNetNode().send(str1);

        });
        /*
        addSocketListener(NET_DEFINES.MESSAGE_ADD_ITEM, (res) => {
            sendWebSocketData({ netCode: NET_DEFINES.ARRANGE_LIST });
        });*/

        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.NETCODE_ADD_POWER.toString(),(res)=>{

            let str1 = JSON.stringify({"netCode": NET_DEFINES.NETCODE_INFORMATION,"cmdCode": 1});
            oops.tcp.getNetNode().send(str1);

        });
        /*
        addSocketListener(NET_DEFINES.NETCODE_ADD_POWER, (res) => {
            sendWebSocketData({ netCode: NET_DEFINES.NETCODE_INFORMATION });
        });
        */
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.BUY_ITEM_SUCCESS.toString(),(res)=>{

            let data = JSON.parse(res.data);
            //showReward2(data)

        });
        /*
        addSocketListener(NET_DEFINES.BUY_ITEM_SUCCESS, (res) => {
            let data = JSON.parse(res.data);
            showReward2(data)
        });*/

        //拉取装备列表
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.EQUIPMENT_LIST.toString(),(res)=>{
            const data = JSON.parse(res.data);
            console.log("装备列表：", data);
            if (data && data.length > 0) {
                const equipmentList = [];
                for (let i = 0; i < data.length; i++) {
                    const equipment = data[i];
                    if (equipment.isMount == 1) {
                        equipmentList.push(equipment);
                    }
                }
                smc.account.AccountModel.getUserInfo().setEquipmentList(equipmentList);
            } else {
                smc.account.AccountModel.getUserInfo().setEquipmentList([]);
            }

            //postMessage(MESSAGE_DEFINES.EQU_IPMENT_UPDATE);
            oops.message.dispatchEvent(MESSAGE_DEFINES.EQU_IPMENT_UPDATE.toString());
        });
        /*
        addSocketListener(NET_DEFINES.EQUIPMENT_LIST, (res) => {
            const data = JSON.parse(res.data);
            console.log("装备列表：", data);
            if (data && data.length > 0) {
                const equipmentList = [];
                for (let i = 0; i < data.length; i++) {
                    const equipment = data[i];
                    if (equipment.isMount == 1) {
                        equipmentList.push(equipment);
                    }
                }
                globalData.getUserInfo().setEquipmentList(equipmentList);
            } else {
                globalData.getUserInfo().setEquipmentList([]);
            }

            postMessage(MESSAGE_DEFINES.EQU_IPMENT_UPDATE);
        });*/
        let str1 = JSON.stringify({"netCode": NET_DEFINES.EQUIPMENT_LIST,"cmdCode": 1});
        oops.tcp.getNetNode().send(str1);
        //sendWebSocketData({ netCode: NET_DEFINES.EQUIPMENT_LIST });
        //拉取修炼等级
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.EQUIPMENT_LIST.toString(),(res)=>{
            const data = JSON.parse(res.data);
            console.log("修炼信息:", data);
            if (data) {
                smc.account.AccountModel.getUserInfo().setPracticeInfo(data);
            }
        })
        /*
        addSocketListener(NET_DEFINES.PRACTICE_LIST, (res) => {
            const data = JSON.parse(res.data);
            console.log("修炼信息:", data);
            if (data) {
                globalData.getUserInfo().setPracticeInfo(data);
            }
        });*/
        let str11 = JSON.stringify({"netCode": NET_DEFINES.PRACTICE_LIST,"cmdCode": 1});
        oops.tcp.getNetNode().send(str11);
        //sendWebSocketData({ netCode: NET_DEFINES.PRACTICE_LIST });

        //拉取天赋信息
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.TALENT_LIST.toString(),(res)=>{
            const data = JSON.parse(res.data);
            console.log("天赋信息:", data);
            if (data && data.length > 0) {
                const talentList = data.map((item:any) => item.configId);
                console.log("天赋列表:", talentList);
                smc.account.AccountModel.getUserInfo().setTalentList(talentList);
            }
        })
        let str12 = JSON.stringify({"netCode": NET_DEFINES.TALENT_LIST,"cmdCode": 1});
        oops.tcp.getNetNode().send(str12);
        /*
        addSocketListener(NET_DEFINES.TALENT_LIST, (res) => {
            const data = JSON.parse(res.data);
            console.log("天赋信息:", data);
            if (data && data.length > 0) {
                const talentList = data.map((item) => item.configId);
                console.log("天赋列表:", talentList);
                globalData.getUserInfo().setTalentList(talentList);
            }
        });
        sendWebSocketData({ netCode: NET_DEFINES.TALENT_LIST });
        */
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.USER_INFO.toString(),(res)=>{
            let str12 = JSON.stringify({"netCode": NET_DEFINES.NETCODE_INFORMATION,"cmdCode": 1});
            oops.tcp.getNetNode().send(str12);
        })
        //addSocketListener(NET_DEFINES.USER_INFO, (res) => {
            //sendWebSocketData({ netCode: NET_DEFINES.NETCODE_INFORMATION });
        //});

//       this.m_fetterView.RefreshFetter();
        if (!NETWORKING) {//单机版本时播放过关动画
            const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
            if (userInfo && userInfo.degree) {
                const degreeInfo = degreeConfig.getConfigByID(userInfo.degree);
                const degreeInfo2 = degreeConfig.getConfigByID(userInfo.lastDegree);
                console.log("之前的等级：", userInfo.lastDegree);
                console.log("当前的等级：", userInfo.degree);
                if (degreeInfo && degreeInfo2 && degreeInfo.levels > degreeInfo2.levels) {
                    console.log("恭喜您过关了：第" + userInfo.lastDegree + "关 -> 第" + userInfo.degree + "关");
//                    if (this.m_controller) {
//                       this.m_controller.ShowUpDegree(userInfo.lastDegree, userInfo.degree);
//                    }
                }
            }
        }
        // if (this.m_controller) {
        //     this.m_controller.ShowUpDegree(7002, 7003);
        // }
    }

    update(deltaTime: number) {

    }

    protected onEnable(): void {

    }

    //刷新阵容
    RefreshRoles() {
        if (this.timer1) {
            clearTimeout(this.timer1)
            this.timer1 = null
        }
        this.timer1 = setTimeout(() => {
            smc.account.AccountModel.initRoleList(this.m_roleList);
//            this.m_roleController.InitRoles();
//            this.m_roleController.InitFriends();
            clearTimeout(this.timer1)
            this.timer1 = null
//            showMessage('网络超时')
        }, 2000);
    }

    // m_lastProgress = 0;
    OnChangeToGame() {
        if (NETWORKING) {
            const userInfo = smc.account.AccountModel.getUserInfo();
            if (userInfo && userInfo.useStamina()) {
                oops.gui.open(UIID.Game);
                oops.gui.remove(UIID.Demo, false);
                // postMessage(MESSAGE_DEFINES.HALL_STAMINA_CHANGE);
                //changeScene('game', this.m_loadingNode, this.m_progressLabel);
            } else {
                //showMessageBox("提示", "体力不足", () => { });
                console.log("体力不足");
            }
        } else {
            const userInfo = smc.account.AccountModel.getUserInfo();
            if (userInfo && userInfo.useStamina()) {
                //let stamina = constantConfig.getConfigByID(12033).parameter1
                //userInfo.getUserInfo().physicalStrength -= stamina;
                //changeScene('game', this.m_loadingNode, this.m_progressLabel);
            } else {
                //showMessageBox("提示", "体力不足", () => { });
                console.log("体力不足");
            }
        }
    }

    OnChangeToBossGame() {
        if (NETWORKING) {
            const userInfo = smc.account.AccountModel.getUserInfo();
            if (userInfo && userInfo.useStamina()) {
                // postMessage(MESSAGE_DEFINES.HALL_STAMINA_CHANGE);
                //changeScene('bossgame', this.m_loadingNode, this.m_progressLabel);
            } else {
                //showMessageBox("提示", "体力不足", () => { });
            }
        } else {
            const userInfo = smc.account.AccountModel.getUserInfo();
            if (userInfo && userInfo.useStamina()) {
                //let stamina = constantConfig.getConfigByID(12033).parameter1
                //userInfo.getUserInfo().physicalStrength -= stamina;
                //changeScene('bossgame', this.m_loadingNode, this.m_progressLabel);
            } else {
                //showMessageBox("提示", "体力不足", () => { });
            }
        }
    }

    OnChangeToPVPGame() {
        if (NETWORKING) {
            const userInfo = smc.account.AccountModel.getUserInfo();
            if (userInfo && userInfo.useStamina()) {
                // postMessage(MESSAGE_DEFINES.HALL_STAMINA_CHANGE);
                //changeScene('pvp', this.m_loadingNode, this.m_progressLabel);
            } else {
                //showMessageBox("提示", "体力不足", () => { });
            }
        } else {
            const userInfo = smc.account.AccountModel.getUserInfo();
            if (userInfo && userInfo.useStamina()) {
                //let stamina = constantConfig.getConfigByID(12033).parameter1
                //userInfo.getUserInfo().physicalStrength -= stamina;
                //changeScene('pvp', this.m_loadingNode, this.m_progressLabel);
            } else {
                //showMessageBox("提示", "体力不足", () => { });
            }
        }
    }

    OnClearStorage() {
        localStorage.clear();
        //destroyGlobalData();
        clearConfigs();
        //director.loadScene('login');
    }

    OnAddMoney() {
//        showAD(AD_TYPE.MONEY, 10000);
        // if (NETWORKING) {
        //     sendWebSocketData({ netCode: NET_DEFINES.MESSAGE_ADD_ITEM, data: [{ "num": 1000000, "id": 1 }] });
        // } else {
        //     const money = Number(globalData.getUserInfo().getMoney());
        //     globalData.getUserInfo().setMoney(money + 100000);
        //     globalData.getUserInfo().saveInfo();
        //     postMessage(MESSAGE_DEFINES.HALL_GOLD_CHANGE);
        // }
    }

    OnAddDiamond() {
//        showAD(AD_TYPE.DIAMOND, 1000);
        // sendWebSocketData({ netCode: NET_DEFINES.MESSAGE_ADD_ITEM, data: [{ "num": 1000000, "id": 2 }] });
    }

    OnAddPower() {
//        showAD(AD_TYPE.STAMINA, 60);
    }


    protected onDisable(): void {
       // removeAllMessageListener();
        oops.message.clear();
        //removeAllSocketListener();
        oops.tcp.getNetNode().cleanListeners()
    }

    protected onDestroy(): void {
        clearInterval(this.timer)
        this.timer = null
    }

    OnGotoConfig() {
 //       director.loadScene('editor');
    }

    reset() {
        this.node.destroy();
    }
}