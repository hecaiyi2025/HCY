import { _decorator, Button, Component, Event, EventHandler, find, instantiate, Label, Node, Prefab, resources, UIOpacity, UITransform, view } from 'cc';
import { HallRoleView } from './HallRoleView';
import { cloudsConfig } from '../game/common/config/clouds';
import { DEFAULT_CLOUD_TYPE, formatNum, MESSAGE_DEFINES, NET_DEFINES, NETWORKING, OPER_ID, ROLE_OPER_TYPE, ROLE_TYPE } from '../game/common/global';
//import { globalData } from '../../data/globalData';
import { checkPriceColor} from '../game/common/publicFunctions';
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { smc } from "../game/common/SingletonModuleComp";
import { friendConfig } from '../game/common/config/friend';
import { friendLevelConfig } from '../game/common/config/friend_level';
import { cloudsLevelConfig } from '../game/common/config/clouds_level';
import { petConfig } from '../game/common/config/petConfig';
import { BasePet } from './BasePet';
import { Logger } from 'db://oops-framework/core/common/log/Logger';

const { ccclass, property } = _decorator;

@ccclass('HallRoleController')
export class HallRoleController extends Component {
    @property(Prefab)
    gridPrefab: Prefab|null = null;
    @property(Node)
    roleLayout: Node|null = null;
    @property(Node)
    friendLayout: Node|null = null;
    @property(Node)
    addButton: Node|null = null;
    @property(Node)
    bg: Node|null = null;
    @property(Node)
    deleteButton: Node|null = null;
    @property(Node)
    addFriendNode: Node|null = null;
    @property(Node)
    addFriendContent: Node|null = null;
    @property(Node)
    changePetNode: Node|null = null;
    @property(Node)
    changePetContent: Node|null = null;
    //红点
    @property(Node)
    m_redPoint: Node|null = null;

    @property(Label)
    addCloudPriceLabel: Label|null = null;

    m_movingNode: Node|null = null;
    m_delete: boolean = false;
    m_rolePrefabs :{[key:string]:any}= {};
    m_cloudPrefabs:{[key:string]:any} = {};
    m_petPrefabs:{[key:string]:any} = {};

    //id映射节点
    m_idToNode:{[key:string|number]:any} = {};

    //添加道友对应祥云信息
    m_addFriendInfo = null;

    //是否拥有宠物
    m_hasPet: boolean = false;

    //阵容正确编辑标识符
    m_isRight: boolean = true;
    start() {
        //获取可拖动的角色列表
        oops.message.on(MESSAGE_DEFINES.HALL_GET_GRID_LIST.toString(),() => {
                return this.friendLayout!.children;
                },this);
        /*
        addMessageListener(MESSAGE_DEFINES.HALL_GET_GRID_LIST, () => {
            return this.friendLayout.children;
        });*/

        //获取删除按钮
        oops.message.on(MESSAGE_DEFINES.HALL_GET_DELETE_BUTTON.toString(),() => {
            return this.deleteButton!;
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_GET_DELETE_BUTTON, () => {
            return this.deleteButton;
        });*/

        //阵容编辑正确标识符
        oops.message.on(MESSAGE_DEFINES.EXIT_EDIT_SUCCESS.toString(),() => {
            this.m_isRight = true;
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.EXIT_EDIT_SUCCESS, () => {
            this.m_isRight = true;
        });*/

        //开始拖拽角色
        oops.message.on(MESSAGE_DEFINES.HALL_MOVING_FRIEND.toString(),(...arg:any) => {
            this.m_movingNode = arg[1];
            this.deleteButton!.active = true;
            for (let i = 0; i < this.friendLayout!.children.length; i++) {
                const child = this.friendLayout!.children[i];
                const roleScript = child.getComponent(HallRoleView);
                const roleScript2 = arg[1].getComponent(HallRoleView);
                if (roleScript && roleScript.GetInfo()!.uuid == roleScript2.GetInfo().uuid) {//找到正在拖拽的那个节点的组件
                    roleScript.ShowBody(false);
                }
                // const siblingIndex = child.getSiblingIndex();
                // console.log("第" + i + "个节点的siblingIndex:", siblingIndex);
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_MOVING_FRIEND, (res) => {
            this.m_movingNode = res;
            this.deleteButton.active = true;
            for (let i = 0; i < this.friendLayout.children.length; i++) {
                const child = this.friendLayout.children[i];
                const roleScript = child.getComponent(HallRoleView);
                const roleScript2 = res.getComponent(HallRoleView);
                if (roleScript && roleScript.GetInfo().uuid == roleScript2.GetInfo().uuid) {
                    roleScript.ShowBody(false);
                }
                // const siblingIndex = child.getSiblingIndex();
                // console.log("第" + i + "个节点的siblingIndex:", siblingIndex);
            }
        });*/

        //结束拖拽角色
        oops.message.on(MESSAGE_DEFINES.HALL_MOVING_FRIEND_END.toString(),(res) => {
            this.deleteButton!.active = false;
            if (this.m_delete) {
                oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_DELETE_FRIEND.toString(),this.m_movingNode);
                //postMessage(MESSAGE_DEFINES.HALL_DELETE_FRIEND, this.m_movingNode);
                this.m_delete = false;
            }
            for (let i = 0; i < this.friendLayout!.children.length; i++) {
                const child = this.friendLayout!.children[i];
                const roleScript = child.getComponent(HallRoleView);
                if (roleScript) {
                    roleScript.ShowBody(true);
                }
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_MOVING_FRIEND_END, () => {
            this.deleteButton.active = false;
            if (this.m_delete) {
                postMessage(MESSAGE_DEFINES.HALL_DELETE_FRIEND, this.m_movingNode);
                this.m_delete = false;
            }
            for (let i = 0; i < this.friendLayout.children.length; i++) {
                const child = this.friendLayout.children[i];
                const roleScript = child.getComponent(HallRoleView);
                if (roleScript) {
                    roleScript.ShowBody(true);
                }
            }
        });*/

        //进入删除按钮范围
        oops.message.on(MESSAGE_DEFINES.HALL_INTO_DELETE_BUTTON.toString(),() => {
            this.deleteButton!.setScale(1.2, 1.2, 1);
            this.m_delete = true;
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_INTO_DELETE_BUTTON, () => {
            this.deleteButton.setScale(1.2, 1.2, 1);
            this.m_delete = true;
        });*/

        //离开删除按钮范围
        oops.message.on(MESSAGE_DEFINES.HALL_OUT_DELETE_BUTTON.toString(),() => {
            this.deleteButton!.setScale(1, 1, 1);
            this.m_delete = false;
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_OUT_DELETE_BUTTON, () => {
            this.deleteButton.setScale(1, 1, 1);
            this.m_delete = false;
        });*/

        //替换角色
        oops.message.on(MESSAGE_DEFINES.HALL_SWITCH_FRIEND.toString(),(...arg:any) => {
            let switchNode = null;
            let switchIndex = 0;
            let orginNode = null;
            let orginIndex = 0;
            for (let i = 0; i < this.friendLayout!.children.length; i++) {
                const child = this.friendLayout!.children[i];
                const roleScript = child.getComponent(HallRoleView);
                const roleScript2 = arg[1].getComponent(HallRoleView);
                const roleScript3 = this.m_movingNode!.getComponent(HallRoleView);
                if (roleScript && roleScript.GetInfo()!.uuid == roleScript2.GetInfo().uuid) {
                    switchNode = child;
                    switchIndex = i;
                }
                if (roleScript && roleScript.GetInfo()!.uuid == roleScript3!.GetInfo()!.uuid) {
                    orginNode = child;
                    orginIndex = i;
                }
            }
            // switchNode.setSiblingIndex(orginIndex);
            // orginNode.setSiblingIndex(switchIndex);
            if (switchIndex > orginIndex) {
                // console.log("向下移动");
                // for (let i = 0; i < this.friendLayout.children.length; i++) {
                //     const child = this.friendLayout.children[i];
                //     const siblingIndex = child.getSiblingIndex();
                //     const siblingIndex2 = orginNode.getComponent(HallRoleView);
                //     const siblingIndex3 = switchNode.getComponent(HallRoleView);
                //     if (siblingIndex < siblingIndex2) {
                //         //不动
                //     } else if (siblingIndex > siblingIndex2 && siblingIndex <= siblingIndex3) {
                //         child.setSiblingIndex(child.getSiblingIndex() - 1)
                //     } else {
                //         //不动
                //     }
                //     orginNode.setSiblingIndex(switchIndex);
                // }
                switchNode!.setSiblingIndex(orginIndex);
                orginNode!.setSiblingIndex(switchIndex);
            } else if (switchIndex < orginIndex) {
                // console.log("向上移动");
                // for (let i = 0; i < this.friendLayout.children.length; i++) {
                //     const child = this.friendLayout.children[i];
                //     const siblingIndex = child.getSiblingIndex();
                //     const siblingIndex2 = orginNode.getComponent(HallRoleView);
                //     const siblingIndex3 = switchNode.getComponent(HallRoleView);
                //     if (siblingIndex < siblingIndex3) {
                //         //不动
                //     } else if (siblingIndex >= siblingIndex3 && siblingIndex < siblingIndex2) {
                //         child.setSiblingIndex(child.getSiblingIndex() + 1)
                //     } else {
                //         //不动
                //     }
                //     orginNode.setSiblingIndex(switchIndex);
                // }
                switchNode!.setSiblingIndex(orginIndex);
                orginNode!.setSiblingIndex(switchIndex);
            } else {
                console.log("不应该啊！");
            }

            if (NETWORKING) {
                let orginScript = orginNode!.getComponent(HallRoleView)!.GetInfo();
                let switchScript = switchNode!.getComponent(HallRoleView)!.GetInfo();
                if (this.m_isRight) {
                    let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_ADD, data: [{ "oldId": orginScript!.id, "newId": orginScript!.id, "operateId": OPER_ID.CHANGE, id: orginScript!.uuid, orderNum: switchScript!.orderNum }, { "oldId": switchScript!.id, "newId": switchScript!.id, "operateId": OPER_ID.CHANGE, id: switchScript!.uuid, orderNum: orginScript!.orderNum }] ,"cmdCode": 1});
                    oops.tcp.getNetNode().send(str);
                    //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [{ "oldId": orginScript.id, "newId": orginScript.id, "operateId": OPER_ID.CHANGE, id: orginScript.uuid, orderNum: switchScript.orderNum }, { "oldId": switchScript.id, "newId": switchScript.id, "operateId": OPER_ID.CHANGE, id: switchScript.uuid, orderNum: orginScript.orderNum }] });
                    //postMessage(MESSAGE_DEFINES.EXIT_EDIT_TIMEOUT);
                    oops.message.dispatchEvent(MESSAGE_DEFINES.EXIT_EDIT_TIMEOUT.toString());
                }
                this.m_isRight = false;
            } else {
                // 保存
                const childList = this.friendLayout!.children;
                childList.sort((a, b) => {
                    return a.getSiblingIndex() - b.getSiblingIndex();
                });
                const uuidList = [];
                for (let i = 0; i < childList.length; i++) {
                    const child = childList[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript) {
                        const roleInfo = roleScript.GetInfo();
                        if (roleInfo) {
                            uuidList.push(roleInfo.uuid);
                        }
                    }
                }
                smc.account.AccountModel.getUserInfo().switchCloud(uuidList, orginNode, switchNode);
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_SWITCH_FRIEND, (res) => {
            let switchNode = null;
            let switchIndex = 0;
            let orginNode = null;
            let orginIndex = 0;
            for (let i = 0; i < this.friendLayout.children.length; i++) {
                const child = this.friendLayout.children[i];
                const roleScript = child.getComponent(HallRoleView);
                const roleScript2 = res.getComponent(HallRoleView);
                const roleScript3 = this.m_movingNode.getComponent(HallRoleView);
                if (roleScript && roleScript.GetInfo().uuid == roleScript2.GetInfo().uuid) {
                    switchNode = child;
                    switchIndex = i;
                }
                if (roleScript && roleScript.GetInfo().uuid == roleScript3.GetInfo().uuid) {
                    orginNode = child;
                    orginIndex = i;
                }
            }
            // switchNode.setSiblingIndex(orginIndex);
            // orginNode.setSiblingIndex(switchIndex);
            if (switchIndex > orginIndex) {
                // console.log("向下移动");
                // for (let i = 0; i < this.friendLayout.children.length; i++) {
                //     const child = this.friendLayout.children[i];
                //     const siblingIndex = child.getSiblingIndex();
                //     const siblingIndex2 = orginNode.getComponent(HallRoleView);
                //     const siblingIndex3 = switchNode.getComponent(HallRoleView);
                //     if (siblingIndex < siblingIndex2) {
                //         //不动
                //     } else if (siblingIndex > siblingIndex2 && siblingIndex <= siblingIndex3) {
                //         child.setSiblingIndex(child.getSiblingIndex() - 1)
                //     } else {
                //         //不动
                //     }
                //     orginNode.setSiblingIndex(switchIndex);
                // }
                switchNode.setSiblingIndex(orginIndex);
                orginNode.setSiblingIndex(switchIndex);
            } else if (switchIndex < orginIndex) {
                // console.log("向上移动");
                // for (let i = 0; i < this.friendLayout.children.length; i++) {
                //     const child = this.friendLayout.children[i];
                //     const siblingIndex = child.getSiblingIndex();
                //     const siblingIndex2 = orginNode.getComponent(HallRoleView);
                //     const siblingIndex3 = switchNode.getComponent(HallRoleView);
                //     if (siblingIndex < siblingIndex3) {
                //         //不动
                //     } else if (siblingIndex >= siblingIndex3 && siblingIndex < siblingIndex2) {
                //         child.setSiblingIndex(child.getSiblingIndex() + 1)
                //     } else {
                //         //不动
                //     }
                //     orginNode.setSiblingIndex(switchIndex);
                // }
                switchNode.setSiblingIndex(orginIndex);
                orginNode.setSiblingIndex(switchIndex);
            } else {
                console.log("不应该啊！");
            }

            if (NETWORKING) {
                let orginScript = orginNode.getComponent(HallRoleView).GetInfo();
                let switchScript = switchNode.getComponent(HallRoleView).GetInfo();
                if (this.m_isRight) {
                    sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [{ "oldId": orginScript.id, "newId": orginScript.id, "operateId": OPER_ID.CHANGE, id: orginScript.uuid, orderNum: switchScript.orderNum }, { "oldId": switchScript.id, "newId": switchScript.id, "operateId": OPER_ID.CHANGE, id: switchScript.uuid, orderNum: orginScript.orderNum }] });
                    postMessage(MESSAGE_DEFINES.EXIT_EDIT_TIMEOUT);
                }
                this.m_isRight = false;
            } else {
                // 保存
                const childList = this.friendLayout.children;
                childList.sort((a, b) => {
                    return a.getSiblingIndex() - b.getSiblingIndex();
                });
                const uuidList = [];
                for (let i = 0; i < childList.length; i++) {
                    const child = childList[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript) {
                        const roleInfo = roleScript.GetInfo();
                        if (roleInfo) {
                            uuidList.push(roleInfo.uuid);
                        }
                    }
                }
                globalData.getUserInfo().switchCloud(uuidList, orginNode, switchNode);
            }
        });*/

        //删除角色
        oops.message.on(MESSAGE_DEFINES.HALL_DELETE_FRIEND.toString(),(...arg:any) => {
            const roleScript = arg[1].getComponent(HallRoleView);
            if (roleScript) {
                const roleInfo = roleScript.GetInfo();
                if (roleInfo) {
                    if (NETWORKING) {
                        let updateData = [];
                        let cloudList = smc.account.AccountModel.getUserInfo().getCloudList();
                        for (const item of cloudList) {
                            if (item.orderNum > roleInfo.orderNum) {
                                updateData.push({ "oldId": item.id, "newId": item.id, "operateId": OPER_ID.CHANGE, id: item.uuid, orderNum: item.orderNum - 1 })
                            }
                        }
                        if (this.m_isRight) {
                            if (roleInfo.friendInfo) {
                                let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_ADD, data: [...updateData, { "oldId": roleInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.uuid }, { "oldId": roleInfo.friendInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.friendInfo.uuid }] ,"cmdCode": 1});
                                oops.tcp.getNetNode().send(str);
                                //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [...updateData, { "oldId": roleInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.uuid }, { "oldId": roleInfo.friendInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.friendInfo.uuid }] });
                            } else {
                                let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_ADD, data: [...updateData, { "oldId": roleInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.uuid }] ,"cmdCode": 1});
                                oops.tcp.getNetNode().send(str);
                                //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [...updateData, { "oldId": roleInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.uuid }] });
                            }
                        }
                        this.m_isRight = false;
                    } else {
                        smc.account.AccountModel.getUserInfo().deleteCloud(roleInfo.uuid);
                        arg[1].removeFromParent(); //删除节点
                    }
                }
            }
            this.RefreshAddEuqipmentButton();
            this.RefreshFetter();

            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_DELETE_FRIEND, (res) => {
            const roleScript = res.getComponent(HallRoleView);
            if (roleScript) {
                const roleInfo = roleScript.GetInfo();
                if (roleInfo) {
                    if (NETWORKING) {
                        let updateData = [];
                        let cloudList = globalData.getUserInfo().getCloudList();
                        for (const item of cloudList) {
                            if (item.orderNum > roleInfo.orderNum) {
                                updateData.push({ "oldId": item.id, "newId": item.id, "operateId": OPER_ID.CHANGE, id: item.uuid, orderNum: item.orderNum - 1 })
                            }
                        }
                        if (this.m_isRight) {
                            if (roleInfo.friendInfo) {
                                sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [...updateData, { "oldId": roleInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.uuid }, { "oldId": roleInfo.friendInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.friendInfo.uuid }] });
                            } else {
                                sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [...updateData, { "oldId": roleInfo.id, "newId": 0, "operateId": OPER_ID.SUB, id: roleInfo.uuid }] });
                            }
                        }
                        this.m_isRight = false;
                    } else {
                        globalData.getUserInfo().deleteCloud(roleInfo.uuid);
                        res.removeFromParent(); //删除节点
                    }
                }
            }
            this.RefreshAddEuqipmentButton();
            this.RefreshFetter();
        });*/

        //添加道友
        oops.message.on(MESSAGE_DEFINES.HALL_SHOW_ADD_FRIEND.toString(),(...arg:any) => {
            this.m_addFriendInfo = arg[1]
            this.addFriendNode!.active = true;
            if (NETWORKING) {
                let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_LIST,"cmdCode": 1});
                oops.tcp.getNetNode().send(str);
                //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_LIST });
            } else {
                this.OnShowAddFriend(arg[1]);
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_SHOW_ADD_FRIEND, (data) => {
            this.m_addFriendInfo = data
            this.addFriendNode.active = true;
            if (NETWORKING) {
                sendWebSocketData({ netCode: NET_DEFINES.FRIEND_LIST });
            } else {
                this.OnShowAddFriend(data);
            }
        });*/

        //金币改变
        oops.message.on(MESSAGE_DEFINES.HALL_GOLD_CHANGE.toString(),() => {
            this.RefreshAddEuqipmentPrice();
            console.log("NET_DEFINES.HALL_GOLD_CHANGE");
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_GOLD_CHANGE, () => {
            this.RefreshAddEuqipmentPrice();
            console.log("NET_DEFINES.HALL_GOLD_CHANGE");
        });*/

        //装备升级
        oops.message.on(MESSAGE_DEFINES.HALL_UP_CLOUD.toString(),(...arg:any) => {
            this.RefreshAddEuqipmentButton();
            if (this.friendLayout && this.friendLayout.children && this.friendLayout.children.length) {
                for (let i = 0; i < this.friendLayout.children.length; i++) {
                    const child = this.friendLayout.children[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript) {
                        roleScript.ShowUpPriceAndProperty();
                    }
                }
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_UP_CLOUD, (data) => {
            this.RefreshAddEuqipmentButton();
            if (this.friendLayout && this.friendLayout.children && this.friendLayout.children.length) {
                for (let i = 0; i < this.friendLayout.children.length; i++) {
                    const child = this.friendLayout.children[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript) {
                        roleScript.ShowUpPriceAndProperty();
                    }
                }
            }
        });*/

        //道友升级
        oops.message.on(MESSAGE_DEFINES.HALL_UP_FRIEND.toString(),(...arg:any) => {
            this.RefreshAddEuqipmentButton();
            if (this.friendLayout && this.friendLayout.children && this.friendLayout.children.length) {
                for (let i = 0; i < this.friendLayout.children.length; i++) {
                    const child = this.friendLayout.children[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript) {
                        roleScript.ShowUpPriceAndProperty();
                    }
                }
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_UP_FRIEND, (data) => {
            this.RefreshAddEuqipmentButton();
            if (this.friendLayout && this.friendLayout.children && this.friendLayout.children.length) {
                for (let i = 0; i < this.friendLayout.children.length; i++) {
                    const child = this.friendLayout.children[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript) {
                        roleScript.ShowUpPriceAndProperty();
                    }
                }
            }
        });*/

        //切换宠物
        oops.message.on(MESSAGE_DEFINES.HALL_CHANGE_PET.toString(),(...arg:any) => {
            if (this.roleLayout && this.roleLayout.children) {
                for (let i = 0; i < this.roleLayout.children.length; i++) {
                    const child = this.roleLayout.children[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript && roleScript.GetType() == ROLE_TYPE.MAIN && arg[1].res) {
                        const petPath = arg[1].res;
                        roleScript.ShowPet(this.m_petPrefabs[petPath], petPath, (pet:any) => {
                            if (pet) {
                                let button = pet.getComponent(Button);
                                if (!button) {
                                    button = pet.addComponent(Button);
                                }
                                if (button) {
                                    const clickEventHandler = new EventHandler();
                                    clickEventHandler.target = this.node;
                                    clickEventHandler.component = 'HallRoleController';
                                    clickEventHandler.handler = 'OnClickPet';
                                    button.clickEvents.push(clickEventHandler);
                                }
                            }
                        });
                    }
                }
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_CHANGE_PET, (data) => {
            if (this.roleLayout && this.roleLayout.children) {
                for (let i = 0; i < this.roleLayout.children.length; i++) {
                    const child = this.roleLayout.children[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript && roleScript.GetType() == ROLE_TYPE.MAIN && data.res) {
                        const petPath = data.res;
                        roleScript.ShowPet(this.m_petPrefabs[petPath], petPath, (pet) => {
                            if (pet) {
                                let button = pet.getComponent(Button);
                                if (!button) {
                                    button = pet.addComponent(Button);
                                }
                                if (button) {
                                    const clickEventHandler = new EventHandler();
                                    clickEventHandler.target = this.node;
                                    clickEventHandler.component = 'HallRoleController';
                                    clickEventHandler.handler = 'OnClickPet';
                                    button.clickEvents.push(clickEventHandler);
                                }
                            }
                        });
                    }
                }
            }
        });*/

        //添加道友
        oops.message.on(MESSAGE_DEFINES.HALL_ADD_FRIEND.toString(),(...arg:any) => {
            this.RefreshFetter();
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_ADD_FRIEND, () => {
            this.RefreshFetter();
        });*/

        //添加宠物
        oops.message.on(MESSAGE_DEFINES.HALL_SHOW_ADD_PET.toString(),(...arg:any) => {
            this.changePetNode!.active = true;
            if (NETWORKING) {
                //学进后续补充
                let str = JSON.stringify({"netCode": NET_DEFINES.PET_LIST,"cmdCode": 1});
                oops.tcp.getNetNode().send(str);
                //sendWebSocketData({ netCode: NET_DEFINES.PET_LIST });
            } else {
                this.OnShowChangePet(arg[1]);
            }
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.HALL_SHOW_ADD_PET, (data) => {
            this.changePetNode.active = true;
            if (NETWORKING) {
                //学进后续补充
                sendWebSocketData({ netCode: NET_DEFINES.PET_LIST });
            } else {
                this.OnShowChangePet(data);
            }
        });*/
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.FRIEND_LIST.toString(),(res)=>{
                //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量,与杨一样
                if (this.node.parent!.active) {
                    let data = JSON.parse(res.data);
                    this.OnShowAddFriend(data);
                    console.log('hall');
                }
                           
        });
        /*
        addSocketListener(NET_DEFINES.FRIEND_LIST, (res) => {
            if (this.node.parent.active) {
                let data = JSON.parse(res.data);
                this.OnShowAddFriend(data);
                console.log('hall');

            }
        });*/

        this.m_rolePrefabs = smc.account.AccountModel.m_rolePrefabs;
        this.m_cloudPrefabs = smc.account.AccountModel.m_cloudPrefabs;
        this.m_petPrefabs = smc.account.AccountModel.m_petPrefabs;

        this.RefreshAddEuqipmentPrice();
        console.log("HallRoleController start");
    }
    update(deltaTime: number) {

    }

    protected onEnable(): void {
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.PET_LIST.toString(),(res)=>{
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量,与杨一样
            if (this.node.parent!.active) {
                if (res.data) {
                    let data = JSON.parse(res.data);
                    if (data) {
                        this.OnShowChangePet(data);
                        if (this.roleLayout!.children.length > 0) {
                            let roleAddPetButton = this.roleLayout!.children[0];
                            if (!data.length) {
                                this.m_hasPet = false;
                                roleAddPetButton.getComponent(HallRoleView)!.ShowAddPetButton(this.m_hasPet)
                            } else {
                                this.m_hasPet = true
                                roleAddPetButton.getComponent(HallRoleView)!.ShowAddPetButton(this.m_hasPet)
                            }
                        }
                    }
                }
            }               
        });
        /*
        addSocketListener(NET_DEFINES.PET_LIST, (res) => {
            if (this.node.parent.active) {
                if (res.data) {
                    let data = JSON.parse(res.data);
                    if (data) {
                        this.OnShowChangePet(data);
                        if (this.roleLayout.children.length > 0) {
                            let roleAddPetButton = this.roleLayout.children[0];
                            if (!data.length) {
                                this.m_hasPet = false;
                                roleAddPetButton.getComponent(HallRoleView).ShowAddPetButton(this.m_hasPet)
                            } else {
                                this.m_hasPet = true
                                roleAddPetButton.getComponent(HallRoleView).ShowAddPetButton(this.m_hasPet)
                            }
                        }
                    }
                }
            }
        });*/
        //sendWebSocketData({ netCode: NET_DEFINES.PET_LIST });
        let str = JSON.stringify({"netCode": NET_DEFINES.PET_LIST,"cmdCode": 1});
        oops.tcp.getNetNode().send(str);
    }

    async InitRoles() {
        /*
        if(!this.gridPrefab){
            console.log("qqq----1");
            await oops.res.load("Hall/Role/prefab/grid",Prefab,null,(success:boolean,prefab:Prefab)=>{
                if(success){
                    console.log("qqq000");
                    Logger.instance.logView("加载gird成功");
                    this.gridPrefab=prefab;
                }
                else{
                    console.log("qqq000");
                    Logger.instance.logView("加载gird错误");
                    return
                }
            })
        }*/
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        if (userInfo) {
            //console.log("qqq111");
            const role = userInfo.role;
            //添加主角
            if (role) {
                //console.log("qqq222",this.gridPrefab);
                const rolePath = role.res;
                const cloudId = role.cloudId;
                const cloudInfo = cloudsConfig.getConfigByID(cloudId);
                //console.log("qqq2.4",cloudsConfig);
                const cloudPath = cloudInfo["res" + role.cloudType];
                //console.log("qqq2.5",cloudPath);
                if (this.gridPrefab) {
                    //console.log("qqq333");
                    let roleView = null
                    if (this.roleLayout && this.roleLayout.children) {
                        if (this.roleLayout.children.length > 0) {
                            roleView = this.roleLayout.children[0];
                        } else {
                            //console.log("qqq444");
                            roleView = instantiate(this.gridPrefab);//////这里要改进由ecs实现
                            this.roleLayout.addChild(roleView);
                        }
                    }
                    roleView!.setPosition(0, 0, 0);
                    roleView!.active = true;
                    const roleScript = roleView!.getComponent(HallRoleView);
                    if (roleScript) {
                        //console.log("qqq555");
                        roleScript.SetInfo(ROLE_TYPE.MAIN, role);
                        roleScript.ShowModel(this.m_cloudPrefabs[cloudPath], cloudPath, this.m_rolePrefabs[rolePath], rolePath);/////都要改进由esc
                        const petId = role.petInfo ? role.petInfo.configId : null;
                        roleScript.ShowAddPetButton(this.m_hasPet);
                        if (petId) {
                            roleScript.ShowAddPetButton(false);
                            const petInfo = petConfig.getConfigByID(petId);
                            const petPath = petInfo.res;
                            roleScript.ShowPet(this.m_petPrefabs[petPath], petPath, (pet:any) => {
                                if (pet) {
                                    let button = pet.getComponent(Button);
                                    if (!button) {
                                        button = pet.addComponent(Button);
                                    }
                                    if (button) {
                                        const clickEventHandler = new EventHandler();
                                        clickEventHandler.target = this.node;
                                        clickEventHandler.component = 'HallRoleController';
                                        clickEventHandler.handler = 'OnClickPet';
                                        button.clickEvents.push(clickEventHandler);
                                    }
                                }
                            });
                        }
                    }
                }
            }
            if (!NETWORKING) {
                const cloudList = userInfo.cloudList;
                if (cloudList) {
                    for (let i = 0; i < cloudList.length; i++) {
                        const cloudInfo = cloudList[i];
                        this.AddCloud(cloudInfo);
                    }
                }
            }

            this.RefreshAddEuqipmentButton();
        }
    }

    //初始化道友
    InitFriends() {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        const cloudList = userInfo.cloudList;
        //判断this.m_idToNode的key是否在cloudList中
        for (const key in this.m_idToNode) {
            if (Object.prototype.hasOwnProperty.call(this.m_idToNode, key)) {
                const element = this.m_idToNode[key];
                if (!cloudList.find((item:any) => item.uuid == key)) {//以userInfo.cloudList中的数据为准
                    element.removeFromParent();
                    delete this.m_idToNode[key];
                }
            }
        }
        // this.friendLayout.removeAllChildren()
        if (cloudList) {
            for (let i = 0; i < cloudList.length; i++) {
                const cloudInfo = cloudList[i];
                this.AddCloud(cloudInfo);//重新生成
            }
        }

        this.RefreshAddEuqipmentButton();
    }

    AddCloud(cloudInfo:any) {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        const cloudPath = cloudInfo["res" + userInfo.role.cloudType];
        const friendInfo = cloudInfo.friendInfo;
        let friendPath = null;
        if (friendInfo) {
            friendPath = friendInfo.res;
        }
        if (this.m_idToNode[cloudInfo.uuid]) {//已经有的
            const roleScript = this.m_idToNode[cloudInfo.uuid].getComponent(HallRoleView);
            if (roleScript) {
                roleScript.SetInfo(ROLE_TYPE.FRIEND, cloudInfo);
                roleScript.ShowModel(this.m_cloudPrefabs[cloudPath], cloudPath, this.m_rolePrefabs[friendPath], friendPath);
                roleScript.RefreshAddFriendButton();
                this.m_idToNode[cloudInfo.uuid].setSiblingIndex(cloudInfo.orderNum)
            }
            return
        }
        if (this.gridPrefab) {//没有的实例化之
            const friendView = instantiate(this.gridPrefab);//有待改进
            this.friendLayout!.addChild(friendView);
            friendView.setPosition(0, 0, 0);
            friendView.setSiblingIndex(cloudInfo.orderNum)
            friendView.active = true;
            const roleScript = friendView.getComponent(HallRoleView);
            if (roleScript) {
                roleScript.SetInfo(ROLE_TYPE.FRIEND, cloudInfo);
                roleScript.ShowModel(this.m_cloudPrefabs[cloudPath], cloudPath, this.m_rolePrefabs[friendPath], friendPath);
                roleScript.RefreshAddFriendButton();
            }
            this.m_idToNode[cloudInfo.uuid] = friendView;
        }
    }

    OnAddCloud() {//点击添加button的回调
        console.log("OnAddCloud");
        let cloudInfo = cloudsConfig.getConfigByType(DEFAULT_CLOUD_TYPE);
        if (!cloudInfo) {
            const cloudList = cloudsConfig.getConfig();
            for (const id in cloudList) {
                if (Object.prototype.hasOwnProperty.call(cloudList, id)) {
                    cloudInfo = cloudList[id];
                    break;
                }
            }
        }
        const type = cloudInfo.type;
        const newCloudInfo = JSON.parse(JSON.stringify(cloudInfo));//深拷贝;
        const cloudLevelInfo = cloudsLevelConfig.getConfigByTypeAndLevel(type, 1);

        const priceJson = JSON.parse(cloudLevelInfo.price);
        const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货币
        const money = Number(smc.account.AccountModel.getUserInfo().getMoney());
        if (price > money) {
            //showMessageBox("提示", "金币不足!", () => {
            //    return;
           // });
            console.log("金币不足");
            return;
        }
        if (NETWORKING) {
            const cloudLength = smc.account.AccountModel.getUserInfo().getCloudList().length;
            if (this.m_isRight) {
                let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_ADD,data: [{ "oldId": newCloudInfo.id, "newId": newCloudInfo.id, "operateId": OPER_ID.ADD, orderNum: cloudLength }],"cmdCode": 1});
                oops.tcp.getNetNode().send(str);
                //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [{ "oldId": newCloudInfo.id, "newId": newCloudInfo.id, "operateId": OPER_ID.ADD, orderNum: cloudLength }] });
            }
            this.m_isRight = false;
        } else {
            newCloudInfo.star = 1;//默认1星
            smc.account.AccountModel.getUserInfo().addNewCloud(newCloudInfo);//改变系统数据
            this.AddCloud(newCloudInfo);
            this.RefreshAddEuqipmentButton();
            //postMessage(MESSAGE_DEFINES.HALL_ADD_CLOUD, newCloudInfo);
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_ADD_CLOUD.toString(),newCloudInfo);
            smc.account.AccountModel.getUserInfo().setMoney(money - price);
            smc.account.AccountModel.getUserInfo().saveInfo();
            //postMessage(MESSAGE_DEFINES.HALL_GOLD_CHANGE);
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_GOLD_CHANGE.toString());
        }
        console.log('点击祥云：', newCloudInfo);
    }

    RefreshAddEuqipmentButton() {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        if (userInfo) {
            const cloudList = userInfo.cloudList;
            if (this.addButton && cloudList && cloudList.length != null) {
                this.addButton.active = cloudList.length < 5;
            }
        }
    }
    OnShowAddFriend(data:any) {//弹出供选择的角色面板
        console.log("OnShowAddFriend:", data);
        if (this.addFriendNode) {
            this.addFriendContent!.removeAllChildren();
            const AddFriendNode: Function = (friendInfo:any, isUnlock:boolean) => {
                const friendView:any = instantiate(this.gridPrefab);                     //希望可以改进ecs
                this.addFriendContent!.addChild(friendView);
                friendView.setPosition(0, 0, 0);
                friendView.active = true;
                const roleScript = friendView.getComponent(HallRoleView);
                if (roleScript) {
                    roleScript.SetFriendInfo(friendInfo);
                    roleScript.ShowFriend(this.m_rolePrefabs[friendInfo.res], friendInfo.res);
                    roleScript.ShowName(friendInfo.name);
                    const type = friendInfo.type;
                    const friendLevelInfo = friendLevelConfig.getConfigByTypeAndLevel(type, 1);
                    const priceJson = JSON.parse(friendLevelInfo.price);
                    const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货币
                    roleScript.ShowAddFriendPrice(price);
                    roleScript.ShowAddFriendIcon(priceJson[0].id)
                    roleScript.ShowPetProperty({ x: 0, y: -50 });
                    roleScript.ShowEnable(isUnlock);
                }
                if (isUnlock) {
                    const button: Button = friendView.addComponent(Button);
                    const handler = new EventHandler();
                    handler.target = this.node;
                    handler.component = "HallRoleController";
                    handler.handler = "OnAddFriend";
                    handler.customEventData = JSON.stringify({ id: friendInfo.id, cloud: this.m_addFriendInfo });
                    button.clickEvents.push(handler);
                    const handler2 = new EventHandler();
                    handler2.target = find("SoundManager");
                    handler2.component = "soundManager";
                    handler2.handler = "onClickButtonSound";
                    button.clickEvents.push(handler2);
                }
            }
            if (NETWORKING) {
                const friendInfos = friendConfig.getConfig();
                const list = [];
                for (const id in friendInfos) {
                    if (Object.prototype.hasOwnProperty.call(friendInfos, id)) {
                        const friendInfo = JSON.parse(JSON.stringify(friendInfos[id]));
                        let has = false;
                        for (let index = 0; index < data.length; index++) {
                            if (data[index].partnerId == id) {
                                has = true;
                                break;
                            }
                        }
                        friendInfo.has = has;
                        list.push(friendInfo);
                    }
                }
                list.sort((a, b) => {
                    if (a.has && !b.has) {
                        return -1;
                    } else {
                        return a.id - b.id;
                    }
                })
                for (let i = 0; i < list.length; i++) {
                    const friendInfo = list[i];
                    AddFriendNode(friendInfo, friendInfo.has);
                }
            } else {
                const friendInfos = friendConfig.getConfig();
                for (const key in friendInfos) {
                    if (Object.prototype.hasOwnProperty.call(friendInfos, key)) {
                        const friendInfo = friendInfos[key];
                        AddFriendNode(friendInfo, true);
                    }
                }
            }
        }
    }

    OnHideAddFriend() {//隐藏面板
        if (this.addFriendNode) {
            this.addFriendNode.active = false;
        }
    }

    OnAddFriend(event: TouchEvent, customEventData: any) {//点击绑定的回调
        console.log("OnAddFriend:", customEventData);
        this.OnHideAddFriend();
        const data = JSON.parse(customEventData);
        if (!data) return;
        const uuid = Number(data.cloud.uuid);
        const configId = Number(data.id);


        let friendInfo = friendConfig.getConfigByID(configId);
        if (!friendInfo) {
            const friendList = friendConfig.getConfig();
            for (const id in friendList) {
                if (Object.prototype.hasOwnProperty.call(friendList, id)) {
                    const info = friendList[id];
                    friendInfo = info;
                    break;
                }
            }
        }
        const type = friendInfo.type;
        const friendLevelInfo = friendLevelConfig.getConfigByTypeAndLevel(type, 1);
        const priceJson = JSON.parse(friendLevelInfo.price);
        const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货币
        const money = Number(smc.account.AccountModel.getUserInfo().getMoney());
        if (price > money) {
            //showMessageBox("提示", "金币不足!", () => {
               // return;
            //});
            console.log("金币不足");
            return;
        }
        if (NETWORKING) {
            if (this.m_isRight) {
                let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_ADD, data: [{ "oldId": data.cloud.id, "newId": data.cloud.id, "operateId": OPER_ID.CHANGE, id: uuid, orderNum: data.cloud.orderNum }, { "oldId": data.id, "newId": data.id, "operateId": OPER_ID.ADD, relevanceId: uuid }],"cmdCode": 1});
                oops.tcp.getNetNode().send(str);
                //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [{ "oldId": data.cloud.id, "newId": data.cloud.id, "operateId": OPER_ID.CHANGE, id: uuid, orderNum: data.cloud.orderNum }, { "oldId": data.id, "newId": data.id, "operateId": OPER_ID.ADD, relevanceId: uuid }] });
            }
            this.m_isRight = false;
        } else {
            const newFriendInfo = JSON.parse(JSON.stringify(friendInfo));//深拷贝
            newFriendInfo.star = 1;//默认1星
            smc.account.AccountModel.getUserInfo().AddNewFriend(uuid, newFriendInfo);
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_ADD_FRIEND.toString(),newFriendInfo);
            //postMessage(MESSAGE_DEFINES.HALL_ADD_FRIEND, newFriendInfo);
            smc.account.AccountModel.getUserInfo().setMoney(money - price);
            smc.account.AccountModel.getUserInfo().saveInfo();
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_GOLD_CHANGE.toString());
            //postMessage(MESSAGE_DEFINES.HALL_GOLD_CHANGE);

            console.log("this.friendLayout", this.friendLayout);
            if (this.friendLayout && this.friendLayout.children && this.friendLayout.children.length) {
                for (let i = 0; i < this.friendLayout.children.length; i++) {
                    const child = this.friendLayout.children[i];
                    const roleScript = child.getComponent(HallRoleView);
                    if (roleScript && roleScript.GetInfo()!.uuid == uuid) {
                        roleScript.ShowFriend(this.m_rolePrefabs[newFriendInfo.res], newFriendInfo.res); // 加载角色
                        roleScript.RefreshAddFriendButton();
                        roleScript.ShowUpPriceAndProperty();
                    }
                }
            }
        }
    }

    RefreshAddEuqipmentPrice() {
        let cloudInfo = cloudsConfig.getConfigByType(DEFAULT_CLOUD_TYPE);
        if (!cloudInfo) {
            const cloudList = cloudsConfig.getConfig();
            for (const id in cloudList) {
                if (Object.prototype.hasOwnProperty.call(cloudList, id)) {
                    const cloud = cloudList[id];
                    cloudInfo = cloud;
                    break;
                }
            }
        }
        const type = cloudInfo.type;
        const cloudLevelInfo = cloudsLevelConfig.getConfigByTypeAndLevel(type, 1);
        const priceJson = JSON.parse(cloudLevelInfo.price);
        const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货币
        this.addCloudPriceLabel!.string = formatNum(price, 2);
        this.m_redPoint!.active = checkPriceColor(this.addCloudPriceLabel!, price);
    }

    OnClickPet() {
        this.changePetNode!.active = true;
        if (NETWORKING) {
            let str = JSON.stringify({"netCode": NET_DEFINES.PET_LIST,"cmdCode": 1});
            oops.tcp.getNetNode().send(str);
            //sendWebSocketData({ netCode: NET_DEFINES.PET_LIST });
        } else {
            this.OnShowChangePet(null);
        }
    }

    OnShowChangePet(data:any) {
        console.log("OnShowChangePet:", data);
        if (this.changePetNode) {
            this.changePetContent!.removeAllChildren();
            const AddPetNode: Function = (petInfo:any, prefab: Prefab, isUnlock:boolean) => {
                const pet = instantiate(prefab); // 创建节点,有待改进
                this.changePetContent!.addChild(pet);
                if (pet) {
                    if (isUnlock) {
                        let button = pet.getComponent(Button);
                        if (!button) {
                            button = pet.addComponent(Button);
                        }
                        if (button) {
                            const handler1 = new EventHandler();
                            handler1.target = this.node;
                            handler1.component = 'HallRoleController';
                            handler1.handler = 'OnChangePet';
                            button.clickEvents.push(handler1);
                            handler1.customEventData = petInfo;

                            const handler2 = new EventHandler();
                            handler2.target = find("SoundManager");
                            handler2.component = "soundManager";
                            handler2.handler = "onClickButtonSound";
                            button.clickEvents.push(handler2);
                        }
                    }
                    const petScript = pet.getComponent(BasePet);
                    if (petScript) {
                        petScript.SetInfo(petInfo);
                        petScript.ShowName(petInfo.name);
                        petScript.ShowEnable(isUnlock);
                    }
                }
            }
            if (NETWORKING) {
                const petInfos = petConfig.getConfig();
                for (const id in petInfos) {
                    if (Object.prototype.hasOwnProperty.call(petInfos, id)) {
                        let has = false;
                        if (data) {
                            for (let index = 0; index < data.length; index++) {
                                if (data[index].petsId == id) {
                                    has = true;
                                    break;
                                }
                            }
                            const petInfo = petInfos[id];
                            const petPath = petInfo.res;
                            const petPrefab = this.m_petPrefabs[petPath];//已经有预制体了
                            if (petPrefab) {//主角宠物
                                AddPetNode(petInfo, petPrefab, has);
                            } else if (petPath) {
                                oops.res.load(petPath, Prefab,(err: Error, prefab: Prefab)=>{
                                    if (err) {
                                        console.log("加载资源失败:", err);
                                        return;
                                    }
                                    AddPetNode(petInfo, prefab, has);
                                });
                                /*
                                resources.load(petPath, Prefab, async (err: Error, prefab: Prefab) => {
                                    if (err) {
                                        console.log("加载资源失败:", err);
                                        return;
                                    }
                                    AddPetNode(petInfo, prefab, has);
                                });*/
                            }
                        }
                    }
                }
            } else {
                const petInfos = petConfig.getConfig();
                for (const key in petInfos) {
                    if (Object.prototype.hasOwnProperty.call(petInfos, key)) {
                        const petInfo = petInfos[key];
                        const petPath = petInfo.res;
                        const petPrefab = this.m_petPrefabs[petPath];
                        if (petPrefab) {//主角宠物
                            AddPetNode(petInfo, petPrefab, true);
                        } else if (petPath) {
                            oops.res.load(petPath, Prefab,(err: Error, prefab: Prefab)=>{
                                    if (err) {
                                        console.log("加载资源失败:", err);
                                        return;
                                    }
                                    AddPetNode(petInfo, prefab, false);
                                });
                        }

                    }
                }
            }
        }
    }

    OnCloseChangePet() {
        if (this.changePetNode) {
            this.changePetNode.active = false;
        }
    }

    OnChangePet(event: TouchEvent, customEventData: any) {//点击回调
        if (customEventData) {
            const petId = Number(customEventData.id);
            if (petId) {
                this.OnCloseChangePet();
                if (NETWORKING) {
                    //学进后续补充
                    const petInfo = smc.account.AccountModel.getUserInfo().getUserInfo().role.petInfo;
                    if (this.m_isRight) {
                        if (petInfo) {
                            let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_ADD, data: [{ "oldId": petInfo.configId, "newId": 0, "operateId": OPER_ID.SUB, id: petInfo.id }, { "oldId": petId, "newId": petId, "operateId": OPER_ID.ADD, id: customEventData.uid }],"cmdCode": 1});
                            oops.tcp.getNetNode().send(str);
                            //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [{ "oldId": petInfo.configId, "newId": 0, "operateId": OPER_ID.SUB, id: petInfo.id }, { "oldId": petId, "newId": petId, "operateId": OPER_ID.ADD, id: customEventData.uid }] });
                        } else {
                            let str = JSON.stringify({"netCode": NET_DEFINES.FRIEND_ADD,data: [{ "oldId": petId, "newId": petId, "operateId": OPER_ID.ADD, id: customEventData.uid }],"cmdCode": 1});
                            oops.tcp.getNetNode().send(str);
                            //sendWebSocketData({ netCode: NET_DEFINES.FRIEND_ADD, data: [{ "oldId": petId, "newId": petId, "operateId": OPER_ID.ADD, id: customEventData.uid }] });
                        }
                    }
                    this.m_isRight = false;
                } else {
                    const petInfo = petConfig.getConfigByID(petId);
                    if (petInfo) {
                        smc.account.AccountModel.getUserInfo().setPet(petInfo);
                        postMessage(MESSAGE_DEFINES.HALL_CHANGE_PET, petInfo);
                    }
                }
            }
        }
    }


    RefreshFetter() {
        for (let i = 0; i < this.friendLayout!.children.length; i++) {
            const child = this.friendLayout!.children[i];
            const roleScript = child.getComponent(HallRoleView);
            if (roleScript) {
                roleScript.RefreshFetter();
            }
        }
    }
}


