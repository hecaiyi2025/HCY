import { _decorator, Component, sp } from 'cc';
const { ccclass, property, requireComponent, disallowMultiple } = _decorator;
import AnimatorSpine from "../../../../extensions/oops-plugin-framework/assets/libs/animator/AnimatorSpine";
import { AnimatorStateLogic } from "../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { RoleViewLoader,Role } from "./Role";

import { AnimationEventHandler } from "./AnimationEventHandler";
import { RoleStateAttack } from "./RoleStateAttack";
import { RoleStateDead } from "./RoleStateDead";
import { RoleStateHit } from "./RoleStateHit";

/** 角色动作名 */
export enum RoleAnimatorType {
    /** 待机 */
    Idle = "Idle",
    /** 攻击 */
    Attack = "Attack",
    /** 受击 */
    Hurt = "Hurt",
    /** 死亡 */
    Dead = "Dead"
}
/** 武器名 */
export var WeaponName: any = {
    0: "Fist",
    1: "Katana",
    2: "CrossGun",
    3: "LongGun",
    4: "Razor",
    5: "Arch",
    6: "Crossbow",
    7: "IronCannon",
    8: "FireGun",
    9: "Wakizashi",
    10: "Kunai",
    11: "Dagger",
    12: "Kusarigama",
    13: "DanceFan",
    14: "Flag",
    15: "MilitaryFan",
    16: "Shield"
}

@ccclass('RoleViewAnimator')
@disallowMultiple
@requireComponent(sp.Skeleton)
export class RoleViewAnimator extends AnimatorSpine  {
    /** 攻击行为完成 */
    onAttackComplete: Function = null!;
    /** 受击动作完成 */
    onHitActionComplete: Function = null!;
    /** 角色对象 */
    role: Role = null!;
    /** 武器动画名 */
    private weaponAnimName: string = null!;

    start() {
        super.start();

        // 动画状态机
        let anim = new AnimationEventHandler();
        let asl: Map<string, AnimatorStateLogic> = new Map();
        asl.set(RoleAnimatorType.Attack, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.Hurt, new RoleStateHit(this.role, anim));
        asl.set(RoleAnimatorType.Dead, new RoleStateDead(this.role, anim));
        this.initArgs(asl, anim);
    }
    /**
     * 播放动画
     * @override
     * @param animName 动画名
     * @param loop 是否循环播放
     */
    //AttackCritical_Arch
    protected playAnimation(animName: string, loop: boolean) {
        if (animName) {
            //this.weaponAnimName = this.getWeaponAnimName();
            //var name = `${animName}_${this.weaponAnimName}`;
            this._spine.setAnimation(0, animName, loop);
        }
        else {
            this._spine.clearTrack(0);
        }
    }
    /** 武器动画剪辑名 */
    private getWeaponAnimName() {
        //var job = this.role.RoleModelJob;
        var weaponAnimName = WeaponName[0];
        return weaponAnimName;
    }
}


