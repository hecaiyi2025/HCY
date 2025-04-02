import { _decorator, sp, Node } from 'cc';
const { ccclass, property } = _decorator;
import { ecs } from '../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { CCComp } from "../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { RoleViewLoader,Role } from "./Role";
import { RoleViewAnimator } from "./RoleViewAnimator";

//定义类RoleViewAnimator extends AnimatorSpine，可以在这个类里面成员赋值很多动作回调函数(如onAttackComplete)，
// 这个组件在Role的init函数添加，并且赋给Role.Animator，
//public onStateChange(fromState: AnimatorState, toState: AnimatorState) {
//    this.playAnimation(toState.motion, toState.loop);
//    this._stateLogicMap.get(toState.name).onEntry();
//    以及后面的update()触发= this._stateLogicMap.get(this._ac.curState.name).onUpdate();
//}

//定义类 AnimationEventHandler implements AnimationPlayer里面有基类可以被触发的回调接口，可以在这个类里面
//注册一些其他函数，在接口被触发时候调用这些函数，起到中介用途

//定义多种逻辑类RoleStateAttack extends AnimatorStateLogic ，构造函数传来Role和AnimationEventHandler
//赋给role和anim，利用anim中介用途可以往里注册this.anim.addFrameEvent("attack", this.onAttack, this);当
//执行动画的时候执行逻辑里的回调

//先准备xxooStateLogic类，然后再RoleViewAnimator.start函数里面执行new handler,new logicmap,然后用来初始化
// 自己基类成员_stateLogicMap和_animationPlayer，

// 基类里有一个状态机控制器ac：AnimatorController(有成员e _states:Map<string, AnimatorState>),也是由RoleViewAnimator提供初始化参数
//所谓状态控制（如GFU IFSM）有this._ac.states/this._ac.curState/
/*
        let anim = new AnimationEventHandler();
        let asl: Map<string, AnimatorStateLogic> = new Map();
        asl.set(RoleAnimatorType.Attack, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.Hurt, new RoleStateHit(this.role, anim));
        asl.set(RoleAnimatorType.Dead, new RoleStateDead(this.role, anim));
        this.initArgs(asl, anim);
*/

//我先定义MyiewAnimator派生于AnimatorSpine，在里面我主动提供StateLogics和AnimationPlayer
//然后用MyiewAnimator.onStateChange(fromState: AnimatorState, toState: AnimatorState)
//执行播放动画和逻辑切换，动画播放完成之后AnimationPlayer内注册的回调执行。

//无视条件直接跳转状态RoleViewAnimator.play(stateName: string)=>this._ac.play(stateName);=>
//当状态有改变时this.changeState(stateName);=>this._animator.onStateChange(oldState, this._curState);





@ccclass('RoleViewComp')
@ecs.register('RoleViewComp')
export class RoleViewComp extends  CCComp  {
    loader: RoleViewLoader = null!;

    /** 角色动画规则管理 */
    animator: RoleViewAnimator = null!;

    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton = null!;

    reset() {
        this.node.destroy();//必须有这一句
    }
    onLoad() {
        var role = this.ent as Role;

        this.loader = this.node.addComponent(RoleViewLoader);
        this.node.emit("load", role);

        this.animator = this.spine.getComponent(RoleViewAnimator)!;
        this.animator.role = role;

        
    }
    
}


