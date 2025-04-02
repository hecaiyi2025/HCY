/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2023-02-15 09:38:36
 */
import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 提示弹出窗口 */
    Alert,
    /** 确认弹出窗口 */
    Confirm,
    Reward,
    /** DEMO */
    Demo,
    Game,
    GameBuffView,
    success,
    fail,
    Loading2,
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "login/prefab/LoadingViewComp"},
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "common/prefab/alert" },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm" },
    [UIID.Reward]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm" },
    [UIID.Demo]: { layer: LayerType.UI, prefab: "Hall/background/prefab/HallView" },
    [UIID.Game]: { layer: LayerType.UI, prefab: "game/battle/prefab/root" },
    [UIID.GameBuffView]: { layer: LayerType.UI, prefab: "gui/gameBuff/prefab/gameBuff" },
    [UIID.success]: { layer: LayerType.UI, prefab: "gui/end/gameSuccess" },
    [UIID.fail]: { layer: LayerType.UI, prefab: "gui/end/gameFailed" },
    [UIID.Loading2]: { layer: LayerType.UI, prefab: "gui/loading/loading"},
}