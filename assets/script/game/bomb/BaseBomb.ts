import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseBomb')
export class BaseBomb extends Component {

    m_destoryId :any= null;
    m_params = null;
    start() {

    }

    update(deltaTime: number) {

    }

    StartBomb() {
        if (this.m_destoryId) {
            clearTimeout(this.m_destoryId);
            this.m_destoryId = null;
        }
        this.m_destoryId = setTimeout(() => {
            this.node.removeFromParent();
        }, 1000);
    }

    OnAnimationEnd() {
        if (this.m_destoryId) {
            clearTimeout(this.m_destoryId);
            this.m_destoryId = null;
        }
        this.node.removeFromParent();
    }

    SetParams(params:any) {
        this.m_params = params;
    }

    protected onDisable(): void {
        if (this.m_destoryId) {
            clearTimeout(this.m_destoryId);
            this.m_destoryId = null;
        }
    }
}


