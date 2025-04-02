import { _decorator, Component, instantiate, Node, Prefab, resources, Vec3 } from 'cc';
//import { addMessageListener, sendMessage } from '../../public/publicFunctions';
import { MESSAGE_DEFINES,DROP_TYPE } from '../common/global';
import { smc } from "../common/SingletonModuleComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { BaseDrop } from './BaseDrop';
const { ccclass, property } = _decorator;

@ccclass('DropController')
export class DropController extends Component {
    m_config = [
        {
            id: 1,
            res: "game/drop/drop1/drop1",
        }
    ];
    m_dropPrefabs:{[key:string|number]:any} = {}
    start() {
        oops.message.on(MESSAGE_DEFINES.GAME_SHOW_DROP.toString(),(...arg:any) => {
            oops.message.dispatchEventcallback(MESSAGE_DEFINES.GAME_GET_DROP_POS.toString(),(node: Node[]) => {
                if (node) {
                    let path = null;
                    for (let i = 0; i < this.m_config.length; i++) {
                        const config = this.m_config[i];
                        if (config.id == arg[1].id) {
                            path = config.res;
                        }
                    }
                    if (path) {
                        const money = Number(arg[1].num);
                        let num = money; // 根据money的值来决定生成几个
                        if (money >= 10 && money <= 100) {
                            num = Math.floor(money / 10);
                        } else if (money > 100 && money <= 1000) {
                            num = Math.floor(money / 100);
                        } else if (money > 1000 && money <= 10000) {
                            num = Math.floor(money / 1000);
                        } else if (money > 10000) {
                            num = Math.floor(money / 10000);
                        }
                        for (let i = 0; i < num; i++) {
                            const randomx = Math.random() * 100 - 50;
                            const randomy = Math.random() * 100 + 50;
                            const randomPos = new Vec3(arg[1].fromPos.x + randomx, arg[1].fromPos.y + randomy, 0);
                            this.AddDrop(arg[1].id, this.m_dropPrefabs[path], i == 0 ? money : 0, randomPos, node[0].getWorldPosition(), i * 10);
                        }
                    }
                }
            },DROP_TYPE.MONEY);
            /*
            sendMessage(MESSAGE_DEFINES.GAME_GET_DROP_POS, arg[1].id, (node) => {
                if (node) {
                    let path = null;
                    for (let i = 0; i < this.m_config.length; i++) {
                        const config = this.m_config[i];
                        if (config.id == arg[1].id) {
                            path = config.res;
                        }
                    }
                    if (path) {
                        const money = Number(arg[1].num);
                        let num = money; // 根据money的值来决定生成几个
                        if (money >= 10 && money <= 100) {
                            num = Math.floor(money / 10);
                        } else if (money > 100 && money <= 1000) {
                            num = Math.floor(money / 100);
                        } else if (money > 1000 && money <= 10000) {
                            num = Math.floor(money / 1000);
                        } else if (money > 10000) {
                            num = Math.floor(money / 10000);
                        }
                        for (let i = 0; i < num; i++) {
                            const randomx = Math.random() * 100 - 50;
                            const randomy = Math.random() * 100 + 50;
                            const randomPos = new Vec3(arg[1].fromPos.x + randomx, arg[1].fromPos.y + randomy, 0);
                            this.AddDrop(arg[1].id, this.m_dropPrefabs[path], i == 0 ? money : 0, randomPos, node.getWorldPosition(), i * 10);
                        }
                    }
                }
            });*/
                    
            },this);
            /*
        addMessageListener(MESSAGE_DEFINES.GAME_SHOW_DROP, (data) => {
            sendMessage(MESSAGE_DEFINES.GAME_GET_DROP_POS, data.id, (node) => {
                if (node) {
                    let path = null;
                    for (let i = 0; i < this.m_config.length; i++) {
                        const config = this.m_config[i];
                        if (config.id == data.id) {
                            path = config.res;
                        }
                    }
                    if (path) {
                        const money = Number(data.num);
                        let num = money; // 根据money的值来决定生成几个
                        if (money >= 10 && money <= 100) {
                            num = Math.floor(money / 10);
                        } else if (money > 100 && money <= 1000) {
                            num = Math.floor(money / 100);
                        } else if (money > 1000 && money <= 10000) {
                            num = Math.floor(money / 1000);
                        } else if (money > 10000) {
                            num = Math.floor(money / 10000);
                        }
                        for (let i = 0; i < num; i++) {
                            const randomx = Math.random() * 100 - 50;
                            const randomy = Math.random() * 100 + 50;
                            const randomPos = new Vec3(data.fromPos.x + randomx, data.fromPos.y + randomy, 0);
                            this.AddDrop(data.id, this.m_dropPrefabs[path], i == 0 ? money : 0, randomPos, node.getWorldPosition(), i * 10);
                        }
                    }
                }
            });
        });*/

        for (const key in this.m_config) {
            if (Object.prototype.hasOwnProperty.call(this.m_config, key)) {
                const configInfo = this.m_config[key];
                /*
                resources.load(configInfo.res, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.m_dropPrefabs[configInfo.res] = prefab;// 将预制体存储到字典中
                });*/
                oops.res.load(configInfo.res, Prefab, async (err: Error, prefab: Prefab) => {
                    if (err) {
                        console.log("加载资源失败:", err);
                        return;
                    }
                    this.m_dropPrefabs[configInfo.res] = prefab;// 将预制体存储到字典中
                });
            }
        }
    }

    update(deltaTime: number) {

    }

    AddDrop(id:any, prefab:any, num:any, fromPos:any, toPos:any, timeout:any) {
        //console.log("AddDrop",id,num,fromPos);
        const drop = instantiate(prefab); // 创建节点
        drop.layer=this.node.layer
        for (const child of drop.children) {

            child.layer=this.node.layer
        }
        this.node.addChild(drop); // 将节点添加到场景中
        drop.setWorldPosition(fromPos); // 设置节点的位置
        const dropScript = drop.getComponent(BaseDrop);
        if (dropScript) {
            dropScript.SetType(id);
            dropScript.SetValue(num);
            dropScript.StartDrop(fromPos, toPos, timeout);
        }
    }

    GameOver() {
        const children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const dropScript = child.getComponent(BaseDrop);
            if (dropScript) {
                dropScript.StopDrop();
            }
        }
    }
}


