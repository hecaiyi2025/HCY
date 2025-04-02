import { _decorator, Component, Node } from 'cc';
import { circleMove } from '../common/circleMove';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { MESSAGE_DEFINES } from '../common/global';
const { ccclass, property } = _decorator;

@ccclass('BackgroundView')
export class BackgroundView extends Component {

    @property(circleMove)
    m_circleMoves: circleMove[]=[];
    // m_maxSpeed = -40;//最大速度
    // m_speed = -40;//当前速度
    // m_maxCount = 5;//最大怪物数量多少个的时候停下来
    start() {
        // addMessageListener(MESSAGE_DEFINES.SET_BG_MAX_SPEED, (count) => {
        //     const flag = this.m_maxSpeed > 0 ? 1 : -1;
        //     const minSpeed = (this.m_maxSpeed * globalData.getGameRate()) / this.m_maxCount;
        //     this.m_speed = this.m_maxSpeed * globalData.getGameRate() - minSpeed * count;
        //     if (this.m_speed != 0 && this.m_speed * flag < 0) {
        //         this.m_speed = 0;
        //     }
        //     this.SetSpeed(this.m_speed);
        // });

    }

    update(deltaTime: number) {
    }

    StartMove() {
        for (let i = 0; i < this.m_circleMoves.length; i++) {
            const circleMove = this.m_circleMoves[i];
            circleMove.startMove();
            circleMove.setSpeedRate(smc.account.AccountModel.getGameRate());
        }
    }

    SetSpeedRate(rate:any) {
        if (this.m_circleMoves) {
            for (let i = 0; i < this.m_circleMoves.length; i++) {
                const circleMove = this.m_circleMoves[i];
                circleMove.setSpeedRate(rate);
            }
        }
    }

    StopMove() {
        for (let i = 0; i < this.m_circleMoves.length; i++) {
            const circleMove = this.m_circleMoves[i];
            circleMove.stopMove();
        }
    }

    GetGroundSpeed() {
        let maxSpeed = 0;
        if (this.m_circleMoves) {
            for (let i = 0; i < this.m_circleMoves.length; i++) {
                
                const _circleMove = this.m_circleMoves[i];
                //console.log("getgroundspeed",_circleMove,this.m_circleMoves.length)
                if (_circleMove&&Math.abs(_circleMove.getSpeed() * _circleMove.getSpeedRate()) > maxSpeed) {
                    maxSpeed = _circleMove.getSpeed() * _circleMove.getSpeedRate();
                }
            }
        }
        return maxSpeed;
    }
}


