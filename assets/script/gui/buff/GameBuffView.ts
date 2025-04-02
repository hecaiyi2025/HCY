import { _decorator, Component, Label, Node, Toggle } from 'cc';
//import { postMessage } from '../../public/publicFunctions';
import { MESSAGE_DEFINES } from '../../game/common/global';
import { buffConfig } from '../../game/common/config/buff';
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../../game/common/config/GameUIConfig";
const { ccclass, property } = _decorator;

@ccclass('GameBuffView')
export class GameBuffView extends Component {
    @property(Node)
    m_nodes: Node[] = [];

    m_buffIndex = 0;
    m_buffList :any[]= [];
    start() {
        //this.ShowBuff();
    }

    update(deltaTime: number) {

    }

    ShowBuff() {
        this.m_buffList = [];
        const buffInfos = buffConfig.getConfig();
        const buffList = [];
        for (const id in buffInfos) {
            if (Object.prototype.hasOwnProperty.call(buffInfos, id)) {
                const buffInfo = buffInfos[id];
                if (buffInfo.type == 1 || buffInfo.type == 2) {
                    buffList.push(JSON.parse(JSON.stringify(buffInfo)));//深拷贝
                }
            }
        }
        const randomIndexes = [];
        const randomNum = 3;
        let index = 0;
        while (randomIndexes.length < randomNum) {
            const randomIndex = Math.floor(Math.random() * buffList.length);
            if (-1 == randomIndexes.indexOf(randomIndex) && randomIndex < buffList.length) {
                randomIndexes.push(randomIndex);
                const buffInfo = buffList[randomIndex];
                if (buffInfo) {
                    this.m_buffList.push(buffInfo);//深拷贝
                    if (index < this.m_nodes.length) {
                        const toggleNode = this.m_nodes[index];
                        const title = toggleNode.getChildByName("title");
                        title!.getComponent(Label)!.string = buffInfo.name;
                        const desc = toggleNode.getChildByPath("content");
                        desc!.getComponent(Label)!.string = buffInfo.desc;
                    }
                }
                index++;
            }
        }
        console.log("this.m_buffList:", this.m_buffList);
    }

    OnSelectBuff(event: Event, customEventData: string) {
        this.m_buffIndex = parseInt(customEventData);
        let buffId = null;
        if (this.m_buffIndex < this.m_buffList.length) {
            buffId = this.m_buffList[this.m_buffIndex].id;
        }
        oops.message.dispatchEvent(MESSAGE_DEFINES.GAME_NEXT_LEVEL.toString(), { buffId: buffId })
        //postMessage(MESSAGE_DEFINES.GAME_NEXT_LEVEL, { buffId: buffId });
        //this.node.active = false;
        console.log("OnSelectBuff");
        oops.gui.remove(UIID.GameBuffView);
    }
}


