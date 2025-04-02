import { _decorator } from 'cc';
import { BaseMonster } from '../battle/BaseMonster';
import { GAME_TYPE, MESSAGE_DEFINES, MONSTER_STATUS } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
const { ccclass, property } = _decorator;

@ccclass('Monster5')
export class Monster5 extends BaseMonster {
    start() {
        // setInterval(() => {
        //     // this.ShowHit();
        //     this.Jump(500);
        // }, 3000);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

}


