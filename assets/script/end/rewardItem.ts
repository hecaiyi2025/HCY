import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame } from 'cc';
import { goodsConfig } from '../game/common/config/goods';
import { smc } from "../game/common/SingletonModuleComp";
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
const { ccclass, property } = _decorator;

@ccclass('rewardItem')
export class rewardItem extends Component {
    @property(Sprite)
    icon: Sprite|null = null;

    @property(Label)
    nameLabel: Label |null= null;

    @property(Label)
    num: Label |null= null;
    start() {

    }

    update(deltaTime: number) {

    }

    ShowUI(data:any) {
        console.log('rewardItem:', data);
        this.num!.string = 'x' + data.num;
        const id = data.id;
        const goodsInfo = goodsConfig.getConfigByID(id);
        if (goodsInfo) {
            oops.res.loadAsync(goodsInfo.icon,SpriteFrame).then((spriteFrame: SpriteFrame)=>{
                this.icon!.spriteFrame = spriteFrame;

            })/*
            getResourcesAsync(goodsInfo.icon, (success, spriteFrame: SpriteFrame) => {
                if (success) {
                    this.icon.spriteFrame = spriteFrame;
                }
            });*/
            if (this.nameLabel) {
                this.nameLabel.string = goodsInfo.name;
            }
        }
    }
}


