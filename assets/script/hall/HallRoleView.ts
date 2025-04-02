import { _decorator, Button, Color, Component, instantiate, Label, Node, Prefab, resources, Size, sp, Sprite, SpriteFrame, UITransform, view, } from 'cc';
import { formatNum, MESSAGE_DEFINES, NET_DEFINES, NETWORKING, ROLE_TYPE, ROLE_OPER_TYPE, fetterColor } from '../game/common/global';
import { checkPriceColor} from '../game/common/publicFunctions';
import { friendLevelConfig } from '../game/common/config/friend_level';
//import { globalData } from '../../data/globalData';
import { cloudsLevelConfig } from '../game/common/config/clouds_level';
import { petConfig } from '../game/common/config/petConfig';
//import { getResourcesAsync } from '../../public/publicFunctions';
import { friendConfig } from '../game/common/config/friend';
import { cloudsStarConfig } from '../game/common/config/clouds_star';
import { friendStarConfig } from '../game/common/config/friend_star';
import { goodsConfig } from '../game/common/config/goods';
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { smc } from '../game/common/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('HallRoleView')
export class HallRoleView extends Component {
    @property(Node)
    body: Node|any = null;

    @property(Node)
    layout: Node|any  = null;

    @property(Node)
    add: Node|any  = null;

    @property(Node)
    blood: Node|any  = null;

    @property(Node)
    info: Node|any  = null;

    @property(Node)
    info2: Node|any  = null;

    @property(Label)
    nameLabel: Label|any  = null;

    @property(Node)
    deleteButton: Node|any  = null;

    @property(Label)
    cloudLevelLabel: Label|any  = null;
    @property(Label)
    friendLevelLabel: Label|any  = null;
    @property(Label)
    attackLabel: Label|any  = null;
    @property(Label)
    bloodLabel: Label|any  = null;
    @property(Label)
    defenceLabel: Label|any  = null;

    @property(Label)
    addFriendPriceLabel: Label|any  = null;
    @property(Sprite)
    addFriendPriceIcon: Sprite|any  = null;
    @property(Label)
    upFriendPriceLabel: Label|any  = null;
    @property(Sprite)
    upFriendPriceIcon: Sprite|any  = null;
    @property(Label)
    upCloudPriceLabel: Label|any  = null;
    @property(Sprite)
    upCloudPriceIcon: Sprite|any  = null;
    @property(Button)
    upFriendButton: Button|any  = null;
    @property(Button)
    upCloudButton: Button|any  = null;
    @property(Node)
    elementNode: Node|any  = null;

    @property(Label)
    cloudStarLabel: Label|any  = null;
    @property(Label)
    friendStarLabel: Label|any  = null;
    @property(Node)
    addPetButton: Node|any  = null;
    @property(Node)
    unlockNode: Node|any  = null;

    m_type = ROLE_TYPE.MAIN;//0-主角 1-道友
    m_info :any= null;
    m_pet :Node|any =null;//宠物
    m_operType = ROLE_OPER_TYPE.NORMAL;//0-正常 1-BOSS战 2-PVP
    m_addFriendCallback :Function|null= null;
    start() {
        this.ResetScale();
    }

    update(deltaTime: number) {

    }

    SetInfo(type:any, info:any) {
        console.log("info:", info);
        this.m_type = type;
        this.m_info = info;
        this.ShowInfo2(this.m_type != ROLE_TYPE.MAIN);
        // this.ShowDeleteButton(this.m_type != ROLE_TYPE.MAIN);
        this.ShowUpPriceAndProperty();
    }

    SetFriendInfo(friendInfo:any) {
        if (!this.m_info) {
            this.m_info = {};
        }
        this.m_info.friendInfo = friendInfo;
    }

    GetInfo() {
        return this.m_info;
    }

    GetType() {
        return this.m_type;
    }

    SetOperType(type:any) {
        this.m_operType = type;
    }

    SetAddFriendCallback(callback:any) {
        this.m_addFriendCallback = callback;
    }

    ShowUpPriceAndProperty() {
        if (this.m_type == ROLE_TYPE.MAIN) {//主角不需要
            return;
        }
        if (this.m_info) {
            const type = this.m_info.type;
            const level = this.m_info.level;
            if (this.cloudLevelLabel) this.cloudLevelLabel.string = level;
            const levelConfig = cloudsLevelConfig.getConfigByTypeAndLevel(type, level);
            const nextLevelInfo = cloudsLevelConfig.getConfigByTypeAndLevel(type, Number(level) + 1);
            if (levelConfig) {
                if (this.upCloudPriceLabel) {
                    const priceJson = JSON.parse(levelConfig.price);
                    const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货币
                    this.upCloudPriceLabel.string = formatNum(price, 2);
                    goodsConfig.setIconByIDAsync(this.upCloudPriceIcon, priceJson[0].id);
                    const enable = checkPriceColor(this.upCloudPriceLabel, price);
                    if (this.upCloudButton) {
                        this.upCloudButton.enabled = enable;
                    }
                }
                if (this.bloodLabel) this.bloodLabel.string = levelConfig.blood;
            }
            if (this.upCloudButton) {
                this.upCloudButton.node.active = nextLevelInfo != null ? true : false;
            }
        }
        if (this.m_info.friendInfo) {
            const type = this.m_info.friendInfo.type;
            const level = this.m_info.friendInfo.level;
            if (this.friendLevelLabel) this.friendLevelLabel.string = level;
            const levelConfig = friendLevelConfig.getConfigByTypeAndLevel(type, level);
            const nextLevelInfo = friendLevelConfig.getConfigByTypeAndLevel(type, Number(level) + 1);
            console.log("nextLevelInfo:", nextLevelInfo);
            if (levelConfig) {
                if (this.upFriendPriceLabel) {
                    const priceJson = JSON.parse(levelConfig.price);
                    const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货
                    this.upFriendPriceLabel.string = formatNum(price, 2);
                    goodsConfig.setIconByIDAsync(this.upFriendPriceIcon, priceJson[0].id);
                    const enable = checkPriceColor(this.upFriendPriceLabel, price);
                    const currentGold = Number(smc.account.AccountModel.getUserInfo().getMoney());
                    console.log(currentGold, price, 'hhhhhhhhhh');

                    if (this.upFriendButton) {
                        this.upFriendButton.enabled = enable;
                    }
                }
                if (this.attackLabel) this.attackLabel.string = levelConfig.attack;
                if (this.defenceLabel) this.defenceLabel.string = levelConfig.defence;
            }
            if (this.upFriendButton) {
                this.upFriendButton.node.active = nextLevelInfo != null ? true : false;
            }
        }
        this.RefreshCloundStar();
        this.RefreshFriendStar();
    }

    ShowBody(show:boolean) {
        if (this.body) {
            this.body.active = show;
        }
        if (this.layout && this.layout.children && this.layout.children.length && this.layout.children.length > 0) {
            for (let i = 0; i < this.layout.children.length; i++) {
                const child = this.layout.children[i];
                const image = child.getChildByName("image");
                if (image) {
                    image.getComponent(Sprite).color = show ? new Color(255, 255, 255, 255) : new Color(255, 0, 0, 255);
                }
                const skeleton = child.getChildByName("skeleton");
                if (skeleton) {
                    skeleton.getComponent(sp.Skeleton).color = show ? new Color(255, 255, 255, 255) : new Color(255, 0, 0, 255);
                }
            }
        }
    }

    ShowModel(cloudPrefab:any, cloudPath:any, friendPrefab:any, friendPath:any) {
        
        if (cloudPrefab) {
            //console.log("ShowModel11---",cloudPrefab,cloudPath,friendPrefab,friendPath);
            this.AddCloudNode(cloudPrefab);
            // 加载角色
            this.ShowFriend(friendPrefab, friendPath);
            if (this.add) {
                this.add.setSiblingIndex(10);
            }
        } else if (cloudPath) {
            //console.log("ShowModel---22",cloudPrefab,cloudPath,friendPrefab,friendPath);
            oops.res.load(cloudPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                //console.log("ShowModel---33",prefab,cloudPath);
                this.AddCloudNode(prefab);
                // 加载角色
                this.ShowFriend(friendPrefab, friendPath);
                if (this.add) {
                    this.add.setSiblingIndex(10);
                }
            });
            /*
            resources.load(cloudPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.AddCloudNode(prefab);
                // 加载角色
                this.ShowFriend(friendPrefab, friendPath);
                if (this.add) {
                    this.add.setSiblingIndex(10);
                }
            });*/
        }
    }

    AddCloudNode(prefab:any) {
        //console.log("ShowModel--",prefab);
        const cloud = instantiate(prefab); // 创建节点 要改进ecs
        if (this.layout.getChildByName("cloud")) {
            this.layout.getChildByName("cloud").removeFromParent();
        }
        cloud.active=true;
        cloud.name = "cloud";
        cloud.layer=this.layout.layer
        for (const child of cloud.children) {

            child.layer=this.layout.layer
        }
        this.layout.addChild(cloud); // 添加到场景中
    }

    ShowFriend(friendPrefab:any, friendPath:any) {
        //console.log("ShowModel--",friendPrefab);
        if (friendPrefab) {
            this.AddFriendNode(friendPrefab);
        } else if (friendPath) {
            oops.res.load(friendPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.AddFriendNode(prefab);
            });
            /*
            resources.load(friendPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.AddFriendNode(prefab);
            });*/
        }
    }

    AddFriendNode(prefab:any) {
        const role = instantiate(prefab); // 创建节点
        if (this.layout.getChildByName("role")) {
            this.layout.getChildByName("role").removeFromParent();
        }
        role.name = "role";
        role.layer=this.layout.layer
        for (const child of role.children) {

            child.layer=this.layout.layer
        }
        this.layout.addChild(role); // 添加到场景中
        //加载五行图标
        if (this.m_type == ROLE_TYPE.FRIEND && this.elementNode) {
            this.elementNode.active = true;
            const iconNode = this.elementNode.getChildByName("icon");
            const iconSprit = iconNode.getComponent(Sprite);
            const friendId = this.m_info.friendInfo.id;
            const friendInfo = friendConfig.getConfigByID(friendId);
            oops.res.loadAsync("icon/element/" + friendInfo.element,SpriteFrame).then(
                (spriteFrame: SpriteFrame) => {
                    if (iconSprit) {
                        iconSprit.spriteFrame = spriteFrame;
                    }
                }
            )
            /*
            getResourcesAsync("icon/element/" + friendInfo.element, (success, spriteFrame: SpriteFrame) => {
                if (iconSprit && success) {
                    iconSprit.spriteFrame = spriteFrame;
                }
            });*/
            //加载羁绊效果
            this.RefreshFetter();
        }
    }

    ShowAddButton(show:any) {
        if (this.add) {
            this.add.active = show;
            this.add.setSiblingIndex(10);
        }
    }

    ShowInfo(show:any) {
        if (this.info) {
            this.info.active = show;
        }
    }

    ShowInfo2(show:any) {
        if (this.info2) {
            this.info2.active = show;
        }
    }

    ShowDeleteButton(show:any) {
        if (this.deleteButton) {
            this.deleteButton.active = show;
        }
    }

    OnOpenAddFriend() {
        console.log("this.m_info:", this.m_info);
        if (this.m_operType == ROLE_OPER_TYPE.BOSS || this.m_operType == ROLE_OPER_TYPE.PVP) {
            console.log("this.m_addFriendCallback:", this.m_addFriendCallback);
            if (this.m_addFriendCallback) {
                this.m_addFriendCallback({ uuid: this.m_info.uuid, id: this.m_info.id, orderNum: this.m_info.orderNum });
            }
            return;
        }
        if (this.m_type == ROLE_TYPE.FRIEND) {
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_SHOW_ADD_FRIEND.toString(), { uuid: this.m_info.uuid, id: this.m_info.id, orderNum: this.m_info.orderNum });
            //postMessage(MESSAGE_DEFINES.HALL_SHOW_ADD_FRIEND, { uuid: this.m_info.uuid, id: this.m_info.id, orderNum: this.m_info.orderNum });
        }
    }

    RefreshAddFriendButton() {
        let show = false;
        console.log("this.m_info:", this.m_info);

        if (this.m_info && !this.m_info.friendInfo) {
            show = true;
        }
        this.ShowAddButton(show);
        this.ShowInfo(!show);
    }

    ShowName(name:any) {
        if (this.nameLabel) {
            this.nameLabel.node.active = true;
            this.nameLabel.string = name;
        }
    }

    ShowAddFriendPrice(price:any) {
        if (this.addFriendPriceLabel) {
            this.addFriendPriceLabel.node.parent.active = true;
            this.addFriendPriceLabel.string = formatNum(price, 2);
            checkPriceColor(this.addFriendPriceLabel, price);
        }
    }

    ShowAddFriendIcon(id:any) {
        if (this.addFriendPriceIcon) {
            goodsConfig.setIconByIDAsync(this.addFriendPriceIcon, id);
        }
    }

    ResetScale() {
        const height = 1920;
        let ScreenHeight = view.getVisibleSize().height;
        let scale = ScreenHeight / height;
        this.node.setScale(scale, scale, 1);
        const contentSize = this.node.getComponent(UITransform)!.contentSize;
        this.node.getComponent(UITransform)!.contentSize = new Size(contentSize.width * scale, contentSize.height * scale);
    }

    OnDelete() {
        if (this.m_operType == ROLE_OPER_TYPE.BOSS) {
            oops.message.dispatchEvent(MESSAGE_DEFINES.BOSS_DELETE_FRIEND.toString(),this.node);
            //postMessage(MESSAGE_DEFINES.BOSS_DELETE_FRIEND, this.node);
        } else if (this.m_operType == ROLE_OPER_TYPE.PVP) {
            oops.message.dispatchEvent(MESSAGE_DEFINES.PVP_DELETE_FRIEND.toString(),this.node);
            //postMessage(MESSAGE_DEFINES.PVP_DELETE_FRIEND, this.node);
        } else {
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_DELETE_FRIEND.toString(),this.node);
            //postMessage(MESSAGE_DEFINES.HALL_DELETE_FRIEND, this.node);
        }
    }

    OnUpCloudLevel() {//点击回调
        if (this.m_info && this.m_info.uuid) {
            const cloudList = smc.account.AccountModel.getUserInfo().getCloudList();
            const money = Number(smc.account.AccountModel.getUserInfo().getMoney());
            if (cloudList && cloudList.length) {
                for (let i = 0; i < cloudList.length; i++) {
                    const cloud = cloudList[i];
                    if (cloud.uuid == this.m_info.uuid) {
                        const type = cloud.type;
                        const cloudLevelInfo = cloudsLevelConfig.getConfigByTypeAndLevel(type, Number(cloud.level));
                        const nextLevelInfo = cloudsLevelConfig.getConfigByTypeAndLevel(type, Number(cloud.level) + 1);
                        if (cloudLevelInfo && nextLevelInfo) {
                            const priceJson = JSON.parse(cloudLevelInfo.price);
                            const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货币
                            if (money < price) {
                                //showMessageBox("提示", "金币不足!", () => {
                                    return;
                                //});
                                console.log("金币不足");
                                return;
                            }
                            if (NETWORKING) {
                                let str = JSON.stringify({"netCode": NET_DEFINES.SIGN_UPGRADE, data: { mountId: this.m_info.uuid, upgradeType: 5 },"cmdCode": 1});
                                oops.tcp.getNetNode().send(str);
                                //sendWebSocketData({ netCode: NET_DEFINES.SIGN_UPGRADE, data: { mountId: this.m_info.uuid, upgradeType: 5 } });
                            } else {
                                cloud.level = Number(cloud.level) + 1;
                                smc.account.AccountModel.getUserInfo().setMoney(money - price);
                            }
                        }
                        break;
                    }
                }
            }
            if (NETWORKING) return;
            smc.account.AccountModel.getUserInfo().saveInfo();
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_UP_CLOUD.toString(),this.m_info);
            //postMessage(MESSAGE_DEFINES.HALL_UP_CLOUD, this.m_info);
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_GOLD_CHANGE.toString());
            //postMessage(MESSAGE_DEFINES.HALL_GOLD_CHANGE);
        }
    }

    OnUpFriendLevel() {//点击回调
        console.log("this.m_info:", this.m_info);
        if (this.m_info && this.m_info.uuid) {
            const cloudList = smc.account.AccountModel.getUserInfo().getCloudList();
            const money = Number(smc.account.AccountModel.getUserInfo().getMoney());
            if (cloudList && cloudList.length) {
                for (let i = 0; i < cloudList.length; i++) {
                    const cloud = cloudList[i];
                    if (cloud.uuid == this.m_info.uuid) {
                        if (cloud.friendInfo) {
                            const type = cloud.friendInfo.type;
                            const friendLevelInfo = friendLevelConfig.getConfigByTypeAndLevel(type, Number(cloud.friendInfo.level));
                            const nextLevelInfo = friendLevelConfig.getConfigByTypeAndLevel(type, Number(cloud.friendInfo.level) + 1);
                            if (friendLevelInfo && nextLevelInfo) {
                                const priceJson = JSON.parse(friendLevelInfo.price);
                                const price = Number(priceJson[0].num);//xyang先写死，UI还没有做到可以显示多个货币
                                if (money < price) {
                                    //showMessageBox("提示", "金币不足!", () => {
                                        //return;
                                    //});
                                    console.log("金币不足");
                                    return;
                                }
                                if (NETWORKING) {
                                    let str = JSON.stringify({"netCode": NET_DEFINES.SIGN_UPGRADE, data: { mountId: this.m_info.friendInfo.uuid, upgradeType: 1 },"cmdCode": 1});
                                    oops.tcp.getNetNode().send(str);
                                    //sendWebSocketData({ netCode: NET_DEFINES.SIGN_UPGRADE, data: { mountId: this.m_info.friendInfo.uuid, upgradeType: 1 } });
                                } else {
                                    cloud.friendInfo.level = Number(cloud.friendInfo.level) + 1;
                                    smc.account.AccountModel.getUserInfo().setMoney(money - price);
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if (NETWORKING) return;
            smc.account.AccountModel.getUserInfo().saveInfo();
            this.ShowUpPriceAndProperty();
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_UP_FRIEND.toString(),this.m_info);
            //postMessage(MESSAGE_DEFINES.HALL_UP_FRIEND, this.m_info);
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_GOLD_CHANGE.toString());
            //postMessage(MESSAGE_DEFINES.HALL_GOLD_CHANGE);
        }
    }


    ShowPet(petPrefab:any, petPath:any, callback:any) {
        if (this.m_type == ROLE_TYPE.MAIN) {
            if (petPrefab) {//主角宠物
                this.AddPetNode(petPrefab);
                this.ShowAddPetButton(false);
                if (callback) callback(this.m_pet);
            } else if (petPath) {
                oops.res.loadAsync(petPath, Prefab).then((prefab: Prefab)=> {
                    this.AddPetNode(prefab);
                    this.ShowAddPetButton(false);
                    if (callback) callback(this.m_pet);

                },(error)=>{
                    console.log("加载资源失败:", error);
                    return;
                });
                /*
                resources.load(petPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.AddPetNode(prefab);
                    this.ShowAddPetButton(false);
                    if (callback) callback(this.m_pet);
                });*/
            }
        }
    }
    ShowPetProperty(offset:any = null) {
        //加载五行图标
        if (this.elementNode) {
            this.elementNode.active = true;
            const iconNode = this.elementNode.getChildByName("icon");
            const iconSprit = iconNode.getComponent(Sprite);
            const friendId = this.m_info.friendInfo.id;
            const friendInfo = friendConfig.getConfigByID(friendId);

            oops.res.loadAsync("icon/element/" + friendInfo.element, SpriteFrame).then((spriteFrame: SpriteFrame)=> {
                if (iconSprit) {
                    iconSprit.spriteFrame = spriteFrame;
                }

            },(error)=>{
                console.log("加载资源失败:", error);
                return;
            });
            /*
            getResourcesAsync("icon/element/" + friendInfo.element, (success, spriteFrame: SpriteFrame) => {
                if (iconSprit && success) {
                    iconSprit.spriteFrame = spriteFrame;
                }
            });
            */
            if (offset) {
                this.elementNode.setPosition(this.elementNode.position.x + offset.x, this.elementNode.position.y + offset.y, this.elementNode.position.z);
            }
        }
    }

    AddPetNode(prefab:any) {
        if (this.m_pet) {
            this.m_pet.removeFromParent();
        }
        this.m_pet = instantiate(prefab); // 创建节点
        this.m_pet.name = "pet";
        this.node.addChild(this.m_pet); // 添加到场景中
        const thisWidth = this.node.getComponent(UITransform)!.width; // 获取主角节点宽度
        const petWidth = this.m_pet.getComponent(UITransform)!.width; // 获取宠物节点宽度
        this.m_pet.setPosition(-thisWidth / 2 - petWidth / 2, 0, 0); // 设置宠物节点的位置
    }

    GetPet() {
        return this.m_pet;
    }

    HideUpCloudButton() {
        this.upCloudButton.node.active = false;
    }

    HideUpFriendButton() {
        this.upFriendButton.node.active = false;
    }

    RefreshCloundStar() {
        if (this.m_info && this.m_info.star) {
            const starInfo = cloudsStarConfig.getConfigByID(this.m_info.star);
            if (this.cloudStarLabel && starInfo) {
                this.cloudStarLabel.string = starInfo.name;
            }
        }
    }

    RefreshFriendStar() {
        if (this.m_info && this.m_info.friendInfo && this.m_info.friendInfo.star) {
            const starInfo = friendStarConfig.getConfigByID(this.m_info.friendInfo.star);
            if (this.friendStarLabel && starInfo) {
                this.friendStarLabel.string = starInfo.name;
            }
        }
    }

    RefreshFetter() {
        if (this.m_info && this.m_info.friendInfo) {
            const fetterNode = this.elementNode.getChildByName("fetter");
            if (fetterNode) {
                fetterNode.active = this.m_info.friendInfo.fetter ? true : false;
                const fetterSprite = fetterNode.getComponent(Sprite);
                if (fetterSprite && this.m_info.friendInfo.fetter && this.m_info.friendInfo.fetter.type) {
                    fetterSprite.color = fetterColor[this.m_info.friendInfo.fetter.type];
                }
            }
            const numNode = this.elementNode.getChildByName("num");
            if (numNode) {
                numNode.active = this.m_info.friendInfo.fetter ? true : false;
                const numLabel = numNode.getComponent(Label);
                if (numLabel && this.m_info.friendInfo.fetter && this.m_info.friendInfo.fetter.same) {
                    numLabel.string = this.m_info.friendInfo.fetter.same;
                }
            }
        }
    }

    ShowAddPetButton(show:boolean) {
        this.addPetButton.active = show;
    }


    OnClickPet() {
        if (this.m_operType == ROLE_OPER_TYPE.BOSS) {
            oops.message.dispatchEvent(MESSAGE_DEFINES.BOSS_SHOW_ADD_PET.toString());
            //postMessage(MESSAGE_DEFINES.BOSS_SHOW_ADD_PET);
        } else if (this.m_operType == ROLE_OPER_TYPE.PVP) {
            oops.message.dispatchEvent(MESSAGE_DEFINES.PVP_SHOW_ADD_PET.toString());
            //postMessage(MESSAGE_DEFINES.PVP_SHOW_ADD_PET);
        } else {
            oops.message.dispatchEvent(MESSAGE_DEFINES.HALL_SHOW_ADD_PET.toString());
            //postMessage(MESSAGE_DEFINES.HALL_SHOW_ADD_PET);
        }
    }

    ShowEnable(enable:boolean) {
        if (this.layout && this.layout.children && this.layout.children.length && this.layout.children.length > 0) {
            for (let i = 0; i < this.layout.children.length; i++) {
                const child = this.layout.children[i];
                const image = child.getChildByName("image");
                if (image) {
                    image.getComponent(Sprite).color = enable ? new Color(255, 255, 255, 255) : new Color(125, 125, 125, 255);
                }
                const skeleton = child.getChildByName("skeleton");
                if (skeleton) {
                    skeleton.getComponent(sp.Skeleton).color = enable ? new Color(255, 255, 255, 255) : new Color(125, 125, 125, 255);
                }
            }
        }
        if (this.nameLabel) {
            this.nameLabel.color = enable ? new Color(255, 255, 255, 255) : new Color(125, 125, 125, 255);
        }
        if (this.unlockNode) {
            this.unlockNode.active = !enable;
        }
        if (this.elementNode) {
            const iconNode = this.elementNode.getChildByName("icon");
            const iconSprit = iconNode.getComponent(Sprite);
            if (iconSprit) {
                iconSprit.color = enable ? new Color(255, 255, 255, 255) : new Color(125, 125, 125, 255);
            }
        }
    }
}


