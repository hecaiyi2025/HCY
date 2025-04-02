import { _decorator, Component, instantiate, Layout, Node, UITransform } from 'cc';
import { rewardItem } from './rewardItem';
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../game/common/config/GameUIConfig";
const { ccclass, property } = _decorator;

@ccclass('GameSuccessView')
export class GameSuccessView extends Component {
    //物品
    @property(Node)
    item: Node|any = null;
    //横向列表
    @property(Node)
    rewardContent: Node|any = null;

    m_timerId:any = null;
    start() {

    }

    update(deltaTime: number) {

    }

    Show(money:any, rewardList:any) {
        this.rewardContent.removeAllChildren();
        if (money != 0) {
            const moneyItem = instantiate(this.item);
            moneyItem.active = true;
            this.rewardContent.addChild(moneyItem);
            const rewardScript = moneyItem.getComponent(rewardItem);
            if (rewardScript) {
                rewardScript.ShowUI({ id: 1, num: money });
            }
        }
        if (rewardList && rewardList.length) {
            const layout = this.rewardContent.getComponent(Layout);
            if (layout) {
                layout.paddingLeft = rewardList.length > 3 ? 0 : 40;
                layout.spacingX = rewardList.length > 3 ? 0 : 20;
            }
            for (let i = 0; i < rewardList.length; i++) {
                const reward = rewardList[i];
                if (reward.id == 1) {//金币在上面做过，这里不需要再做了
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
            if (this.m_timerId) {
                clearTimeout(this.m_timerId);
                this.m_timerId = null;
            }
            this.m_timerId = setTimeout(() => {
                if (this.rewardContent.parent) {
                    const transform = this.rewardContent.parent.getComponent(UITransform);
                    if (transform) {
                        let width = this.rewardContent.getComponent(UITransform).contentSize.width;
                        let maxWidth = width;
                        if (this.rewardContent.parent.parent) {
                            const parentTransform = this.rewardContent.parent.parent.getComponent(UITransform);
                            if (parentTransform) {
                                maxWidth = parentTransform.contentSize.width;
                            }
                        }
                        if (width > maxWidth) {
                            width = maxWidth;
                        }
                        transform.setContentSize(width, this.rewardContent.getComponent(UITransform).contentSize.height);
                    }
                }
            }, 100);
        }
    }
    OnChangeToHall() {
        
        oops.gui.open(UIID.Demo)
        oops.gui.remove(UIID.Game,true);
        //oops.gui.replaceAsync(UIID.Game,UIID.Demo)
        oops.gui.remove(UIID.success);
/*
        //changeScene('hall', this.loadingNode, this.progressLabel);
        oops.gui.openAsync(UIID.Loading2).then((node)=>{ 
            oops.gui.openAsync(UIID.Demo).then(()=>{
                oops.gui.remove(UIID.Loading2);
                oops.gui.remove(UIID.success);  
            })
              
       })*/

    }
}


