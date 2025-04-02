import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveTo')
export class MoveTo extends Component {
    @property(Node)
    from: Node|any = null;
    @property(Node)
    to: Node|any = null;

    m_fromPos = Vec3.ZERO;
    m_toPos = Vec3.ZERO;
    m_start = false;
    m_time = 0;
    m_callback :any= null;
    start() {

    }

    update(deltaTime: number) {
        if (this.m_start && this.m_fromPos && this.m_toPos) {
            let t = deltaTime / this.m_time;
            if (t > 1) {
                t = 1;
            }
            let x = this.node.getWorldPosition().x + (this.m_toPos.x - this.m_fromPos.x) * t;
            let y = this.node.getWorldPosition().y + (this.m_toPos.y - this.m_fromPos.y) * t;
            let xend = false;
            let yend = false;
            if (this.m_toPos.x - this.m_fromPos.x > 0) {
                if (x >= this.m_toPos.x) {
                    x = this.m_toPos.x;
                    xend = true;
                }
            } else {
                if (x <= this.m_toPos.x) {
                    x = this.m_toPos.x;
                    xend = true;
                }
            }
            if (this.m_toPos.y - this.m_fromPos.y > 0) {
                if (y >= this.m_toPos.y) {
                    y = this.m_toPos.y;
                    yend = true;
                }
            } else {
                if (y <= this.m_toPos.y) {
                    y = this.m_toPos.y;
                    yend = true;
                }
            }
            if (xend && yend) {
                this.m_start = false;
                if (this.m_callback) {
                    this.m_callback();
                }
            }
            this.node.setWorldPosition(new Vec3(x, y, 0));
        }
    }

    setFrom(from:any) {
        this.from = from;
        this.m_fromPos = from.getWorldPosition();
    }

    setTo(to:any) {
        this.to = to;
        this.m_toPos = to.getWorldPosition();
    }

    setFromPos(pos:any) {
        this.m_fromPos = pos;
    }

    setToPos(pos:any) {
        this.m_toPos = pos;
    }

    moveTo(time:any, callback:any = null) {
        if (this.m_fromPos) {
            this.m_time = time;
            this.m_start = true;
            this.m_callback = callback;
            this.node.setWorldPosition(this.m_fromPos);
        }
    }

    reset() {
        if (this.m_fromPos) {
            this.m_start = false;
            this.node.setWorldPosition(this.m_fromPos);
        }
    }

    stop() {
        this.m_start = false;
    }
}


