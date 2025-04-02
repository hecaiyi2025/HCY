import { _decorator, Component, Node ,Sprite, SpriteFrame,} from 'cc';
const { ccclass, property } = _decorator;
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { smc } from "../../common/SingletonModuleComp";
import { clearConfigs, IsLoadConfigs, LoadConfigs } from '../../common/config/config';
import { AD_TYPE, FONT_NAME, GAME_TYPE, MESSAGE_DEFINES, NET_DEFINES, NETWORKING, formatNum} from '../../common/global';
import {  WEBSOCKET_URL } from '../../common/global';
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { degreeConfig } from '../../common/config/degree';
import { constantConfig } from '../../common/config/constant';
import { cloudsLevelConfig } from '../../common/config/clouds_level'

import { petsStarConfig } from '../../common/config/pets_star'
import { goodsConfig } from '../../common/config/goods'
import { friendLevelConfig } from '../../common/config/friend_level'
import { Console } from 'console';
import { resolve } from 'path';


@ccclass('TopViewComponent')
@ecs.register('TopViewComponent', false)
export class TopViewComponent extends CCVMParentComp {

        //头像
        @property(Sprite)
        m_head: Sprite|null = null;

        /** VM 组件绑定数据 */
        data: any = {
            /** 加载资源当前进度 */
            name:"",
            /** 加载资源最大进度 */
            headid:"",
            /** 加载资源进度比例值 */
            money:0,
            /** 加载流程中提示文本 */
            diamond:0,
            //
            force:0,
            //体力
            progressstring:0,
            physicalStrength: 0,
            /** 加载资源最大进度 */
            physicalStrengthTotal: 1,
            title:"",
            
        };
        timer:any= null;
        start() {
            this.enter();
        }
    
        enter() {
            this.bindEvent();
            //this.loadRes();
        }
        reset(): void { 

        }
        bindEvent(): void { 
            //删除角色
            oops.message.on(MESSAGE_DEFINES.HALL_DELETE_FRIEND.toString(),() => {
                setTimeout(() => {
                this.ShowTop();
            }, 500);
            },this);
         /*    
        addMessageListener(MESSAGE_DEFINES.HALL_DELETE_FRIEND, (res) => {
            setTimeout(() => {
                this.ShowTop();
            }, 500);
        });
            */
        //添加道友
        oops.message.on(MESSAGE_DEFINES.HALL_ADD_FRIEND.toString(),() => {
            setTimeout(() => {
            this.ShowTop();
        }, 500);
        },this)
        /*
        addMessageListener(MESSAGE_DEFINES.HALL_ADD_FRIEND, (data) => {
            setTimeout(() => {
                this.ShowTop();
            }, 500);
        });*/

        //添加装备
        oops.message.on(MESSAGE_DEFINES.HALL_ADD_CLOUD.toString(),() => {
            setTimeout(() => {
            this.ShowTop();
        }, 500);
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.HALL_ADD_CLOUD, (data) => {
            setTimeout(() => {
                this.ShowTop();
            }, 500);
        });
        */
        //金币改变
        oops.message.on(MESSAGE_DEFINES.HALL_GOLD_CHANGE.toString(),() => {
            const userInfo = smc.account.AccountModel.getUserInfo().m_userInfo;
            if (userInfo) {
                this.ShowMoney(userInfo.money);
            }
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.HALL_GOLD_CHANGE, (data) => {
            const userInfo = globalData.getUserInfo().m_userInfo;
            if (userInfo) {
                this.ShowMoney(userInfo.money);
            }
        });*/

        //  //个人信息改变
        //  addMessageListener(MESSAGE_DEFINES.HALL_GET_USER_INFO, (data) => {
        //     this.ShowTop();
        // });

        //体力改变
        oops.message.on(MESSAGE_DEFINES.HALL_STAMINA_CHANGE.toString(),() => {
            this.ShowStamina();
        },this);
        /*
        addMessageListener(MESSAGE_DEFINES.HALL_STAMINA_CHANGE, () => {
            this.ShowStamina();
        });*/

        //战力刷新
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.POWER_REFRESH.toString(),(res)=>{
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            let data = JSON.parse(res.data);
            const userInfo = smc.account.AccountModel.getUserInfo().m_userInfo;
            userInfo.role.equipmentCombatPower = data.equipmentCombatPower;
            userInfo.role.fightingPower = data.pveCombatPower;
            userInfo.role.bossRoomFightingPower = data.bossRoomCombatPower;
            userInfo.role.practiceCombatPower = data.practiceCombatPower;
            userInfo.role.pvpFightingPower = data.pvpCombatPower;
            userInfo.role.talentCombatPower = data.talentCombatPower;
            userInfo.role.characterCombatPower = data.characterCombatPower
            this.ShowForce(Math.floor((+data.equipmentCombatPower) + (+ data.talentCombatPower) + (+data.practiceCombatPower) + (+data.pveCombatPower) + (+data.characterCombatPower)));
        

        })
        /*
        addSocketListener(NET_DEFINES.POWER_REFRESH, (res) => {
            let data = JSON.parse(res.data);
            const userInfo = globalData.getUserInfo().m_userInfo;
            userInfo.role.equipmentCombatPower = data.equipmentCombatPower;
            userInfo.role.fightingPower = data.pveCombatPower;
            userInfo.role.bossRoomFightingPower = data.bossRoomCombatPower;
            userInfo.role.practiceCombatPower = data.practiceCombatPower;
            userInfo.role.pvpFightingPower = data.pvpCombatPower;
            userInfo.role.talentCombatPower = data.talentCombatPower;
            userInfo.role.characterCombatPower = data.characterCombatPower
            this.ShowForce(Math.floor((+data.equipmentCombatPower) + (+ data.talentCombatPower) + (+data.practiceCombatPower) + (+data.pveCombatPower) + (+data.characterCombatPower)));
        });
        */
        oops.tcp.getNetNode().addResponeHandler(NET_DEFINES.NETCODE_POWER.toString(),(res)=>{
            //我的回调函数收到的都是已经从字符串解析到json后的对象的data分量
            let data = JSON.parse(res.data);
            smc.account.AccountModel.getUserInfo().setStamina(data.physicalStrength);
            this.ShowStamina();
        })
        /*
        addSocketListener(NET_DEFINES.NETCODE_POWER, (res) => {
            let data = JSON.parse(res.data);
            globalData.getUserInfo().setStamina(data.physicalStrength);
            this.ShowStamina();
            // setTimeout(() => {
            //     sendWebSocketData({ netCode: NET_DEFINES.NETCODE_POWER });
            // }, this.Countdown);
        });*/
        this.refreshStamina()
        this.refreshPower()
        this.ShowTop()
        }
        //自动刷新体力
        refreshStamina() {
        let config = constantConfig.getConfigByID(12031)
        // this.timer = setInterval(() => {
        let physicalStrength = smc.account.AccountModel.getUserInfo().getUserInfo().physicalStrength
        if (physicalStrength >= config.parameter1) {
            return
        }
        let str = JSON.stringify({"netCode": NET_DEFINES.NETCODE_POWER,"cmdCode": 1});
        oops.tcp.getNetNode().send(str);
        //sendWebSocketData({ netCode: NET_DEFINES.NETCODE_POWER });
        // }, this.Countdown);
    }

    //刷新战力
    refreshPower() {
        // let list = [
        //     { code: NET_DEFINES.EQUIPMENT_BATCH, scene: 4, type: 2 },
        //     { code: NET_DEFINES.TALENT_UPGRADE, scene: 4, type: 8 },
        //     { code: NET_DEFINES.PET_TALENT_UNLOCK, scene: 4, type: 2 },
        //     { code: NET_DEFINES.FRIEND_ADD, scene: 4, type: 2 },
        //     { code: NET_DEFINES.SIGN_UPGRADE, scene: 4, type: 2 },
        //     { code: NET_DEFINES.BOSS_EDIT, scene: 4, type: 2 },
        //     { code: NET_DEFINES.STAR_UP, scene: 4, type: 7 }
        // ]
        // for (let index = 0; index < list.length; index++) {
        //     addSocketListener(list[index].code, (res) => {
        // sendWebSocketData({ netCode: NET_DEFINES.POWER_REFRESH, data: { type: 1, scene: 2 } });
        //     });
        // }
    }

    protected onDestroy(): void {
        clearInterval(this.timer)
        this.timer = null
    }

    update(deltaTime: number) {

    }
    ShowTop() {
        const userInfo = smc.account.AccountModel.getUserInfo().m_userInfo;
        if (userInfo) {
            this.ShowName(userInfo.name);
            this.ShowAvatar(userInfo.avatar);
            this.ShowMoney(userInfo.money);
            this.ShowYu(userInfo.diamond);
            let force = 0;
            if (userInfo.role) {
                const property = smc.account.AccountModel.getUserInfo().getFinalProperty(); // 获取最终属性
                force += this.GetForce(Number(property.attack), Number(property.defence), Number(property.blood), Number(userInfo.role.interval));
            }
            if (userInfo.cloudList) {
                for (let i = 0; i < userInfo.cloudList.length; i++) {
                    const cloudInfo = userInfo.cloudList[i];
                    const cloudType = Number(cloudInfo.type);
                    const cloudLevel = Number(cloudInfo.level);
                    const cloudLevelInfo = cloudsLevelConfig.getConfigByTypeAndLevel(cloudType, cloudLevel);
                    if (cloudLevelInfo) {
                        const blood = Number(cloudLevelInfo.blood);
                        let attack = 0;
                        let defence = 0;
                        let attackInterval = 0;
                        if (cloudInfo.friendInfo) {
                            attackInterval = Number(cloudInfo.friendInfo.interval); // 攻击间隔
                            const friendLevel = Number(cloudInfo.friendInfo.level);
                            const friendType = Number(cloudInfo.friendInfo.type);
                            const friendLevelInfo = friendLevelConfig.getConfigByTypeAndLevel(friendType, friendLevel);
                            if (friendLevelInfo) {
                                attack = Number(friendLevelInfo.attack);
                                defence = Number(friendLevelInfo.defence);
                            }
                        }
                        force += this.GetForce(attack, defence, blood, attackInterval);
                    }
                }
            }
            if (userInfo.petInfo) {
                const satrId = userInfo.role.petInfo ? userInfo.role.petInfo.star : null;
                let petStarInfo = petsStarConfig.getConfigByID(satrId);
                if (petStarInfo) {
                    force += this.GetForce(petStarInfo.attack, 0, 0, petStarInfo.interval);
                }
            }
            // this.ShowForce(Math.floor(force));
        }
        this.ShowTitle();
        this.ShowStamina();
        this.ShowForce(Math.floor((+userInfo.role.equipmentCombatPower||0) + (+ userInfo.role.talentCombatPower||0) + (+userInfo.role.practiceCombatPower||0) + (+userInfo.role.fightingPower||0) + (+userInfo.role.characterCombatPower||0)));
    }

    ShowTitle() {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();
        if (userInfo && userInfo.degree) {
            const degreeInfo = degreeConfig.getConfigByID(userInfo.degree);
            if (degreeInfo && degreeInfo.name) {
                //this.m_title.string = degreeInfo.name;
                this.data.title=degreeInfo.name;
            }
        }
        
    }

    ShowName(name:string) {
        this.data.name=name;
        if (name.length >= 4) {
            this.data.name = name.slice(0, 4) + '...';
        } else {
                this.data.name = name;
        }
        /*
        if (this.nameLabel) {
            // if (name.length >= 4) {
            //     this.nameLabel.string = name.slice(0, 4) + '...';
            // } else {
            this.nameLabel.string = name;
            // }

        }
        */
    }

    async ShowAvatar(id:any) {
        let config = goodsConfig.getConfigByID(id);
        if (config) {
            this.data.headid=config.icon;
            this.m_head!.spriteFrame = await oops.res.loadAsync(config.icon,SpriteFrame).then((val:SpriteFrame)=>{return val});
            //getResources(config.icon) as SpriteFrame;
        }
    }

    ShowMoney(money:any) {
        this.data.money=formatNum(money,2);
        
        /*
        if (this.moneyLabel) {
            this.moneyLabel.string = formatNum(money, 2);
        }
        */
    }

    ShowYu(num:any) {
        this.data.diamond=formatNum(num, 2);
        /*
        if (this.m_yuLabel) {
            this.m_yuLabel.string = formatNum(num, 2);
        }
        */
    }

    ShowForce(force:any) {
        this.data.force=force;
        /*
        if (this.forceLabel) {
            //上一次战力
            let lastForce = +this.forceLabel.string;
            //差值
            let diff = force - lastForce;
            if (diff == 0) {
                return
            }
            let color: Color = null;
            this.m_powerLabel.string = ''
            //差值大于0，显示+号
            if (diff > 0) {
                this.m_powerLabel.string = '+' + diff.toString();
                color = new Color(127, 177, 0, 255);
            } else {
                this.m_powerLabel.string = diff.toString();
                color = new Color(230, 5, 5, 255);
            }
            this.m_powerLabel.color = color;
            // 使用 tween 创建数字变化动画
            tween({ value: lastForce })
                .to(1, { value: force }, {
                    easing: 'linear', onUpdate: (target: any, ratio: number) => {
                        if (this.forceLabel && this.m_powerLabel) {
                            this.forceLabel.string = Math.floor(target.value) + ''
                            let opacity = 255 - 255 * ratio
                            color.a = opacity
                            this.m_powerLabel.color = color
                        }
                    }
                },)
                .start();
        }
        */
    }

    GetForce(attack:any, defence:any, blood:any, attackInterval:any) {
        if (attackInterval == null || attackInterval == 0) {
            return defence * 5 + blood;
        }
        const value = attack * 10 / attackInterval + defence * 5 + blood;
        return value;
    }

    ShowStamina() {
        const userInfo = smc.account.AccountModel.getUserInfo().getUserInfo();

        if (constantConfig.getConfigByID(12031)) {
            //总体力
            let physicalStrengthTotal = constantConfig.getConfigByID(12031).parameter1
            this.data.physicalStrengthTotal=physicalStrengthTotal;
            this.data.physicalStrength=userInfo.physicalStrength;

            //console.log("physicalStrength=",this.data.physicalStrength,physicalStrengthTotal);
            
            //this.data.progress=userInfo.physicalStrength / physicalStrengthTotal;
            //this.data.progress=0.5;
            this.data.progressstring= `${userInfo.physicalStrength} / ${physicalStrengthTotal}`;
            /*
            if (this.staminaProgressbar) {
                this.staminaProgressbar.progress = userInfo.physicalStrength / physicalStrengthTotal;
            }
            if (this.staminaLabel) {
                this.staminaLabel.string = `${userInfo.physicalStrength} / ${physicalStrengthTotal}`;
            }
            */
        }

    }


}


