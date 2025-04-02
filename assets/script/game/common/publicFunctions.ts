import { Color, Font, ImageAsset, Label, Node, Prefab, Sprite, SpriteFrame, Texture2D, assetManager, director, resources } from "cc";
import { reward2Instance, awardInstance, loadingInstance, messageInstance, msgInstance, publicInstance, rewardInstance, soundInstance, tipInstance, topMenuInstance, adInstance,operateInstance } from "./publicInstance"
import { roleConfig } from "./config/roleConfig";
//import { globalData } from "../data/globalData";
import { smc } from "../common/SingletonModuleComp";

import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";

function addSocketListener(code: number, callback: (data: any) => void) {
    //publicInstance.getInstace() && publicInstance.getInstace().addSocketListener(code, callback);
    oops.tcp.getNetNode().addResponeHandler(code.toString(), callback)
}

function removeSocketListener(code: number, callback:  (data: any) => void) {
    //publicInstance.getInstace() && publicInstance.getInstace().removeSocketListener(code, callback);
    oops.tcp.getNetNode().removeResponeHandler(code.toString(), callback)
}

function removeAllSocketListener() {
    //publicInstance.getInstace() && publicInstance.getInstace().removeAllSocketListener();
    oops.tcp.getNetNode().cleanListeners();
}

function addSocketErrorListener(code: number, callback: (data: any) => void) {
    oops.tcp.getNetNode().addResponeHandler(code.toString(), callback)
    //publicInstance.getInstace() && publicInstance.getInstace().addSocketErrorListener(code, callback);
}

function addSocketErrorListenerList(codeList: number[], callback: (data: any) => void) {
    //publicInstance.getInstace() && publicInstance.getInstace().addSocketErrorListenerList(codeList, callback);
    
}

function removeSocketErrorListener(code: number, callback: (data: any) => void) {
    //publicInstance.getInstace() && publicInstance.getInstace().removeSocketErrorListener(code, callback);
    oops.tcp.getNetNode().addResponeHandler(code.toString(), callback)
}

function removeAllSocketErrorListener() {
    //publicInstance.getInstace() && publicInstance.getInstace().removeAllSocketErrorListener();
}

function sendWebSocketData(data: any) {
    //publicInstance.getInstace() && publicInstance.getInstace().sendWebSocketData(data);
    oops.tcp.getNetNode().send(data);
}

function addMessageListener(code: number, callback: (data: any) => void) {
    //publicInstance.getInstace() && publicInstance.getInstace().addMessageListener(code, callback);
    oops.message.on(code.toString(),callback,{})
}

function removeMessageListener(code: number, callback: (data: any) => void) {
    //publicInstance.getInstace() && publicInstance.getInstace().removeMessageListener(code, callback);
    oops.message.off(code.toString(),callback,{})
}

function removeAllMessageListener() {
   // publicInstance.getInstace() && publicInstance.getInstace().removeAllMessageListener();
    oops.message.clear()
    
}

function postMessage(code: number, data: any = null) {
    //publicInstance.getInstace() && publicInstance.getInstace().postMessage(code, data);
    oops.message.dispatchEvent(code.toString(), data);
}


function sendMessage(code: number, data: any, messageCallBack: (data: any) => void) {
    //publicInstance.getInstace() && publicInstance.getInstace().sendMessage(code, data, messageCallBack);
    oops.message.dispatchEventcallback(code.toString(), data,messageCallBack);
}


function setListener() {
    //soundInstance.getInstace() && soundInstance.getInstace().setListener();
}

function playSoundByFile(file: string) {
    oops.audio.playEffect(file);
    //soundInstance.getInstace() && soundInstance.getInstace().playSoundByFile(file);
}

function playSoundByName(name: string) {
    oops.audio.playEffect(name);
    //soundInstance.getInstace() && soundInstance.getInstace().playSoundByName(name);
}


function playActorLine(actorId:any, noRandom = false) {
    //return soundInstance.getInstace() && soundInstance.getInstace().playActorLine(actorId, noRandom);
}

function onClickButtonSound() {
    oops.audio.playEffect("");
    //soundInstance.getInstace() && soundInstance.getInstace().onClickButtonSound();
}

function switchBGM(play: boolean) {
    if (play) {
        //soundInstance.getInstace() && soundInstance.getInstace().playBGM();
        oops.audio.playMusic("")
    } else {
        //soundInstance.getInstace() && soundInstance.getInstace().pauseBGM();
        oops.audio.stopMusic()
    }
}

function switchSound(play: boolean) {
    if (play) {
       // soundInstance.getInstace() && soundInstance.getInstace().playSound();
        oops.audio.playEffect("");
    } else {
        //soundInstance.getInstace() && soundInstance.getInstace().stopSound();
        oops.audio.stopAll()
    }
}

function showTip(str: string) {
    tipInstance.showTip(str);
}

function showAwardDialog(data:any) {
    awardInstance.showTip(data);
}

function showLoading() {
    loadingInstance.showLoading();
}

function closeLoading() {
    loadingInstance.closeLoading();
}

function showReward(data:any) {
    rewardInstance.showReward(data);
}

function showReward2(data:any) {
    reward2Instance.showReward(data);
}


function closeReward() {
    rewardInstance.closeReward();
}


function showMessageBox(title: string, content: string, sureCallback: Function,
    cancelCallback: Function, showCancel: boolean = true, type: number = 1, param: any = null, maskEnabled = true, buttonStrs = []) {
    msgInstance.showMessageBox(title, content, sureCallback, cancelCallback, showCancel, type, param, maskEnabled, buttonStrs);
}

function showMessage(title: string) {
    messageInstance.showMessage(title);
}

function closeMessageBox() {
    msgInstance.closeMessageBox();
}

function showTopMenu(content: string, showTime = 5, showButton: number = 0, buttonStr: string[] = [], callbacks: Function[] = [], param: any = null) {
    console.log("buttonStr1:", buttonStr);
    topMenuInstance.showTopMenu(content, showTime, showButton, buttonStr, callbacks, param);
    // topMenuInstance.
}

function closeTopMenu() {
    topMenuInstance.closeTopMenu();
}

let suffixList = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];//去除后缀名
async function getResources(url: string) {
    return new Promise((resolve, reject) => {
        if (!url) {
            url = "icons/unKnown"
        } else {
            for (let i = 0; i < suffixList.length; i++) {
                const suffix = suffixList[i];
                if (url.indexOf(suffix) != -1) {
                    url = url.replace(suffix, "");
                }
            }
        }
        if (url.indexOf("/spriteFrame") == -1) {
            url = url + "/spriteFrame";
        }
        oops.res.loadAsync(url,SpriteFrame).then((spriteFrame: SpriteFrame)=>{resolve(spriteFrame);},(err:any)=>{
            console.log("getResources 加载资源失败:", err);
            if (url.indexOf("icons/") != -1 && url.indexOf("unKnown") == -1) {//防止无限递归
                let spriteFrame2 = getResources("icons/unKnown");
                console.log("getResources 加载unKnown");
                resolve(spriteFrame2);
            } else {
                reject(err);
            }
        });
        /*
        resources.load(url, SpriteFrame, async (err: Error, spriteFrame: SpriteFrame) => {
            if (err) {
                console.log("getResources 加载资源失败:", err);
                if (url.indexOf("icons/") != -1 && url.indexOf("unKnown") == -1) {//防止无限递归
                    let spriteFrame2 = await getResources("icons/unKnown");
                    console.log("getResources 加载unKnown");
                    resolve(spriteFrame2);
                } else {
                    reject(err);
                }
            }
            resolve(spriteFrame);
        });*/
    });
    
}

function getResourcesAsync(url: string, callback:AnyFunction) {
    // 使用异步加载资源
    for (let i = 0; i < suffixList.length; i++) {
        const suffix = suffixList[i];
        if (url.indexOf(suffix) != -1) {
            url = url.replace(suffix, "");
        }
    }
    if (url.indexOf("/spriteFrame") == -1) {
        url = url + "/spriteFrame";
    }

    oops.res.loadAsync(url,SpriteFrame).then((spriteFrame: SpriteFrame)=>{if (callback) callback(true, spriteFrame);},(err:any)=>{
        console.log("getResources 加载资源失败:", err);
            if (url.indexOf("icons/") != -1 && url.indexOf("unKnown") == -1) {//防止无限递归
                let spriteFrame2 =  getResources("icons/unKnown");
                console.log("getResources 加载unKnown");
                if (callback) callback(true, spriteFrame2);
            } else {
                if (callback) callback(false);
            }
    });
    /*
    resources.load(url, SpriteFrame, async (err: Error, spriteFrame: SpriteFrame) => {
        if (err) {
            console.log("getResources 加载资源失败:", err);
            if (url.indexOf("icons/") != -1 && url.indexOf("unKnown") == -1) {//防止无限递归
                let spriteFrame2 = await getResources("icons/unKnown");
                console.log("getResources 加载unKnown");
                if (callback) callback(true, spriteFrame2);
            } else {
                if (callback) callback(false);
            }
        }
        if (callback) callback(true, spriteFrame);
    });
    */
}

function setAvatar(url: string, avatarSprite: Sprite, frame :string|null) {
    if (url && url.length > 0 && avatarSprite) {
        if (url.indexOf("http") !== -1) {
            assetManager.loadRemote(url, { isCrossOrigin: true }, (err, asset: ImageAsset) => {
                if (err) {
                    console.log("setAvatar error:", err);
                    return;
                }
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = asset;
                spriteFrame.texture = texture;
                avatarSprite.spriteFrame = spriteFrame;
            });
        } else {
            let file = url;
            if (file.indexOf("avatars/") == -1) {
                file = `avatars/${file}`;
            }
            getResourcesAsync(file, (success:boolean, spriteFrame:SpriteFrame) => {
                if (success) {
                    avatarSprite.spriteFrame = spriteFrame as SpriteFrame;
                } else {
                    console.log("setAvatar error!");
                }
            });
        }
    }
    if (avatarSprite && avatarSprite.node.parent && avatarSprite.node.parent.parent) {
        const frameNode = avatarSprite.node.parent.parent.getChildByName("frame");
        if (frameNode!=null&&frame!=null) {
            let bb:boolean= (frame!=null && frame.length > 0);
            frameNode.active =bb
            const frameSprite = frameNode.getComponent(Sprite);
            if (frame && frame.length > 0 && frameSprite) {
                getResourcesAsync(frame, (success:boolean, spriteFrame:SpriteFrame) => {
                    if (success) {
                        frameSprite.spriteFrame = spriteFrame as SpriteFrame;
                    } else {
                        console.log("setAvatar error!");
                    }
                });
            }
        }
    }
}

function showOperate(node:Node){
    operateInstance.showOperate(node);
}

function changeScene(sceneName:any, loadingNode:any, progressLabel:any) {
    console.log("changeScene");
    if (loadingNode) {
        loadingNode.active = true;
    }
    let m_lastProgress = 0;
    director.preloadScene(sceneName, (completedCount, totalCount) => {
        if (progressLabel) {
            const progress = Math.floor(completedCount * 100 / totalCount);
            if (progress < m_lastProgress) {
                return;
            }
            m_lastProgress = progress;
            progressLabel.string = progress + "%";
        }
    }, (e) => {
        console.log("loadScene:", sceneName);
        director.loadScene(sceneName)
    });
}


function getAngle(point1:any, point2:any, width = 0, height = 0) {
    const deltaX = point2.x - point1.x + width;
    const deltaY = point2.y - point1.y + height;
    const angle = Math.atan2(deltaY, deltaX);
    const angleInDegrees = angle * 180 / Math.PI;
    return angleInDegrees;
}
function checkPriceColor(label: Label, price:any) {
    const currentGold = Number(smc.account.AccountModel.getUserInfo().getMoney());
    if (label) {
        label.color = price > currentGold ? new Color(255, 0, 0, 255) : new Color(255, 255, 255, 255);
    }
    return price <= currentGold;
}

function changeFont(node: Node, fontName: string) {
    if (node && node.getComponent(Label)) {
        resources.load(`font/${fontName}`, (err, assets: Font) => {
            if (err) {
                console.log("changeFont error:", err);
                return;
            }
            node.getComponent(Label)!.useSystemFont = false
            node.getComponent(Label)!.font = assets;
            //描边宽度
            node.getComponent(Label)!.outlineWidth = 2;
            if (node.getComponent(Label)!.fontSize >= 40) {
                node.getComponent(Label)!.outlineWidth = 4;
            }
            if (node.getComponent(Label)!.fontSize >= 60) {
                node.getComponent(Label)!.outlineWidth = 6;
            }
        })
    }
    for (let index = 0; index < node.children.length; index++) {
        changeFont(node.children[index], fontName)
    }
}


function showAD(type:any, num:any, rewardList = null) {
    adInstance.showAD(type, num, rewardList);
}


export {
    changeFont,
    addSocketListener,
    removeSocketListener,
    removeAllSocketListener,
    addSocketErrorListener,
    addSocketErrorListenerList,
    removeSocketErrorListener,
    removeAllSocketErrorListener,
    sendWebSocketData,
    addMessageListener,
    removeMessageListener,
    removeAllMessageListener,
    postMessage,
    sendMessage,
    playSoundByFile,
    playSoundByName,
    playActorLine,
    onClickButtonSound,
    switchBGM,
    switchSound,
    showTip,
    showMessageBox,
    showTopMenu,
    getResources,
    getResourcesAsync,
    setListener,
    closeMessageBox,
    closeTopMenu,
    setAvatar,
    changeScene,
    getAngle,
    checkPriceColor,
    showLoading,
    closeLoading,
    showReward,
    closeReward,
    showAwardDialog,
    showReward2,
    showMessage,
    showAD,
    showOperate
}