
export let activeEffect = undefined;

function cleanupEffect(effect) {
    const { deps } = effect;
    for(let i = 0; i<deps.length; i++) {
        deps[i].delete(effect); // 解除effect， 重新收集
    }
    effect.deps.length = 0;
}
export class ReactiveEffect {
    // 增加一个父结点指向
    public parent = null;
    public deps = [];
    // 在实例上新增一个active属性
    public active = true ; // 这个effect默认是激活的。
    constructor(public fn, public scheduler){}  // ts public 表示用户传递的参数也会在this上，相当于this.fn = fn;
        
    run() { // 就是执行effect
        if(!this.active){ // 非激活的状态，只执行，不需要依赖收集
            this.fn()
        }
        // 其余就要依赖收集了 核心就是当前的effect 和稍后渲染的属性关联;
        try{ 
            this.parent = activeEffect;
            activeEffect = this;
            // 这里需要在执行用户函数之前， 1）把之前收集的内容清空
            cleanupEffect(this);
            return this.fn(); // 2）再重新收集
        } finally{
            activeEffect = this.parent;
            this.parent = null;
        }
    }
    stop() {
        if(this.active) {
            this.active = false;
            cleanupEffect(this);
        }
    }
}

export function effect(fn, options:any = {}) { 
    // 可以根据状态变化，重新执行， effect可以嵌套着写
    const  _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect); // 绑定this
    runner.effect = _effect; // 将effect 挂载到 runner 函数上
    return runner;
}


// 数据结构
/**
 * 对象   某个属性 -》 多个effect
 * {对象：{name: []}}
 * WeakMap = {对象: Map{name: Set}}
 * 
 * 多对多
 * 
 */
const targetMap = new WeakMap();
export function track(target, type, key) {
    if(!activeEffect) return;
    let depsMap = targetMap.get(target);
    if(!depsMap){
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key);
    if(!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    let shouldTrack = !dep.has(activeEffect); // 去重一下
    if(shouldTrack) {
        dep.add(activeEffect);
        // 存放的是属性对应的set
        activeEffect.deps.push(dep);// 多对多，让effect记录对应的dep， 稍后清理时会用
    }
}

export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if(!depsMap) return;
    let effects = depsMap.get(key);
    // 在执行之前 先拷贝一份，不要关联引用
    if(effects) {
        effects = new Set(effects);
        effects.forEach(effect =>{
            if (effect !== activeEffect) { // 避免递归，死循环的情况
                if( effect.scheduler ) {
                    effect.scheduler(); //  1、如果用户传入了， 则用用户的
                } else {
                    effect.run(); // 2、否则默认刷新视图
                }
                
            }
        })
    }
    

}
