import { track, trigger } from './effect'
import { isObject } from '@vue/shared';
import { reactive } from './reactive'

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    get(target, key, receiver) {
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        // 收集依赖
        track(target, 'get', key);
        // 这里可以监控到用户取值了
        let res = Reflect.get(target, key, receiver); // 改变this指向， receiver是指proxy
        if(isObject(res)) {
            return reactive(res); // 深度代理实现；  性能好，取值才会代理
        }
        return res;
    },
    set(target, key, value, receiver) {
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver);
        if(oldValue !== value) { // 值变化了，要更新
            trigger(target, 'set', key, value, oldValue);
        }
        // 这里可以监控到用户设值了
        return result
    }
}