import { _decorator } from 'cc';
import { BaseMonster } from '../battle/BaseMonster';
import { GAME_TYPE, MESSAGE_DEFINES, MONSTER_STATUS } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
const { ccclass, property } = _decorator;

@ccclass('Monster4')
export class Monster4 extends BaseMonster {
    start() {
        super.start();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }
}


