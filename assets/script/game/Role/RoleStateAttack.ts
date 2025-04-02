import { AnimatorStateLogic } from "../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { Role } from "./Role";
import { AnimationEventHandler } from "./AnimationEventHandler";

/** 攻击状态逻辑 */
export class RoleStateAttack extends AnimatorStateLogic {
    private role: Role;
    private anim: AnimationEventHandler;

    public constructor(role: Role, anim: AnimationEventHandler) {
        super();
        this.role = role;
        this.anim = anim;
        this.anim.addFrameEvent("attack", this.onAttack, this);
    }

    private onAttack() {
        var onAttackComplete = this.role.RoleViewComp.animator.onAttackComplete;
        onAttackComplete && onAttackComplete();
    }

    public onEntry() {

    }

    public onUpdate() {

    }

    public onExit() {

    }
}