import { Prefab, director, find, Node, resources, instantiate, Label, view, tween, Vec3, Color } from "cc";
//import { publics } from "./public";socket
//import { soundManager } from "./soundManager";
//import { tipBox } from "../tools/tipBox";
//import { MessageBox } from "../tools/MessageBox";
//import { topMenu } from "../tools/topMenu";
//import { rewardDialog } from "../hall/rewardDialog";
//import { routerTool } from "../hall/router/routerTool";
//import { rewardDialog2 } from "../hall/rewardDialog2";
//import { advertisementController } from "../hall/advertisement/advertisementController";
//import { operateAnimation } from "../hall/operateAnimation";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../common/config/GameUIConfig";
class publicInstanceClass {
    getInstace() {
        // 获取实例
        //publics.start();
        return oops.tcp;
    }
}

const publicInstance = new publicInstanceClass();


class soundInstanceClass {
    //m_instance: soundManager[] = [];
    getInstace() {
        // 获取实例
        //const sceneName = director.getScene().name;
        //if (sceneName && find("SoundManager")) {
            //this.m_instance[sceneName] = find("SoundManager").getComponent(soundManager);
        //}
        //return this.m_instance[sceneName];
        return oops.audio;
    }
}

const soundInstance = new soundInstanceClass();


class tipInstanceClass {
    m_prefab: Prefab|null = null;
    m_tipNode: Node[] = [];

    async getTipPrefab() {//这个函数对我来说不需要，我用oops.gui.会自动加载预制体
        /*
        return new Promise((resolve, reject) => {

            resources.load('prefab/tips', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
            
        })
        */
    }

    async showTip(str: string, interval = 3) {//这个函数我能指定tip节点挂哪
        oops.gui.toast(str);
        /*
        let currentNode = find("Canvas/tips");
        const sceneName = director.getScene().name;

        if (sceneName) {
            this.m_tipNode[sceneName] = currentNode;
            console.log(!this.m_tipNode[sceneName], !this.m_tipNode[sceneName]);

            if (!this.m_tipNode[sceneName] || !find("Canvas/tips")) {
                if (!this.m_prefab) {
                    this.m_prefab = await this.getTipPrefab() as Prefab;
                }
                if (find("Canvas/tips")) {
                    this.m_tipNode[sceneName] = find("Canvas/tips");
                } else {
                    this.m_tipNode[sceneName] = instantiate(this.m_prefab);
                    this.m_tipNode[sceneName].name = "tips";
                    find("Canvas").addChild(this.m_tipNode[sceneName]);
                }
            }
            if (this.m_tipNode[sceneName]) {
                const script = this.m_tipNode[sceneName].getComponent(tipBox);
                script.showTip(str);
                if (interval) {
                    setTimeout(() => {
                        const currenScreenName = director.getScene().name;
                        if (currenScreenName == sceneName) {
                            script.hideTip();
                        }
                    }, interval * 1000);
                }
            }
        }*/
    }
    
}

const tipInstance = new tipInstanceClass();

class awardInstanceClass {
    m_prefab: Prefab|null = null;
    m_tipNode: Node[] = [];

    async getTipPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/rewardDialog', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
        })
        */
    }

    async showTip(data:any) {
        oops.gui.open(UIID.Reward,data);
        /*
        let currentNode = find("Canvas/rewardDialog");
        const sceneName = director.getScene().name;

        if (sceneName) {
            this.m_tipNode[sceneName] = currentNode;
            console.log(!this.m_tipNode[sceneName], !this.m_tipNode[sceneName]);

            if (!this.m_tipNode[sceneName] || !find("Canvas/rewardDialog")) {
                if (!this.m_prefab) {
                    this.m_prefab = await this.getTipPrefab() as Prefab;
                }
                if (find("Canvas/rewardDialog")) {
                    this.m_tipNode[sceneName] = find("Canvas/rewardDialog");
                } else {
                    this.m_tipNode[sceneName] = instantiate(this.m_prefab);
                    this.m_tipNode[sceneName].name = "rewardDialog";
                    find("Canvas").addChild(this.m_tipNode[sceneName]);
                }
            }
            if (this.m_tipNode[sceneName]) {
                const script = this.m_tipNode[sceneName].getComponent(rewardDialog);
                script.showDialog(data);
            }
        }
        */
    }
}

const awardInstance = new awardInstanceClass();

// class award2InstanceClass {
//     m_prefab: Prefab = null;
//     m_tipNode: Node[] = [];

//     async getTipPrefab() {
//         return new Promise((resolve, reject) => {
//             resources.load('prefab/rewardDialog2', Prefab, (err: Error, prefab: Prefab) => {
//                 if (err) {
//                     reject(err)
//                 }
//                 resolve(prefab)
//             })
//         })
//     }

//     async showTip(data) {
//         let currentNode = find("Canvas/rewardDialog2");
//         const sceneName = director.getScene().name;

//         if (sceneName) {
//             this.m_tipNode[sceneName] = currentNode;
//             console.log(!this.m_tipNode[sceneName], !this.m_tipNode[sceneName]);

//             if (!this.m_tipNode[sceneName] || !find("Canvas/rewardDialog2")) {
//                 if (!this.m_prefab) {
//                     this.m_prefab = await this.getTipPrefab() as Prefab;
//                 }
//                 if (find("Canvas/rewardDialog2")) {
//                     this.m_tipNode[sceneName] = find("Canvas/rewardDialog2");
//                 } else {
//                     this.m_tipNode[sceneName] = instantiate(this.m_prefab);
//                     this.m_tipNode[sceneName].name = "rewardDialog2";
//                     find("Canvas").addChild(this.m_tipNode[sceneName]);
//                 }
//             }
//             if (this.m_tipNode[sceneName]) {
//                 (this.m_tipNode[sceneName] as Node).setSiblingIndex(this.m_tipNode[sceneName].parent.children.length - 1)
//                 const script = this.m_tipNode[sceneName].getComponent(rewardDialog2);
//                 script.showDialog(data);
//             }
//         }
//     }
// }

// const award2Instance = new award2InstanceClass();

class msgInstanceClass {
    m_prefab: Prefab|null = null;
    m_msgNode: Node[] = [];

    async getTipPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/messageBox', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
        })
        */
    }

    async showMessageBox(title: string, content: string, sureCallback: Function, cancelCallback: Function,
        showCancel: boolean = true, type: number = 1, param: any = null, maskEnabled = true, buttonStrs = []) {
        let params={title: title, content: content, sureCallback: sureCallback, cancelCallback: cancelCallback,
            showCancel: showCancel = true, type:1, param:param, maskEnabled : true, buttonStrs : []}
        oops.gui.open(UIID.Confirm,params);


        /*
        let currentNode = find("Canvas/messageBox");
        const sceneName = director.getScene().name;
        // console.log(sceneName, 'sceneName');
        if (sceneName) {
            this.m_msgNode[sceneName] = currentNode;
            if (!this.m_msgNode[sceneName] || !find("Canvas/messageBox")) {
                // if (!this.m_prefab) {
                this.m_prefab = await this.getTipPrefab() as Prefab;
                // }
                if (find("Canvas/messageBox")) {
                    this.m_msgNode[sceneName] = find("Canvas/messageBox");
                } else {
                    this.m_msgNode[sceneName] = instantiate(this.m_prefab);
                    this.m_msgNode[sceneName].name = "messageBox";
                    find("Canvas").addChild(this.m_msgNode[sceneName]);
                }
            }

            if (this.m_msgNode[sceneName]) {
                const script = this.m_msgNode[sceneName].getComponent(MessageBox);
                script.showMessageBox(title, content, sureCallback, cancelCallback, showCancel, type, param, maskEnabled, buttonStrs);
            }
        }
        */
    }

    closeMessageBox() {
        oops.gui.remove(UIID.Confirm);
        /*
        const sceneName = director.getScene().name;
        let currentNode = find("Canvas/messageBox");
        if (sceneName) {
            this.m_msgNode[sceneName] = currentNode;
            const script = this.m_msgNode[sceneName]?.getComponent(MessageBox);
            script?.CloseMessageBox();
        }
        */

    }
}

const msgInstance = new msgInstanceClass();

class routerInstanceClass {

    //路由栈
    m_stack: string[] = [];

    push(url: string) {
        /*
        let currentNode = find("Canvas/router");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            this.updateArray(this.m_stack, url)
            const script = currentNode.getComponent(routerTool);
            script.routerTo(url);
        }
        */
    }

    replace(url: string) {
        /*
        let currentNode = find("Canvas/router");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            this.m_stack.pop();
            this.updateArray(this.m_stack, url)
            const script = currentNode.getComponent(routerTool);
            script.routerTo(url);
        }
         */
    }

    back() {
        /*
        let currentNode = find("Canvas/router");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            const script = currentNode.getComponent(routerTool);
            this.m_stack.pop();
            script.routerTo(this.m_stack[this.m_stack.length - 1]);
        }
        */
    }

    //清空路由栈
    clear() {
        //this.m_stack = [];
    }

    updateArray(arr:any, element:any) {
        /*
        // 检查元素是否已经存在于数组中
        const index = arr.indexOf(element);
        if (index !== -1) {
            // 如果存在，删除该元素
            arr.splice(index, 1);
        }
        // 添加新元素到数组中
        arr.push(element);
        */
    }
    
}

const router = new routerInstanceClass();


class messageInstanceClass {
    async getTipPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/message', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
                
        })*/
        
    }

    async showMessage(title: string) {
        oops.gui.open(UIID.Alert,title);
        /*
        const sceneName = director.getScene().name;
        let prefab = await this.getTipPrefab() as Prefab;
        let node = instantiate(prefab);
        let child = node.getChildByName('title')
        child.getComponent(Label).string = title;
        find("Canvas").addChild(node);
        tween(child)
            .to(2, { scale: new Vec3(0.5, 0.5, 1), position: new Vec3(0, 1000, 0) })
            .call(() => {
                child.active = false
                child.parent.destroy()
            })
            .start()
        let label = child.getComponent(Label)
        let rgbA = 255
        let timer = setInterval(() => {
            rgbA -= 5
            if (label && label.color) {
                label.color = new Color(255, 255, 255, rgbA)
            }
            if (rgbA <= 0) {
                clearInterval(timer)
            }
        }, 32)
        */
    }
}

const messageInstance = new messageInstanceClass();

class loadingInstanceClass {
    m_prefab: Prefab|null = null;
    m_msgNode: Node[] = [];

    async getLoadingPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/loading', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
        })
        */
    }

    async showLoading() {
        oops.gui.open(UIID.Loading);
        /*
        let currentNode = find("Canvas/loading");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            currentNode.active = true
            return
        }
        // console.log(sceneName, 'sceneName');
        if (sceneName) {
            this.m_msgNode[sceneName] = currentNode;
            if (!this.m_msgNode[sceneName] || !find("Canvas/loading")) {
                // if (!this.m_prefab) {
                this.m_prefab = await this.getLoadingPrefab() as Prefab;
                // }
                if (find("Canvas/loading")) {
                    this.m_msgNode[sceneName] = find("Canvas/loading");
                    // currentNode.active = true;
                } else {
                    this.m_msgNode[sceneName] = instantiate(this.m_prefab);
                    this.m_msgNode[sceneName].name = "loading";
                    find("Canvas").addChild(this.m_msgNode[sceneName]);
                }
            }
        }
        */
    }

    closeLoading() {
        oops.gui.remove(UIID.Loading);
        /*
        const sceneName = director.getScene().name;
        let currentNode = find("Canvas/loading");
        if (sceneName && currentNode) {
            currentNode.active = false
        }*/
    }
    
}

const loadingInstance = new loadingInstanceClass();


class rewardInstanceClass {
    m_prefab: Prefab|null = null;
    m_msgNode: Node[] = [];

    async getRewardPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/rewardDialog', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
        })
        */
    }

    async showReward(data:any) {
        oops.gui.open(UIID.Reward,data);
        /*
        let currentNode = find("Canvas/rewardDialog");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            // currentNode.active = true
            let script = currentNode.getComponent(rewardDialog);
            script.showDialog(data);
            return
        }
        // console.log(sceneName, 'sceneName');
        if (sceneName) {
            this.m_msgNode[sceneName] = currentNode;
            if (!this.m_msgNode[sceneName] || !find("Canvas/rewardDialog")) {
                // if (!this.m_prefab) {
                this.m_prefab = await this.getRewardPrefab() as Prefab;
                // }
                if (find("Canvas/rewardDialog")) {
                    this.m_msgNode[sceneName] = find("Canvas/rewardDialog");
                    // currentNode.active = true;
                } else {
                    this.m_msgNode[sceneName] = instantiate(this.m_prefab);
                    this.m_msgNode[sceneName].name = "rewardDialog";
                    find("Canvas").addChild(this.m_msgNode[sceneName]);
                }
            }
        }
        */
    }

    closeReward() {
        oops.gui.remove(UIID.Reward);
        /*
        const sceneName = director.getScene().name;
        let currentNode = find("Canvas/rewardDialog");
        if (sceneName && currentNode) {
            currentNode.active = false
        }
        */
    }
}

const rewardInstance = new rewardInstanceClass();

class operateInstanceClass {
    m_prefab: Prefab|null = null;
    m_msgNode: Node[] = [];

    async getPperate() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/operateAnimation', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
        })
        */
    }

    async showOperate(node:any) {
        
        /*
        let currentNode = find("Canvas/operateAnimation");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            // currentNode.active = true
            let script = currentNode.getComponent(operateAnimation);
            script.showOperateAnimation(node);
            return
        }
        // console.log(sceneName, 'sceneName');
        if (sceneName) {
            this.m_msgNode[sceneName] = currentNode;
            if (!this.m_msgNode[sceneName] || !find("Canvas/operateAnimation")) {
                // if (!this.m_prefab) {
                this.m_prefab = await this.getPperate() as Prefab;
                // }
                if (find("Canvas/operateAnimation")) {
                    this.m_msgNode[sceneName] = find("Canvas/operateAnimation");
                    // currentNode.active = true;
                } else {
                    this.m_msgNode[sceneName] = instantiate(this.m_prefab);
                    this.m_msgNode[sceneName].name = "operateAnimation";
                    find("Canvas").addChild(this.m_msgNode[sceneName]);
                }
            }
        }
            */
    }

    closeOperate() {
        /*
        const sceneName = director.getScene().name;
        let currentNode = find("Canvas/operateAnimation");
        if (sceneName && currentNode) {
            currentNode.active = false
        }
        */
    }
}

const operateInstance = new operateInstanceClass();

class reward2InstanceClass {
    m_prefab: Prefab|null = null;
    m_msgNode: Node[] = [];

    async getRewardPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/rewardDialog2', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    reject(err)
                }
                resolve(prefab)
            })
        })
        */
    }

    async showReward(data:any) {
        oops.gui.open(UIID.Reward,data);
        /*
        let currentNode = find("Canvas/rewardDialog2");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            // currentNode.active = true
            let script = currentNode.getComponent(rewardDialog2);
            script.showDialog(data);
            return
        }
        // console.log(sceneName, 'sceneName');
        if (sceneName) {
            this.m_msgNode[sceneName] = currentNode;
            if (!this.m_msgNode[sceneName] || !find("Canvas/rewardDialog2")) {
                // if (!this.m_prefab) {
                this.m_prefab = await this.getRewardPrefab() as Prefab;
                // }
                if (find("Canvas/rewardDialog2")) {
                    this.m_msgNode[sceneName] = find("Canvas/rewardDialog2");
                    // currentNode.active = true;
                } else {
                    this.m_msgNode[sceneName] = instantiate(this.m_prefab);
                    this.m_msgNode[sceneName].name = "rewardDialog2";
                    find("Canvas").addChild(this.m_msgNode[sceneName]);
                    this.m_msgNode[sceneName].setSiblingIndex(this.m_msgNode[sceneName].parent.children.length - 1)
                }
                this.showReward(data)
            }
        }
        */
    }

    closeReward() {
        oops.gui.remove(UIID.Reward);
        /*
        const sceneName = director.getScene().name;
        let currentNode = find("Canvas/rewardDialog2");
        if (sceneName && currentNode) {
            currentNode.active = false
        }
        */
    }
}

const reward2Instance = new reward2InstanceClass();


class topMenuInstanceClass {
    m_prefab: Prefab|null = null;
    m_topMenuNode: Node[] = [];

    async getTopMenuPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/top_menu', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("getTopMenuPrefab err:", err);
                    reject(err);
                }
                resolve(prefab);
            });
        });
        */
    }

    async showTopMenu(content: string, showTime = 5, showButton: number = 0, buttonStr: string[] = [], callbacks: Function[] = [], param: any = null) {
        /*
        let currentNode = find("Canvas/topMenu");
        const sceneName = director.getScene().name;
        if (sceneName) {
            this.m_topMenuNode[sceneName] = currentNode;
            if (!this.m_topMenuNode[sceneName] || !find("Canvas/topMenu")) {
                if (!this.m_prefab) {
                    this.m_prefab = await this.getTopMenuPrefab() as Prefab;
                }
                if (find("Canvas/topMenu")) {
                    this.m_topMenuNode[sceneName] = find("Canvas/topMenu");
                } else {
                    this.m_topMenuNode[sceneName] = instantiate(this.m_prefab);
                    this.m_topMenuNode[sceneName].name = "topMenu";
                    find("Canvas").addChild(this.m_topMenuNode[sceneName]);
                }
                this.m_topMenuNode[sceneName].active = true;
                let ScreenHeight = view.getVisibleSizeInPixel().height;
                let ScreenScaleY = view.getScaleY();
                this.m_topMenuNode[sceneName].setPosition(0, ScreenHeight / (ScreenScaleY * 2), 0);
            }
            if (this.m_topMenuNode[sceneName]) {
                const script = this.m_topMenuNode[sceneName].getComponent(topMenu);
                console.log("buttonStr2:", buttonStr);
                script.showTopMenu(content, showTime, showButton, buttonStr, callbacks, param);
            }
        }*/
    }

    async closeTopMenu() {
        /*
        let currentNode = find("Canvas/topMenu");
        const sceneName = director.getScene().name;
        if (sceneName) {
            this.m_topMenuNode[sceneName] = currentNode;
            if (!this.m_topMenuNode[sceneName] || !find("Canvas/topMenu")) {
                if (!this.m_prefab) {
                    this.m_prefab = await this.getTopMenuPrefab() as Prefab;
                }
                if (find("Canvas/topMenu")) {
                    this.m_topMenuNode[sceneName] = find("Canvas/topMenu");
                } else {
                    this.m_topMenuNode[sceneName] = instantiate(this.m_prefab);
                    this.m_topMenuNode[sceneName].name = "topMenu";
                    find("Canvas").addChild(this.m_topMenuNode[sceneName]);
                }
                this.m_topMenuNode[sceneName].active = true;
                let ScreenHeight = view.getVisibleSizeInPixel().height;
                let ScreenScaleY = view.getScaleY();
                this.m_topMenuNode[sceneName].setPosition(0, ScreenHeight / (ScreenScaleY * 2), 0);
            }
            if (this.m_topMenuNode[sceneName]) {
                const script = this.m_topMenuNode[sceneName].getComponent(topMenu);
                script.closeTopMenu();
            }
        }
        */
        // closeTopMenu
    }
}

const topMenuInstance = new topMenuInstanceClass();


class ADInstanceClass {
    m_prefab: Prefab|null = null;
    m_ADNode: Node[] = [];

    async getADPrefab() {
        /*
        return new Promise((resolve, reject) => {
            resources.load('prefab/advertisement', Prefab, (err: Error, prefab: Prefab) => {
                if (err) {
                    console.log("getADPrefab err:", err);
                    reject(err);
                }
                resolve(prefab);
            });
        });
        */
    }

    async showAD(type:any, num:any, rewardList:any) {
        /*
        let currentNode = find("Canvas/Advertisement");
        const sceneName = director.getScene().name;
        if (sceneName) {
            this.m_ADNode[sceneName] = currentNode;
            if (!this.m_ADNode[sceneName] || !find("Canvas/Advertisement")) {
                if (!this.m_prefab) {
                    this.m_prefab = await this.getADPrefab() as Prefab;
                }
                if (find("Canvas/Advertisement")) {
                    this.m_ADNode[sceneName] = find("Canvas/Advertisement");
                } else {
                    this.m_ADNode[sceneName] = instantiate(this.m_prefab);
                    this.m_ADNode[sceneName].name = "Advertisement";
                    find("Canvas").addChild(this.m_ADNode[sceneName]);
                }
            }
            if (this.m_ADNode[sceneName]) {
                this.m_ADNode[sceneName].active = true;
                this.m_ADNode[sceneName].setPosition(0, 0, 0);
                const script = this.m_ADNode[sceneName].getComponent(advertisementController);
                script.showAD(type, num, rewardList);
            }
        }*/
    }

    async closeAD() {
        /*
        let currentNode = find("Canvas/Advertisement");
        const sceneName = director.getScene().name;
        if (sceneName && currentNode) {
            this.m_ADNode[sceneName] = currentNode;
            if (this.m_ADNode[sceneName]) {
                this.m_ADNode[sceneName].active = false;
            }
        }*/
    }
}

const adInstance = new ADInstanceClass();

export { publicInstance, soundInstance, tipInstance, msgInstance, topMenuInstance, loadingInstance, rewardInstance, awardInstance, messageInstance, router, reward2Instance, operateInstance,adInstance };
