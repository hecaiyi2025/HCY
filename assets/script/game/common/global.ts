import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Enum, color } from "cc";

import { goodsConfig } from "./config/goods";
import { equipmentConfig } from "./config/equipment";
import { friendConfig } from "./config/friend";
import { guideConfig } from "./config/guide";
import { petConfig } from "./config/petConfig";
import { roleConfig } from "./config/roleConfig";
import { skillConfig } from "./config/skill";
import { degreeConfig } from "./config/degree";
import { buffConfig } from "./config/buff";
import { mallConfig } from "./config/mallConfig";
import { talentConfig } from "./config/talent";
import { practiceConfig } from "./config/practice";
import { constantConfig } from "./config/constant";
import { friendLevelConfig } from "./config/friend_level";
import { monsterConfig } from "./config/monsterConfig";
import { cloudsLevelConfig } from "./config/clouds_level";
import { equipmentStarConfig } from "./config/equipment_star";
import { petsStarConfig } from "./config/pets_star";
import { skillStarConfig } from "./config/skill_star";
import { fetterConfig } from "./config/fetters";
import { taskConfig } from "./config/taskConfig";
import { bossGameConfig } from "./config/bossGameConfig";
import { friendStarConfig } from "./config/friend_star";
import { cloudsStarConfig } from "./config/clouds_star";
import { cloudsConfig } from "./config/clouds";
import { petBuffConfig } from "./config/Pet_buff";
import { debuffConfig } from "./config/debuff";

import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";

// const IP = '192.168.21.109';
// const IP = '192.168.30.37';
// const IP = '192.168.30.10';//内网ip/端口6061
// const IP = '43.139.231.76';//服务器ip/端口9999
const IP = '43.139.231.76';
// const HTTP_PORT = '9091';
const HTTP_PORT = '9999';
// const HTTP_PORT = '6061';
export const WEBSOCKET_URL = 'ws://' + IP + ':' + HTTP_PORT + '/wsGateway/ws';

export const LOGIN_URL = 'http://' + IP + ':' + HTTP_PORT + '/auth/oauth/token';
export const REGISTER_URL = 'http://' + IP + ':' + HTTP_PORT + '/game/user/registerGuest';
export const CHANGE_PW_URL = 'http://' + IP + ':' + HTTP_PORT + '/game/player/register';
// export const GET_ANNOUNCEMENT_URL = 'http://' + IP + ':' + HTTP_PORT + '/api/noticeInfo/showing';
export const GET_ANNOUNCEMENT_URL = 'http://' + IP + ':' + HTTP_PORT + '/api/noticeInfo/showing';
export const GET_RANDOM_URL = 'http://' + IP + ':' + HTTP_PORT + '/game/player/nickName';
export const GET_CHECKNAME_URL = 'http://' + IP + ':' + HTTP_PORT + '/game/player/checkNickName';

export const RELEASE = true; //是否发布版本

export const NETWORKING = true; //是否联网
//let soundswitch=oops.storage.get("SOUND_SWITCH") ;
//let musicswitch=oops.storage.get("SOUND_SWITCH") ;
//export let SOUND_SWITCH = soundswitch ? JSON.parse(soundswitch) : true; //音效开关
//export let MUSIC_SWITCH = musicswitch ? JSON.parse(musicswitch) : true; //音乐开关
//export let SOUND_SWITCH = localStorage.getItem('SOUND_SWITCH') ? JSON.parse(localStorage.getItem('SOUND_SWITCH')) : true; //音效开关
//export let MUSIC_SWITCH = localStorage.getItem('MUSIC_SWITCH') ? JSON.parse(localStorage.getItem('MUSIC_SWITCH')) : true; //音乐开关

//设置音效开关
export function setSoundSwitch(value: boolean) {
    //SOUND_SWITCH = value;
}
//设置音乐开关
export function setMusicSwitch(value: boolean) {
    //MUSIC_SWITCH = value;
}

export const FONT_NAME = 'W5';//字体

//pvp对手id
export let PVP_OPPONENT_ID = 0;

//设置pvp对手id
export function setPVP_OPPONENT_ID(value: number) {
    PVP_OPPONENT_ID = value;
}

export const NET_DEFINES = {
    //请求命令类型: 0 心跳，1 业务
    CMDCODE_HEART: 0,
    CMDCODE_LOGIC: 1,
    //业务编码
    NETCODE_BINDING: 1001,            //绑定token
    NETCODE_INFORMATION: 1002,//个人信息
    NETCODE_POWER: 1003,//体力刷新
    NETCODE_ADD_POWER: 1004,//增加体力
    POWER_REFRESH: 1005,//战力刷新
    EQUIPMENT_LIST: 1103,//装备列表
    EQUIPMENT_ING: 1102,//当前装备
    EQUIPMENT_BATCH: 1109,//批量上阵装备
    STAR_UP: 1101,//升星

    FRIEND_LIST: 1104,//道友列表

    XIANGYUN_LIST: 1105,//祥云列表

    GAME_BOSS_SETTLEMENT: 1010,//BOSS战关卡结算

    ONLINE_TIME: 1116,//在线时长校验

    ARRANGE_LIST: 1061,//布阵列表
    FRIEND_ADD: 1060,//编辑阵容
    SIGN_UPGRADE: 1063,//道友祥云升级

    BOSS_LIST: 1071,//boss布阵列表
    BOSS_EDIT: 1070,//boss编辑阵容
    BOSS_INFO: 1011,//boss战信息
    BOSS_RANK: 1012,//boss战排行榜
    BOSS_AD_FAIL: 1013,//boss战结算看广告双倍奖励

    GAME_LEVEL_SETTLEMENT: 1080,//普通关卡结算
    GAME_LEVEL_AD_FAIL: 1081,//普通关卡结算

    GAME_PVP_SETTLEMENT: 1091,//PVP关卡结算
    GAME_PVP_AD_FAIL: 1095,//PVP关卡结算看广告双倍奖励

    SHOP_BUY: 1106,//商城购买

    SIGN_LIST: 1107,//签到列表
    SIGN_IN: 1108,//签到

    BAG_LIST: 1114,//获取背包信息

    TALENT_LIST: 1112,//获取天赋列表
    TALENT_UPGRADE: 1113,//天赋升级

    TASK_LIST: 1111,//任务列表
    TASK_COMPLETE: 1110,//完成任务

    PET_LIST: 1117,//宠物列表
    PET_TALENT: 1119,//宠物词条洗练
    PET_TALENT_LIST: 1118,//宠物词条列表
    PET_TALENT_LOCK: 1120,//宠物词条锁定
    PET_TALENT_UNLOCK: 1121,//宠物词条解锁

    PRACTICE_LIST: 1122,//修行列表

    SIGN_IN_REWARD: 1123,//离线收益
    GET_SIGN_IN_REWARD: 1124,//获取离线收益
    MESSAGE_ADD_ITEM: 9999,//添加物品

    RED_DOT: 1125,//红点

    PVP_START: 1090,//pvp开始
    PVP_RANK_LIST: 1092,//pvp排行榜
    PVP_HISTORY_LIST: 1093,//pvp历史战绩
    PVP_LEFT_CHALLENGE_COUNT: 1094,//pvp挑战剩余次数


    USER_INFO: 1127,//用户昵称与头像

    UPDATE_CLOUD_FACE: 1128,//更新祥云外观

    BUY_ITEM_SUCCESS: 1129,//成品合成通知

    GOODS_LIST: 1130,//商品信息列表
};

export const MESSAGE_DEFINES = {
    MESSAGE_PLAY_CLICK_SOUND: 20001,//播放按钮按下声音
    GET_ROLE_LIST: 20002,//获取角色目标
    GET_MONSTER_TARGET: 20003,//获取怪物目标
    ROLE_ATTACK: 20004,//角色攻击怪物
    MONSTER_ATTACK: 20005,//怪物攻击角色
    ROLE_DEAD: 20006,//角色死亡
    MONSTER_DEAD: 20007,//怪物死亡
    BULLET_HIT_TARGET: 20008,//子弹击中怪物
    GET_MULTI_MONSTER_TARGET: 20009,//获取伤害范围内怪物目标
    SET_BG_MAX_SPEED: 20010,//设置背景最大速度
    GAME_FAILED: 20011,//游戏失败
    GAME_SUCCESS: 20012,//游戏成功
    GAME_TOUCH_BEGIN: 20013,//触摸开始
    GAME_TOUCH_MOVE: 20014,//触摸移动
    GAME_TOUCH_END: 20015,//触摸结束
    GAME_TOUCH_CANCEL: 20016,//触摸取消
    GAME_USE_SKILL: 20017,//使用技能
    GAME_SHOW_PROGRESS: 20018,//显示进度条
    GAME_ELITE_DEAD: 20019,//传送阵死亡
    GAME_NEXT_LEVEL: 20020,//下一关
    GAME_BG_STOP: 20021,//背景停止
    GAME_BOSS_DEAD: 20022,//BOSS死亡
    GAME_GET_MONSTER_POS: 20023,//获取怪物初始点
    GAME_SCREEN_SHAKE: 20024,//屏幕震动
    GAME_GET_SCORE: 20025,//获取分数
    GAME_GET_DROP_POS: 20026,//获取金钱初始点
    GAME_SHOW_DROP: 20027,//显示掉落
    GAME_ADD_DROP: 20028,//添加掉落
    REFRESH_SKILL: 20029,//刷新可使用的技能
    GET_GROUND_SPEED: 20030,//获取地面速度
    SKILL_ADD_MONSTER: 20031,//技能增加怪物
    PET_ATTACK: 20032,//宠物攻击怪物
    HALL_SHOW_ADD_PET: 20033,//显示添加宠物
    GAME_BOSS_ALL_DAMAGE: 20034,//Boss战总伤害
    GAME_GET_SKILL_POS: 20035,//获取技能初始点
    BULLET_CREATE_BUFF: 20036,//子弹创建buff
    BULLET_CREATE_DEBUFF: 20037,//子弹创建debuff
    ROLE_ADD_BUFF: 20038,//角色添加buff
    GAME_SHOW_DAMAGE: 20039,//显示伤害
    GAME_GET_MONSTER_POSBG: 20040,//获取怪物底层图层
    GAME_GET_ACCELERATE: 20041,//获取加速
    CHANGED_GAME_RATE: 20042,//游戏速度改变
    GAME_SET_DEAD_NUM: 20043,//测试：设置怪物死亡数

    HALL_GET_GRID_LIST: 21000,//获取可拖动的角色列表
    HALL_GET_DELETE_BUTTON: 21001,//获取删除按钮
    HALL_MOVING_FRIEND: 21002,//开始拖拽角色
    HALL_MOVING_FRIEND_END: 21003,//停止拖拽角色
    HALL_INTO_DELETE_BUTTON: 21004,//进入删除按钮范围
    HALL_OUT_DELETE_BUTTON: 21005,//离开删除按钮范围
    HALL_SWITCH_FRIEND: 21006,//交换角色
    HALL_DELETE_FRIEND: 21007,//删除角色
    HALL_SHOW_ADD_FRIEND: 21008,//显示添加道友
    HALL_ADD_CLOUD: 21009,//添加祥云
    HALL_ADD_FRIEND: 21010,//添加道友
    HALL_GOLD_CHANGE: 21011,//金币变化
    HALL_UP_CLOUD: 21012,//升级祥云
    HALL_UP_FRIEND: 21013,//升级道友
    HALL_OPEN_PET_DETAILS: 21014,//打开宠物详情
    HALL_CHANGE_PET: 21015,//切换宠物
    HALL_GET_USER_INFO: 21016,//个人信息
    BOSS_SHOW_ADD_FRIEND: 21017,//Boss战显示添加道友
    BOSS_ADD_FRIEND: 21018,//Boss战添加道友
    BOSS_DELETE_FRIEND: 21019,//Boss战删除角色
    PVP_SHOW_ADD_FRIEND: 21020,//PVP显示添加道友
    PVP_ADD_FRIEND: 21021,//PVP添加道友
    PVP_DELETE_FRIEND: 21022,//PVP删除角色
    HALL_TO_BOSSGAME: 21023,//进入Boss战
    BOSS_SHOW_ADD_PET: 21024,//Boss战显示宠物列表
    PVP_SHOW_ADD_PET: 21025,//PVP显示宠物列表
    BOSS_CHANGE_PET: 21026,//Boss战添加宠物
    PVP_CHANGE_PET: 21027,//PVP添加宠物
    HALL_TO_PVP: 21028,//进入PVP
    HALL_STAMINA_CHANGE: 21029,//体力变化


    PVP_GET_SELF_TARGET: 22001,//PVP获取对手目标
    PVP_GET_ENEMY_TARGET: 22002,//PVP获取对手目标
    PVP_SELF_ATTACK: 22003,//PVP攻击对手
    PVP_ENEMY_ATTACK: 22004,//PVP攻击对手
    PVP_MULTI_TARGET: 22005,//PVP子弹获取伤害范围内对手目标

    EQU_IPMENT_DEATAILS: 23001,//装备详情
    FRIEND_DETAILS: 23002,//道友详情
    EQU_IPMENT_MOUNT: 23003,//装备挂载
    EQU_IPMENT_UPDATE: 23004,//装备数值更新
    EQU_IPMENT_UN_MOUNT: 23005,//宠物详情切换

    TALENT_DETAILS: 24001,//天赋详情弹窗
    GOODS_DETAILS: 25001,//商品详情弹窗
    GOODS_ANIMATION: 25002,//商品动画

    GUIDE_CONTROLLER: 26001,//新手引导

    EXIT_GAME: 27001,//游戏退出
    SWITCH_MUSIC: 27002,//切换音乐
    SWITCH_SOUND: 27003,//切换音效

    SWITCH_CLOUD: 28001,//切换祥云
    TALENT_UPGRADE: 1113,//天赋升级
    TALENT_UPGRADE_AD: 1114, //看广告天赋升级
    TALENT_UPGRADE_AD_SUCCESS: 1115,//看广告天赋升级弹窗


    EXIT_EDIT_TIMEOUT: 28001,//pve超时操作
    EXIT_EDIT_SUCCESS: 28002,//pve正确编辑标识符
    EXIT_EDIT_BOSS_SUCCESS: 28004,//boss正确编辑标识符

    GET_SIGN_IN_REWARD_AD: 28003,//看广告额外领取离线收益
}

//格式化数字，fixed为格式化精度，null为全精度，1为千位格式化，2为万位格式化，3为亿位格式化
export function formatNum(num:any, fixed:number|null=null) {
    let returnNum = num;
    if (num >= 100000000) {
        const fixedNum = getToFixedNum(Number((Number(num) / 100000000).toFixed(2)));
        returnNum = (num / 100000000).toFixed(fixedNum) + '亿';
    } else if (num >= 10000 && fixed != 3) {
        const fixedNum = getToFixedNum(Number((Number(num) / 10000).toFixed(2)));
        returnNum = (num / 10000).toFixed(fixedNum) + '万';
    } else if (num >= 1000 && (fixed != 2 && fixed != 3)) {
        const fixedNum = getToFixedNum(Number((Number(num) / 1000).toFixed(2)));
        returnNum = (num / 1000).toFixed(fixedNum) + '千';
    }
    return returnNum;
}

//id对应config
export const idMapConfig = [
    { min: 1, max: 1000, config: goodsConfig },
    { min: 1001, max: 2000, config: equipmentConfig, type: 2 },
    { min: 2001, max: 3000, config: roleConfig },
    { min: 3001, max: 4000, config: guideConfig },
    { min: 4001, max: 5000, config: friendConfig, type: 1 },
    { min: 5001, max: 6000, config: petConfig, type: 3 },
    { min: 6001, max: 7000, config: skillConfig },
    { min: 7001, max: 8000, config: degreeConfig },
    { min: 8001, max: 9000, config: buffConfig },
    { min: 9001, max: 10000, config: mallConfig },
    { min: 10001, max: 11000, config: talentConfig, type: 8 },
    { min: 11001, max: 12000, config: practiceConfig, type: 7 },
    { min: 12001, max: 13000, config: constantConfig },
    { min: 13001, max: 16000, config: friendLevelConfig, type: 1 },
    { min: 16001, max: 19000, config: monsterConfig },
    { min: 19001, max: 20000, config: cloudsLevelConfig, type: 5 },
    { min: 20001, max: 22000, config: equipmentStarConfig, type: 2 },
    { min: 22001, max: 23000, config: petsStarConfig, type: 3 },
    { min: 23001, max: 25000, config: skillStarConfig, type: 6 },
    // { min: 25001, max: 26000, config: goodsConfig },
    { min: 26001, max: 27000, config: fetterConfig },
    { min: 27001, max: 28000, config: taskConfig },
    // { min: 28001, max: 29000, config: goodsConfig },
    { min: 29001, max: 30000, config: bossGameConfig },
    { min: 30001, max: 31000, config: friendStarConfig, type: 1 },
    { min: 31001, max: 32000, config: cloudsStarConfig, type: 5 },
    // { min: 32001, max: 33000, config: goodsConfig },
    { min: 33001, max: 34000, config: cloudsConfig, type: 5 },
    { min: 34001, max: 35000, config: petBuffConfig, type: 3 },
    // { min: 35001, max: 36000, config: goodsConfig },
    // { min: 36001, max: 37000, config: goodsConfig },
    { min: 37001, max: 38000, config: debuffConfig },
    // { min: 38001, max: 39000, config: goodsConfig },
]

//根据id获取对应config
export function getConfigByID(id:any) {
    for (let i = 0; i < idMapConfig.length; i++) {
        const config = idMapConfig[i];
        if (config.min <= id && id <= config.max) {
            return config;
        }
    }
    return null;
}


/**
 * 将数字转换为中文数字字符串。
 * 
 * @param num 要转换的非负整数。
 * @returns 对应的中文数字字符串。
 * 
 * 该函数处理了基本的数字转换，并对10-19之间的特殊数字进行了处理，
 * 例如将“一十”转换为“十”。
 */
export function numberToChinese(num:any) {
    if (num === 0) return '零';

    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千'];
    let result = '';

    let i = 0;
    while (num > 0) {
        const digit = num % 10; // 获取当前位的数字
        if (digit !== 0) {
            result = digits[digit] + units[i] + result;
        } else if (result && !result.startsWith(digits[0])) {
            result = digits[0] + result;
        }
        num = Math.floor(num / 10);
        i++;
    }

    // 处理特殊情况：10-19之间的数字
    result = result.replace('一十', '十');
    // 处理多余的“零”
    result = result.replace(/零(?=零)/g, '');

    return result;
}


function getToFixedNum(formatNum:any) {
    let fixNum = 2;
    if (formatNum * 100 % 100 == 0) {
        fixNum = 0;
    } else if (formatNum * 10 % 10 == 0) {
        fixNum = 1;
    } else {
        fixNum = 2;
    }
    return fixNum;
}

export const DEFAULT_ROLE_TYPE = 1;//初始化主角默认配置类型
export const DEFAULT_CLOUD_TYPE = 1;//初始化默认道具类型
export const DEFAULT_DEGREE = 7001;//初始化关卡

export const ROLE_TYPE = {
    MAIN: 1,//主角
    FRIEND: 2,//道友
}

export const NODE_TYPE = {
    NONE: 0, //无
    ROLE: 1,//角色
    MONSTER: 2,//怪物
    PET: 3,//宠物
}

export const BOMB_TYPE = {
    NONE: 0,//无爆炸
    CIRCLE: 1,//圆形爆炸
}

export const SKILL_TYPE = {
    PASSIVE: 1,//被动技能
    ACTIVE: 2,//主动技能
    BOSS: 3,//BOSS技能
}

export const MONSTER_TYPE = {
    NORMAL: 1,//普通怪物
    // FLY: 2,//飞行怪物
    ELITE: 9,//传送阵怪物
    BOSS: 10,//BOSS怪物
}

export const DROP_TYPE = {
    MONEY: 1,//金钱掉落
}

export const ROLE_STATUS = {
    IDLE: 0, // 待机
    ATTACK: 1, // 攻击
    DEAD: 2, // 死亡
    OVER: 3, // 结束
}

export const PET_STATUS = {
    IDLE: 0, // 待机
    ATTACK: 1, // 攻击
    STOP: 2, // 停止
}

export const MONSTER_STATUS = {
    IDLE: 0,
    RUN: 1,
    ATTACK: 2,
    HIT: 3,
    BACK: 4,
    OVER: 6,
    DEATH: 5,
}

export const GAME_TYPE = {
    NONE: 0, //无
    NORMAL: 1,//普通关卡
    BOSS: 2,//BOSS关卡
    PVP: 3,//PVP
}

export const DATA_TYPE = {
    FRIEND: 1,//道友
    EQUIPTMENT: 2,//装备
    PET: 3,//宠物
    CLOUD: 5,//祥云
}

export const ITEM_TYPE = {
    MONEY: 1,//铜币
    GOLD: 2,//仙玉
}

export const ROLE_OPER_TYPE = {
    NORMAL: 0,//阵容
    BOSS: 1,//BOSS战阵容
    PVP: 2,//PVP阵容
}

export const fetterColor :{[key:string]:any}= {
    gold: color(245, 244, 32), //金色
    wood: color(48, 255, 97), //木色
    water: color(129, 199, 243), //水系色
    fire: color(243, 129, 129), //火焰色
    earth: color(255, 226, 67), //土色
}

export const UPGRADE_TYPE = {
    //升级
    UPGRADE: 1,
    //升星
    UPGRADE_STAR: 2,
    //修行
    TRAIN: 3
}

//操作id
export const OPER_ID = {
    //增加
    ADD: 1,
    //减少
    SUB: 2,
    //修改
    CHANGE: 3,
}

//普通关卡通关类型
export const LEVEL_PASS_TYPE = {
    SUCCESS: 1,//通关
    FAIL: 2,//未通关
}

//PVP关卡通关类型
export const LEVEL_PVP_TYPE = {
    SUCCESS: 1,//胜利
    FAIL: 2,//失败
}

//Boss战关卡通关类型
export const LEVEL_BOSS_TYPE = {
    SUCCESS: 1,//胜利
    FAIL: 2,//失败
}

//PVP队伍阵营
export const PVP_TEAM_CAMP = {
    NONE: 0,//无
    SELF: 1,//我方
    ENEMY: 2,//敌方
}

//id对应配置表
export const ID_CONFIG = {
    "1000": goodsConfig,
    "2000": equipmentConfig
}

//品质颜色
export const QUALITY_COLOR = {
    //白色
    1: color(255, 255, 255),
    //绿色
    2: color(0, 255, 153),
    //蓝色
    3: color(0, 235, 255),
    //紫色
    4: color(248, 106, 248),
    //橙色
    5: color(255, 163, 0),
}

//目标类型
export const TARGET_TYPE = {
    ENEMY: 0, //敌方
    SELF: 1,//己方
    ALL: 2,//所有
}

//伤害类型
export const DAMAGE_TYPE = {
    NONE: 0, //无类型
    NORMAL: 1,//普通伤害
    SHIELD: 2,//打在护盾伤害
    DEBUFF: 3,//debuff伤害
    ADDBLOOD: 4,//加血
}

//游戏阶段
export const GAME_STEP = {
    GAME_READY: 0,
    GAME_START: 1,
    GAME_RUN: 2,
    GAME_OVER: 3,
}

//羁绊属性
export const FETTER_ATTRIBUTE = Enum({
    NONE: 0,//不触发羁绊
    ATTACK: 1,//按攻击频率
    HIT: 2,//按伤害频率
})

//广告类型
export const AD_TYPE = Enum({
    NONE: 0,//无广告
    MONEY: 1,//看广告获取铜币
    DIAMOND: 2,//看广告获取仙玉
    STAMINA: 3,//看广告获取体力
    GAME_FAIL: 4,//看广告获取双倍奖励（战斗）
    BOSS_FAIL: 5,//看广告获取双倍奖励（BOSS战）
    PVP_FAIL: 6,//看广告获取双倍奖励（PVP）
    OFFLINE: 7,//看广告获取额外离线奖励
    TALENT:8,//看广告解锁天赋
})

function getAngle(point1:any, point2:any, width = 0, height = 0) {
    const deltaX = point2.x - point1.x + width;
    const deltaY = point2.y - point1.y + height;
    const angle = Math.atan2(deltaY, deltaX);
    const angleInDegrees = angle * 180 / Math.PI;
    return angleInDegrees;
}
export {
    getAngle
}