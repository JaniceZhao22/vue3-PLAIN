import { isObject } from '@vue/shared';
import { mutableHandlers, ReactiveFlags } from './baseHandler'; // 核心抽到这里

// 1）将数据转换为响应式的， 只能做对象的代理
const reactiveMap = new WeakMap(); // WeakMap中key只能是对象


// 同一个对象代理多次，返回同一个代理
// 代理对象再次被代理，可以直接返回
export function reactive(target) {
    if(!isObject(target)) {
        return
    }
    if(target[ReactiveFlags.IS_REACTIVE]){ // 第一次不是proxy， 第二次进来是proxy， 会走到get中的判断
        return target;
    }
    // 增加缓存
    let existingProxy = reactiveMap.get(target);
    if(existingProxy) {
        return existingProxy;
    }
    // 第一次普通对象代理
    // 下一次传递的是proxy， 看有木有代理过， 增加标识

    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
}



