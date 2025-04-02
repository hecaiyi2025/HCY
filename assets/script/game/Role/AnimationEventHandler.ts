import AnimatorBase, { AnimationPlayer } from "../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorBase";

class FrameEventData {
    public callback!: Function;
    public target: any;
}

/** 模型动作自定义事件逻辑 */
export class AnimationEventHandler implements AnimationPlayer {
    private frameEvents: Map<string, FrameEventData> = new Map();
    private finishedEvents: Map<string, FrameEventData> = new Map();

    public addFrameEvent(type: string, callback: Function, target: any) {
        var data = new FrameEventData();
        data.callback = callback;
        data.target = target;
        this.frameEvents.set(type, data);
    }

    public addFinishedEvent(type: string, callback: Function, target: any) {
        var data = new FrameEventData();
        data.callback = callback;
        data.target = target;
        this.finishedEvents.set(type, data);
    }

    onFrameEventCallback(type: string, target: AnimatorBase): void {
        var data = this.frameEvents.get(type);
        if (data)
            data.callback.call(data.target, type, target);
    }

    onFinishedCallback(target: AnimatorBase): void {
        var data = this.finishedEvents.get(target.curStateName);
        if (data)
            data.callback.call(data.target, target.curStateName, target);
    }

    playAnimation(animName: string, loop: boolean): void {

    }

    scaleTime(scale: number): void {

    }
}


