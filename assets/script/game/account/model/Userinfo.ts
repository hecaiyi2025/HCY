import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { cloudsConfig } from "../../common/config/clouds";
import { cloudsStarConfig } from "../../common/config/clouds_star";
import { degreeConfig } from "../../common/config/degree";
import { friendConfig } from "../../common/config/friend";
import { friendStarConfig } from "../../common/config/friend_star";
import { roleConfig } from "../../common/config/roleConfig";
import { DATA_TYPE, DEFAULT_DEGREE, ITEM_TYPE, NETWORKING, ROLE_OPER_TYPE, UPGRADE_TYPE } from "../../common/global";
import { fetterConfig } from "../../common/config/fetters";
import { equipmentStarConfig } from "../../common/config/equipment_star";
import { practiceConfig } from "../../common/config/practice";
import { talentConfig } from "../../common/config/talent";
import { buffConfig } from "../../common/config/buff";
import { constantConfig } from "../../common/config/constant";

@ccclass('Userinfo')
export class UserInfo {
      //玩家信息
      m_userInfo: any = {};
      m_initUserInfo = false;
      //战力flag
      m_powerFlag = false;
  
      InitUserInfo(roleInfo:any) {
          if (this.m_initUserInfo) {
              return;
          }
          this.m_initUserInfo = true;
          const userInfo = localStorage.getItem('user_info');
          if (userInfo) {
              const userInfoJson = JSON.parse(userInfo);
              if (userInfoJson) {
                  this.m_userInfo = userInfoJson;
                  if (NETWORKING) {
                      this.m_userInfo.cloudList = []
                      this.m_userInfo.boss.cloudList = []
                      this.m_userInfo.pvp.cloudList = []
                      this.m_userInfo.role.petInfo = null
                      this.m_userInfo.boss.petInfo = null
                      this.m_userInfo.pvp.petInfo = null
                      this.m_userInfo.stamina = 100; //体力
                  } else {
                      if (this.m_userInfo.equipmentList && !this.m_userInfo.cloudList) {
                          this.m_userInfo.cloudList = this.m_userInfo.equipmentList;
                          this.m_userInfo.equipmentList = null;
                      }
                      if (this.m_userInfo.role.equipmentId && !this.m_userInfo.role.cloudId) {
                          this.m_userInfo.role.cloudId = this.m_userInfo.role.equipmentId;
                          this.m_userInfo.role.equipmentId = null;
                      }
                      let reset = false;
                      console.log("this.m_userInfo:", this.m_userInfo);
                      if (this.m_userInfo.role) {
                          const roleInfo = roleConfig.getConfigByID(this.m_userInfo.role.id);
                          for (const key in roleInfo) {
                              if (Object.prototype.hasOwnProperty.call(roleInfo, key)) {
                                  const element = roleInfo[key];
                                  if (key != "blood" && key != "attack" && key != "defence") {
                                      this.m_userInfo.role[key] = element;
                                  }
                              }
                          }
                      }
                      if (!this.m_userInfo.boss) {
                          this.m_userInfo.boss = {
                              role: roleInfo,
                              cloudList: [],
                          };
                      }
                      if (!this.m_userInfo.pvp) {
                          this.m_userInfo.pvp = {
                              role: roleInfo,
                              cloudList: [],
                          };
                      }
                      if (!this.m_userInfo.degree) {
                          this.m_userInfo.degree = DEFAULT_DEGREE;
                          this.m_userInfo.lastDegree = DEFAULT_DEGREE;
                      }
                      /////////////////xyang测试////////////////////
                      // this.m_userInfo.degree = 7003;
                      // this.m_userInfo.role.petInfo = {
                      //     configId: 5006,
                      //     createTime: "2025-01-14 11:36:49",
                      //     id: 3,
                      //     isDelete: 2,
                      //     level: 1,
                      //     orderNum: 0,
                      //     relevanceId: 0,
                      //     star: 22041,
                      //     type: 3,
                      //     updateTime: "2025-01-14 11:36:49",
                      //     userId: 2826
                      // };
                      ///////////////////////////////////////////
                      if (this.m_userInfo.cloudList && this.m_userInfo.cloudList.length > 0) {
                          for (let i = 0; i < this.m_userInfo.cloudList.length; i++) {
                              const cloud = this.m_userInfo.cloudList[i];
                              const cloudInfo = cloudsConfig.getConfigByID(cloud.id);
                              for (const key in cloudInfo) {
                                  if (Object.prototype.hasOwnProperty.call(cloudInfo, key)) {
                                      const element = cloudInfo[key];
                                      cloud[key] = element;
                                  }
                              }
                              if (cloud.friendInfo) {
                                  const friend = friendConfig.getConfigByID(cloud.friendInfo.id);
                                  for (const key in friend) {
                                      if (Object.prototype.hasOwnProperty.call(friend, key)) {
                                          const element = friend[key];
                                          cloud.friendInfo[key] = element;
                                      }
                                  }
                              }
                          }
                      }
                      if (!this.m_userInfo.money) {
                          this.m_userInfo.money = 0;
                      }
                      this.m_userInfo.stamina = 100; //体力
                      this.m_userInfo.physicalStrength = 100; //体力2
                  }
                  this.refreshFetter();
                  return;
              }
          }
          roleInfo.star = 1;
          roleInfo.level = 1;
          roleInfo.weapon = [];
          if (!roleInfo.cloudType) {
              roleInfo["cloudType"] = 1;
          }
          this.m_userInfo = {
              name: "歌苓艾莉",
              avatar: 49,
              score: 0,
              loginTime: new Date().getTime(), //登录时间
              logoutTime: 0, //退出时间
              role: roleInfo,//主角信息
              cloudList: [],//祥云列表（包含道友）
              money: 2000,//铜币
              diamond: 0,//仙玉
              stone: 0,
              degree: DEFAULT_DEGREE,//关卡
              boss: {//boss战阵容
                  role: roleInfo,
                  cloudList: [],
              },
              pvp: {//pvp阵容
                  role: roleInfo,
                  cloudList: [],
              },
              stamina: 100,//体力
              physicalStrength: 100,//体力
              equipmentList: [],//装备列表
              practice: {},//修炼信息
              talentList: [],//天赋列表
          };
          this.m_initUserInfo = true;
          this.saveInfo();
      }
  
      //设置个人信息
      setUserInfo(userInfo:any) {
          let obj ={} as { [key: string]: any };
          obj['name'] = userInfo.nickName
          for (let index = 0; index < userInfo.accountList.length; index++) {
              let data = userInfo.accountList[index];
              if (data.goodsId == ITEM_TYPE.MONEY) {
                  obj["money"] = data.amount;
              } else if (data.goodsId == ITEM_TYPE.GOLD) {
                  obj["diamond"] = data.amount;
              }
          }
          obj["degree"] = userInfo.levelsConfig;
          obj["physicalStrength"] = userInfo.physicalStrength
          obj["avatar"] = userInfo.avatar
          let role = this.m_userInfo.role
          role["cloudType"] = userInfo.cloudsList[0].prop
          role["cloudId"] = userInfo.cloudsList[0].configId
          role["cloudStar"] = userInfo.cloudsList[0].star
          //初始赋值一次
          if (!this.m_powerFlag) {
              role["bossRoomFightingPower"] = userInfo.bossRoomFightingPower
              role["equipmentCombatPower"] = userInfo.equipmentCombatPower
              role["fightingPower"] = userInfo.fightingPower
              role["practiceCombatPower"] = userInfo.practiceCombatPower
              role["pvpFightingPower"] = userInfo.pvpFightingPower
              role["talentCombatPower"] = userInfo.talentCombatPower
              role["characterCombatPower"] = userInfo.characterCombatPower
          }
  
  
          Object.assign(this.m_userInfo, obj);
          this.saveInfo();
          // postMessage(MESSAGE_DEFINES.HALL_GET_USER_INFO);
      }
  
      //设置体力
      setStamina(power:any) {
          this.m_userInfo.physicalStrength = power;
      }
  
      //初始化阵容列表
      initRoleList(data:any) {
          if (data) {
              data.sort((a:any, b:any) => a.orderNum - b.orderNum)
              this.m_userInfo.cloudList = []
              this.m_userInfo.role.petInfo = null
              for (let i = 0; i < data.length; i++) {
                  if (data[i].type == DATA_TYPE.CLOUD) {
                      const cloud = {}as { [key: string]: any };
                      const cloudInfo = cloudsConfig.getConfigByID(data[i].configId);
                      cloud["level"] = data[i].level;
                      cloud["uuid"] = data[i].id;
                      cloud["orderNum"] = data[i].orderNum;
                      cloud["star"] = data[i].star;
                      for (const key in cloudInfo) {
                          if (Object.prototype.hasOwnProperty.call(cloudInfo, key)) {
                              const element = cloudInfo[key];
                              cloud[key] = element;
                          }
                      }
                      if (data[i].gameMountList) {
                          cloud["friendInfo"] = {}
                          cloud["friendInfo"]["level"] = data[i].gameMountList[0].level;
                          cloud["friendInfo"]["uuid"] = data[i].gameMountList[0].id;
                          cloud["friendInfo"]["star"] = data[i].gameMountList[0].star;
                          const friend = friendConfig.getConfigByID(data[i].gameMountList[0].configId);
                          for (const key in friend) {
                              if (Object.prototype.hasOwnProperty.call(friend, key)) {
                                  const element = friend[key];
                                  cloud["friendInfo"][key] = element;
                              }
                          }
                      }
                      this.m_userInfo.cloudList.push(cloud);
                  } else if (data[i].type == DATA_TYPE.PET) {
                      let obj = { configId: data[i].configId, level: 1, type: data[i].type, star: data[i].star, id: data[i].id };
                      this.m_userInfo.role.petInfo = obj;
                  } else if (data[i].type == DATA_TYPE.EQUIPTMENT) {
  
                  }
              }
              this.m_initUserInfo = true;
          }
      }
  
      //初始化boss阵容
      initBossRoleList(data:any) {
          if (data) {
              data.sort((a:any, b:any) => a.orderNum - b.orderNum)
              this.m_userInfo.boss.cloudList = []
              for (let i = 0; i < data.length; i++) {
                  if (data[i].type == DATA_TYPE.CLOUD) {
                      const cloud = {}as { [key: string]: any };;
                      const cloudInfo = cloudsConfig.getConfigByID(data[i].configId);
                      cloud["level"] = data[i].level;
                      cloud["uuid"] = data[i].id;
                      cloud["orderNum"] = data[i].orderNum;
                      cloud["star"] = data[i].star;
                      for (const key in cloudInfo) {
                          if (Object.prototype.hasOwnProperty.call(cloudInfo, key)) {
                              const element = cloudInfo[key];
                              cloud[key] = element;
                          }
                      }
                      if (data[i].gameLineUpList) {
                          cloud["friendInfo"] = {}
                          cloud["friendInfo"]["level"] = data[i].gameLineUpList[0].level;
                          cloud["friendInfo"]["uuid"] = data[i].gameLineUpList[0].id;
                          cloud["friendInfo"]["star"] = data[i].gameLineUpList[0].star;
                          const friend = friendConfig.getConfigByID(data[i].gameLineUpList[0].configId);
                          for (const key in friend) {
                              if (Object.prototype.hasOwnProperty.call(friend, key)) {
                                  const element = friend[key];
                                  cloud["friendInfo"][key] = element;
                              }
                          }
                      }
                      this.m_userInfo.boss.cloudList.push(cloud);
                  } else if (data[i].type == DATA_TYPE.PET) {
                      let obj = { configId: data[i].configId, level: 1, type: data[i].type, star: data[i].star, id: data[i].id };
                      this.m_userInfo.boss.petInfo = obj;
                  } else if (data[i].type == DATA_TYPE.EQUIPTMENT) {
  
                  }
              }
          }
      }
  
      //初始化pvp阵容
      initPvpRoleList(data:any) {
          if (data) {
              data.sort((a:any, b:any) => a.orderNum - b.orderNum)
              this.m_userInfo.pvp.cloudList = []
              for (let i = 0; i < data.length; i++) {
                  if (data[i].type == DATA_TYPE.CLOUD) {
                      const cloud = {}as { [key: string]: any };;
                      const cloudInfo = cloudsConfig.getConfigByID(data[i].configId);
                      cloud["level"] = data[i].level;
                      cloud["uuid"] = data[i].id;
                      cloud["orderNum"] = data[i].orderNum;
                      cloud["star"] = data[i].star;
                      for (const key in cloudInfo) {
                          if (Object.prototype.hasOwnProperty.call(cloudInfo, key)) {
                              const element = cloudInfo[key];
                              cloud[key] = element;
                          }
                      }
                      if (data[i].gameLineUpList) {
                          cloud["friendInfo"] = {}
                          cloud["friendInfo"]["level"] = data[i].gameLineUpList[0].level;
                          cloud["friendInfo"]["uuid"] = data[i].gameLineUpList[0].id;
                          cloud["friendInfo"]["star"] = data[i].gameLineUpList[0].star;
                          const friend = friendConfig.getConfigByID(data[i].gameLineUpList[0].configId);
                          for (const key in friend) {
                              if (Object.prototype.hasOwnProperty.call(friend, key)) {
                                  const element = friend[key];
                                  cloud["friendInfo"][key] = element;
                              }
                          }
                      }
                      this.m_userInfo.pvp.cloudList.push(cloud);
                  } else if (data[i].type == DATA_TYPE.PET) {
                      let obj = { configId: data[i].configId, level: 1, type: data[i].type, star: data[i].star, id: data[i].id };
                      this.m_userInfo.pvp.petInfo = obj;
                  } else if (data[i].type == DATA_TYPE.EQUIPTMENT) {
  
                  }
              }
          }
      }
  
      //初始化对手pvp阵容
      initEnemyPvpRoleList(data:any) {
          console.log("initEnemyPvpRoleList", data);
          this.m_userInfo['enemyPVP'] = {
              "role": {
                  "id": "2001",
                  "type": "1",
                  "name": "神僧",
                  "res": "game/role/role1/role1",
                  "blood": "1000",
                  "attack": "10",
                  "defence": "0",
                  "interval": "2",
                  "skill": "6001",
                  "activeSkill": "6007",
                  "distance": "-1",
                  "bulletOffset": "{\"x\":\"60\",\"y\":\"-15\"}",
                  "skillInterval": "0.5",
                  "cloudId": "33001",
                  "cloudType": "1",
                  "cloudStar": "31001",
                  "remarks": "",
                  "star": 1,
                  "level": 1,
                  "weapon": [
  
                  ]
              },
              "cloudList": [
  
              ],
              "petInfo": null
          }
          if (data) {
              data.sort((a:any, b:any) => a.orderNum - b.orderNum)
              for (let i = 0; i < data.length; i++) {
                  if (data[i].type == DATA_TYPE.CLOUD) {
                      const cloud = {}as { [key: string]: any };;
                      const cloudInfo = cloudsConfig.getConfigByID(data[i].configId);
                      cloud["level"] = data[i].level;
                      cloud["uuid"] = data[i].id;
                      cloud["orderNum"] = data[i].orderNum;
                      cloud["star"] = data[i].star;
                      for (const key in cloudInfo) {
                          if (Object.prototype.hasOwnProperty.call(cloudInfo, key)) {
                              const element = cloudInfo[key];
                              cloud[key] = element;
                          }
                      }
                      if (data[i].gameLineUpList) {
                          cloud["friendInfo"] = {}
                          cloud["friendInfo"]["level"] = data[i].gameLineUpList[0].level;
                          cloud["friendInfo"]["uuid"] = data[i].gameLineUpList[0].id;
                          cloud["friendInfo"]["star"] = data[i].gameLineUpList[0].star;
                          const friend = friendConfig.getConfigByID(data[i].gameLineUpList[0].configId);
                          for (const key in friend) {
                              if (Object.prototype.hasOwnProperty.call(friend, key)) {
                                  const element = friend[key];
                                  cloud["friendInfo"][key] = element;
                              }
                          }
                      }
                      this.m_userInfo.enemyPVP.cloudList.push(cloud);
                  } else if (data[i].type == DATA_TYPE.PET) {
                      let obj = { configId: data[i].configId, level: 1, type: data[i].type, star: data[i].star, id: data[i].id };
                      this.m_userInfo.enemyPVP.petInfo = obj;
                  } else if (data[i].type == DATA_TYPE.EQUIPTMENT) {
  
                  }
              }
          }
      }
  
      isInit() {
          return this.m_initUserInfo;
      }
  
      saveInfo() {
          if (this.m_initUserInfo) {
              this.refreshFetter();
              console.log("saveInfo:", this.m_userInfo);
              localStorage.setItem('user_info', JSON.stringify(this.m_userInfo));
          }
      }
  
      getUserInfo() {
          return this.m_userInfo;
      }
  
      getMoney() {
          return this.m_userInfo.money;
      }
  
      setMoney(money:any) {
          this.m_userInfo.money = money;
      }
  
      getCloudList() {
          return this.m_userInfo.cloudList;
      }
  
      addNewCloud(cloudInfo:any, type = ROLE_OPER_TYPE.NORMAL) {//type 0/null-阵容，1-boss战，2-pvp
          cloudInfo.uuid = new Date().getTime(); //唯一id
          if (type == ROLE_OPER_TYPE.BOSS) {
              this.m_userInfo.boss.cloudList.push(cloudInfo);
              cloudInfo.level = this.getCloudMaxLevel(cloudInfo);//等级取当前星级的最高级
          } else if (type == ROLE_OPER_TYPE.PVP) {
              this.m_userInfo.pvp.cloudList.push(cloudInfo);
              cloudInfo.level = this.getCloudMaxLevel(cloudInfo);//等级取当前星级的最高级
          } else {
              this.m_userInfo.cloudList.push(cloudInfo);
              cloudInfo.level = 1;//默认等级1
          }
          this.saveInfo();
          return cloudInfo;
      }
  
      AddNewFriend(cloudId:any, friendInfo:any, type = ROLE_OPER_TYPE.NORMAL) {//type 0/null-阵容，1-boss战，2-pvp
          let list = [];
          if (type == ROLE_OPER_TYPE.BOSS) {
              list = this.m_userInfo.boss.cloudList;
          } else if (type == ROLE_OPER_TYPE.PVP) {
              list = this.m_userInfo.pvp.cloudList;
          } else {
              list = this.m_userInfo.cloudList;
          }
          for (let i = 0; i < list.length; i++) {
              const cloudInfo = list[i];
              if (cloudInfo.uuid == cloudId) {
                  if (type == ROLE_OPER_TYPE.BOSS) {
                      friendInfo.level = this.getFriendMaxLevel(friendInfo); //等级取当前星级的最高级
                  } else if (type == ROLE_OPER_TYPE.PVP) {
                      friendInfo.level = this.getFriendMaxLevel(friendInfo); //等级取当前星级的最高级
                  } else {
                      friendInfo.level = 1; //默认等级1
                  }
                  cloudInfo.friendInfo = friendInfo;
                  break;
              }
          }
          this.saveInfo();
      }
  
      switchCloud(uuidList:any, from:any, to:any, type = ROLE_OPER_TYPE.NORMAL) {//type 0/null-阵容，1-boss战，2-pvp
          console.log("from:", from, "to:", to);
          let list = [];
          if (type == ROLE_OPER_TYPE.BOSS) {
              list = this.m_userInfo.boss.cloudList;
          } else if (type == ROLE_OPER_TYPE.PVP) {
              list = this.m_userInfo.pvp.cloudList;
          } else {
              list = this.m_userInfo.cloudList;
          }
          const newList = [];
          for (let i = 0; i < uuidList.length; i++) {
              const uuid = uuidList[i];
              for (let j = 0; j < list.length; j++) {
                  const cloudInfo = list[j];
                  if (cloudInfo.uuid == uuid) {
                      newList.push(cloudInfo);
                      break;
                  }
              }
          }
          this.m_userInfo.cloudList = newList;
          this.saveInfo();
      }
  
      deleteCloud(uuid:any, type = ROLE_OPER_TYPE.NORMAL) {//type 0/null-阵容，1-boss战，2-pvp
          let list = [];
          if (type == ROLE_OPER_TYPE.BOSS) {
              list = this.m_userInfo.boss.cloudList;
          } else if (type == ROLE_OPER_TYPE.PVP) {
              list = this.m_userInfo.pvp.cloudList;
          } else {
              list = this.m_userInfo.cloudList;
          }
          for (let i = 0; i < list.length; i++) {
              const cloudInfo = list[i];
              if (cloudInfo.uuid == uuid) {
                  list.splice(i, 1);
                  break;
              }
          }
          this.saveInfo();
      }
  
      NextDegree() {
          this.SetLastDegree();
          this.m_userInfo.degree = this.m_userInfo.degree + 1;
          this.m_userInfo.cloudList = [];
          this.saveInfo();
      }
  
      SetLastDegree() {//lastDegree用来做单机版本的关卡动画
          this.m_userInfo.lastDegree = this.m_userInfo.degree;
      }
  
      setPet(petInfo:any, type = ROLE_OPER_TYPE.NORMAL) {
          if (type == ROLE_OPER_TYPE.BOSS) {
              this.m_userInfo.boss.petInfo = {
                  configId: petInfo.id,
                  level: 1,
                  star: 22002,
                  type: 3,
              };
          } else if (type == ROLE_OPER_TYPE.PVP) {
              this.m_userInfo.pvp.petInfo = {
                  configId: petInfo.id,
                  level: 1,
                  star: 22002,
                  type: 3,
              };
          } else {
              this.m_userInfo.role.petInfo = {
                  configId: petInfo.id,
                  level: 1,
                  star: 22002,
                  type: 3,
              };
          }
          this.saveInfo();
      }
  
      getCloudMaxLevel(cloudInfo:any) {
          if (cloudInfo.star) {
              const starInfo:any = cloudsStarConfig.getConfigByStar(cloudInfo.star);
              if (starInfo && starInfo.starRatingRestrictions) {
                  const restriction = JSON.parse(starInfo.starRatingRestrictions);
                  if (restriction && restriction.max) {
                      return restriction.max;
                  }
              }
          }
          return 1;
      }
  
      getFriendMaxLevel(friendInfo:any) {
          if (friendInfo.star) {
              let type = friendConfig.getConfigByID(friendInfo.id).type;
              const starInfo:any = friendStarConfig.getConfigByStar(type, friendInfo.star);
              if (starInfo && starInfo.starRatingRestrictions) {
                  const restriction = JSON.parse(starInfo.starRatingRestrictions);
                  if (restriction && restriction.max) {
                      return restriction.max;
                  }
              }
          }
          return 1;
      }
  
      refreshFetter() {
          const list = this.m_userInfo.cloudList;
          this.setListFetter(list);
          const list2 = this.m_userInfo.boss.cloudList;
          this.setListFetter(list2);
          const list3 = this.m_userInfo.pvp.cloudList;
          this.setListFetter(list3);
      }
  
      setListFetter(list:any) {
          if (!list || list.length == 0) return;
          const fetterList : Array<{ same?: number }>= [];
          for (let i = 0; i < list.length; i++) {
              const cloudInfo = list[i];
              if (cloudInfo.friendInfo) {
                  if (fetterList[cloudInfo.friendInfo.element]) {
                      (fetterList[cloudInfo.friendInfo.element]as { same: number }).same += 1;
                  } else {
                      fetterList[cloudInfo.friendInfo.element] = {};
                      fetterList[cloudInfo.friendInfo.element].same = 1;
                      (fetterList[cloudInfo.friendInfo.element]as { type: any }).type = cloudInfo.friendInfo.element;
                  }
              }
          }
          if (Object.keys(fetterList).length == 0) return;
          let double = 0;
          const doubleList = [];
          let triple = 0;
          const tripleList = [];
          let quad = 0;
          const quadList = [];
          let penta = 0;
          const pentaList = [];
          for (const key in fetterList) {
              if (Object.prototype.hasOwnProperty.call(fetterList, key)) {
                  const fetter: { [key: string]: any } = fetterList[key];
                  if (fetter.same == 2) {
                      double++;
                      doubleList[fetter.type] = true;
                  } else if (fetter.same == 3) {
                      triple++;
                      tripleList[fetter.type] = true;
                  } else if (fetter.same == 4) {
                      quad++;
                      quadList[fetter.type] = true;
                  } else if (fetter.same == 5) {
                      penta++;
                      pentaList[fetter.type] = true;
                  }
              }
          }
          const fetterInfos :any= fetterConfig.getConfig();
          let activeFetter = null;
          for (const key in fetterInfos) {
              if (Object.prototype.hasOwnProperty.call(fetterInfos, key)) {
                  const fetterInfo = fetterInfos[key];
                  const condition = JSON.parse(fetterInfo.condition);
                  if (condition) {
                      let doubleTemp = double;
                      const doubleListTemp:{ [key: string]: any } = doubleList;
                      let tripleTemp = triple;
                      const tripleListTemp:{ [key: string]: any } = tripleList;
                      let quadTemp = quad;
                      const quadListTemp :{ [key: string]: any }= quadList;
                      let pentaTemp = penta;
                      const pentaListTemp:{ [key: string]: any } = pentaList;
                      let coincide = true;
                      let elementList = [];
                      for (let i = 0; i < condition.length; i++) {
                          const conditionInfo = condition[i];
                          if (conditionInfo["same"]) {
                              if (conditionInfo["same"] == 2) {
                                  if (doubleTemp <= 0) {
                                      coincide = false;
                                  } else {
                                      doubleTemp--;
                                      const type = Object.keys(doubleListTemp)[double - doubleTemp - 1];
                                      doubleListTemp[Object.keys(doubleListTemp)[double - doubleTemp - 1]] = null;
                                      elementList.push({ type, same: 2 });
                                  }
                              } else if (conditionInfo["same"] == 3) {
                                  if (tripleTemp <= 0) {
                                      coincide = false;
                                  } else {
                                      tripleTemp--;
                                      const type = Object.keys(tripleListTemp)[triple - tripleTemp - 1];
                                      tripleListTemp[Object.keys(tripleListTemp)[triple - tripleTemp - 1]] = null;
                                      elementList.push({ type, same: 3 });
                                  }
                              } else if (conditionInfo["same"] == 4) {
                                  if (quadTemp <= 0) {
                                      coincide = false;
                                  } else {
                                      quadTemp--;
                                      const type = Object.keys(quadListTemp)[quad - quadTemp - 1];
                                      quadListTemp[Object.keys(quadListTemp)[quad - quadTemp - 1]] = null;
                                      elementList.push({ type, same: 4 });
                                  }
                              } else if (conditionInfo["same"] == 5) {
                                  if (pentaTemp <= 0) {
                                      coincide = false;
                                  } else {
                                      pentaTemp--;
                                      const type = Object.keys(pentaListTemp)[penta - pentaTemp - 1];
                                      pentaListTemp[Object.keys(pentaListTemp)[penta - pentaTemp - 1]] = null;
                                      elementList.push({ type, same: 5 });
                                  }
                              }
                          }
                      }
                      if (coincide) {
                          if (!activeFetter) {
                              activeFetter = fetterInfo;
                              activeFetter.elementList = elementList;
                          } else {
                              if (activeFetter.level < fetterInfo.level) {
                                  activeFetter = fetterInfo;
                                  activeFetter.elementList = elementList;
                              }
                          }
                      }
                  }
              }
          }
          if (activeFetter) {
              this.m_userInfo.fetter = activeFetter;
              for (let i = 0; i < list.length; i++) {
                  const cloudInfo = list[i];
                  if (cloudInfo.friendInfo) {
                      cloudInfo.friendInfo.fetter = null;
                      for (let j = 0; j < activeFetter.elementList.length; j++) {
                          const elementInfo = activeFetter.elementList[j];
                          elementInfo.id = activeFetter.id;
                          if (elementInfo.type == cloudInfo.friendInfo.element) {
                              cloudInfo.friendInfo.fetter = elementInfo;
                          }
                      }
                  }
              }
              console.log("list:", list);
          }
      }
  
      getStamina() {
          return this.m_userInfo.stamina;
      }
  
      useStamina() {
          //体力消耗
          let stamina = constantConfig.getConfigByID(12033).parameter1
          // console.log("当前体力:", this.m_userInfo.physicalStrength);
          // console.log("体力消耗:", stamina);
          if (Number(this.m_userInfo.physicalStrength) >= Number(stamina)) {
              this.saveInfo();
              return true;
          }
          return false;
      }
  
      setEquipmentList(list:any) {
          this.m_userInfo.equipmentList = list;
          this.saveInfo();
      }
  
      setPracticeInfo(info:any) {
          this.m_userInfo.practice = info;
          this.saveInfo();
      }
  
      setTalentList(list:any) {
          this.m_userInfo.talentList = list;
          this.saveInfo();
      }
  
      //获取主角最终的攻防血
      getFinalProperty() {
          const property = {
              attack: 0,
              defence: 0,
              blood: 0,
          };
          //自身属性
          if (this.m_userInfo.role) {
              property.attack += Number(this.m_userInfo.role.attack);
              property.defence += Number(this.m_userInfo.role.defence);
              property.blood += Number(this.m_userInfo.role.blood);
          }
          //装备属性
          if (this.m_userInfo.equipmentList) {
              for (let index = 0; index < this.m_userInfo.equipmentList.length; index++) {
                  const equipment = this.m_userInfo.equipmentList[index];
                  const star = equipment.star;
                  const equipmentStarInfo = equipmentStarConfig.getConfigByID(star);
                  if (equipmentStarInfo) {
                      property.attack += Number(equipmentStarInfo.attack);
                      property.defence += Number(equipmentStarInfo.defence);
                      property.blood += Number(equipmentStarInfo.blood);
                  }
              }
          }
          //修炼属性
          if (this.m_userInfo.practice) {
              const practiceId = this.m_userInfo.practice.newUpgrade;
              const practiceInfo = practiceConfig.getConfigByID(practiceId);
              if (practiceInfo) {
                  property.attack += Number(practiceInfo.attack);
                  property.defence += Number(practiceInfo.defence);
                  property.blood += Number(practiceInfo.blood);
              }
          }
          //天赋属性
          if (this.m_userInfo.talentList) {
              for (let i = 0; i < this.m_userInfo.talentList.length; i++) {
                  const talentId = this.m_userInfo.talentList[i];
                  const talentInfo = talentConfig.getConfigByID(talentId);
                  if (talentInfo) {
                      const propertyJson = JSON.parse(talentInfo.property);
                      if (propertyJson && propertyJson.length > 0) {
                          for (let j = 0; j < propertyJson.length; j++) {
                              const propertyInfo = propertyJson[j];
                              if (talentInfo.tabType == 1) {
                                  if (propertyInfo.type == "attack") {
                                      property.attack += Number(propertyInfo.num);
                                  } else if (propertyInfo.type == "defence") {
                                      property.defence += Number(propertyInfo.num);
                                  } else if (propertyInfo.type == "blood") {
                                      property.blood += Number(propertyInfo.num);
                                  }
                              } else if (talentInfo.tabType == 3) {
                                  let config = buffConfig.getConfigByID(propertyInfo.id)
                                  let param = JSON.parse(config.param)
                                  for (const key in param) {
                                      if (Object.prototype.hasOwnProperty.call(param, key)) {
                                          if (key == "attack") {
                                              property.attack *= Number(1 + +param[key]);
                                          } else if (key == "defence") {
                                              property.defence *= Number(1 + +param[key]);
                                          } else if (key == "blood") {
                                              property.blood *= Number(1 + +param[key]);
                                          }
                                      }
                                  }
  
                              }
                          }
                      }
                  }
              }
          }
          return property;
      }
  
      clearData() {
          this.m_userInfo = {};
          this.m_initUserInfo = false;
      }

}

//export {Userinfo};
