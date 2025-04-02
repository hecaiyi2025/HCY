import { _decorator, Component, Node, sp, UITransform, Vec3, view, Animation } from 'cc';
//import { getAngle, postMessage, sendMessage } from '../../public/publicFunctions';
import { BOMB_TYPE, MESSAGE_DEFINES, NODE_TYPE, PVP_TEAM_CAMP, ROLE_TYPE,getAngle } from '../common/global';
import { BaseMonster } from '../battle/BaseMonster';
import { BaseRole } from '../battle/BaseRole';
import { friendConfig } from '../common/config/friend';
import { roleConfig } from '../common/config/roleConfig';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
//import { globalData } from '../../data/globalData';
const { ccclass, property } = _decorator;

@ccclass('BaseBullet')
export class BaseBullet extends Component {
    @property(Animation)
    m_animations: Animation[] = [];
    @property(sp.Skeleton)
    m_skeletons: sp.Skeleton[] = [];

    m_target: Node|any = null;
    m_targetParent: Node|any  = null;// 目标父节点， 用于目标死亡后判断消失位置的

    m_info:any = null;// 子弹信息

    m_fromType = NODE_TYPE.NONE;// 子弹来源角色类型 1-玩家 2-怪物
    m_from :any= null;// 子弹来源信息
    m_camp = PVP_TEAM_CAMP.NONE; //阵营(用于PVP)

    m_type = 0;//技能类型 1-被动 2-主动
    m_speed = 500;//子弹速度
    m_attack = 0;//子弹伤害
    m_attackInterval = 0.2;//持续伤害时间间隔，只有持续伤害会用到这个数值

    m_status = 0;//0:未开始 1:开始 2:结束
    m_lastDisX = 0;//失去目标后保持原角度和速度
    m_lastDisY = 0;//失去目标后保持原角度和速度
    m_maxLive = 10;//最大存活时间，防止bug撑爆内存
    m_liveId :any= null;//计时器id
    m_bottomY = 0;//子弹最低位置，低于这个位置就消失

    m_hitList :any[]= [];//已击中的目标列表
    m_fetterInfo:any = null;// 羁绊信息
    start() {

    }

    update(deltaTime: number) {
    }

    SetInfo(info:any, buffSkillRate = 1) {
        this.m_info = info;
        this.m_type = info.type;
        this.m_speed = info.speed;
        this.m_attackInterval = info.interval;
        if (this.m_type == 2) {
            this.SetSkillAttack(buffSkillRate);
        }
    }

    SetFromInfo(type:any, from:any) {
        this.m_fromType = type;
        this.m_from = from;
    }

    GetFromInfo() {
        return this.m_from;
    }

    GetInfo() {
        return this.m_info;
    }

    SetTarget(target:any) {
        this.m_target = target;
        this.m_targetParent = target.parent;
    }

    SetAttack(attack:any) {
        this.m_attack = attack;
    }
    GetAttack() {
        return this.m_attack;
    }

    SetCamp(camp:any) {
        this.m_camp = camp;
    }

    GetCamp() {
        return this.m_camp;
    }

    SetFetterInfo(info:any) {
        this.m_fetterInfo = info;
    }
    GetFetterInfo() {
        return this.m_fetterInfo;
    }

    StartMove() {
        this.m_status = 1;
        this.ClearTimeoutId();
        this.m_liveId = setTimeout(() => {
            this.m_status = 2;
            this.ClearTimeoutId();
            this.removeSelf();
        }, this.m_maxLive * 1000); // 子弹存活时间
        this.SetEuler();
        const targetWorldPosX = this.m_target.getWorldPosition().x;
        const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
        const myWorldPosX = this.node.getWorldPosition().x;
        const myWorldPosY = this.node.getWorldPosition().y;
        this.m_lastDisX = targetWorldPosX - myWorldPosX;
        this.m_lastDisY = targetWorldPosY - myWorldPosY;
        /*
        sendMessage(MESSAGE_DEFINES.GAME_GET_MONSTER_POS, null, (list) => {
            const to = list[0];
            this.m_bottomY = to.getWorldPosition().y; // 获取怪物最低位置
        });*/
        oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_MONSTER_POS.toString(),(list: Node[]) => {
            const to = list[0];
            this.m_bottomY = to.getWorldPosition().y; // 获取怪物最低位置

        },null);
    }

    ClearTimeoutId() {
        if (this.m_liveId) {
            clearTimeout(this.m_liveId);
            this.m_liveId = null;
        }
    }

    SetEuler() {
        let euler = this.node.eulerAngles.z;
        if (this.m_target) {
            euler = getAngle(this.node.getWorldPosition(), this.m_target.getWorldPosition(), 0, this.GetTargetHeight());// 设置子弹角度
        }
        this.node.setRotationFromEuler(0, 0, euler); // 设置子弹角度
    }

    GetCenterPosition() {
        return new Vec3(this.node.getWorldPosition().x, this.node.getWorldPosition().y, this.node.getWorldPosition().z);
    }

    protected onDisable(): void {
        this.ClearTimeoutId();
    }

    GetTargetHeight() {
        if (!this.m_target) return 0;
        return (0.5 - this.m_target.getComponent(UITransform).anchorPoint.y) * this.m_target.getComponent(UITransform).height / 2;
    }

    CheckTargetAlive(target :any= null) {
        if (!target) {
            target = this.m_target;
        }
        if (this.m_camp == PVP_TEAM_CAMP.NONE) {//非PVP
            if (target) {
                if (this.m_fromType == NODE_TYPE.MONSTER) {
                    const roleScript = target.getComponent(BaseRole);
                    if (roleScript && roleScript.IsAlive()) {
                        return true;
                    }
                } else if (this.m_fromType == NODE_TYPE.ROLE) {
                    const monsterScript = target.getComponent(BaseMonster);
                    if (monsterScript && monsterScript.IsAlive()) {
                        return true;
                    }
                }
            }
        } else {//PVP
            if (target) {
                const roleScript = target.getComponent(BaseRole);
                if (roleScript && roleScript.IsAlive()) {
                    return true;
                }
            }
        }
        return false;

    }

    removeSelf() {
        this.node.active = false;
    }

    SetSkillAttack(buffSkillRate:any) {
        const skillId:any = this.m_info.id;
        let id = null;
        const roleList = roleConfig.getConfig();
        for (const key in roleList) {
            if (Object.prototype.hasOwnProperty.call(roleList, key)) {
                const roleInfo = roleList[key];
                if (roleInfo.activeSkill == skillId) {
                    id = roleInfo.id;
                    break;
                }
            }
        }
        if (!id) {
            const friendlist = friendConfig.getConfig();
            for (const key in friendlist) {
                if (Object.prototype.hasOwnProperty.call(friendlist, key)) {
                    const friendInfo = friendlist[key];
                    if (friendInfo.activeSkill == skillId) {
                        id = friendInfo.id;
                        break;
                    }
                }
            }
        }
        if (id) {
            /*
            sendMessage(MESSAGE_DEFINES.GET_ROLE_LIST, true, (targetList: Node[]) => {
                if (targetList && targetList.length > 0) {
                    for (let i = 0; i < targetList.length; i++) {
                        const role = targetList[i];
                        const roleScript = role.getComponent(BaseRole);
                        if (roleScript && roleScript.GetInfo()) {
                            const roleType = roleScript.GetType();
                            const roleInfo = roleScript.GetInfo();
                            if (roleType == ROLE_TYPE.MAIN) {
                                if (roleInfo.id == id) {
                                    let rate = this.m_info.rate;
                                    if (!rate || rate == 0) {
                                        rate = 1;
                                    }
                                    this.SetAttack(roleScript.GetAttack() * rate * buffSkillRate);
                                    this.m_from = role;
                                }
                            } else if (roleType == ROLE_TYPE.FRIEND) {
                                if (roleInfo.friendInfo && roleInfo.friendInfo.id == id) {
                                    let rate = this.m_info.rate;
                                    if (!rate || rate == 0) {
                                        rate = 1;
                                    }
                                    this.SetAttack(roleScript.GetAttack() * rate * buffSkillRate);
                                    this.m_from = role;
                                }
                            }
                        }
                    }
                }
            });*/
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GET_ROLE_LIST.toString(),(targetList: Node[]) => {
                if (targetList && targetList.length > 0) {
                    for (let i = 0; i < targetList.length; i++) {
                        const role = targetList[i];
                        const roleScript = role.getComponent(BaseRole);
                        if (roleScript && roleScript.GetInfo()) {
                            const roleType = roleScript.GetType();
                            const roleInfo = roleScript.GetInfo();
                            if (roleType == ROLE_TYPE.MAIN) {
                                if (roleInfo.id == id) {
                                    let rate = this.m_info.rate;
                                    if (!rate || rate == 0) {
                                        rate = 1;
                                    }
                                    this.SetAttack(roleScript.GetAttack() * rate * buffSkillRate);
                                    this.m_from = role;
                                }
                            } else if (roleType == ROLE_TYPE.FRIEND) {
                                if (roleInfo.friendInfo && roleInfo.friendInfo.id == id) {
                                    let rate = this.m_info.rate;
                                    if (!rate || rate == 0) {
                                        rate = 1;
                                    }
                                    this.SetAttack(roleScript.GetAttack() * rate * buffSkillRate);
                                    this.m_from = role;
                                }
                            }
                        }
                    }
                }
             },true);
        }  
    }

    IsAlive() {
        return this.m_status != 2;
    }

    CheckOutArea() {
        const myWorldPosX = this.node.getWorldPosition().x;
        const myWorldPosY = this.node.getWorldPosition().y;
        let screenWidth = view.getVisibleSize().width;
        let screenHeight = view.getVisibleSize().height;
        if (myWorldPosX < 0 || myWorldPosY < 0 || myWorldPosX > screenWidth || myWorldPosY > screenHeight) {
            this.m_status = 2;
            this.ClearTimeoutId();
            this.removeSelf();
            return false;
        }
        return true;
    }

    /*子弹击中目标*/
    /*
    * bomb: 如果未找到目标是否直接爆炸
    * removeSelf: 是否移除子弹
    * repeat: 用于穿透性子弹，是否重复击中目标
    * */
    HitTarget(removeSelf = true, repeat = false) {
        let code = null;
        if (this.m_camp == PVP_TEAM_CAMP.NONE) {//非PVP
            if (this.m_fromType == NODE_TYPE.MONSTER) {
                //
            } else if (this.m_fromType == NODE_TYPE.ROLE) {
                code = MESSAGE_DEFINES.GET_MULTI_MONSTER_TARGET;
            }
        } else {
            code = MESSAGE_DEFINES.PVP_MULTI_TARGET;
        }
        if (code) {/*
            sendMessage(code, { target: this.node, range: this.m_info.range, max: this.m_info.maxHit }, (list) => {
                if (list && list.length > 0) {
                    const finalList = list.filter((item) => {
                        let has = false;
                        if (!repeat) {
                            has = this.m_hitList.indexOf(item) != -1;
                        }
                        return this.CheckTargetAlive() && !has;
                    });
                    if (finalList.length > 0) {
                        if (!repeat) {
                            this.m_hitList = this.m_hitList.concat(finalList);
                        }
                        if (this.m_info && this.m_info.bombType == BOMB_TYPE.NONE && this.m_info.bomb == "0") {//普通子弹
                            for (let i = 0; i < finalList.length; i++) {
                                const monster = finalList[i];
                                postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                            }
                        } else {//爆炸子弹,只选取最近的一个目标产生爆炸
                            finalList.sort((a, b) => {
                                const aPos = a.getWorldPosition();
                                const bPos = b.getWorldPosition();
                                const aDis = Math.sqrt(Math.pow(aPos.x - this.node.getWorldPosition().x, 2) + Math.pow(aPos.y - this.node.getWorldPosition().y, 2));
                                const bDis = Math.sqrt(Math.pow(bPos.x - this.node.getWorldPosition().x, 2) + Math.pow(bPos.y - this.node.getWorldPosition().y, 2));
                                return aDis - bDis;
                            })
                            const monster = finalList[0];
                            postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                        }
                        if (removeSelf) {
                            this.m_status = 2;
                            this.ClearTimeoutId();
                            this.removeSelf();
                        }
                    }
                }
            });
            */
            oops.message.dispatchEventcallback(code.toString(),(list: Node[]) => {
                if (list && list.length > 0) {
                    const finalList = list.filter((item) => {
                        let has = false;
                        if (!repeat) {
                            has = this.m_hitList.indexOf(item) != -1;
                        }
                        return this.CheckTargetAlive() && !has;
                    });
                    if (finalList.length > 0) {
                        if (!repeat) {
                            this.m_hitList = this.m_hitList.concat(finalList);
                        }
                        if (this.m_info && this.m_info.bombType == BOMB_TYPE.NONE && this.m_info.bomb == "0") {//普通子弹
                            for (let i = 0; i < finalList.length; i++) {
                                const monster = finalList[i];
                                oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                                //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                            }
                        } else {//爆炸子弹,只选取最近的一个目标产生爆炸
                            finalList.sort((a, b) => {
                                const aPos = a.getWorldPosition();
                                const bPos = b.getWorldPosition();
                                const aDis = Math.sqrt(Math.pow(aPos.x - this.node.getWorldPosition().x, 2) + Math.pow(aPos.y - this.node.getWorldPosition().y, 2));
                                const bDis = Math.sqrt(Math.pow(bPos.x - this.node.getWorldPosition().x, 2) + Math.pow(bPos.y - this.node.getWorldPosition().y, 2));
                                return aDis - bDis;
                            })
                            const monster = finalList[0];
                            oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(), { from: this.node, to: monster, attack: this.m_attack })
                            //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to: monster, attack: this.m_attack });// 子弹击中目标
                        }
                        if (removeSelf) {
                            this.m_status = 2;
                            this.ClearTimeoutId();
                            this.removeSelf();
                        }
                    }
                }
             },{target: this.node, range: this.m_info.range, max: this.m_info.maxHit});
        }
    }

    Move(deltaTime:any) {
        const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
        if (distance != 0) {
            const myWorldPosX = this.node.getWorldPosition().x;
            const myWorldPosY = this.node.getWorldPosition().y;
            const x = myWorldPosX + (this.m_lastDisX > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisX) / distance);
            const y = myWorldPosY + (this.m_lastDisY > 0 ? 1 : -1) * this.m_speed * deltaTime * (Math.abs(this.m_lastDisY) / distance);
            this.node.setWorldPosition(x, y, 0); // 设置子弹位置
        }
    }

    Bomb(to:any) {
        oops.message.dispatchEvent(MESSAGE_DEFINES.BULLET_HIT_TARGET.toString(),  { from: this.node, to, attack: this.m_attack })
        //postMessage(MESSAGE_DEFINES.BULLET_HIT_TARGET, { from: this.node, to, attack: this.m_attack });// 直接爆炸
        this.m_status = 2;
        this.ClearTimeoutId();
        this.removeSelf();
    }

    AutoMove(deltaTime:any) {
        const myWorldPosX = this.node.getWorldPosition().x;
        const myWorldPosY = this.node.getWorldPosition().y;
        const cross = this.m_info.cross != '0';//穿透子弹逻辑：不重复计算伤害、且计算伤害后不需要移除自己
        const repeat = this.GetMoveRepeat(cross);
        const removeSelf = this.GetCanRemoveSelf(cross);
        if (cross) {
            this.Move(deltaTime); // 移动
            this.HitTarget(removeSelf, repeat); // 击中目标
        } else if (this.m_target) {
            const targetWorldPosX = this.m_target.getWorldPosition().x;
            const targetWorldPosY = this.m_target.getWorldPosition().y + this.GetTargetHeight();
            if (this.CheckTargetAlive()) {
                this.SetEuler(); // 设置子弹角度
                this.m_lastDisX = targetWorldPosX - myWorldPosX;
                this.m_lastDisY = targetWorldPosY - myWorldPosY;
                const distance = Math.sqrt(this.m_lastDisX * this.m_lastDisX + this.m_lastDisY * this.m_lastDisY);
                const width = this.node.getComponent(UITransform)!.width;
                const targetWidth = this.m_target.getComponent(UITransform).width;
                // console.log("目标距离：", distance);
                // console.log("爆炸范围：", width / 2 + targetWidth / 2);
                this.Move(deltaTime); // 移动
                if (distance <= width / 2 + targetWidth / 2) {
                    this.HitTarget(removeSelf, repeat); // 击中目标
                }
            } else {
                this.Move(deltaTime); // 移动
                if (this.m_targetParent) {//穿透子弹不需要计算低于目标，穿过目标后继续飞行，直到低于地板
                    if (myWorldPosY < targetWorldPosY) {
                        this.node.setWorldPosition(myWorldPosX, targetWorldPosY, 0); // 设置子弹位置
                        this.Bomb(null);
                    }
                }
            }
        } else {
            this.m_status = 2;
            this.ClearTimeoutId();
            this.removeSelf();// 子弹消失
        }

        this.checkBottom();
    }

    checkBottom() {
        const myWorldPosX = this.node.getWorldPosition().x;
        const myWorldPosY = this.node.getWorldPosition().y;
        if (myWorldPosY < this.m_bottomY) {
            this.node.setWorldPosition(myWorldPosX, this.m_bottomY, 0); // 设置子弹位置
            this.Bomb(null);
        }
    }

    GetMoveRepeat(cross:any) {
        return !cross;
    }
    GetCanRemoveSelf(cross:any) {
        return !cross;
    }

    Reset() {
        for (let i = 0; i < this.m_animations.length; i++) {
            const animation = this.m_animations[i];
            animation.stop();
            animation.play();
        }
        for (let i = 0; i < this.m_skeletons.length; i++) {
            const skeleton = this.m_skeletons[i];
            if (skeleton) {
                skeleton.timeScale = smc.account.AccountModel.getGameRate();
                if (skeleton.findAnimation('play')) {
                    skeleton.setAnimation(0, 'play', skeleton.loop);
                }
            }
        }
        this.m_hitList = [];//已击中的目标列表
    }
}


