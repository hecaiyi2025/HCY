import { AnimatorStateLogic } from "../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { Role } from "./Role";
import { AnimationEventHandler } from "./AnimationEventHandler";

/** 受击状态逻辑 */
export class RoleStateDead extends AnimatorStateLogic {
    private role: Role;
    private anim: AnimationEventHandler;

    public constructor(role: Role, anim: AnimationEventHandler) {
        super();
        this.role = role;
        this.anim = anim;
        this.anim.addFrameEvent("dead", this.onDead, this);
    }

    private onDead() {
        var onHitActionComplete = this.role.RoleViewComp.animator.onHitActionComplete;
        onHitActionComplete && onHitActionComplete();
    }

    public onEntry() {

    }

    public onUpdate() {

    }

    public onExit() {

    }
}