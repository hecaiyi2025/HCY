import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveBy')
export class MoveBy extends Component {

    m_start = false;
    m_time = 0;
    m_distance = 0;
    m_maxDistance = 0;
    m_callback :Function|any= null;
    mode: number = 0; // 0: x轴移动，1: y轴移动
    m_gameSpeed = 1;
    start() {

    }

    update(deltaTime: number) {
        deltaTime = deltaTime * this.m_gameSpeed;
        if (this.m_start) {
            let t = deltaTime / this.m_time;
            if (t > 1) {
                t = 1;
            }
            let x = this.node.position.x;
            let y = this.node.position.y;
            let distance = this.m_maxDistance * t;
            if (this.m_distance < Math.abs(distance)) {
                distance = this.m_distance * (this.m_maxDistance > 0 ? 1 : -1);
                this.m_start = false;
                if (this.m_callback) {
                    this.m_callback();
                }
            }
            this.m_distance -= Math.abs(distance);
            if (this.mode == 0) {
                x += distance;
            } else {
                y += distance;
            }
            this.node.position = new Vec3(x, y, 0);
        }
    }

    moveBy(mode:any, distance:any, time:any, callback:any = null) {
        this.mode = mode;
        this.m_distance = Math.abs(distance);
        this.m_maxDistance = distance;
        this.m_time = time;
        this.m_start = true;
        this.m_callback = callback;
    }

    setGameSpeed(speed:any) {
        this.m_gameSpeed = speed;
    }

    protected onDisable(): void {
        this.m_start = false;
        this.m_callback = null;
    }
}


