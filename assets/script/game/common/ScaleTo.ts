import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScaleTo')
export class ScaleTo extends Component {
    @property
    from = 0;
    @property
    to = 1;

    m_start = false;
    m_time = 0;
    m_callback:any = null;
    start() {

    }

    update(deltaTime: number) {
        if (this.m_start) {
            let t = deltaTime / this.m_time;
            if (t > 1) {
                t = 1;
            }
            let scale = this.node.scale.x + (this.to - this.from) * t;
            let end = false;
            if (this.to - this.from > 0) {
                if (scale >= this.to) {
                    scale = this.to;
                    end = true;
                }
            } else {
                if (scale <= this.to) {
                    scale = this.to;
                    end = true;
                }
            }
            if (end) {
                this.m_start = false;
                if (this.m_callback) {
                    this.m_callback();
                }
            }
            this.node.scale = new Vec3(scale, scale, scale);

        }
    }

    setFrom(from:any) {
        this.from = from;
    }

    setTo(to:any) {
        this.to = to;
    }

    scaleTo(time:any, callback:any = null) {
        this.m_time = time;
        this.m_start = true;
        this.m_callback = callback;
        this.node.scale = new Vec3(this.from, this.from, this.from);
    }

    reset() {
        this.m_start = false;
        this.node.scale = new Vec3(this.from, this.from, this.from);
    }
}


