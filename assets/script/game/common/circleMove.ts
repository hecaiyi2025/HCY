import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('circleMove')
export class circleMove extends Component {
    @property
    speed: number = -10;
    @property
    begin: number = 488;
    @property
    end: number = -488;
    @property
    interval: number = 0;
    @property
    mode: number = 0; // 0: y轴移动，1: x轴移动
    @property
    status: number = 0; // 0: 移动，1: 停止
    @property
    m_speedRate: number = 1;

    m_interval = 0;
    start() {
        this.m_interval = this.interval;
    }

    update(deltaTime: number) {
        if (this.m_interval > 0) {
            this.m_interval -= deltaTime;
            return;
        }
        if (this.status == 0) {
            if (this.mode == 0) {
                let y = this.node.position.y + this.speed * this.m_speedRate * deltaTime;
                if (this.end < 0 ? y < this.end : y > this.end) {
                    this.node.setPosition(this.node.position.x, this.begin, this.node.position.z);
                    this.m_interval = this.interval;
                } else {
                    this.node.setPosition(this.node.position.x, y, this.node.position.z);
                }
            } else {
                let x = this.node.position.x + this.speed * this.m_speedRate * deltaTime;
                if (this.end < 0 ? x < this.end : x > this.end) {
                    this.node.setPosition(this.begin, this.node.position.y, this.node.position.z);
                    this.m_interval = this.interval;
                } else {
                    this.node.setPosition(x, this.node.position.y, this.node.position.z);
                }
            }
        }
    }

    stopMove() {
        this.status = 1;
    }

    startMove() {
        this.status = 0;
    }

    setSpeed(speed:any) {
        this.speed = speed;
    }

    getSpeed() {
        if (this.status == 1) {
            return 0;
        }
        return this.speed;
    }

    setSpeedRate(rate:any) {
        this.m_speedRate = rate;
    }

    getSpeedRate() {
        return this.m_speedRate;
    }
}


