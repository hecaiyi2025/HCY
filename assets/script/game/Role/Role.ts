import { _decorator, Component, Node, director, Prefab, instantiate, Vec3, sp, error} from 'cc';
const { ccclass, property } = _decorator;


import { ecs } from '../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { ViewUtil } from "../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { RoleViewComp } from "./RoleViewComp";

//为啥mmorpg有handleRoleLooksSpwanRequestsystem来处理Roleloolrequest数据组件，还要同时有Gameworld来spawn呢
//角色role/monster/npc有对应的system来获取对应data参数，但是角色里面的子entity实例还是由Gameword来spwan维系关系
//对应的角色body根据data参数由resmanager来生成实例绑定到entiy关系父节点上
//当角色死亡 用Gameworld.despawn(GameObject/Entity)就可调用gameobject.destroy()/entitymanager.DestroyEntity(entity)，system主要处理entity data参数用。
//也就是说从entity/componentDate过渡到Gameobject显示实现、销毁还必须在Gameword中来完成(同时instant预制体+生成entity加入entitymanager)

//对比到oops中，Role extends ecs.Entity中下面代码可以实现类似上面桥梁作用：Node与entity绑定：
/*
/* 加载角色显示对象（cc.Component在创建后，添加到ECS框架中，使实体上任何一个ECS组件都可以通过 ECS API 获取到视图层对象 
load(parent: Node, pos: Vec3 = Vec3.ZERO) {
    var node = ViewUtil.createPrefabNode("game/battle/role");
    var mv = node.getComponent(RoleViewComp)!;
    this.add(mv);

    node.parent = parent;
    node.setPosition(pos);
}
*/
//也就是具备如下关系链，实际上完成的Gameword.spawn()的存在需求：
//Role.RoleViewComp.node
//node.getComponent(RoleViewComp).ent
//对应销毁Role.destroy()接口会完成this._parent.removeChild(this, false);以及this.removeChild(e);
//然后回收其上所有component
//然后destroyEntity(this);回收role:entitys.push(entity);于是也具备Gameword.Despawn(entity)的存在需求
//最后某个组件（如RoleViewComp ）上的回收前的reset（）执行完成Gameword.Despawn(obj)的存在需求：
/*
reset() {
    this.node.destroy();
}
*/
/*
destroy(): void {//Role类下的定义
        // 如果该组件对象是由ecs系统外部创建的，则不可回收，需要用户自己手动进行回收。
        this.remove(RoleViewComp);
        super.destroy();
    }

 destroy() {  //ecsentity类下的定义
    this.isValid = false;

    // 如果有父模块，则移除父模块上记录的子模块
    if (this._parent) {
        this._parent.removeChild(this, false);
        this._parent = null;
    }

    // 移除模块上所有子模块
    if (this._children) {
        this._children.forEach(e => {
            this.removeChild(e);
        });
        this._children = null;
    }

    // 移除实体上所有组件
    this.compTid2Ctor.forEach(this._remove, this);
    destroyEntity(this);
    this.compTid2Obj.clear();
}
*/
//综合其上，给Role定义load/destroy接口函数等价Gameword的接口，所有我不需要定义类Gameword


/** 账号模块 */
@ccclass('RoleViewLoader')
export class RoleViewLoader extends Component {
    spine: sp.Skeleton = null!;
    onLoad() {
        this.node.on("load", this.onEmitLoad, this);
    }
    private onEmitLoad(role: Role) {
        console.log("role.RoleViewComp.spine",role.RoleViewComp.spine)
        this.spine = role.RoleViewComp.spine;
        this.load("game/battle/content/role/model1"/*role.RoleModel.anim*/);//提供资源路径
    }
    private load(path: string) {
        //this.node.active = false;

        //var path = GameResPath.getRolePath(name);
        oops.res.load(path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
            if (err) {
                console.error(`动画名为【${path}】的角色资源不存在`);
                return;
            }

            this.spine.skeletonData = sd;
            this.spine.skeletonData.addRef();
            this.node.active = true;
            this.node.setPosition(0, -100);
        });
    }

    onDestroy() {
        if (this.spine.skeletonData) this.spine.skeletonData.decRef();
    }
}

@ecs.register('Role')
export class Role extends ecs.Entity {
    // 视图层
    RoleViewComp!: RoleViewComp;//定义成员之后 
    // 数据层
    //RoleModel!: RoleModelComp;

    protected init() {
        
        setTimeout(() => {
            console.log("Role.destroy()")
            this.destroy();
            //this.RoleViewComp.animator.play("Idle")
        }, 10000);
        
        // 初始化游戏公共资源
        this.load(oops.gui.game);
    }
    /** 加载角色显示对象（cc.Component在创建后，添加到ECS框架中，使实体上任何一个ECS组件都可以通过 ECS API 获取到视图层对象 */
    load(parent: Node, pos: Vec3 = Vec3.ZERO) {
        
        var node = ViewUtil.createPrefabNode("game/battle/role");
        console.log("ctor.compName=",RoleViewComp.name);
        var mv = node.getComponent(RoleViewComp)!;
        this.add(mv);
        //this.RoleViewComp=mv;
        //console.log("DemoViewComp start",parent);
        node.parent = parent;
        //node.x=40;
        //node.y=40;
        node.setPosition(new Vec3(40,40,1));
        
    }
    destroy(): void {
        // 如果该组件对象是由ecs系统外部创建的，则不可回收，需要用户自己手动进行回收。
        this.remove(RoleViewComp);
        super.destroy();
    }
}


/** 账号模块 */
@ecs.register('Spawn')
export class SpawnComp extends ecs.Comp {
    reset() {
    }
}
@ecs.register('Unspawn')
export class UnspawnComp extends ecs.Comp {
    reset() {
    }
}

/** 初始化资源逻辑注册到Initialize模块中 */
@ecs.register('SpawnSystem')
export class SpawnSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(SpawnComp);
    }

    entityEnter(e: ecs.Entity): void {
       
    }
}

/** 初始化资源逻辑注册到Initialize模块中 */
@ecs.register('UnspawnSystem')
export class UnspawnSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(UnspawnComp);
    }

    entityEnter(e: ecs.Entity): void {
       
    }
}




@ccclass('GameWorld')
export class GameWorld{
    

}


