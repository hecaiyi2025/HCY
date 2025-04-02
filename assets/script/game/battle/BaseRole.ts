import { _decorator, Animation, color, Color, Component, instantiate, Label, Node, Prefab, ProgressBar, random, resources, sp, Sprite, SpriteFrame, UIOpacity, UITransform, Vec3 } from 'cc';
//import { addMessageListener, getAngle, getResourcesAsync, playSoundByName, postMessage, sendMessage } from '../../public/publicFunctions';
import { DAMAGE_TYPE, FETTER_ATTRIBUTE, fetterColor, MESSAGE_DEFINES, NODE_TYPE, ROLE_STATUS, ROLE_TYPE,getAngle } from '../common/global';
//import { globalData } from '../../data/globalData';
import { cloudsLevelConfig } from '../common/config/clouds_level';
import { friendLevelConfig } from '../common/config/friend_level';
import { skillConfig } from '../common/config/skill';
import { friendConfig } from '../common/config/friend';
import { debuffConfig } from '../common/config/debuff';
import { BaseDebuff } from './BaseDebuff';
import { fetterConfig } from '../common/config/fetters';
import { buffConfig } from '../common/config/buff';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
const { ccclass, property } = _decorator;

@ccclass('BaseRole')
export class BaseRole extends Component {//他挂预制体上,我觉得他应该派生与mvparent来管理其上数据显示
    @property(Node)
    layout: Node|any = null;
    @property(ProgressBar)
    m_bloodProgressBar: ProgressBar|any  = null;
    @property(Node)
    m_skillArrowNode: Node|any  = null;
    @property(ProgressBar)
    m_shieldProgressBar: ProgressBar|any  = null;
    @property(Node)
    elementNode: Node|any  = null;
    @property(Node)
    m_shieldNode: Node|any = null;
    @property(Node)
    m_healthNode : Node|any= null;

    m_skeleton:any = null;//骨骼
    m_type = ROLE_TYPE.MAIN;//0-主角 1-道友
    m_info :any= null;
    m_status = ROLE_STATUS.IDLE;//角色状态
    m_attackValue = 0; // 攻击蓄力
    m_attackInterval = 0; // 攻击间隔
    m_skill:any = null; // 技能类型
    m_skillInterval = 0; // 起手到生成弹道的时间
    m_bulletOffset = { x: 0, y: 0 };//子弹偏移

    m_attack = 0; // 攻击力
    m_blood = 0; // 血量
    m_maxBlood = 0; // 最大血量
    m_defence = 0; //防御力

    m_buff_attack = 0; // buff攻击力
    m_buff_blood = 0; // buff血量
    m_buff_maxBlood = 0; // buff最大血量
    m_buff_defence = 0; //buff防御力
    m_buff_shield = 0; //buff护盾值
    m_buff_maxShield = 0; //buff护盾值
    m_skill_shield = 0; //buff护盾值
    m_skill_maxShield = 0; //buff护盾值
    m_buff_reduction = 1; //buff伤害减免
    m_buff_interval = 1; //buff攻速

    m_hitId :any= null;//受击动画id
    m_hitNum = 0; // 受击掉血值后播放动画
    m_attackIds :any[]= [];//攻击动画id
    m_healthId :any= null;//加血动画id
    m_touchPoint :Vec3|null= null;//触摸点

    m_pet:any = null;//宠物
    m_debuffList :any[]= []; // debuff列表
    m_fetterParam = null;//羁绊参数
    m_fetterRate = 0;//羁绊触发概率
    start() {
        if (!this.m_bloodProgressBar && this.node.getChildByName("blood")) {
            this.m_bloodProgressBar = this.node.getChildByName("blood")!.getComponent(ProgressBar);//这个代码对我来说不需要
        }
        if (!this.m_shieldProgressBar && this.node.getChildByName("shield")) {
            this.m_shieldProgressBar = this.node.getChildByName("shield")!.getComponent(ProgressBar);
        }
        oops.message.on(MESSAGE_DEFINES.GAME_TOUCH_BEGIN.toString(),(...arg:any)=>{//体现了管理者身份
                    //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
                    if (this.m_type == ROLE_TYPE.MAIN) {
                        this.m_skillArrowNode.active = true;
                    }
                    this.m_touchPoint = arg[1].pos;
                    this.SetArrowEuler();
                },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_TOUCH_BEGIN, (data) => {
            // console.log("GAME_TOUCH_BEGIN")
            if (this.m_type == ROLE_TYPE.MAIN) {
                this.m_skillArrowNode.active = true;
            }
            this.m_touchPoint = data.pos;
            this.SetArrowEuler();
            // this.SetArrowWidth();
        });
        */
        oops.message.on(MESSAGE_DEFINES.GAME_TOUCH_MOVE.toString(),(...arg:any)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            this.m_touchPoint = arg[1].pos;
            this.SetArrowEuler();
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_TOUCH_MOVE, (data) => {
            // console.log("GAME_TOUCH_MOVE")
            this.m_touchPoint = data.pos;
            this.SetArrowEuler();
            // this.SetArrowWidth();
        });*/
        oops.message.on(MESSAGE_DEFINES.GAME_TOUCH_END.toString(),()=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            if (this.m_type == ROLE_TYPE.MAIN) {
                this.m_skillArrowNode.active = false;
            }
            this.m_touchPoint = null;
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_TOUCH_END, (data) => {
            // console.log("GAME_TOUCH_END")
            if (this.m_type == ROLE_TYPE.MAIN) {
                this.m_skillArrowNode.active = false;
            }
            this.m_touchPoint = null;
        });*/
        oops.message.on(MESSAGE_DEFINES.GAME_TOUCH_CANCEL.toString(),(data)=>{//体现了管理者身份
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            if (this.m_type == ROLE_TYPE.MAIN) {
                this.m_skillArrowNode.active = false;
            }
            this.m_touchPoint = null;
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.GAME_TOUCH_CANCEL, (data) => {
            // console.log("GAME_TOUCH_CANCEL")
            if (this.m_type == ROLE_TYPE.MAIN) {
                this.m_skillArrowNode.active = false;
            }
            this.m_touchPoint = null;
        });*/
    }

    update(deltaTime: number) {
        deltaTime = deltaTime * smc.account.AccountModel.getGameRate();
        if (this.m_status == ROLE_STATUS.ATTACK && this.m_attackInterval > 0) {
            if (this.m_attackValue < this.m_attackInterval * this.m_buff_interval) {
                this.m_attackValue += deltaTime;
            }
            if (this.m_attackValue >= this.m_attackInterval * this.m_buff_interval) {
                this.m_attackValue = 0;
                this.Attack();
            }
        }
        //受击计时
        if (this.m_hitNum > 0) {
            this.m_hitNum -= deltaTime;
            if (this.m_hitNum <= 0) {
                this.m_hitNum = 0;
                this.m_skeleton!.color = color(255, 255, 255, 255);
            }
        }
    }

    SetInfo(type:any, info:any) {
        this.m_type = type;
        this.m_info = info;
        this.SetFetterInfo();
        if (info) {
            if (this.m_type == ROLE_TYPE.MAIN) {
                const property = smc.account.AccountModel.getUserInfo().getFinalProperty();//加了所有功能后的最终属性
                this.m_attackInterval = Number(info.interval);
                this.m_attackValue = Number(info.interval); // 第一次攻击蓄力
                this.m_skill = Number(info.skill);
                this.m_attack = Number(property.attack);
                this.m_blood = Number(property.blood);
                this.m_maxBlood = Number(property.blood);
                this.m_defence = Number(property.defence);
                this.m_bulletOffset = info.bulletOffset;
                this.m_skillInterval = Number(info.skillInterval);
            } else if (this.m_type == ROLE_TYPE.FRIEND) {
                const cloudLevel = Number(info.level);
                const cloudType = Number(info.type);
                const cloudLevelInfo = cloudsLevelConfig.getConfigByTypeAndLevel(cloudType, cloudLevel);
                if (cloudLevelInfo) {
                    this.m_blood = Number(cloudLevelInfo.blood);
                    this.m_maxBlood = Number(cloudLevelInfo.blood);
                }
                if (info.friendInfo) {
                    this.m_attackInterval = Number(info.friendInfo.interval); // 攻击间隔
                    this.m_attackValue = Number(info.friendInfo.interval); // 第一次攻击蓄力
                    this.m_skill = Number(info.friendInfo.skill);
                    this.m_bulletOffset = info.friendInfo.bulletOffset;
                    this.m_skillInterval = Number(info.friendInfo.skillInterval);
                    const friendLevel = Number(info.friendInfo.level);
                    const friendType = Number(info.friendInfo.type);
                    const friendLevelInfo = friendLevelConfig.getConfigByTypeAndLevel(friendType, friendLevel);
                    if (friendLevelInfo) {
                        this.m_attack = Number(friendLevelInfo.attack);
                        this.m_defence = Number(friendLevelInfo.defence);
                    }
                }
            }
        }
    }

    GetInfo() {
        return this.m_info;
    }

    SetAttackInterval(interval:any) {
        this.m_attackInterval = interval;
    }
    GetAttackInterval() {
        return this.m_attackInterval;
    }

    SetDefence(defence:any) {
        if (defence != null && defence != undefined) {
            this.m_defence = Number(defence);
        }
    }

    GetDefence() {
        return this.m_defence;
    }

    SetMaxBlood(blood:any) {
        this.m_maxBlood = Number(blood);
    }

    GetMaxBlood() {
        return this.m_maxBlood;
    }

    GetBody() {
        const roleNode = this.layout.getChildByName("role");
        if (roleNode) {
            return roleNode;
        }
        return this.node;
    }

    ShowModel(cloudPrefab:any, cloudPath:any, friendPrefab:any, friendPath:any) {
        console.log("Baserole.ShowModel---",friendPrefab,friendPath)
        if (cloudPrefab) {
            this.AddCloudNode(cloudPrefab);
            // 加载角色
            this.ShowFriend(friendPrefab, friendPath);
        } else if (cloudPath) {/*
            resources.load(cloudPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.AddCloudNode(prefab);
                // 加载角色
                this.ShowFriend(friendPrefab, friendPath);
            });*/
            oops.res.load(cloudPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                //console.log("ShowModel---33",prefab,cloudPath);
                this.AddCloudNode(prefab);
                // 加载角色
                this.ShowFriend(friendPrefab, friendPath);
            });
        }
    }

    AddCloudNode(prefab:any) {
        const cloud = instantiate(prefab); // 创建节点
        cloud.name = "cloud";
        cloud.layer=this.layout.layer
        for (const child of cloud.children) {

            child.layer=this.layout.layer
        }
        this.layout.addChild(cloud); // 添加到场景中
    }

    ShowFriend(friendPrefab:any, friendPath:any) {
        if (friendPrefab) {
            this.AddFriendNode(friendPrefab);
        } else if (friendPath) {
            /*
            resources.load(friendPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                this.AddFriendNode(prefab);
            });*/
            oops.res.load(friendPath, Prefab, async (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("加载资源失败:", err);
                    return;
                }
                //console.log("ShowModel---33",prefab,cloudPath);
                this.AddCloudNode(prefab);
                // 加载角色
                this.ShowFriend(friendPrefab, friendPath);
            });
        }
    }

    AddFriendNode(prefab:any) {
        const role = instantiate(prefab); // 创建节点
        role.name = "role";
        role.layer=this.layout.layer
        for (const child of role.children) {

            child.layer=this.layout.layer
        }
        this.layout.addChild(role); // 添加到场景中

        const skeletonNode = role.getChildByName("skeleton");
        if (skeletonNode) {
            this.m_skeleton = skeletonNode.getComponent(sp.Skeleton);
        }
        // this.m_shieldNode = role.getChildByName("shield");
        // this.m_healthNode = role.getChildByName("health");
        //加载五行图标
        if (this.m_type == ROLE_TYPE.FRIEND && this.elementNode) {
            this.elementNode.active = true;
            const iconNode = this.elementNode.getChildByName("icon");
            const iconSprit = iconNode.getComponent(Sprite);
            const friendId = this.m_info!.friendInfo.id;
            const friendInfo = friendConfig.getConfigByID(friendId);

        let url="icon/element/";
        let suffixList = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];//去除后缀名
            // 使用异步加载资源
        for (let i = 0; i < suffixList.length; i++) {
            const suffix = suffixList[i];
            if (url.indexOf(suffix) != -1) {
                url = url.replace(suffix, "");
            }
        }
        if (url.indexOf("/spriteFrame") == -1) {
            url = url + "/spriteFrame";
        }
        oops.res.load(url, SpriteFrame, async (err: Error, spriteFrame: SpriteFrame) => {
            if (err) {
                console.log("加载资源失败:", err);
                return;
            }
            if (iconSprit) {
                iconSprit.spriteFrame = spriteFrame;
            }
        });
        /*
            getResourcesAsync("icon/element/" + friendInfo.element, (success, spriteFrame: SpriteFrame) => {
                if (iconSprit && success) {
                    iconSprit.spriteFrame = spriteFrame;
                }
            });
        */
        //加载羁绊效果
        this.RefreshFetter();
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

    ShowPet(petPrefab:any, petPath:any, callback:any) {
        if (this.m_type == ROLE_TYPE.MAIN) {
            if (petPrefab) {//主角宠物
                this.AddPetNode(petPrefab);
                if (callback) callback(this.m_pet);
            } else if (petPath) {
                oops.res.load(petPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.AddPetNode(prefab);
                    if (callback) callback(this.m_pet);
                });
                /*
                resources.load(petPath, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.AddPetNode(prefab);
                    if (callback) callback(this.m_pet);
                });*/
            }
        }
    }

    AddPetNode(prefab:any) {
        if (this.m_pet) {
            this.m_pet.removeFromParent();
        }
        this.m_pet = instantiate(prefab); // 创建节点
        this.m_pet!.name = "pet";
        this.node.addChild(this.m_pet); // 添加到场景中
        // const thisWidth = this.node.getComponent(UITransform).width; // 获取主角节点宽度
        // const petWidth = this.m_pet.getComponent(UITransform).width; // 获取宠物节点宽度
        const thisHeight = this.node.getComponent(UITransform)!.height; // 获取主角节点高度
        this.m_pet.setPosition(0, thisHeight / 2, 0); // 设置宠物节点的位置
    }

    GetPet() {
        return this.m_pet;
    }

    GetSkill() {
        return this.m_skill;
    }

    StartAttack() {
        if (this.m_status == ROLE_STATUS.IDLE) {
            this.m_status = ROLE_STATUS.ATTACK;
        }
    }

    GetAttack() {
        return this.m_attack + this.m_buff_attack;
    }

    GetBulletOffset() {
        return this.m_bulletOffset;
    }

    Attack() {
        const skillInfo = skillConfig.getConfigByID(this.m_skill);
        let num = 1;
        let distance = 0;
        if (skillInfo) {
            num = skillInfo.bullet;
            distance = skillInfo.distance;
        }
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_MONSTER_TARGET.toString(),(list: any[]) => {
            //console.log("BaseRole.PlayAttackAnimation",list.length)
            if (list.length > 0) {
                this.PlayAttackAnimation();
                // 计算羁绊
                let fetterInfo:{[key:string|number]:any}|null = this.GetFetterInfo();
                if (fetterInfo) {
                    fetterInfo["attribute"] = this.m_info.friendInfo.attribute; // 羁绊属性
                    if (this.m_info.friendInfo.attribute == FETTER_ATTRIBUTE.NONE) {//不触发羁绊
                        fetterInfo = null;
                    } else if (this.m_info.friendInfo.attribute == FETTER_ATTRIBUTE.ATTACK) {//按攻击频率触发
                        if (Math.random() < this.m_fetterRate) {//触发羁绊
                            if (fetterInfo.param.buff) {//增益羁绊
                                const buffInfo = buffConfig.getConfigByID(fetterInfo.param.buff);
                                if (buffInfo) {
                                    const buffParam = JSON.parse(buffInfo.param);
                                    this.SetBuff(buffParam);
                                }
                            }
                        } else {//没触发
                            fetterInfo = null;
                        }
                    } else if (this.m_info.friendInfo.attribute == FETTER_ATTRIBUTE.HIT) {//按伤害频率触发
                    }
                }
                //只要fetterInfo不为null则说明触发羁绊
                const id = setTimeout(() => {
                    if (list.length < num) {
                        for (let i = 0; i < list.length; i++) {
                            const target = list[i];
                            oops.message.dispatchEvent(MESSAGE_DEFINES.ROLE_ATTACK.toString(), { from: this.node, target, attack: this.m_attack + this.m_buff_attack, fetterInfo })
                            //postMessage(MESSAGE_DEFINES.ROLE_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, fetterInfo });
                        }
                    } else {
                        for (let i = 0; i < num; i++) {
                            const target = list[i];
                            oops.message.dispatchEvent(MESSAGE_DEFINES.ROLE_ATTACK.toString(),{ from: this.node, target, attack: this.m_attack + this.m_buff_attack, fetterInfo })
                            //postMessage(MESSAGE_DEFINES.ROLE_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, fetterInfo });
                        }
                    }
                    // playSoundByFile("attack");
                }, Number(this.m_skillInterval) * 1000);
                this.m_attackIds.push(id);
            } else {
                if (this.m_type == ROLE_TYPE.MAIN) {
                    this.m_attackValue = Number(this.m_info.interval); // 第一次攻击蓄力
                } else if (this.m_type == ROLE_TYPE.FRIEND) {
                    this.m_attackValue = Number(this.m_info.friendInfo.interval); // 重新攻击蓄力
                }
            }
        },{num, from:this.node, distance})
        //console.log("BaseRole.PlayAttackAnimation",{ num, from: this.node, distance})
        /*
        sendMessage(MESSAGE_DEFINES.GET_MONSTER_TARGET, { num, from: this.node, distance }, (list: []) => {
            if (list.length > 0) {
                this.PlayAttackAnimation();
                // 计算羁绊
                let fetterInfo = this.GetFetterInfo();
                if (fetterInfo) {
                    fetterInfo["attribute"] = this.m_info.friendInfo.attribute; // 羁绊属性
                    if (this.m_info.friendInfo.attribute == FETTER_ATTRIBUTE.NONE) {//不触发羁绊
                        fetterInfo = null;
                    } else if (this.m_info.friendInfo.attribute == FETTER_ATTRIBUTE.ATTACK) {//按攻击频率触发
                        if (Math.random() < this.m_fetterRate) {//触发羁绊
                            if (fetterInfo.param.buff) {//增益羁绊
                                const buffInfo = buffConfig.getConfigByID(fetterInfo.param.buff);
                                if (buffInfo) {
                                    const buffParam = JSON.parse(buffInfo.param);
                                    this.SetBuff(buffParam);
                                }
                            }
                        } else {//没触发
                            fetterInfo = null;
                        }
                    } else if (this.m_info.friendInfo.attribute == FETTER_ATTRIBUTE.HIT) {//按伤害频率触发
                    }
                }
                //只要fetterInfo不为null则说明触发羁绊
                const id = setTimeout(() => {
                    if (list.length < num) {
                        for (let i = 0; i < list.length; i++) {
                            const target = list[i];
                            postMessage(MESSAGE_DEFINES.ROLE_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, fetterInfo });
                        }
                    } else {
                        for (let i = 0; i < num; i++) {
                            const target = list[i];
                            postMessage(MESSAGE_DEFINES.ROLE_ATTACK, { from: this.node, target, attack: this.m_attack + this.m_buff_attack, fetterInfo });
                        }
                    }
                    // playSoundByFile("attack");
                }, Number(this.m_skillInterval) * 1000);
                this.m_attackIds.push(id);
            } else {
                if (this.m_type == ROLE_TYPE.MAIN) {
                    this.m_attackValue = Number(this.m_info.interval); // 第一次攻击蓄力
                } else if (this.m_type == ROLE_TYPE.FRIEND) {
                    this.m_attackValue = Number(this.m_info.friendInfo.interval); // 重新攻击蓄力
                }
            }
        });*/
    }

    PlayAttackAnimation() {
        //console.log("BaseRole.PlayAttackAnimation")
        const roleNode = this.layout.getChildByName("role");
        if (roleNode) {
            if (this.m_skeleton) {
                this.m_skeleton.setAnimation(0, 'attack', false);
            } else {
                const animation = roleNode.getComponent(Animation);
                if (animation) {
                    animation.play('skill');
                }
            }
        }
    }

    ShowHit(attack:any, type = DAMAGE_TYPE.NORMAL) {//显示被hit效果
        if (this.m_status == ROLE_STATUS.DEAD) {
            return;
        }
        if (attack <= 0) {
            return;
        }
        if (this.m_buff_shield > 0 || this.m_skill_shield > 0) {
            if (this.m_buff_shield + this.m_skill_shield >= attack) {
                if (this.m_buff_shield >= attack) {
                    this.m_buff_shield -= attack;
                } else {
                    attack -= this.m_buff_shield;
                    this.m_buff_shield = 0;
                    if (this.m_skill_shield >= attack) {
                        this.m_skill_shield -= attack;
                    } else {
                        attack -= this.m_skill_shield;
                        this.m_skill_shield = 0;
                    }
                }
                this.ShowDamage(attack, DAMAGE_TYPE.SHIELD);//伤害数值，应该放到system中处理
                this.ShowShield();
                return;
            } else {
                attack -= (this.m_buff_shield + this.m_skill_shield); // 减去护盾
                this.m_buff_shield = 0;
                this.m_skill_shield = 0;
            }
        }
        this.ShowShield();
        let damage = attack - (this.m_defence + this.m_buff_defence); // 减去防御
        damage *= this.m_buff_reduction; // 减去减伤
        if (damage <= 0) {
            damage = 1;
            this.ShowDamage(damage, type);
            return;
        }
        this.ShowDamage(damage, type);
        if (this.m_buff_blood > 0) {
            this.m_buff_blood -= damage;
            if (this.m_buff_blood <= 0) {
                this.m_blood += this.m_buff_blood;
                this.m_buff_blood = 0;
            }
        } else {
            this.m_blood -= damage;//减少血量
        }
        this.ShowBlood((this.m_blood + this.m_buff_blood) / (this.m_maxBlood + this.m_buff_maxBlood));
        if (this.m_blood <= 0) {
            this.m_blood = 0;
            this.Dead();
            return;
        }
        if (this.m_hitId) {
            clearTimeout(this.m_hitId);
            this.m_hitId = null;
        }
        this.PlayHitAnimation();
        //playSoundByName("hit");
    }

    PlayHitAnimation() {
        const roleNode = this.layout.getChildByName("role");
        if (roleNode) {
            if (this.m_skeleton) {
                // this.m_skeleton.setAnimation(0, 'hit', false);
                if (this.m_hitNum == 0) {
                    this.m_hitNum = 0.2;
                    this.m_skeleton.color = color(255, 0, 0, 255);
                }
            } else {
                const animation = roleNode.getComponent(Animation);
                if (animation) {
                    const sprite = roleNode.getChildByName('image').getComponent(Sprite);
                    if (sprite) {
                        sprite.color = new Color(255, 0, 0, 255);
                        this.m_hitId = setTimeout(() => {
                            sprite.color = new Color(255, 255, 255, 255);
                        }, 100);
                    }
                }
            }
        }
    }

    ShowBlood(rate:any) {
        this.m_bloodProgressBar.node.active = true;
        this.m_bloodProgressBar.progress = rate;
    }

    ShowDamage(damage:any, type:any) {
        oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_SHOW_DAMAGE.toString(), { from: this.node, damage, type })
        //postMessage(MESSAGE_DEFINES.GAME_SHOW_DAMAGE, { from: this.node, damage, type });
    }

    Dead() {
        if (this.m_status != ROLE_STATUS.DEAD) {
            this.m_status = ROLE_STATUS.DEAD;
            this.PlayDeadAnimation();
            oops.message.dispatchEvent(MESSAGE_DEFINES.ROLE_DEAD.toString(),this.node)
            //postMessage(MESSAGE_DEFINES.ROLE_DEAD, this.node);
        }
    }

    PlayDeadAnimation() {
        const roleNode = this.layout.getChildByName("role");
        if (roleNode) {
            if (this.m_skeleton) {
                this.m_skeleton.setAnimation(0, 'dead', false);
            } else {
                const animation = roleNode.getComponent(Animation);
                if (animation) {
                    animation.play('dead');
                }
            }
        }
    }

    SetArrowEuler() {
        let euler = this.m_skillArrowNode.eulerAngles.z;
        if (this.m_touchPoint) {
            euler = getAngle(this.m_skillArrowNode.getWorldPosition(), new Vec3(this.m_touchPoint.x, this.m_touchPoint.y, 0));// 设置角度
        }
        this.m_skillArrowNode.setRotationFromEuler(0, 0, euler); // 设置角度
    }

    SetArrowWidth() {
        const length = Math.sqrt(Math.pow(this.m_touchPoint!.x - this.m_skillArrowNode.getWorldPosition().x, 2) + Math.pow(this.m_touchPoint!.y - this.m_skillArrowNode.getWorldPosition().y, 2));
        this.m_skillArrowNode.getComponent(UITransform).width = length * 0.9;
    }

    GetTouchPoint() {
        return this.m_touchPoint;
    }

    GetType() {
        return this.m_type;
    }

    SetBuff(buff:any, value = null) {
        if (buff.attack) {
            this.m_buff_attack += this.m_attack * Number(buff.attack);
        }
        if (buff.defence) {
            this.m_buff_defence += Number(buff.defence);
        }
        if (buff.blood) {
            this.m_buff_maxBlood += this.m_maxBlood * Number(buff.blood);
            this.m_buff_blood += this.m_maxBlood * Number(buff.blood);
        }
        if (buff.shield) {
            this.m_buff_shield += Number(buff.shield);
            this.m_buff_maxShield += Number(buff.shield);
            this.ShowShield();
        }
        if (buff.reduction) {
            this.m_buff_reduction *= Number(buff.reduction);
        }
        if (buff.attackspeed) {
            this.m_buff_interval -= this.m_buff_interval * Number(buff.attackspeed);
        }
        if (buff.health) {
            let addblood = (this.m_maxBlood + this.m_buff_maxBlood) * Number(buff.health);
            this.AddBlood(addblood);
        }
        if (buff.skill_health) {
            let addblood = Number(buff.skill_health);
            this.AddBlood(addblood);
        }
        if (buff.skill_shield) {
            this.m_skill_shield = Number(buff.skill_shield);
            this.m_skill_maxShield = Number(buff.skill_shield);
            this.ShowShield();
        }
        if (buff.fetter_health && value) {
            let addblood = Number(value) * Number(buff.fetter_health);
            this.AddBlood(addblood);
        }
    }

    ShowShield() {
        if (this.m_buff_shield <= 0) {
            this.m_buff_shield = 0;
            this.m_buff_maxShield = 0;
        }
        if (this.m_skill_shield <= 0) {
            this.m_skill_shield = 0;
            this.m_skill_maxShield = 0;
        }
        if (this.m_shieldNode && this.m_shieldProgressBar) {
            this.m_shieldNode.active = this.m_buff_shield + this.m_skill_shield > 0;
            this.m_shieldProgressBar.node.active = this.m_buff_shield + this.m_skill_shield > 0;
            this.m_shieldProgressBar.progress = (this.m_buff_shield + this.m_skill_shield) / (this.m_buff_maxShield + this.m_skill_maxShield);
        }
    }

    protected onDisable(): void {
        if (this.m_hitId) {
            clearTimeout(this.m_hitId);
            this.m_hitId = null;
        }
        if (this.m_attackIds && this.m_attackIds.length > 0) {
            for (let i = 0; i < this.m_attackIds.length; i++) {
                clearInterval(this.m_attackIds[i]);
            }
            this.m_attackIds = [];
        }
        if (this.m_healthId) {
            clearTimeout(this.m_healthId);
            this.m_healthId = null;
        }
    }

    IsAlive() {
        return this.m_status != ROLE_STATUS.DEAD || this.m_status != ROLE_STATUS.OVER;
    }

    GameOver() {
        this.m_status = ROLE_STATUS.OVER;
    }

    ShowDebuff(debuffId:any, attack:any) {
        let oldDebuff = null;
        for (let i = 0; i < this.m_debuffList.length; i++) {
            const item = this.m_debuffList[i];
            if (item.id == debuffId) {//找到那个相同id、
                oldDebuff = item;
                break;
            }
        }
        if (oldDebuff) {//如果存在相同buff，cd重置，伤害高的覆盖伤害低的
            const debuff = debuffConfig.getConfigByID(oldDebuff.id);
            if (oldDebuff.attack < attack) {
                oldDebuff.attack = attack;
            }
            let debuffScript = oldDebuff.node.getComponent(BaseDebuff);
            if (debuffScript) {
                debuffScript.SetInfo(debuff);
                if (oldDebuff.attack < attack) {
                    debuffScript.SetAttack(attack);
                }
                debuffScript.SetCD(debuff.cd);
            }
        } else {//不存在相同的
            const debuff = debuffConfig.getConfigByID(debuffId);
            if (debuff) {
                if (debuff.res) {
                    oops.res.load(debuff.res, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        const node = instantiate(prefab);
                        if (node) {
                            node.active = true;
                            node.setParent(this.node);
                            node.setPosition(new Vec3(0, this.GetSelfHeight(), 0));
                            let debuffScript = node.getComponent(BaseDebuff);
                            if (!debuffScript) {
                                debuffScript = node.addComponent(BaseDebuff);
                            }
                            if (debuffScript) {
                                debuffScript.SetInfo(debuff);
                                debuffScript.SetCD(debuff.cd);
                                debuffScript.SetParent(this.node, NODE_TYPE.ROLE);
                                debuffScript.SetAttack(attack);
                                debuffScript.SetDestroyCallback(() => {
                                    for (let i = 0; i < this.m_debuffList.length; i++) {
                                        const item = this.m_debuffList[i];
                                        if (item.id == debuffId) {
                                            this.m_debuffList.splice(i, 1);
                                            break;
                                        }
                                    }
                                });
                                debuffScript.StartDebuff();
                            }
                        }
                        const debuffInfo = { id: debuffId, node: node, attack: attack };
                        this.m_debuffList.push(debuffInfo);//存好
                    });
                    /*
                    resources.load(debuff.res, Prefab, async (err: Error, prefab: Prefab) => {
                        if (err) {
                            console.log("加载资源失败:", err);
                            return;
                        }
                        const node = instantiate(prefab);
                        if (node) {
                            node.active = true;
                            node.setParent(this.node);
                            node.setPosition(new Vec3(0, this.GetSelfHeight(), 0));
                            let debuffScript = node.getComponent(BaseDebuff);
                            if (!debuffScript) {
                                debuffScript = node.addComponent(BaseDebuff);
                            }
                            if (debuffScript) {
                                debuffScript.SetInfo(debuff);
                                debuffScript.SetCD(debuff.cd);
                                debuffScript.SetParent(this.node, NODE_TYPE.ROLE);
                                debuffScript.SetAttack(attack);
                                debuffScript.SetDestroyCallback(() => {
                                    for (let i = 0; i < this.m_debuffList.length; i++) {
                                        const item = this.m_debuffList[i];
                                        if (item.id == debuffId) {
                                            this.m_debuffList.splice(i, 1);
                                            break;
                                        }
                                    }
                                });
                                debuffScript.StartDebuff();
                            }
                        }
                        const debuffInfo = { id: debuffId, node: node, attack: attack };
                        this.m_debuffList.push(debuffInfo);
                    });*/
                }
            }
        }
    }

    GetSelfHeight() {
        return (0.5 - this.node.getComponent(UITransform)!.anchorPoint.y) * this.node.getComponent(UITransform)!.height / 2;
    }

    SetFetterInfo() {
        if (this.m_info && this.m_info.friendInfo) {
            const fetter = this.m_info.friendInfo.fetter;
            if (fetter) {
                const fetterId = fetter.id;
                const fetterInfo = fetterConfig.getConfigByID(fetterId);
                if (fetterInfo) {
                    const param = JSON.parse(fetterInfo.param);
                    if (param.length > 0) {
                        for (let i = 0; i < param.length; i++) {
                            const item = param[i];
                            if (item.element == fetter.type) {
                                this.m_fetterParam = item;
                                break;
                            }
                        }
                    }
                    this.m_fetterRate = fetterInfo.triggerProbability;
                }
            }
        }
    }

    GetFetterInfo() {
        if (this.m_info && this.m_info.friendInfo) {
            const fetter = this.m_info.friendInfo.fetter;
            if (fetter && this.m_fetterParam && this.m_fetterRate > 0) {
                return { id: fetter.id, rate: this.m_fetterRate, param: this.m_fetterParam };
            }
        }
        return null;
    }

    AddBlood(addblood:any) {
        if (this.m_maxBlood - this.m_blood < addblood) {
            addblood -= this.m_maxBlood - this.m_blood;
            this.m_blood = this.m_maxBlood;
            if (this.m_buff_maxBlood > 0) {
                this.m_buff_blood += addblood;
                if (this.m_buff_blood > this.m_buff_maxBlood) {
                    this.m_buff_blood = this.m_buff_maxBlood;
                }
            }
        } else {
            this.m_blood += addblood;
        }
        this.ShowBlood((this.m_blood + this.m_buff_blood) / (this.m_maxBlood + this.m_buff_maxBlood));
        if (this.m_healthNode) {
            this.m_healthNode.active = true;
            if (this.m_healthId) {
                clearTimeout(this.m_healthId);
                this.m_healthId = null;
            }
            this.m_healthId = setTimeout(() => {
                this.m_healthNode.active = false;
                this.m_healthId = null;
            }, 1000);
        }
        let damage = addblood;
        if (damage < 0) {
            return;
        } else if (damage < 1) {
            damage = 1;
        }
        this.ShowDamage(damage, DAMAGE_TYPE.ADDBLOOD);
    }
}


