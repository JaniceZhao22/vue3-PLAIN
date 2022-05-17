
export let activeEffect = undefined;
class ReactiveEffect{
    // 在实例上新增一个active属性
    public active = true ; // 这个effect默认是激活的。
    constructor(public fn){  // ts public 表示用户传递的参数也会在this上，相当于this.fn = fn;
        
    }
    run() { // 就是执行effect
        if(!this.active){ // 非激活的状态，只执行，不需要依赖收集
            this.fn()
        }
        // 其余就要依赖收集了 核心就是当前的effect 和稍后渲染的属性关联;
        try{ 
            activeEffect = this;
            return this.fn();
        } finally{
            activeEffect = undefined;
        }
        
    }
}



export function effect(fn) { 
    // 可以根据状态变化，重新执行， effect可以嵌套着写
    const  _effect = new ReactiveEffect(fn);
    _effect.run();
}