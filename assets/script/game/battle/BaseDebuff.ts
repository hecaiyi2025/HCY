import { _decorator, Component, Node } from 'cc';
import { DAMAGE_TYPE, NODE_TYPE } from '../common/global';
//import { globalData } from '../../data/globalData';
//import { BaseMonster } from './BaseMonster';
import { BaseRole } from './BaseRole';
const { ccclass, property } = _decorator;

@ccclass('BaseDebuff')
export class BaseDebuff extends Component {
    m_info = null;// debuff信息
    m_cd = null;//debuff持续时间
    m_attack = 0;//debuff伤害
    m_parent = null;//debuff挂载对象
    m_parentType = NODE_TYPE.MONSTER;//debuff挂载对象类型
    m_destroyCallback = null;//debuff销毁回调
    m_dot = null;//dot间隔
    m_dotType = null;//dot类型：1，按攻击 2，按生命最大值
    m_dotValue = null;//dot参数
    m_dotTimer = null;//dot计时器

    m_oldParam = null;
    start() {

    }

    update(deltaTime: number) {
        /*
        if (this.m_cd != null) {
            deltaTime = deltaTime * globalData.getGameRate();
            this.m_cd -= deltaTime;
            if (this.m_cd <= 0) {
                this.RemoveDebuff();
                if (this.m_destroyCallback) {
                    this.m_destroyCallback();
                }
                this.node.removeFromParent();
                this.m_cd = null;
            }
            if (this.m_dot != null) {
                this.m_dotTimer += deltaTime;
                if (this.m_dotTimer >= this.m_dot) {
                    this.m_dotTimer = 0;
                    //dot伤害
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            let damage = 0;
                            if (this.m_dotType == 1) {
                                damage = this.m_attack * this.m_dotValue;
                            } else if (this.m_dotType == 2) {
                                damage = monsterScript.GetMaxBlood() * this.m_dotValue;
                            }
                            console.log("debuff dot伤害：", damage);
                            monsterScript.ShowHit(damage, null, DAMAGE_TYPE.DEBUFF);
                        }
                    } else if (this.m_parentType == NODE_TYPE.ROLE) {
                        const roleScript = this.m_parent.getComponent(BaseRole);
                        if (roleScript) {
                            let damage = 0;
                            if (this.m_dotType == 1) {
                                damage = this.m_attack * this.m_dotValue;
                            } else if (this.m_dotType == 2) {
                                damage = roleScript.GetMaxBlood() * this.m_dotValue;
                            }
                            console.log("debuff dot伤害：", damage);
                            roleScript.ShowHit(this.m_attack, DAMAGE_TYPE.DEBUFF);
                        }
                    }
                }
            }
        }*/
    }

    SetInfo(info:any) {
        this.m_info = info;
    }
    SetCD(cd:any) {
        this.m_cd = cd;
    }
    SetParent(parent:any, type:any) {
        this.m_parent = parent;
        this.m_parentType = type;
    }
    SetAttack(attack:any) {
        this.m_attack = attack;
    }
    SetDestroyCallback(callback:any) {
        this.m_destroyCallback = callback;
    }
    StartDebuff() {
        /*
        console.log("开始debuff");
        if (this.m_info && this.m_parent && this.m_parentType) {
            const param = JSON.parse(this.m_info.param);
            if (param) {
                if (param.dot && param.dotType && param.dotValue) {
                    this.m_dot = Number(param.dot);
                    this.m_dotType = Number(param.dotType);
                    this.m_dotValue = Number(param.dotValue);
                    this.m_dotTimer = 0;
                }
                //减速
                if (param.speed != null && param.speed != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            this.m_oldParam = monsterScript.GetSpeed();
                            monsterScript.SetSpeed(monsterScript.GetSpeed() * Number(param.speed));
                        }
                    }
                }
                //冻结
                if (param.attackInterval != null && param.attackInterval != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            this.m_oldParam = monsterScript.GetAttackInterval();
                            monsterScript.SetAttackInterval(monsterScript.GetAttackInterval() * Number(param.attackInterval));
                        }
                    } else if (this.m_parentType == NODE_TYPE.ROLE) {
                        const roleScript = this.m_parent.getComponent(BaseRole);
                        if (roleScript) {
                            this.m_oldParam = roleScript.GetAttackInterval();
                            roleScript.SetAttackInterval(roleScript.GetAttackInterval() * Number(param.attackInterval));
                        }
                    }
                }
                //减抗
                if (param.defence != null && param.defence != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            this.m_oldParam = monsterScript.GetDefence();
                            monsterScript.SetDefence(monsterScript.GetDefence() * Number(param.defence));
                        }
                    } else if (this.m_parentType == NODE_TYPE.ROLE) {
                        const roleScript = this.m_parent.getComponent(BaseRole);
                        if (roleScript) {
                            this.m_oldParam = roleScript.GetDefence();
                            roleScript.SetDefence(roleScript.GetDefence() * Number(param.defence));
                        }
                    }
                }
                //一次性伤害
                if (param.damage != null && param.damage != undefined && param.damageType != null && param.damageType != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            let damage = 0;
                            if (param.damageType == 1) {
                                damage = this.m_attack * param.damage;
                            } else if (param.damageType == 2) {
                                damage = monsterScript.GetMaxBlood() * param.damage;
                            }
                            console.log("debuff dot伤害：", damage);
                            monsterScript.ShowHit(damage, null, DAMAGE_TYPE.DEBUFF);
                        }
                    } else if (this.m_parentType == NODE_TYPE.ROLE) {
                        const roleScript = this.m_parent.getComponent(BaseRole);
                        if (roleScript) {
                            let damage = 0;
                            if (param.damageType == 1) {
                                damage = this.m_attack * param.damage;
                            } else if (param.damageType == 2) {
                                damage = roleScript.GetMaxBlood() * param.damage;
                            }
                            console.log("debuff dot伤害：", damage);
                            roleScript.ShowHit(this.m_attack, DAMAGE_TYPE.DEBUFF);
                        }
                    }
                }
                //倒退
                if (param.repel != null && param.repel != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            monsterScript.ShowHit(this.m_attack, param.repel, DAMAGE_TYPE.DEBUFF);
                        }
                    }
                }
            }
        }*/
    }

    RemoveDebuff() {/*
        console.log("结束debuff");
        if (this.m_info && this.m_parent && this.m_parentType) {
            const param = JSON.parse(this.m_info.param);
            if (param) {
                if (param.speed != null && param.speed != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            monsterScript.SetSpeed(this.m_oldParam);
                        }
                    }
                }
                if (param.attackInterval != null && param.attackInterval != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            monsterScript.SetAttackInterval(this.m_oldParam);
                        }
                    } else if (this.m_parentType == NODE_TYPE.ROLE) {
                        const roleScript = this.m_parent.getComponent(BaseRole);
                        if (roleScript) {
                            roleScript.SetAttackInterval(this.m_oldParam);
                        }
                    }
                }
                if (param.defence != null && param.defence != undefined) {
                    if (this.m_parentType == NODE_TYPE.MONSTER) {
                        const monsterScript = this.m_parent.getComponent(BaseMonster);
                        if (monsterScript) {
                            monsterScript.SetDefence(this.m_oldParam);
                        }
                    } else if (this.m_parentType == NODE_TYPE.ROLE) {
                        const roleScript = this.m_parent.getComponent(BaseRole);
                        if (roleScript) {
                            roleScript.SetDefence(this.m_oldParam);
                        }
                    }
                }
            }
        }*/
    }
}


