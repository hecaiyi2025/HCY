import { _decorator, Component, instantiate, Node } from 'cc';
import { rewardItem } from './rewardItem';
const { ccclass, property } = _decorator;
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../game/common/config/GameUIConfig";
@ccclass('GameFailedView')
export class GameFailedView extends Component {
    //物品
    @property(Node)
    item: Node|any = null;
    //横向列表
    @property(Node)
    rewardContent: Node|any = null;

    m_money = 0;
    m_rewardList = [];
    start() {

    }

    update(deltaTime: number) {

    }

    Show(money:any, rewardList:any) {
        this.m_money = money;
        this.m_rewardList = rewardList;
        this.rewardContent.removeAllChildren();
        if(money != 0){
            const moneyItem = instantiate(this.item);
            moneyItem.active = true;
            this.rewardContent.addChild(moneyItem);
            const rewardScript = moneyItem.getComponent(rewardItem);
            if (rewardScript) {
                rewardScript.ShowUI({ id: 1, num: money });
            }
        }
        if (rewardList) {
            for (let i = 0; i < rewardList.length; i++) {
                const reward = rewardList[i];
                if (reward.id ==1) {//金币在上面做过，这里不需要再做了
                    continue;
                }
                const itemNode = instantiate(this.item);
                itemNode.active = true;
                this.rewardContent.addChild(itemNode);
                const rewardScript = itemNode.getComponent(rewardItem);
                if (rewardScript) {
                    rewardScript.ShowUI(reward);
                }
            }
        }
    }
    OnAdDoubleFail() {
        //showAD(AD_TYPE.GAME_FAIL, this.gameFailedView.m_money);
    }
    OnChangeToHall() {
        oops.gui.open(UIID.Demo)
        oops.gui.remove(UIID.Game,true);
        //oops.gui.replaceAsync(UIID.Game,UIID.Demo)
        oops.gui.remove(UIID.fail);
        /*
        //changeScene('hall', this.loadingNode, this.progressLabel);
        oops.gui.openAsync(UIID.Loading2).then((node)=>{ 
            oops.gui.openAsync(UIID.Demo).then(()=>{
                oops.gui.remove(UIID.Loading2);
                oops.gui.remove(UIID.fail);  
            })
              
       })*/

    }
    OnRestart() {
        //changeScene('game', this.loadingNode, this.progressLabel);
    }
}


